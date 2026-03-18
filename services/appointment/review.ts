import request from '@/utils/request';

export async function getReviews() {
  return request('/reviews');
}

export async function createReview(data: any) {
  return request('/reviews', {
    method: 'POST',
    data,
  });
}