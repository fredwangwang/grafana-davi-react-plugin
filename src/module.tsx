import React, { Component } from 'react';
import { PanelPlugin, PanelProps } from '@grafana/ui';
import { appEvents } from 'grafana/app/core/core';
import { Container, SelectedIndexProvider, StepChart } from 'davi-js';
import { transforme } from './data/transform';
import { connect } from "react-redux";
import { DashboardModel } from "grafana/app/features/dashboard/model";

const initialState = {
  showDocs: false,
  selectedIndex: 0,
};

interface DaviPanelProps extends PanelProps {
  dashboard: any
}

interface DaviPanelState {
  showDocs: boolean;
  selectedIndex: number | undefined;
}

export class MyPanel extends Component<DaviPanelProps, DaviPanelState> {
  readonly state = initialState;

  panelID: number;
  dashboard: DashboardModel;

  constructor(props: DaviPanelProps) {
    super(props);

    this.panelID = props.id;
    this.dashboard = props.dashboard.model;

    this.updateCrosshair = this.updateCrosshair.bind(this);
    this.clearCrosshair = this.clearCrosshair.bind(this);

    console.log("dashboard", this.dashboard)
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
        panel: { id: this.panelID },
      });
      console.log('sync message emitted');
    } else {
      appEvents.emit('graph-hover-clear');
    }
  }

  componentDidMount(): void {
    appEvents.on('graph-hover', this.updateCrosshair);
    appEvents.on('graph-hover-clear', this.clearCrosshair);
  }

  componentWillUnmount(): void {
    appEvents.off('graph-hover', this.updateCrosshair);
    appEvents.off('graph-hover-clear', this.clearCrosshair);
  }

  render() {
    const data = transforme(this.props.data);
    console.log('props', this.props);

    //TODO: configurable title through config panel
    return (
      <div className="chart_container">
        <Container title={{ text: 'Davi Yeesss' }} iconsVisible={true}>
          <SelectedIndexProvider value={this.state.selectedIndex}>
            {/*
                    // @ts-ignore}*/}
            <StepChart zoomEnabled={true} onCrosshairHover={this.onCrosshairHover.bind(this)} data={data} />
          </SelectedIndexProvider>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  dashboard: state.dashboard
});

export const plugin = new PanelPlugin(connect(mapStateToProps)(MyPanel));
