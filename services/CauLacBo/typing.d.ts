declare module CauLacBo {
	export interface IRecord {
		_id: string;
		tenCLB: string;
		anhDaiDien?: string;
		ngayThanhLap?: string;
		moTa?: string; // HTML
		chuNhiem?: string;
		hoatDong: boolean;
		createdAt?: string;
		updatedAt?: string;
	}
}
