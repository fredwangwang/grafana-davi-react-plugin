import React, { PureComponent } from 'react';
import { FormLabel, PanelEditorProps, PanelOptionsGroup, Select } from '@grafana/ui';
import { DaviChartTypeChoices, DaviOptions } from './options';
import ContainerEditor from './editor/containerEditor';

export type IDaviEditor = PureComponent<PanelEditorProps<DaviOptions>>;

function onChartTypeChange(this: IDaviEditor, evt: any) {
  console.log(evt);
  this.props.onOptionsChange({
    ...this.props.options,
    chart_type: evt.value,
  });
}

export default class DaviEditor extends PureComponent<PanelEditorProps<DaviOptions>> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const thisOnChartTypeChange = onChartTypeChange.bind(this);

    return (
      <>
        <ContainerEditor editor={this} />
        <PanelOptionsGroup title="Chart">
          <div className="form-field">
            <FormLabel width={8}>Display mode</FormLabel>
            <Select
              width={12}
              options={DaviChartTypeChoices}
              defaultValue={DaviChartTypeChoices[0]}
              onChange={thisOnChartTypeChange}
              value={DaviChartTypeChoices.find(x => x.value === this.props.options.chart_type)}
            />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="c3">
          <div>3</div>
        </PanelOptionsGroup>
      </>
    );
  }
}
