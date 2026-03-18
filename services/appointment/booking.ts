import request from '@/utils/request';

export async function getBookings() {
  return request('/bookings');
}

export async function createBooking(data: any) {
  return request('/bookings', {
    method: 'POST',
    data,
  });
}

export async function updateBooking(id: string, data: any) {
  return request(`/bookings/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function deleteBooking(id: string) {
  return request(`/bookings/${id}`, {
    method: 'DELETE',
  });
}