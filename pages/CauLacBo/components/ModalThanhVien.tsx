import { Modal, Table, Tag, Typography } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

const { Text } = Typography;

const ModalThanhVien = () => {
	const { visibleMembersModal, setVisibleMembersModal, selectedClub } = useModel('cauLacBo.cauLacBo');
	const { danhSach, getModel, loading } = useModel('dangKyThanhVien.dangKyThanhVien');

	const columns = [
		{
			title: 'TT',
			dataIndex: 'index',
			width: 50,
			align: 'center' as const,
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
		},
		{
			title: 'SĐT',
			dataIndex: 'sdt',
			width: 120,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 90,
			align: 'center' as const,
		},
		{
			title: 'Ngày duyệt',
			dataIndex: 'updatedAt',
			width: 140,
			render: (val: string) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : '-'),
		},
	];

	const thanhVienCLB = danhSach.filter(
		(item) => item.cauLacBoId === selectedClub?._id && item.trangThai === 'Approved',
	);

	return (
		<Modal
			open={visibleMembersModal}
			onCancel={() => setVisibleMembersModal(false)}
			title={
				<>
					Danh sách thành viên: <Text type='success'>{selectedClub?.tenCLB}</Text>
				</>
			}
			footer={null}
			width={900}
			destroyOnClose
		>
			<Table
				size='small'
				bordered
				columns={columns}
				dataSource={thanhVienCLB.map((item, i) => ({ ...item, key: item._id, index: i + 1 }))}
				loading={loading}
				pagination={{ pageSize: 10, showTotal: (t) => `Tổng: ${t} thành viên` }}
			/>
		</Modal>
	);
};

export default ModalThanhVien;
