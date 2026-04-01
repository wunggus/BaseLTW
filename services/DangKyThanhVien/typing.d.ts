declare module DangKyThanhVien {
	export type TrangThai = 'Pending' | 'Approved' | 'Rejected';

	export interface ILichSuThaoTac {
		thaoTac: TrangThai;
		nguoiThucHien?: string;
		thoiGian: string;
		lyDo?: string;
	}

	export interface IRecord {
		_id: string;
		hoTen: string;
		email?: string;
		sdt?: string;
		gioiTinh?: 'Nam' | 'Nữ' | 'Khác';
		diaChi?: string;
		soTruong?: string;
		cauLacBoId: string;
		cauLacBo?: CauLacBo.IRecord;
		lyDoDangKy?: string;
		trangThai: TrangThai;
		ghiChu?: string; // lý do từ chối
		lichSuThaoTac?: ILichSuThaoTac[];
		createdAt?: string;
		updatedAt?: string;
	}
}
