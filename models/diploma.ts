export interface Diploma {
  id: string;
  soVaoSo: number;
  soHieu: string;
  msv: string;
  hoTen: string;
  ngaySinh: string;
  decisionId: string;
  extraFields: Record<string, any>;
}