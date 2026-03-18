export interface WorkingHour {
  day: string;
  start: string;
  end: string;
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  maxCustomersPerDay: number;
  rating?: number;
  workingHours: WorkingHour[];
}