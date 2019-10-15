import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/ui';
import { DashboardModel } from 'grafana/app/features/dashboard/model';
import { appEvents } from 'grafana/app/core/core';
import { transform } from './data/transform';
import { AreaChart, Container, HeatmapChart, IZoom, LineChart, SelectedIndexProvider, setTheme, StatusChart, StepChart } from 'davi-js';
// import { connect } from 'react-redux';
import { DaviChartType, DaviOptions } from './options';
import config from 'grafana/app/core/config';

const initialState = {
  showDocs: false,
  selectedIndex: 0,
};

interface DaviPanelProps<T> extends PanelProps<T> {
  dashboard: any;
}

interface DaviPanelState {
  showDocs: boolean;
  selectedIndex: number | undefined;
}

function selectChartType(selection: DaviChartType): React.ElementType {
  switch (selection) {
    case DaviChartType.STEP:
      return StepChart;
    case DaviChartType.AREA:
      return AreaChart;
    case DaviChartType.HEATMAP:
      return HeatmapChart;
    case DaviChartType.STATUS:
      return StatusChart;
    case DaviChartType.LINE:
    default:
      return LineChart;
  }
}

class DaviPanel extends PureComponent<DaviPanelProps<DaviOptions>, DaviPanelState> {
  readonly state = initialState;

  dashboard: DashboardModel;

  constructor(props: any) {
    super(props);

    if (config.theme.isDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }

    this.dashboard = props.dashboard && props.dashboard.model;

    this.updateCrosshair = this.updateCrosshair.bind(this);
    this.clearCrosshair = this.clearCrosshair.bind(this);
    this.onCrosshairHover = this.onCrosshairHover.bind(this);
    this.onZoom = this.onZoom.bind(this);

    console.log('props', this.props);
  }

  componentDidMount(): void {
    console.log('davi ' + this.props.id + ' mounted');
    appEvents.on('graph-hover', this.updateCrosshair);
    appEvents.on('graph-hover-clear', this.clearCrosshair);
  }

  componentWillUnmount(): void {
    console.log('davi ' + this.props.id + ' unmounted');
    appEvents.off('graph-hover', this.updateCrosshair);
    appEvents.off('graph-hover-clear', this.clearCrosshair);
  }

  updateCrosshair(evt: any) {
    console.log(evt);
    const pos = evt.pos;
    const x = pos.x;
    this.setState({ selectedIndex: x });
  }

  clearCrosshair() {
    this.setState({ selectedIndex: undefined });
  }

  onCrosshairHover(x: number | undefined) {
    if (x) {
      appEvents.emit('graph-hover', {
        pos: {
          x: x,
          x1: x,
          y: 1000,
          y1: 1000,
          panelRelY: 0.5,
        },
        panel: { id: this.props.id },
      });
      console.log('sync message emitted');
    } else {
      appEvents.emit('graph-hover-clear');
    }
  }

  onZoom(zoom: IZoom) {
    this.props.onChangeTimeRange({ from: zoom.xStart, to: zoom.xEnd });
  }

  render() {
    const data = transform(this.props.data, this.props.options.chart_type);
    const ChartInstance = selectChartType(this.props.options.chart_type);

    // @ts-ignore // for experiment the  params
    const _ = (
      // @ts-ignore
      <StepChart height={1} animation={false} data={[]} />
    );

    // TODO: special logic for status chart, should handle properly and expose options
    const statusThreshold = [
      {
        label: 'Pass',
        style: { color: '#65B075' },
        type: 'lte',
        value: Number.POSITIVE_INFINITY,
      },
    ];

    let additionalProps = {};
    if (this.props.options.chart_type === DaviChartType.STATUS) {
      additionalProps = { ...additionalProps, thresholds: statusThreshold };
    }

    return (
      <div className="chart_container">
        <Container title={{ text: this.props.options.title }} iconsVisible={true}>
          <SelectedIndexProvider value={this.state.selectedIndex}>
            <ChartInstance
              animation={false}
              height={this.props.height - 110}
              zoomEnabled={true}
              zoomCallback={this.onZoom}
              onCrosshairHover={this.onCrosshairHover}
              data={data}
              {...additionalProps}
            />
          </SelectedIndexProvider>
        </Container>
      </div>
    );
  }
}

// TODO: disconnected from store since the PR is not yet accepted: https://github.com/grafana/grafana/pull/19780
// const mapStateToProps = (state: any) => ({
//   dashboard: state.dashboard,
// });
//
// export default connect(mapStateToProps)(DaviPanel);
export default DaviPanel;
