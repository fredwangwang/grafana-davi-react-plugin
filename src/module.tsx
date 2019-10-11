import React, { PureComponent } from 'react';
import { PanelPlugin, PanelProps } from '@grafana/ui';
import { Provider } from 'react-redux';
// import * as redux from 'redux';
//
// const reducer = (state: any, action: any) => {
//   return state;
// };

const store = undefined;

export class MyPanel extends PureComponent<PanelProps> {
  render() {
    return (
      // @ts-ignore
      <Provider store={store}>
        <div>Hello from my panel</div>
      </Provider>
    );
  }
}

// const mapstp = (state: any) => ({
//     ...state,
// });
//

export const plugin = new PanelPlugin(MyPanel);
