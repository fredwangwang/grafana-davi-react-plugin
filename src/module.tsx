import React, {Component} from 'react';
import {PanelData, PanelPlugin, PanelProps} from '@grafana/ui';
import {appEvents} from "grafana/app/core/core";
import {Container, SelectedIndexProvider, StepChart} from "davi-js"
import {FieldType} from "@grafana/data";


const initialState = {
    showDocs: false,
    selectedIndex: 0,
};

interface PanelState {
    showDocs: boolean,
    selectedIndex: number | undefined,
}

function transformer(input: PanelData): any {
    return input.series.map((s) => {
        if (s.fields.length !== 2) {
            console.log("something is wrong...", s.fields);
            return;
        }
        const time = s.fields.filter((f) => f.type === FieldType.time)[0].values.toArray();
        const number = s.fields.filter((f) => f.type === FieldType.number)[0].values.toArray();

        const data = time.map((t, i) => {
            return {x: t, y: number[i]}
        });

        return {
            title: s.name,
            data: data,
        }
    })
}

export class MyPanel extends Component<PanelProps, PanelState> {
    readonly state = initialState;

    panelID: number;
    lastPanel: any;

    constructor(props: PanelProps) {
        super(props);

        this.panelID = props.id;

        this.updateCrosshair = this.updateCrosshair.bind(this);
        this.clearCrosshair = this.clearCrosshair.bind(this);
    }

    updateCrosshair(evt: any) {
        console.log(evt);
        this.lastPanel = evt.panel;
        const pos = evt.pos;
        const x = pos.x;
        this.setState({selectedIndex: x});
    }

    clearCrosshair() {
        this.setState({selectedIndex: undefined});
    }

    onCrosshairHover(x: number | undefined) {
        if (x) {
            appEvents.emit('graph-hover', {
                pos: {
                    x: x,
                    x1: x,
                    y: 1000,
                    y1: 1000,
                    panelRelY: 0.5
                },
                panel: {...this.lastPanel, id: this.panelID}
            })
            console.log("sync message emitted")
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
        const data = transformer(this.props.data);
        console.log("props", this.props);

        //TODO: configurable title through config panel
        return (
            <div className="chart_container">
                <Container
                    title={{text: "Davi Yeesss"}}
                    iconsVisible={true}
                >
                    <SelectedIndexProvider value={this.state.selectedIndex}>
                        {/*
                    // @ts-ignore}*/}
                        <StepChart
                            zoomEnabled={true}
                            onCrosshairHover={this.onCrosshairHover.bind(this)}
                            data={data}
                        />
                    </SelectedIndexProvider>
                </Container>
            </div>
        );
    }
}

export const plugin = new PanelPlugin(MyPanel);
