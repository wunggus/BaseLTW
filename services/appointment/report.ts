import request from '@/utils/request';

export async function getReports() {
  return request('/reports');
}