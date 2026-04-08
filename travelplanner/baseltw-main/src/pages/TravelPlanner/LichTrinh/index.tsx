import React, { useState, useMemo } from 'react';
import {
	Row, Col, Card, Button, Select, DatePicker, Input, Modal, Tag, Empty,
	message, Divider, Timeline, Typography, Space, InputNumber, Popconfirm,
	Drawer, List, Avatar, Alert, Tooltip,
} from 'antd';
import {
	PlusOutlined, DeleteOutlined, CalendarOutlined, EnvironmentOutlined,
	DragOutlined, ClockCircleOutlined, DollarOutlined, EditOutlined,
	SaveOutlined, EyeOutlined, SwapOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import dayjs from 'dayjs';
import type { IItinerary, IItineraryDay, IDestination } from '@/models/travelplanner';
import '../style.less';

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

const formatVND = (n: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const getDaysBetween = (start: string, end: string): string[] => {
	const days: string[] = [];
	let cur = dayjs(start);
	const endDay = dayjs(end);
	while (cur.isBefore(endDay) || cur.isSame(endDay, 'day')) {
		days.push(cur.format('YYYY-MM-DD'));
		cur = cur.add(1, 'day');
	}
	return days;
};

const DestPickerDrawer: React.FC<{
	open: boolean;
	onClose: () => void;
	onSelect: (dest: IDestination) => void;
}> = ({ open, onClose, onSelect }) => {
	const { destinations } = useModel('travelplanner');
	const [search, setSearch] = useState('');
	const filtered = destinations.filter(
		(d) => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase())
	);
	return (
		<Drawer
			title={<><EnvironmentOutlined /> Chọn điểm đến</>}
			open={open} onClose={onClose} width={420}
			bodyStyle={{ padding: '16px' }}
		>
			<Input.Search
				placeholder='Tìm điểm đến...'
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				style={{ marginBottom: 16 }}
			/>
			<List
				dataSource={filtered}
				renderItem={(dest) => (
					<List.Item
						key={dest.id}
						onClick={() => { onSelect(dest); onClose(); }}
						style={{ cursor: 'pointer', padding: '10px 8px', borderRadius: 8, transition: 'background 0.2s' }}
						onMouseEnter={(e) => (e.currentTarget.style.background = '#FAF7F0')}
						onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
						extra={<Button size='small' type='primary' style={{ background: '#C9A84C', borderColor: '#C9A84C' }}>Chọn</Button>}
					>
						<List.Item.Meta
							avatar={
								<img src={dest.image} alt={dest.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover' }} />
							}
							title={<Text strong style={{ fontSize: 14 }}>{dest.name}</Text>}
							description={
								<div>
									<div style={{ fontSize: 11, color: '#8B7355' }}><EnvironmentOutlined /> {dest.location}</div>
									<div style={{ fontSize: 11 }}>⭐ {dest.rating} · ⏱ {dest.thoiGianThamQuan}h</div>
								</div>
							}
						/>
					</List.Item>
				)}
			/>
		</Drawer>
	);
};

const LichTrinh: React.FC = () => {
	const { itineraries, destinations, addItinerary, updateItinerary, deleteItinerary, calcItineraryBudget } = useModel('travelplanner');
	const [showCreate, setShowCreate] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [addingToDay, setAddingToDay] = useState<string | null>(null);

	// Form state
	const [formName, setFormName] = useState('');
	const [formDates, setFormDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
	const [formBudget, setFormBudget] = useState<number>(10000000);
	const [formDays, setFormDays] = useState<IItineraryDay[]>([]);

	const currentEdit = useMemo(() => itineraries.find((i) => i.id === editingId), [itineraries, editingId]);

	const openCreate = () => {
		setFormName('');
		setFormDates(null);
		setFormBudget(10000000);
		setFormDays([]);
		setShowCreate(true);
		setEditingId(null);
	};

	const openEdit = (it: IItinerary) => {
		setEditingId(it.id);
		setFormName(it.name);
		setFormDates([dayjs(it.startDate), dayjs(it.endDate)]);
		setFormBudget(it.totalBudget);
		setFormDays(it.days);
		setShowCreate(true);
	};

	const handleDateChange = (dates: any) => {
		if (dates) {
			setFormDates(dates);
			const dayList = getDaysBetween(dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD'));
			setFormDays(dayList.map((date) => ({
				date,
				destinations: formDays.find((d) => d.date === date)?.destinations || [],
				notes: formDays.find((d) => d.date === date)?.notes || '',
			})));
		}
	};

	const addDestToDay = (date: string, dest: IDestination) => {
		setFormDays((prev) =>
			prev.map((d) => d.date === date ? { ...d, destinations: [...d.destinations, dest] } : d)
		);
		message.success(`Đã thêm ${dest.name} vào ngày ${dayjs(date).format('DD/MM')}`);
	};

	const removeDestFromDay = (date: string, destId: string) => {
		setFormDays((prev) =>
			prev.map((d) => d.date === date ? { ...d, destinations: d.destinations.filter((dd) => dd.id !== destId) } : d)
		);
	};

	const handleSave = () => {
		if (!formName.trim()) { message.error('Vui lòng nhập tên lịch trình'); return; }
		if (!formDates) { message.error('Vui lòng chọn ngày đi và về'); return; }
		const it: IItinerary = {
			id: editingId || `it_${Date.now()}`,
			name: formName,
			startDate: formDates[0].format('YYYY-MM-DD'),
			endDate: formDates[1].format('YYYY-MM-DD'),
			days: formDays,
			totalBudget: formBudget,
			createdAt: new Date().toISOString(),
			status: 'draft',
		};
		if (editingId) updateItinerary(editingId, it);
		else addItinerary(it);
		message.success(editingId ? 'Đã cập nhật lịch trình!' : 'Đã tạo lịch trình mới!');
		setShowCreate(false);
	};

	// Budget calc for form
	const formBudgetCalc = useMemo(() => {
		const allDests = formDays.flatMap((d) => d.destinations);
		const anUong = allDests.reduce((s, d) => s + d.chiPhiAnUong, 0);
		const luuTru = allDests.reduce((s, d) => s + d.chiPhiLuuTru, 0);
		const diChuyen = allDests.reduce((s, d) => s + d.chiPhiDiChuyen, 0);
		return { anUong, luuTru, diChuyen, total: anUong + luuTru + diChuyen };
	}, [formDays]);

	const STATUS_CONFIG = {
		draft: { color: 'default', label: 'Nháp' },
		planned: { color: 'blue', label: 'Đã lên kế hoạch' },
		completed: { color: 'green', label: 'Hoàn thành' },
	};

	return (
		<div>
			{/* Header */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
				<div>
					<h2 className='tp-section-title'>📅 Lịch trình <span>của tôi</span></h2>
					<p className='tp-section-subtitle'>Quản lý và lên kế hoạch cho những chuyến du lịch tuyệt vời</p>
				</div>
				<Button
					type='primary' icon={<PlusOutlined />} size='large'
					onClick={openCreate}
					style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C97A)', border: 'none', borderRadius: 12, fontWeight: 600 }}
				>
					Tạo lịch trình mới
				</Button>
			</div>

			{/* Itinerary list */}
			{itineraries.length === 0 ? (
				<Card style={{ borderRadius: 16, textAlign: 'center', padding: 40 }}>
					<Empty description='Chưa có lịch trình nào. Hãy tạo lịch trình đầu tiên!' />
					<Button type='primary' icon={<PlusOutlined />} onClick={openCreate} style={{ marginTop: 16, background: '#C9A84C', borderColor: '#C9A84C' }}>
						Tạo ngay
					</Button>
				</Card>
			) : (
				<Row gutter={[20, 20]}>
					{itineraries.map((it) => {
						const budget = calcItineraryBudget(it);
						const over = budget.total > it.totalBudget;
						const days = getDaysBetween(it.startDate, it.endDate).length;
						const allDests = it.days.flatMap((d) => d.destinations);
						return (
							<Col key={it.id} xs={24} md={12} xl={8}>
								<Card
									className='tp-card-hover'
									style={{ borderRadius: 16, overflow: 'hidden', border: over ? '1px solid #ffccc7' : '1px solid #f0f0f0' }}
									bodyStyle={{ padding: 0 }}
								>
									{/* Card header */}
									<div style={{ background: 'linear-gradient(135deg, #0F1B2D, #1A2E45)', padding: '20px 20px 16px' }}>
										<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
											<div>
												<Tag color={STATUS_CONFIG[it.status].color} style={{ marginBottom: 8, borderRadius: 10, fontSize: 11 }}>
													{STATUS_CONFIG[it.status].label}
												</Tag>
												<h3 style={{ color: 'white', margin: 0, fontFamily: 'Georgia, serif', fontSize: 18, marginBottom: 4 }}>
													{it.name}
												</h3>
												<div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
													<CalendarOutlined /> {dayjs(it.startDate).format('DD/MM')} → {dayjs(it.endDate).format('DD/MM/YYYY')} · {days} ngày
												</div>
											</div>
										</div>
									</div>

									<div style={{ padding: '16px 20px' }}>
										{/* Destinations preview */}
										<div style={{ marginBottom: 12 }}>
											{allDests.slice(0, 3).map((d, i) => (
												<Tag key={i} style={{ marginBottom: 4, borderRadius: 10, fontSize: 11 }}>
													📍 {d.name}
												</Tag>
											))}
											{allDests.length > 3 && (
												<Tag style={{ marginBottom: 4, borderRadius: 10, fontSize: 11, background: '#FAF7F0' }}>
													+{allDests.length - 3} nữa
												</Tag>
											)}
											{allDests.length === 0 && (
												<Text type='secondary' style={{ fontSize: 12 }}>Chưa có điểm đến nào</Text>
											)}
										</div>

										{/* Budget */}
										<div style={{
											background: over ? '#fff5f3' : '#FAF7F0',
											borderRadius: 10, padding: '10px 14px',
											border: over ? '1px solid #ffccc7' : 'none',
											marginBottom: 14,
										}}>
											<Row gutter={8}>
												<Col span={12}>
													<div style={{ fontSize: 11, color: '#8B7355' }}>Ngân sách</div>
													<div style={{ fontSize: 14, fontWeight: 700, color: '#0F1B2D', fontFamily: 'Georgia, serif' }}>
														{formatVND(it.totalBudget)}
													</div>
												</Col>
												<Col span={12}>
													<div style={{ fontSize: 11, color: over ? '#ff4d4f' : '#8B7355' }}>Ước tính chi</div>
													<div style={{ fontSize: 14, fontWeight: 700, color: over ? '#ff4d4f' : '#4CAF7D', fontFamily: 'Georgia, serif' }}>
														{formatVND(budget.total)}
													</div>
												</Col>
											</Row>
											{over && (
												<div style={{ fontSize: 11, color: '#ff4d4f', marginTop: 4 }}>
													⚠️ Vượt ngân sách {formatVND(budget.total - it.totalBudget)}
												</div>
											)}
										</div>

										{/* Actions */}
										<div style={{ display: 'flex', gap: 8 }}>
											<Button size='small' icon={<EditOutlined />} onClick={() => openEdit(it)} style={{ flex: 1, borderRadius: 8 }}>
												Chỉnh sửa
											</Button>
											<Popconfirm title='Xóa lịch trình này?' onConfirm={() => deleteItinerary(it.id)} okButtonProps={{ danger: true }}>
												<Button size='small' danger icon={<DeleteOutlined />} style={{ borderRadius: 8 }} />
											</Popconfirm>
										</div>
									</div>
								</Card>
							</Col>
						);
					})}
				</Row>
			)}

			{/* Create/Edit Modal */}
			<Modal
				title={
					<div style={{ fontFamily: 'Georgia, serif', fontSize: 18, color: '#0F1B2D' }}>
						{editingId ? '✏️ Chỉnh sửa lịch trình' : '🗺️ Tạo lịch trình mới'}
					</div>
				}
				open={showCreate}
				onCancel={() => setShowCreate(false)}
				width={800}
				footer={[
					<Button key='cancel' onClick={() => setShowCreate(false)}>Hủy</Button>,
					<Button key='save' type='primary' icon={<SaveOutlined />} onClick={handleSave}
						style={{ background: '#C9A84C', borderColor: '#C9A84C', fontWeight: 600 }}
					>
						Lưu lịch trình
					</Button>,
				]}
				bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
			>
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<Text strong>Tên lịch trình *</Text>
						<Input
							placeholder='VD: Khám phá miền Bắc 7 ngày'
							value={formName} onChange={(e) => setFormName(e.target.value)}
							style={{ marginTop: 6, borderRadius: 8 }}
						/>
					</Col>
					<Col xs={24} sm={14}>
						<Text strong>Ngày đi - Ngày về *</Text>
						<br />
						<RangePicker
							value={formDates}
							onChange={handleDateChange}
							style={{ marginTop: 6, width: '100%', borderRadius: 8 }}
							format='DD/MM/YYYY'
							disabledDate={(d) => d.isBefore(dayjs(), 'day')}
						/>
					</Col>
					<Col xs={24} sm={10}>
						<Text strong>Ngân sách tổng (VNĐ)</Text>
						<InputNumber
							value={formBudget}
							onChange={(v) => setFormBudget(v || 0)}
							formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
							parser={(v) => parseInt(v!.replace(/,/g, '')) as any}
							style={{ marginTop: 6, width: '100%', borderRadius: 8 }}
							min={0} step={500000}
						/>
					</Col>
				</Row>

				{/* Budget preview */}
				{formDays.length > 0 && formBudgetCalc.total > 0 && (
					<div style={{ marginTop: 16 }}>
						<Alert
							type={formBudgetCalc.total > formBudget ? 'error' : 'success'}
							message={
								<Row gutter={16}>
									<Col span={6}><b>Ăn uống:</b> {new Intl.NumberFormat('vi-VN').format(formBudgetCalc.anUong)}</Col>
									<Col span={6}><b>Lưu trú:</b> {new Intl.NumberFormat('vi-VN').format(formBudgetCalc.luuTru)}</Col>
									<Col span={6}><b>Di chuyển:</b> {new Intl.NumberFormat('vi-VN').format(formBudgetCalc.diChuyen)}</Col>
									<Col span={6}>
										<b style={{ color: formBudgetCalc.total > formBudget ? '#ff4d4f' : '#4CAF7D' }}>
											Tổng: {new Intl.NumberFormat('vi-VN').format(formBudgetCalc.total)}đ
										</b>
									</Col>
								</Row>
							}
							showIcon={false}
							style={{ borderRadius: 10 }}
						/>
					</div>
				)}

				{/* Days */}
				{formDays.length > 0 && (
					<div style={{ marginTop: 20 }}>
						<Divider style={{ margin: '12px 0' }}>
							<Text style={{ fontFamily: 'Georgia, serif', color: '#0F1B2D' }}>Lịch trình theo ngày</Text>
						</Divider>
						{formDays.map((day, idx) => (
							<div key={day.date} className='tp-day-card'>
								<div className='day-header'>
									<div>
										<span className='day-title'>Ngày {idx + 1}</span>
										<span className='day-date' style={{ marginLeft: 12 }}>
											{dayjs(day.date).format('dddd, DD/MM/YYYY')}
										</span>
									</div>
									<Button
										size='small' ghost
										icon={<PlusOutlined />}
										onClick={() => { setAddingToDay(day.date); setDrawerOpen(true); }}
										style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', borderRadius: 8, fontSize: 12 }}
									>
										Thêm điểm
									</Button>
								</div>
								<div className='day-body'>
									{day.destinations.length === 0 ? (
										<div style={{ textAlign: 'center', padding: '20px 0', color: '#8B7355', fontSize: 13 }}>
											<EnvironmentOutlined style={{ fontSize: 24, display: 'block', marginBottom: 8, opacity: 0.4 }} />
											Chưa có điểm đến. Thêm điểm đến cho ngày này.
										</div>
									) : (
										<Timeline style={{ paddingTop: 8 }}>
											{day.destinations.map((dest, di) => (
												<Timeline.Item
													key={dest.id + di}
													dot={<EnvironmentOutlined style={{ color: '#C9A84C' }} />}
												>
													<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
														<div>
															<Text strong style={{ fontSize: 14 }}>{dest.name}</Text>
															<div style={{ fontSize: 12, color: '#8B7355' }}>
																<ClockCircleOutlined /> {dest.thoiGianThamQuan}h ·{' '}
																<DollarOutlined /> ~{new Intl.NumberFormat('vi-VN').format(dest.chiPhiAnUong + dest.chiPhiLuuTru)}đ
															</div>
														</div>
														<Button
															size='small' danger type='text' icon={<DeleteOutlined />}
															onClick={() => removeDestFromDay(day.date, dest.id)}
														/>
													</div>
												</Timeline.Item>
											))}
										</Timeline>
									)}
									<Input.TextArea
										placeholder='Ghi chú cho ngày này...'
										value={day.notes}
										onChange={(e) => setFormDays((prev) => prev.map((d) => d.date === day.date ? { ...d, notes: e.target.value } : d))}
										rows={2}
										style={{ borderRadius: 8, marginTop: 8, fontSize: 12 }}
									/>
								</div>
							</div>
						))}
					</div>
				)}

				{formDays.length === 0 && (
					<div style={{ textAlign: 'center', padding: '40px 0', color: '#8B7355' }}>
						<CalendarOutlined style={{ fontSize: 36, display: 'block', marginBottom: 12, opacity: 0.3 }} />
						Chọn ngày đi và về để bắt đầu lên lịch
					</div>
				)}
			</Modal>

			{/* Destination Picker Drawer */}
			<DestPickerDrawer
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				onSelect={(dest) => {
					if (addingToDay) addDestToDay(addingToDay, dest);
				}}
			/>
		</div>
	);
};

export default LichTrinh;
