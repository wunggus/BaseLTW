import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const BASE_URL = `${ip3}/dang-ky-thanh-vien`;

export async function getDangKyList(params: any) {
	return axios.get(`${BASE_URL}/page`, { params });
}

export async function getDangKyById(id: string) {
	return axios.get(`${BASE_URL}/${id}`);
}

export async function postDangKy(payload: Partial<DangKyThanhVien.IRecord>) {
	return axios.post(BASE_URL, payload);
}

export async function putDangKy(id: string, payload: Partial<DangKyThanhVien.IRecord>) {
	return axios.put(`${BASE_URL}/${id}`, payload);
}

export async function deleteDangKy(id: string) {
	return axios.delete(`${BASE_URL}/${id}`);
}

export async function deleteManyDangKy(ids: string[]) {
	return axios.delete(`${BASE_URL}/many`, { data: { ids } });
}

export async function duyetDangKy(id: string) {
	return axios.put(`${BASE_URL}/${id}/duyet`);
}

export async function tuChoiDangKy(id: string, lyDo: string) {
	return axios.put(`${BASE_URL}/${id}/tu-choi`, { lyDo });
}

export async function duyetNhieuDangKy(ids: string[]) {
	return axios.put(`${BASE_URL}/duyet-nhieu`, { ids });
}

export async function tuChoiNhieuDangKy(ids: string[], lyDo: string) {
	return axios.put(`${BASE_URL}/tu-choi-nhieu`, { ids, lyDo });
}

export async function doiCLBNhieuThanhVien(ids: string[], cauLacBoId: string) {
	return axios.put(`${BASE_URL}/doi-clb`, { ids, cauLacBoId });
}
