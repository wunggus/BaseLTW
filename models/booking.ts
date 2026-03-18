export interface Booking {
  id: string;
  customerName: string;
  employeeId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}