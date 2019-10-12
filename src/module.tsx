import { PanelPlugin } from '@grafana/ui';
import daviPanel from './daviPanel';
import daviEditor from './daviEditor';
import { defaults } from './options';

export const plugin = new PanelPlugin(daviPanel).setEditor(daviEditor).setDefaults(defaults);
