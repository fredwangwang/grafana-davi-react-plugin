import React from 'react';
import { FormField, PanelOptionsGroup } from '@grafana/ui';
import { IDaviEditor } from 'daviEditor';

interface ContainerEditor {
  editor: IDaviEditor;
}

function onTitleChange(this: IDaviEditor, evt: any) {
  return this.props.onOptionsChange({
    ...this.props.options,
    title: evt.target.value,
  });
}

function onDescriptionChange(this: IDaviEditor, evt: any) {
  return this.props.onOptionsChange({
    ...this.props.options,
    description: evt.target.value,
  });
}

const containerEditor = ({ editor }: ContainerEditor) => {
  const thisOnTitleChange = onTitleChange.bind(editor);
  const thisOnDescriptionChange = onDescriptionChange.bind(editor);

  return (
    <PanelOptionsGroup title="Container">
      <FormField label="Title" value={editor.props.options.title} onChange={thisOnTitleChange} />
      <textarea value={'123'} onChange={thisOnDescriptionChange} />
    </PanelOptionsGroup>
  );
};

export default containerEditor;
