import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { SwapOutlined, HistoryOutlined } from '@ant-design/icons';
import { Button, Card, Select, Space, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalDoiCLB from './ModalDoiCLB';
import ModalLichSu from '../DangKyThanhVien/components/ModalLichSu';

const ThanhVienCLBPage = () => {
	const {
		danhSach,
		getModel,
		page,
		limit,
		loading,
		selectedIds,
		setSelectedIds,
		setVisibleDoiCLB,
		setIdsDoiCLB,
		handleXemLichSu,
		setCondition,
	} = useModel('dangKyThanhVien.dangKyThanhVien');

	const { getAllCLB, danhSachTatCa } = useModel('cauLacBo.cauLacBo');

	const [selectedCLBFilter, setSelectedCLBFilter] = useState<string | undefined>(undefined);

	useEffect(() => {
		getAllCLB();
		// Load only Approved members
		setCondition({ trangThai: 'Approved' });
		getModel({ trangThai: 'Approved' });
	}, []);

	const handleDoiCLBChon = () => {
		if (selectedIds?.length) {
			setIdsDoiCLB(selectedIds as string[]);
			setVisibleDoiCLB(true);
		}
	};

	const handleFilterCLB = (val: string | undefined) => {
		setSelectedCLBFilter(val);
		setCondition({ trangThai: 'Approved', ...(val ? { cauLacBoId: val } : {}) });
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
			title: 'Địa chỉ',
			dataIndex: 'diaChi',
			width: 200,
		},
		{
			title: 'Câu lạc bộ',
			dataIndex: 'cauLacBoId',
			width: 180,
			render: (val: string) => {
				const clb = danhSachTatCa.find((c) => c._id === val);
				return clb ? <Tag color='blue'>{clb.tenCLB}</Tag> : val;
			},
		},
		{
			title: 'Ngày duyệt',
			dataIndex: 'updatedAt',
			width: 140,
			align: 'center',
			sortable: true,
			render: (val: string) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (record: DangKyThanhVien.IRecord) => (
				<Space size={0}>
					<Tooltip title='Lịch sử thao tác'>
						<Button
							type='link'
							icon={<HistoryOutlined />}
							style={{ color: '#722ed1' }}
							onClick={() => handleXemLichSu(record)}
						/>
					</Tooltip>
					<Tooltip title='Đổi CLB'>
						<Button
							type='link'
							icon={<SwapOutlined />}
							style={{ color: '#fa8c16' }}
							onClick={() => {
								setIdsDoiCLB([record._id]);
								setVisibleDoiCLB(true);
							}}
						/>
					</Tooltip>
				</Space>
			),
		},
	];

	const batchButtons = selectedIds?.length
		? [
				<Button
					key='doi-clb'
					type='default'
					icon={<SwapOutlined />}
					style={{ color: '#fa8c16', borderColor: '#fa8c16' }}
					onClick={handleDoiCLBChon}
				>
					Đổi CLB cho {selectedIds.length} thành viên
				</Button>,
		  ]
		: [];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='dangKyThanhVien.dangKyThanhVien'
				title='Quản lý thành viên câu lạc bộ'
				widthDrawer={640}
				rowSelection
				buttons={{ create: false }}
				params={{ trangThai: 'Approved' }}
				otherButtons={batchButtons}
			>
				<div style={{ marginBottom: 12 }}>
					<Space>
						<span style={{ fontWeight: 500 }}>Lọc theo CLB:</span>
						<Select
							allowClear
							placeholder='Tất cả câu lạc bộ'
							style={{ width: 240 }}
							value={selectedCLBFilter}
							onChange={handleFilterCLB}
							options={danhSachTatCa.map((clb) => ({ label: clb.tenCLB, value: clb._id }))}
							showSearch
							filterOption={(input, option) =>
								(option?.label as string)?.toLowerCase().includes(input.toLowerCase())
							}
						/>
					</Space>
				</div>
			</TableBase>
			<ModalDoiCLB />
			<ModalLichSu />
		</>
	);
};

export default ThanhVienCLBPage;
