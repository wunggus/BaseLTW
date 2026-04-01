import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, TeamOutlined } from '@ant-design/icons';
import { Avatar, Button, Popconfirm, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import FormCauLacBo from './components/Form';
import ModalThanhVien from './components/ModalThanhVien';

const CauLacBoPage = () => {
	const { getModel, page, limit, deleteModel, handleEdit, handleViewMembers } = useModel('cauLacBo.cauLacBo');

	const columns: IColumn<CauLacBo.IRecord>[] = [
		{
			title: 'Ảnh',
			dataIndex: 'anhDaiDien',
			width: 70,
			align: 'center',
			render: (val: string, record: CauLacBo.IRecord) => (
				<Avatar
					src={val || undefined}
					style={{ background: '#1890ff' }}
					size={40}
				>
					{!val ? record.tenCLB?.charAt(0)?.toUpperCase() : undefined}
				</Avatar>
			),
		},
		{
			title: 'Tên câu lạc bộ',
			dataIndex: 'tenCLB',
			width: 200,
			filterType: 'string',
			sortable: true,
		},
		{
			title: 'Ngày thành lập',
			dataIndex: 'ngayThanhLap',
			width: 140,
			align: 'center',
			sortable: true,
			render: (val: string) => (val ? moment(val).format('DD/MM/YYYY') : '-'),
		},
		{
			title: 'Chủ nhiệm',
			dataIndex: 'chuNhiem',
			width: 160,
			filterType: 'string',
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 260,
			render: (val: string) =>
				val ? (
					<div
						style={{ maxHeight: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}
						dangerouslySetInnerHTML={{ __html: val }}
					/>
				) : (
					'-'
				),
		},
		{
			title: 'Hoạt động',
			dataIndex: 'hoatDong',
			width: 100,
			align: 'center',
			filterType: 'select',
			filterData: ['Có', 'Không'],
			render: (val: boolean) =>
				val ? <Tag color='success'>Có</Tag> : <Tag color='default'>Không</Tag>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 120,
			fixed: 'right',
			render: (record: CauLacBo.IRecord) => (
				<>
					<Tooltip title='Danh sách thành viên'>
						<Button
							onClick={() => handleViewMembers(record)}
							type='link'
							icon={<TeamOutlined />}
							style={{ color: '#52c41a' }}
						/>
					</Tooltip>
					<Tooltip title='Chỉnh sửa'>
						<Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
					</Tooltip>
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => deleteModel(record._id, getModel)}
							title='Bạn có chắc chắn muốn xóa câu lạc bộ này?'
							placement='topLeft'
						>
							<Button danger type='link' icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='cauLacBo.cauLacBo'
				title='Câu lạc bộ'
				Form={FormCauLacBo}
				widthDrawer={600}
				formType='Modal'
				destroyModal
			/>
			<ModalThanhVien />
		</>
	);
};

export default CauLacBoPage;
