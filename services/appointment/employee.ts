import request from '@/utils/request';

export async function getEmployees() {
  return request('/employees');
}

export async function createEmployee(data: any) {
  return request('/employees', {
    method: 'POST',
    data,
  });
}