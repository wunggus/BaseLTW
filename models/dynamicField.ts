export type FieldType = 'string' | 'number' | 'date';

export interface DynamicField {
  id: string;
  name: string;
  type: FieldType;
}