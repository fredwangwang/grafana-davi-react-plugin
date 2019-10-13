import { PanelData } from '@grafana/ui';
import { DataFrame, FieldType } from '@grafana/data';
import { DaviChartType } from '../options';

export function transform(input: PanelData, type: DaviChartType): any {
  switch (type) {
    case DaviChartType.STATUS:
      return transformStatus(input);
    default:
      return transformDefault(input);
  }
}

function extractTimeAndData(s: DataFrame): any {
  if (s.fields.length !== 2) {
    console.error('something is wrong...', s.fields);
    return;
  }

  const tsData = s.fields.filter(f => f.type === FieldType.number)[0].values.toArray();
  const time = s.fields.filter(f => f.type === FieldType.time)[0].values.toArray();

  return {
    time: time,
    data: tsData,
  };
}

function transformStatus(input: PanelData): any {
  if (!input.request) {
    console.error('data does not have the associated request');
    return;
  }
  const intervalMs = input.request.intervalMs;

  return input.series.map(s => {
    const extracted = extractTimeAndData(s);
    if (!extracted) {
      return;
    }

    const data = extracted.time.map((t: number, i: number) => {
      return { x0: t, x: t + intervalMs, y: extracted.data[i] };
    });

    return {
      title: s.name,
      data: data,
    };
  });
}

function transformDefault(input: PanelData): any {
  return input.series.map(s => {
    const extracted = extractTimeAndData(s);
    if (!extracted) {
      return;
    }

    const data = extracted.time.map((t: number, i: number) => {
      return { x: t, y: extracted.data[i] };
    });

    return {
      title: s.name,
      data: data,
    };
  });
}
