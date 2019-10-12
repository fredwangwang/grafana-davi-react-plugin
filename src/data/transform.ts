import { PanelData } from '@grafana/ui';
import { FieldType } from '@grafana/data';

export function transform(input: PanelData): any {
  return input.series.map(s => {
    if (s.fields.length !== 2) {
      console.error('something is wrong...', s.fields);
      return undefined;
    }

    const tsData = s.fields.filter(f => f.type === FieldType.number)[0].values.toArray();
    const time = s.fields.filter(f => f.type === FieldType.time)[0].values.toArray();

    const data = time.map((t, i) => {
      return { x: t, y: tsData[i] };
    });

    return {
      title: s.name,
      data: data,
    };
  });
}
