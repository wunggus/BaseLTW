import request from '@/utils/request';

export async function getDecisions() {
  return request('/decisions');
}

export async function createDecision(data: any) {
  return request('/decisions', {
    method: 'POST',
    data,
  });
}