import request from '@/utils/request';

export async function getReviews(){
  return request('/api/reviews');
}

export async function createReview(data:any){
  return request('/api/reviews',{
    method:'POST',
    data
  });
}