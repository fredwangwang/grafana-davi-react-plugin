import React, { PureComponent } from 'react';
import { PanelModel, PanelProps } from '@grafana/ui';
import { DashboardModel } from 'grafana/app/features/dashboard/model';
import { appEvents } from 'grafana/app/core/core';
import { transform } from './data/transform';
import { AreaChart, Container, HeatmapChart, LineChart, SelectedIndexProvider, StepChart } from 'davi-js';
import { connect } from 'react-redux';
import { DaviChartType, DaviOptions } from './options';

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
    case DaviChartType.LINE:
    default:
      return LineChart;
  }
}

class DaviPanel extends PureComponent<DaviPanelProps<DaviOptions>, DaviPanelState> {
  readonly state = initialState;

  panel: PanelModel;
  dashboard: DashboardModel;

  constructor(props: any) {
    super(props);

    this.dashboard = props.dashboard.model;
    this.panel = this.dashboard.getPanelById(this.props.id);

    this.updateCrosshair = this.updateCrosshair.bind(this);
    this.clearCrosshair = this.clearCrosshair.bind(this);
    this.onCrosshairHover = this.onCrosshairHover.bind(this);

    console.log('props', this.props);
  }

  componentDidMount(): void {
    console.log('davi ' + this.panel.id + ' mounted');
    appEvents.on('graph-hover', this.updateCrosshair);
    appEvents.on('graph-hover-clear', this.clearCrosshair);
  }

  componentWillUnmount(): void {
    console.log('davi ' + this.panel.id + ' unmounted');
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
        panel: { id: this.panel },
      });
      console.log('sync message emitted');
    } else {
      appEvents.emit('graph-hover-clear');
    }
  }

  render() {
    const data = transform(this.props.data);
    const ChartInstance = selectChartType(this.props.options.chart_type);

    // @ts-ignore // for experiment the  params
    const _ = (
      // @ts-ignore
      <StepChart height={1} />
    );

    return (
      <div className="chart_container">
        <Container title={{ text: this.props.options.title }} iconsVisible={true}>
          <SelectedIndexProvider value={this.state.selectedIndex}>
            <ChartInstance height={this.props.height - 110} zoomEnabled={true} onCrosshairHover={this.onCrosshairHover} data={data} />
          </SelectedIndexProvider>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  dashboard: state.dashboard,
});

export default connect(mapStateToProps)(DaviPanel);
