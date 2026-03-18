import request from '@/utils/request';

export async function getServices() {
  return request('/services');
}

export async function createService(data: any) {
  return request('/services', {
    method: 'POST',
    data,
  });
}