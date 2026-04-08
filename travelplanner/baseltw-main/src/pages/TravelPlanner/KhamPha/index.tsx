import React, { useState, useMemo } from 'react';
import {
	Row, Col, Card, Rate, Tag, Button, Select, Input, Slider, Space,
	Typography, Badge, Tooltip, Empty, Divider, Modal, Descriptions,
} from 'antd';
import {
	SearchOutlined, EnvironmentOutlined, ClockCircleOutlined, StarOutlined,
	FilterOutlined, HeartOutlined, HeartFilled, PlusOutlined, EyeOutlined,
	FireOutlined, CompassOutlined,
} from '@ant-design/icons';
import { useModel, history } from 'umi';
import type { IDestination, TLoaiHinh } from '@/models/travelplanner';
import '../style.less';

const { Text, Title, Paragraph } = Typography;
const { Option } = Select;

const LOAI_HINH_CONFIG: Record<TLoaiHinh, { label: string; emoji: string; color: string }> = {
	bien: { label: 'Biển', emoji: '🏖️', color: '#1890ff' },
	nui: { label: 'Núi', emoji: '🏔️', color: '#52c41a' },
	'thanh-pho': { label: 'Thành phố', emoji: '🏙️', color: '#722ed1' },
	'lang-que': { label: 'Làng quê', emoji: '🌾', color: '#fa8c16' },
	'di-tich': { label: 'Di tích', emoji: '🏛️', color: '#eb2f96' },
};

const formatVND = (n: number) =>
	n >= 1000000
		? `${(n / 1000000).toFixed(1)}M`
		: n >= 1000
		? `${(n / 1000).toFixed(0)}K`
		: String(n);

