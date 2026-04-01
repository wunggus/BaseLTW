import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import {
	CheckOutlined,
	CloseOutlined,
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	HistoryOutlined,
} from '@ant-design/icons';
import { Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDangKy from './components/Form';
import ModalLichSu from './components/ModalLichSu';
import ModalTuChoi from './components/ModalTuChoi';

const trangThaiTag: Record<string, JSX.Element> = {
	Pending: <Tag color='processing'>Chờ duyệt</Tag>,
	Approved: <Tag color='success'>Đã duyệt</Tag>,
	Rejected: <Tag color='error'>Từ chối</Tag>,
};

const DangKyThanhVienPage = () => {
	const {
		getModel,
		page,
		limit,
		deleteModel,
		handleEdit,
		handleView,
		selectedIds,
		setSelectedIds,
		duyetNhieuModel,
		setVisibleTuChoi,
		setIdsTuChoi,
		formSubmiting,
		handleXemLichSu,
	} = useModel('dangKyThanhVien.dangKyThanhVien');

	const { getAllCLB, danhSachTatCa } = useModel('cauLacBo.cauLacBo');

	useEffect(() => {
		getAllCLB();
	}, []);

	const handleDuyetChon = () => {
		if (selectedIds?.length) duyetNhieuModel(selectedIds as string[]);
	};

	const handleTuChoiChon = () => {
		if (selectedIds?.length) {
			setIdsTuChoi(selectedIds as string[]);
			setVisibleTuChoi(true);
		}
	};

	const columns: IColumn<DangKyThanhVien.IRecord>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 180,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Email',
			dataIndex: 'email',
			width: 200,
			filterType: 'string',
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
			align: 'center',
			filterType: 'select',
			filterData: ['Nam', 'Nữ', 'Khác'],
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 180,
			filterType: 'select',
			filterData: danhSachTatCa.map((clb) => ({ label: clb.tenCLB, value: clb._id })),
			render: (val: string) => danhSachTatCa.find((clb) => clb._id === val)?.tenCLB ?? val,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			width: 120,
			align: 'center',
			filterType: 'select',
			filterData: [
				{ label: 'Chờ duyệt', value: 'Pending' },
				{ label: 'Đã duyệt', value: 'Approved' },
				{ label: 'Từ chối', value: 'Rejected' },
			],
			render: (val: string) => trangThaiTag[val] ?? <Tag>{val}</Tag>,
		},
		{
			title: 'Ngày đăng ký',
			dataIndex: 'createdAt',
			width: 140,
			align: 'center',
			sortable: true,
			render: (val: string) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 180,
			fixed: 'right',
			render: (record: DangKyThanhVien.IRecord) => (
				<Space size={0}>
					<Tooltip title='Xem chi tiết'>
						<Button onClick={() => handleView(record)} type='link' icon={<EyeOutlined />} />
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Lịch sử thao tác'>
						<Button
							onClick={() => handleXemLichSu(record)}
							type='link'
							icon={<HistoryOutlined />}
							style={{ color: '#722ed1' }}
						/>
					</Tooltip>
					{record.trangThai === 'Pending' && (
						<>
							<Tooltip title='Duyệt'>
								<Popconfirm
									title='Xác nhận duyệt đơn đăng ký này?'
									onConfirm={() => duyetNhieuModel([record._id])}
									okText='Duyệt'
									cancelText='Hủy'
								>
									<Button type='link' icon={<CheckOutlined />} style={{ color: '#52c41a' }} />
								</Popconfirm>
							</Tooltip>
							<Tooltip title='Từ chối'>
								<Button
									type='link'
									danger
									icon={<CloseOutlined />}
									onClick={() => {
										setIdsTuChoi([record._id]);
										setVisibleTuChoi(true);
									}}
								/>
							</Tooltip>
						</>
					)}
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa đơn đăng ký này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</Space>
			),
		},
	];

	const batchButtons = selectedIds?.length
		? [
				<Popconfirm
					key='duyet'
					title={`Xác nhận duyệt ${selectedIds.length} đơn đã chọn?`}
					onConfirm={handleDuyetChon}
					okText='Duyệt'
					cancelText='Hủy'
				>
					<Button type='primary' loading={formSubmiting} icon={<CheckOutlined />}>
						Duyệt {selectedIds.length} đơn đã chọn
					</Button>
				</Popconfirm>,
				<Button
					key='tuchoi'
					danger
					icon={<CloseOutlined />}
					onClick={handleTuChoiChon}
				>
					Từ chối {selectedIds.length} đơn đã chọn
				</Button>,
		  ]
		: [];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='dangKyThanhVien.dangKyThanhVien'
				title='Đơn đăng ký thành viên'
				Form={FormDangKy}
				widthDrawer={640}
				formType='Modal'
				destroyModal
				rowSelection
				otherButtons={batchButtons}
			/>
			<ModalTuChoi />
			<ModalLichSu />
		</>
	);
};

export default DangKyThanhVienPage;
