import React, { useState, useMemo } from 'react';
import {
	Row, Col, Card, Table, Button, Modal, Form, Input, Select, InputNumber,
	Upload, Tag, Popconfirm, Tabs, Typography, Statistic, Rate, message,
	Divider, Space,
} from 'antd';
import {
	PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined,
	BarChartOutlined, AppstoreOutlined, FireOutlined, DollarOutlined,
	EnvironmentOutlined, CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Chart from 'react-apexcharts';
import { useModel } from 'umi';
import type { IDestination, TLoaiHinh } from '@/models/travelplanner';
import { MONTHLY_STATS } from '@/models/travelplanner';
import '../style.less';

const { Text, Title } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const LOAI_HINH_OPTIONS: { value: TLoaiHinh; label: string; emoji: string }[] = [
	{ value: 'bien', label: 'Biển', emoji: '🏖️' },
	{ value: 'nui', label: 'Núi', emoji: '🏔️' },
	{ value: 'thanh-pho', label: 'Thành phố', emoji: '🏙️' },
	{ value: 'lang-que', label: 'Làng quê', emoji: '🌾' },
	{ value: 'di-tich', label: 'Di tích', emoji: '🏛️' },
];

const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';

// ============ DESTINATION MANAGER ============
const QuanLyDiemDen: React.FC = () => {
	const { destinations, addDestination, updateDestination, deleteDestination } = useModel('travelplanner');
	const [modalOpen, setModalOpen] = useState(false);
	const [editId, setEditId] = useState<string | null>(null);
	const [form] = Form.useForm();
	const [imgPreview, setImgPreview] = useState('');

	const openCreate = () => {
		setEditId(null);
		form.resetFields();
		setImgPreview('');
		setModalOpen(true);
	};

	const openEdit = (dest: IDestination) => {
		setEditId(dest.id);
		form.setFieldsValue({
			...dest,
			tags: dest.tags.join(', '),
		});
		setImgPreview(dest.image);
		setModalOpen(true);
	};

	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			const dest: IDestination = {
				id: editId || `d_${Date.now()}`,
				...values,
				tags: values.tags?.split(',').map((t: string) => t.trim()).filter(Boolean) || [],
				reviewCount: values.reviewCount || 0,
				popularityScore: values.popularityScore || 50,
				createdAt: new Date().toISOString(),
			};
			if (editId) {
				updateDestination(editId, dest);
				message.success('Đã cập nhật điểm đến!');
			} else {
				addDestination(dest);
				message.success('Đã thêm điểm đến mới!');
			}
			setModalOpen(false);
		} catch {}
	};

	const columns: ColumnsType<IDestination> = [
		{
			title: 'Điểm đến',
			key: 'name',
			render: (_, r) => (
				<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
					<img src={r.image} alt={r.name} style={{ width: 56, height: 44, borderRadius: 8, objectFit: 'cover' }} />
					<div>
						<Text strong>{r.name}</Text>
						<div style={{ fontSize: 12, color: '#8B7355' }}><EnvironmentOutlined /> {r.location}</div>
					</div>
				</div>
			),
			width: 220,
		},
		{
			title: 'Loại',
			dataIndex: 'loaiHinh',
			key: 'loaiHinh',
			render: (v: TLoaiHinh) => {
				const o = LOAI_HINH_OPTIONS.find((x) => x.value === v);
				return <Tag style={{ borderRadius: 10 }}>{o?.emoji} {o?.label}</Tag>;
			},
		},
		{
			title: 'Rating',
			dataIndex: 'rating',
			key: 'rating',
			render: (v: number) => <span style={{ color: '#C9A84C', fontWeight: 700 }}>⭐ {v}</span>,
			sorter: (a, b) => a.rating - b.rating,
		},
		{
			title: 'Ăn uống/ngày',
			dataIndex: 'chiPhiAnUong',
			key: 'chiPhiAnUong',
			render: (v: number) => formatVND(v),
			sorter: (a, b) => a.chiPhiAnUong - b.chiPhiAnUong,
		},
		{
			title: 'Lưu trú/đêm',
			dataIndex: 'chiPhiLuuTru',
			key: 'chiPhiLuuTru',
			render: (v: number) => formatVND(v),
		},
		{
			title: 'Di chuyển',
			dataIndex: 'chiPhiDiChuyen',
			key: 'chiPhiDiChuyen',
			render: (v: number) => formatVND(v),
		},
		{
			title: 'Thăm quan',
			dataIndex: 'thoiGianThamQuan',
			key: 'thoiGianThamQuan',
			render: (v: number) => `${v}h`,
		},
		{
			title: 'Hành động',
			key: 'action',
			fixed: 'right',
			width: 110,
			render: (_, r) => (
				<Space>
					<Button size='small' icon={<EditOutlined />} onClick={() => openEdit(r)} />
					<Popconfirm
						title={`Xóa điểm đến "${r.name}"?`}
						onConfirm={() => { deleteDestination(r.id); message.success('Đã xóa!'); }}
						okButtonProps={{ danger: true }}
					>
						<Button size='small' danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<div>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<Text strong style={{ fontSize: 16 }}>Danh sách điểm đến ({destinations.length})</Text>
				<Button type='primary' icon={<PlusOutlined />} onClick={openCreate}
					style={{ background: '#C9A84C', borderColor: '#C9A84C', borderRadius: 10 }}
				>
					Thêm điểm đến
				</Button>
			</div>

			<Table
				dataSource={destinations}
				columns={columns}
				rowKey='id'
				scroll={{ x: 900 }}
				style={{ borderRadius: 12, overflow: 'hidden' }}
				size='middle'
				pagination={{ pageSize: 8 }}
			/>

			<Modal
				title={
					<span style={{ fontFamily: 'Georgia, serif', fontSize: 18 }}>
						{editId ? '✏️ Chỉnh sửa điểm đến' : '📍 Thêm điểm đến mới'}
					</span>
				}
				open={modalOpen}
				onCancel={() => setModalOpen(false)}
				onOk={handleSubmit}
				okText={editId ? 'Cập nhật' : 'Thêm mới'}
				okButtonProps={{ style: { background: '#C9A84C', borderColor: '#C9A84C' } }}
				width={680}
				bodyStyle={{ maxHeight: '65vh', overflowY: 'auto' }}
			>
				<Form form={form} layout='vertical' size='middle'>
					<Row gutter={16}>
						<Col span={14}>
							<Form.Item name='name' label='Tên điểm đến' rules={[{ required: true, message: 'Bắt buộc!' }]}>
								<Input placeholder='VD: Vịnh Hạ Long' style={{ borderRadius: 8 }} />
							</Form.Item>
						</Col>
						<Col span={10}>
							<Form.Item name='location' label='Tỉnh / Thành phố' rules={[{ required: true }]}>
								<Input placeholder='VD: Quảng Ninh' style={{ borderRadius: 8 }} />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='loaiHinh' label='Loại hình' rules={[{ required: true }]}>
								<Select placeholder='Chọn loại hình' style={{ borderRadius: 8 }}>
									{LOAI_HINH_OPTIONS.map((o) => (
										<Option key={o.value} value={o.value}>{o.emoji} {o.label}</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='rating' label='Rating' rules={[{ required: true }]}>
								<InputNumber min={1} max={5} step={0.1} style={{ width: '100%', borderRadius: 8 }} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='thoiGianThamQuan' label='Thời gian (giờ)' rules={[{ required: true }]}>
								<InputNumber min={1} max={168} style={{ width: '100%', borderRadius: 8 }} />
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item name='image' label='URL hình ảnh'>
								<Input
									placeholder='https://...'
									style={{ borderRadius: 8 }}
									onChange={(e) => setImgPreview(e.target.value)}
								/>
							</Form.Item>
							{imgPreview && (
								<img src={imgPreview} alt='preview'
									style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 10, marginBottom: 12 }}
									onError={() => setImgPreview('')}
								/>
							)}
						</Col>
						<Col span={24}>
							<Form.Item name='description' label='Mô tả' rules={[{ required: true }]}>
								<Input.TextArea rows={3} placeholder='Mô tả ngắn về điểm đến...' style={{ borderRadius: 8 }} />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='chiPhiAnUong' label='Chi phí ăn uống/ngày (đ)' rules={[{ required: true }]}>
								<InputNumber min={0} step={50000} style={{ width: '100%', borderRadius: 8 }}
									formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(v) => parseInt(v!.replace(/,/g, '')) as any}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='chiPhiLuuTru' label='Chi phí lưu trú/đêm (đ)' rules={[{ required: true }]}>
								<InputNumber min={0} step={100000} style={{ width: '100%', borderRadius: 8 }}
									formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(v) => parseInt(v!.replace(/,/g, '')) as any}
								/>
							</Form.Item>
						</Col>
						<Col span={8}>
							<Form.Item name='chiPhiDiChuyen' label='Chi phí di chuyển (đ)' rules={[{ required: true }]}>
								<InputNumber min={0} step={100000} style={{ width: '100%', borderRadius: 8 }}
									formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(v) => parseInt(v!.replace(/,/g, '')) as any}
								/>
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='tags' label='Tags (cách nhau dấu phẩy)'>
								<Input placeholder='VD: Biển, Resort, Lặn biển' style={{ borderRadius: 8 }} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='popularityScore' label='Độ phổ biến (0-100)'>
								<InputNumber min={0} max={100} style={{ width: '100%', borderRadius: 8 }} />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item name='reviewCount' label='Số lượt đánh giá'>
								<InputNumber min={0} style={{ width: '100%', borderRadius: 8 }}
									formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
									parser={(v) => parseInt(v!.replace(/,/g, '')) as any}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
		</div>
	);
};