const DestinationCard: React.FC<{
	dest: IDestination;
	liked: boolean;
	onLike: () => void;
	onView: () => void;
	onAddToTrip: () => void;
}> = ({ dest, liked, onLike, onView, onAddToTrip }) => {
	const loai = LOAI_HINH_CONFIG[dest.loaiHinh];
	const totalDaily = dest.chiPhiAnUong + dest.chiPhiLuuTru + dest.chiPhiDiChuyen;

	return (
		<Card
			hoverable
			className='tp-dest-card'
			cover={
				<div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
					<img
						alt={dest.name}
						src={dest.image}
						style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
						onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
						onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
					/>
					{/* Overlay gradient */}
					<div style={{
						position: 'absolute', inset: 0,
						background: 'linear-gradient(to top, rgba(15,27,45,0.7) 0%, transparent 60%)',
					}} />
					{/* Like button */}
					<button
						onClick={(e) => { e.stopPropagation(); onLike(); }}
						style={{
							position: 'absolute', top: 12, right: 12,
							background: 'rgba(255,255,255,0.9)', border: 'none',
							borderRadius: '50%', width: 36, height: 36,
							display: 'flex', alignItems: 'center', justifyContent: 'center',
							cursor: 'pointer', fontSize: 16, transition: 'all 0.2s',
						}}
					>
						{liked ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined style={{ color: '#8B7355' }} />}
					</button>
					{/* Loại hình badge */}
					<div style={{
						position: 'absolute', top: 12, left: 12,
						background: 'rgba(255,255,255,0.92)', borderRadius: 20,
						padding: '3px 10px', fontSize: 12, fontWeight: 600,
						color: loai.color,
					}}>
						{loai.emoji} {loai.label}
					</div>
					{/* Popularity */}
					{dest.popularityScore >= 95 && (
						<div style={{
							position: 'absolute', bottom: 12, left: 12,
							background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
							borderRadius: 20, padding: '2px 10px', fontSize: 11,
							fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: 4,
						}}>
							<FireOutlined /> Nổi bật
						</div>
					)}
				</div>
			}
			bodyStyle={{ padding: '14px 16px' }}
		>
			<div>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
					<Text strong style={{ fontSize: 16, color: '#0F1B2D', lineHeight: 1.3 }}>{dest.name}</Text>
					<div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
						<StarOutlined style={{ color: '#C9A84C', fontSize: 13 }} />
						<Text strong style={{ color: '#C9A84C', fontSize: 13 }}>{dest.rating}</Text>
					</div>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
					<EnvironmentOutlined style={{ color: '#8B7355', fontSize: 12 }} />
					<Text type='secondary' style={{ fontSize: 12 }}>{dest.location}</Text>
					<Text type='secondary' style={{ fontSize: 12, margin: '0 4px' }}>·</Text>
					<ClockCircleOutlined style={{ color: '#8B7355', fontSize: 12 }} />
					<Text type='secondary' style={{ fontSize: 12 }}>{dest.thoiGianThamQuan}h tham quan</Text>
				</div>
				<Paragraph
					ellipsis={{ rows: 2 }}
					style={{ fontSize: 12, color: '#8B7355', margin: '0 0 10px' }}
				>
					{dest.description}
				</Paragraph>

				{/* Tags */}
				<div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
					{dest.tags.slice(0, 3).map((tag) => (
						<Tag key={tag} style={{ fontSize: 10, padding: '0 6px', borderRadius: 10, margin: 0 }}>
							{tag}
						</Tag>
					))}
				</div>

				{/* Cost */}
				<div style={{
					background: '#FAF7F0', borderRadius: 8, padding: '8px 12px',
					display: 'flex', justifyContent: 'space-between', marginBottom: 12,
				}}>
					<div style={{ textAlign: 'center' }}>
						<div style={{ fontSize: 10, color: '#8B7355' }}>Ăn uống</div>
						<div style={{ fontSize: 12, fontWeight: 600, color: '#0F1B2D' }}>{formatVND(dest.chiPhiAnUong)}/ngày</div>
					</div>
					<div style={{ textAlign: 'center' }}>
						<div style={{ fontSize: 10, color: '#8B7355' }}>Lưu trú</div>
						<div style={{ fontSize: 12, fontWeight: 600, color: '#0F1B2D' }}>{formatVND(dest.chiPhiLuuTru)}/đêm</div>
					</div>
					<div style={{ textAlign: 'center' }}>
						<div style={{ fontSize: 10, color: '#8B7355' }}>Di chuyển</div>
						<div style={{ fontSize: 12, fontWeight: 600, color: '#0F1B2D' }}>{formatVND(dest.chiPhiDiChuyen)}</div>
					</div>
				</div>

				<div style={{ display: 'flex', gap: 8 }}>
					<Button size='small' icon={<EyeOutlined />} onClick={onView} style={{ flex: 1, borderRadius: 8 }}>
						Chi tiết
					</Button>
					<Button
						size='small' type='primary' icon={<PlusOutlined />} onClick={onAddToTrip}
						style={{ flex: 1, borderRadius: 8, background: '#C9A84C', borderColor: '#C9A84C' }}
					>
						Thêm vào trip
					</Button>
				</div>
			</div>
		</Card>
	);
};

