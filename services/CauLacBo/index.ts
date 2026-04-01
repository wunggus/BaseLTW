import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

const BASE_URL = `${ip3}/cau-lac-bo`;

export async function getCauLacBoList(params: any) {
	return axios.get(`${BASE_URL}/page`, { params });
}

export async function getAllCauLacBo(params?: any) {
	return axios.get(`${BASE_URL}/all`, { params });
}

export async function getCauLacBoById(id: string) {
	return axios.get(`${BASE_URL}/${id}`);
}

export async function postCauLacBo(payload: Partial<CauLacBo.IRecord>) {
	return axios.post(BASE_URL, payload);
}

export async function putCauLacBo(id: string, payload: Partial<CauLacBo.IRecord>) {
	return axios.put(`${BASE_URL}/${id}`, payload);
}

export async function deleteCauLacBo(id: string) {
	return axios.delete(`${BASE_URL}/${id}`);
}
