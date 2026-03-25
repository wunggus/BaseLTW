import request from '@/utils/request';

export async function getRegistries() {
  return request('/registries');
}

export async function createRegistry(data: any) {
  return request('/registries', {
    method: 'POST',
    data,
  });
}