// ============ STATISTICS ============
const ThongKe: React.FC = () => {
	const { itineraries, destinations } = useModel('travelplanner');

	const totalRevenue = MONTHLY_STATS.reduce((s, m) => s + m.revenue, 0);
	const totalTrips = MONTHLY_STATS.reduce((s, m) => s + m.count, 0);
	const avgRevPerTrip = totalTrips > 0 ? totalRevenue / totalTrips : 0;

	// Popular destinations
	const popularDests = useMemo(() => {
		const count: Record<string, number> = {};
		itineraries.forEach((it) => it.days.forEach((d) => d.destinations.forEach((dest) => {
			count[dest.id] = (count[dest.id] || 0) + 1;
		})));
		return destinations
			.map((d) => ({ ...d, tripCount: count[d.id] || 0 }))
			.sort((a, b) => b.tripCount - a.tripCount)
			.slice(0, 5);
	}, [itineraries, destinations]);

	// Budget by category across all itineraries
	const categoryTotals = useMemo(() => {
		let anUong = 0, luuTru = 0, diChuyen = 0;
		itineraries.forEach((it) => it.days.forEach((d) => d.destinations.forEach((dest) => {
			anUong += dest.chiPhiAnUong;
			luuTru += dest.chiPhiLuuTru;
			diChuyen += dest.chiPhiDiChuyen;
		})));
		return { anUong, luuTru, diChuyen };
	}, [itineraries]);

	return (
		<div>
			{/* KPI cards */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				{[
					{ label: 'Tổng lịch trình', value: totalTrips, icon: '📅', color: '#C9A84C', suffix: 'lịch trình' },
					{ label: 'Doanh thu', value: `${(totalRevenue / 1000000).toFixed(0)}M đ`, icon: '💰', color: '#52c41a' },
					{ label: 'Điểm đến', value: destinations.length, icon: '📍', color: '#1890ff' },
					{ label: 'TB/lịch trình', value: `${(avgRevPerTrip / 1000000).toFixed(1)}M đ`, icon: '📊', color: '#722ed1' },
				].map((stat) => (
					<Col xs={12} md={6} key={stat.label}>
						<div className='tp-stat-card' style={{ borderLeftColor: stat.color, position: 'relative' }}>
							<div className='stat-icon' style={{ fontSize: 32 }}>{stat.icon}</div>
							<div className='stat-label'>{stat.label}</div>
							<div className='stat-value'>{stat.value}</div>
						</div>
					</Col>
				))}
			</Row>

			<Row gutter={[20, 20]}>
				{/* Monthly trips bar chart */}
				<Col xs={24} lg={14}>
					<Card
						title={<span style={{ fontFamily: 'Georgia, serif' }}>📊 Lịch trình tạo theo tháng</span>}
						style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
					>
						<Chart
							type='bar'
							height={280}
							series={[
								{ name: 'Số lịch trình', data: MONTHLY_STATS.map((m) => m.count), color: '#C9A84C' },
							]}
							options={{
								xaxis: { categories: MONTHLY_STATS.map((m) => m.month) },
								yaxis: { title: { text: 'Số lịch trình' } },
								plotOptions: { bar: { borderRadius: 6, columnWidth: '60%' } },
								dataLabels: { enabled: false },
								tooltip: { y: { formatter: (v: number) => `${v} lịch trình` } },
							}}
						/>
					</Card>
				</Col>

				{/* Popular destinations */}
				<Col xs={24} lg={10}>
					<Card
						title={<span style={{ fontFamily: 'Georgia, serif' }}>🔥 Điểm đến phổ biến</span>}
						style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', height: '100%' }}
					>
						{popularDests.map((dest, i) => (
							<div key={dest.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
								<div style={{
									width: 28, height: 28, borderRadius: '50%',
									background: i === 0 ? '#C9A84C' : i === 1 ? '#8B7355' : '#d9d9d9',
									display: 'flex', alignItems: 'center', justifyContent: 'center',
									fontWeight: 700, color: 'white', fontSize: 13, flexShrink: 0,
								}}>
									{i + 1}
								</div>
								<img src={dest.image} alt={dest.name}
									style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
								/>
								<div style={{ flex: 1 }}>
									<Text strong style={{ fontSize: 13, display: 'block' }}>{dest.name}</Text>
									<Text type='secondary' style={{ fontSize: 11 }}>{dest.location}</Text>
								</div>
								<div style={{ textAlign: 'right' }}>
									<div style={{ fontWeight: 700, color: '#C9A84C', fontSize: 16, fontFamily: 'Georgia, serif' }}>
										{dest.tripCount}
									</div>
									<div style={{ fontSize: 10, color: '#8B7355' }}>lịch trình</div>
								</div>
							</div>
						))}
						{popularDests.every((d) => d.tripCount === 0) && (
							<div style={{ textAlign: 'center', color: '#8B7355', padding: '20px 0' }}>
								Chưa có đủ dữ liệu thống kê
							</div>
						)}
					</Card>
				</Col>

				{/* Revenue line chart */}
				<Col xs={24} lg={14}>
					<Card
						title={<span style={{ fontFamily: 'Georgia, serif' }}>💵 Doanh thu theo tháng</span>}
						style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
					>
						<Chart
							type='area'
							height={260}
							series={[{ name: 'Doanh thu', data: MONTHLY_STATS.map((m) => m.revenue), color: '#C9A84C' }]}
							options={{
								xaxis: { categories: MONTHLY_STATS.map((m) => m.month) },
								yaxis: { labels: { formatter: (v: number) => `${(v / 1000000).toFixed(0)}M` } },
								tooltip: { y: { formatter: (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ' } },
								fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0 } },
								stroke: { curve: 'smooth', width: 2 },
								dataLabels: { enabled: false },
							}}
						/>
					</Card>
				</Col>

				{/* Budget categories donut */}
				<Col xs={24} lg={10}>
					<Card
						title={<span style={{ fontFamily: 'Georgia, serif' }}>🥧 Phân loại chi tiêu</span>}
						style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
					>
						<Chart
							type='donut'
							height={260}
							series={[categoryTotals.anUong || 1, categoryTotals.luuTru || 1, categoryTotals.diChuyen || 1]}
							options={{
								labels: ['Ăn uống', 'Lưu trú', 'Di chuyển'],
								colors: ['#C9A84C', '#1890ff', '#52c41a'],
								legend: { position: 'bottom' },
								tooltip: { y: { formatter: (v: number) => new Intl.NumberFormat('vi-VN').format(v) + 'đ' } },
								dataLabels: { enabled: false },
								plotOptions: {
									pie: {
										donut: {
											labels: {
												show: true,
												total: { show: true, label: 'Tổng chi', formatter: () => `${((categoryTotals.anUong + categoryTotals.luuTru + categoryTotals.diChuyen) / 1000000).toFixed(1)}M đ` },
											},
										},
									},
								},
							}}
						/>
					</Card>
				</Col>
			</Row>
		</div>
	);
};

// ============ MAIN ADMIN PAGE ============
const Admin: React.FC = () => {
	const [activeTab, setActiveTab] = useState('diem-den');

	return (
		<div>
			<div style={{ marginBottom: 24 }}>
				<h2 className='tp-section-title'>⚙️ Trang <span>quản trị</span></h2>
				<p className='tp-section-subtitle'>Quản lý hệ thống lập kế hoạch du lịch</p>
			</div>

			<Tabs
				activeKey={activeTab}
				onChange={setActiveTab}
				type='card'
				size='large'
				tabBarStyle={{ marginBottom: 24 }}
				items={[
					{
						key: 'diem-den',
						label: <span><AppstoreOutlined /> Quản lý điểm đến</span>,
						children: <QuanLyDiemDen />,
					},
					{
						key: 'thong-ke',
						label: <span><BarChartOutlined /> Thống kê</span>,
						children: <ThongKe />,
					},
				]}
			/>
		</div>
	);
};

export default Admin;
