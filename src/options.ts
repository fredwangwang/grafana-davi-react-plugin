import { SelectableValue } from '@grafana/data';

export enum DaviChartType {
  LINE = 'Line Chart',
  STEP = 'Step Chart',
  AREA = 'Area Chart',
  HEATMAP = 'Heatmap Chart',
}

export const DaviChartTypeChoices: Array<SelectableValue<DaviChartType>> = [
  { value: DaviChartType.LINE, label: DaviChartType.LINE },
  { value: DaviChartType.STEP, label: DaviChartType.STEP },
  { value: DaviChartType.AREA, label: DaviChartType.AREA },
  { value: DaviChartType.HEATMAP, label: DaviChartType.HEATMAP },
];

export interface DaviOptions {
  title: string;
  description: string;
  chart_type: DaviChartType;
}

export const defaults: DaviOptions = {
  title: 'Data Viz',
  description: '',
  chart_type: DaviChartType.LINE,
};
