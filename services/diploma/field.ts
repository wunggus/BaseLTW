import request from '@/utils/request';

export async function getFields() {
  return request('/fields');
}

export async function createField(data: any) {
  return request('/fields', {
    method: 'POST',
    data,
  });
}

export async function deleteField(id: string) {
  return request(`/fields/${id}`, {
    method: 'DELETE',
  });
}