const KhamPha: React.FC = () => {
	const { destinations } = useModel('travelplanner');
	const [search, setSearch] = useState('');
	const [filterLoai, setFilterLoai] = useState<TLoaiHinh | ''>('');
	const [filterRating, setFilterRating] = useState<number>(0);
	const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
	const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
	const [liked, setLiked] = useState<Set<string>>(new Set());
	const [viewDest, setViewDest] = useState<IDestination | null>(null);

	const toggleLike = (id: string) => {
		setLiked((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});
	};

	const filtered = useMemo(() => {
		let list = [...destinations];
		if (search) list = list.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase()));
		if (filterLoai) list = list.filter((d) => d.loaiHinh === filterLoai);
		if (filterRating > 0) list = list.filter((d) => d.rating >= filterRating);
		list = list.filter((d) => {
			const totalCost = d.chiPhiAnUong + d.chiPhiLuuTru + d.chiPhiDiChuyen;
			return totalCost >= priceRange[0] && totalCost <= priceRange[1];
		});
		if (sortBy === 'popular') list.sort((a, b) => b.popularityScore - a.popularityScore);
		else if (sortBy === 'rating') list.sort((a, b) => b.rating - a.rating);
		else if (sortBy === 'price-asc') list.sort((a, b) => (a.chiPhiAnUong + a.chiPhiLuuTru + a.chiPhiDiChuyen) - (b.chiPhiAnUong + b.chiPhiLuuTru + b.chiPhiDiChuyen));
		else if (sortBy === 'price-desc') list.sort((a, b) => (b.chiPhiAnUong + b.chiPhiLuuTru + b.chiPhiDiChuyen) - (a.chiPhiAnUong + a.chiPhiLuuTru + a.chiPhiDiChuyen));
		return list;
	}, [destinations, search, filterLoai, filterRating, sortBy, priceRange]);

	return (
		<div>
			{/* Hero Banner */}
			<div className='tp-hero'>
				<Row align='middle' gutter={[24, 16]}>
					<Col xs={24} md={14}>
						<div style={{ position: 'relative', zIndex: 1 }}>
							<div style={{
								color: '#C9A84C', fontSize: 12, fontWeight: 700, letterSpacing: 2,
								textTransform: 'uppercase', marginBottom: 8,
							}}>
								✦ Khám phá Việt Nam
							</div>
							<h1 style={{
								fontFamily: 'Georgia, Times New Roman, serif',
								fontSize: 'clamp(24px, 4vw, 40px)',
								fontWeight: 700, color: 'white', margin: '0 0 12px',
								lineHeight: 1.2,
							}}>
								Hành trình của bạn<br />
								<span style={{ color: '#C9A84C' }}>bắt đầu từ đây</span>
							</h1>
							<p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: '0 0 24px', maxWidth: 420 }}>
								Khám phá hàng trăm điểm đến tuyệt vời trên khắp Việt Nam, từ những bãi biển hoang sơ đến đỉnh núi hùng vĩ.
							</p>
							<Button
								type='primary' size='large' icon={<CompassOutlined />}
								onClick={() => history.push('/travel/lich-trinh')}
								style={{
									background: 'linear-gradient(135deg, #C9A84C, #E8C97A)',
									border: 'none', borderRadius: 12,
									height: 44, fontWeight: 600, fontSize: 15,
								}}
							>
								Tạo lịch trình ngay
							</Button>
						</div>
					</Col>
					<Col xs={24} md={10}>
						<Row gutter={[12, 12]}>
							{[
								{ value: destinations.length, label: 'Điểm đến', icon: '📍' },
								{ value: '2,450+', label: 'Lịch trình tạo', icon: '📅' },
								{ value: '4.8★', label: 'Đánh giá TB', icon: '⭐' },
								{ value: '98%', label: 'Hài lòng', icon: '😊' },
							].map((stat) => (
								<Col span={12} key={stat.label}>
									<div style={{
										background: 'rgba(255,255,255,0.1)', borderRadius: 12,
										padding: '12px 16px', backdropFilter: 'blur(10px)',
										border: '1px solid rgba(255,255,255,0.15)',
									}}>
										<div style={{ fontSize: 20, marginBottom: 2 }}>{stat.icon}</div>
										<div style={{ fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'Georgia, serif' }}>
											{stat.value}
										</div>
										<div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
											{stat.label}
										</div>
									</div>
								</Col>
							))}
						</Row>
					</Col>
				</Row>
			</div>

			{/* Filter Bar */}
			<div className='tp-filter-bar'>
				<Input
					placeholder='🔍 Tìm điểm đến...'
					prefix={<SearchOutlined />}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					style={{ width: 220, borderRadius: 8 }}
					allowClear
				/>
				<Select
					placeholder='Loại hình'
					style={{ width: 140 }}
					value={filterLoai || undefined}
					onChange={(v) => setFilterLoai(v || '')}
					allowClear
				>
					{(Object.entries(LOAI_HINH_CONFIG) as [TLoaiHinh, any][]).map(([key, cfg]) => (
						<Option key={key} value={key}>{cfg.emoji} {cfg.label}</Option>
					))}
				</Select>
				<Select
					placeholder='Đánh giá tối thiểu'
					style={{ width: 170 }}
					value={filterRating || undefined}
					onChange={(v) => setFilterRating(v || 0)}
					allowClear
				>
					{[4.5, 4.6, 4.7, 4.8, 4.9].map((r) => (
						<Option key={r} value={r}>⭐ {r}+ sao</Option>
					))}
				</Select>
				<Select
					value={sortBy}
					onChange={setSortBy}
					style={{ width: 160 }}
				>
					<Option value='popular'>🔥 Phổ biến nhất</Option>
					<Option value='rating'>⭐ Đánh giá cao</Option>
					<Option value='price-asc'>💰 Giá tăng dần</Option>
					<Option value='price-desc'>💎 Giá giảm dần</Option>
				</Select>
				<div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 220 }}>
					<Text style={{ fontSize: 12, color: '#8B7355', whiteSpace: 'nowrap' }}>Chi phí:</Text>
					<Slider
						range
						min={0} max={5000000} step={100000}
						value={priceRange}
						onChange={(v: [number, number]) => setPriceRange(v)}
						style={{ flex: 1 }}
						tooltip={{ formatter: (v) => `${formatVND(v!)}đ` }}
					/>
				</div>
				<Badge count={filtered.length} style={{ backgroundColor: '#C9A84C' }}>
					<div style={{ padding: '4px 8px', fontSize: 12, color: '#8B7355' }}>
						<FilterOutlined /> kết quả
					</div>
				</Badge>
			</div>

			{/* Category pills */}
			<div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
				<Button
					size='small' type={filterLoai === '' ? 'primary' : 'default'}
					onClick={() => setFilterLoai('')}
					style={{
						borderRadius: 20, fontSize: 12,
						...(filterLoai === '' ? { background: '#0F1B2D', borderColor: '#0F1B2D' } : {}),
					}}
				>
					🗺️ Tất cả
				</Button>
				{(Object.entries(LOAI_HINH_CONFIG) as [TLoaiHinh, any][]).map(([key, cfg]) => (
					<Button
						key={key} size='small'
						type={filterLoai === key ? 'primary' : 'default'}
						onClick={() => setFilterLoai(key)}
						style={{
							borderRadius: 20, fontSize: 12,
							...(filterLoai === key ? { background: '#C9A84C', borderColor: '#C9A84C' } : {}),
						}}
					>
						{cfg.emoji} {cfg.label}
					</Button>
				))}
			</div>

			{/* Results */}
			{filtered.length === 0 ? (
				<Empty description='Không tìm thấy điểm đến phù hợp' image={Empty.PRESENTED_IMAGE_SIMPLE} />
			) : (
				<Row gutter={[20, 20]}>
					{filtered.map((dest) => (
						<Col key={dest.id} xs={24} sm={12} lg={8} xl={6}>
							<DestinationCard
								dest={dest}
								liked={liked.has(dest.id)}
								onLike={() => toggleLike(dest.id)}
								onView={() => setViewDest(dest)}
								onAddToTrip={() => history.push('/travel/lich-trinh')}
							/>
						</Col>
					))}
				</Row>
			)}

			{/* Detail Modal */}
			<Modal
				open={!!viewDest}
				onCancel={() => setViewDest(null)}
				footer={[
					<Button key='close' onClick={() => setViewDest(null)}>Đóng</Button>,
					<Button
						key='add' type='primary'
						style={{ background: '#C9A84C', borderColor: '#C9A84C' }}
						onClick={() => { setViewDest(null); history.push('/travel/lich-trinh'); }}
						icon={<PlusOutlined />}
					>
						Thêm vào lịch trình
					</Button>,
				]}
				width={680}
				bodyStyle={{ padding: 0 }}
			>
				{viewDest && (
					<div>
						<div style={{ position: 'relative', height: 260 }}>
							<img
								src={viewDest.image} alt={viewDest.name}
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
							<div style={{
								position: 'absolute', inset: 0,
								background: 'linear-gradient(to top, rgba(15,27,45,0.8) 0%, transparent 50%)',
							}} />
							<div style={{ position: 'absolute', bottom: 20, left: 24 }}>
								<Tag color={LOAI_HINH_CONFIG[viewDest.loaiHinh].color} style={{ marginBottom: 8 }}>
									{LOAI_HINH_CONFIG[viewDest.loaiHinh].emoji} {LOAI_HINH_CONFIG[viewDest.loaiHinh].label}
								</Tag>
								<h2 style={{ color: 'white', margin: 0, fontFamily: 'Georgia, serif', fontSize: 26 }}>{viewDest.name}</h2>
								<div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>
									<EnvironmentOutlined /> {viewDest.location}
								</div>
							</div>
						</div>
						<div style={{ padding: 24 }}>
							<Row gutter={16} style={{ marginBottom: 16 }}>
								<Col span={8}>
									<div style={{ textAlign: 'center', background: '#FAF7F0', borderRadius: 10, padding: 12 }}>
										<Rate disabled value={viewDest.rating} allowHalf style={{ fontSize: 14 }} />
										<div style={{ fontSize: 18, fontWeight: 700, color: '#0F1B2D', fontFamily: 'Georgia, serif' }}>{viewDest.rating}</div>
										<div style={{ fontSize: 11, color: '#8B7355' }}>{viewDest.reviewCount.toLocaleString()} đánh giá</div>
									</div>
								</Col>
								<Col span={8}>
									<div style={{ textAlign: 'center', background: '#FAF7F0', borderRadius: 10, padding: 12 }}>
										<ClockCircleOutlined style={{ fontSize: 20, color: '#C9A84C', display: 'block', marginBottom: 4 }} />
										<div style={{ fontSize: 18, fontWeight: 700, color: '#0F1B2D', fontFamily: 'Georgia, serif' }}>{viewDest.thoiGianThamQuan}h</div>
										<div style={{ fontSize: 11, color: '#8B7355' }}>Thời gian tham quan</div>
									</div>
								</Col>
								<Col span={8}>
									<div style={{ textAlign: 'center', background: '#FAF7F0', borderRadius: 10, padding: 12 }}>
										<div style={{ fontSize: 20, marginBottom: 4 }}>💰</div>
										<div style={{ fontSize: 18, fontWeight: 700, color: '#0F1B2D', fontFamily: 'Georgia, serif' }}>
											{formatVND(viewDest.chiPhiAnUong + viewDest.chiPhiLuuTru + viewDest.chiPhiDiChuyen)}
										</div>
										<div style={{ fontSize: 11, color: '#8B7355' }}>Tổng chi phí ước tính</div>
									</div>
								</Col>
							</Row>
							<Paragraph style={{ color: '#8B7355', lineHeight: 1.7 }}>{viewDest.description}</Paragraph>
							<Divider style={{ margin: '12px 0' }} />
							<Descriptions size='small' column={3}>
								<Descriptions.Item label='Ăn uống'>{formatVND(viewDest.chiPhiAnUong)}/ngày</Descriptions.Item>
								<Descriptions.Item label='Lưu trú'>{formatVND(viewDest.chiPhiLuuTru)}/đêm</Descriptions.Item>
								<Descriptions.Item label='Di chuyển'>{formatVND(viewDest.chiPhiDiChuyen)}</Descriptions.Item>
							</Descriptions>
							<div style={{ marginTop: 12 }}>
								{viewDest.tags.map((tag) => (
									<Tag key={tag} style={{ borderRadius: 12, marginBottom: 6 }}>{tag}</Tag>
								))}
							</div>
						</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default KhamPha;
