import request from '@/utils/request';

export async function getDiplomas(params?: any) {
  return request('/diplomas', { params });
}

export async function createDiploma(data: any) {
  return request('/diplomas', {
    method: 'POST',
    data,
  });
}