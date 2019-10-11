import React, { PureComponent } from 'react';
import { PanelProps, PanelPlugin } from '@grafana/ui';
import * as reactRedux from 'react-redux';

export class MyPanel extends PureComponent<PanelProps> {
  render() {
    return <div>Hello from my panel</div>;
  }
}

const mapstp = (state: any) => ({
  ...state,
});

reactRedux.connect(mapstp)(MyPanel);

export const plugin = new PanelPlugin(MyPanel);
