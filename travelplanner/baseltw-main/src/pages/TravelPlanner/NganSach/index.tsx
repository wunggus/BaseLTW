import React, { useMemo, useState } from 'react';
import {
	Row, Col, Card, Select, Alert, Progress, Typography, Statistic,
	Table, Tag, Divider, InputNumber, Button, Space,
} from 'antd';
import {
	DollarOutlined, WarningOutlined, CheckCircleOutlined,
	RiseOutlined, FallOutlined, WalletOutlined,
} from '@ant-design/icons';
import Chart from 'react-apexcharts';
import { useModel } from 'umi';
import '../style.less';

const { Text, Title } = Typography;
const { Option } = Select;

const formatVND = (n: number) =>
	new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const CATEGORY_COLORS = ['#C9A84C', '#1890ff', '#52c41a', '#722ed1', '#eb2f96'];

const BUDGET_CATEGORIES = [
	{ key: 'anUong', label: 'Ăn uống', icon: '🍜', color: '#C9A84C' },
	{ key: 'luuTru', label: 'Lưu trú', icon: '🏨', color: '#1890ff' },
	{ key: 'diChuyen', label: 'Di chuyển', icon: '✈️', color: '#52c41a' },
	{ key: 'vuiChoi', label: 'Vui chơi', icon: '🎡', color: '#722ed1' },
	{ key: 'mua_sam', label: 'Mua sắm', icon: '🛍️', color: '#eb2f96' },
];

const NganSach: React.FC = () => {
	const { itineraries, calcItineraryBudget } = useModel('travelplanner');
	const [selectedItId, setSelectedItId] = useState<string>(itineraries[0]?.id || '');
	const [customBudgets, setCustomBudgets] = useState<Record<string, number>>({
		vuiChoi: 1500000, mua_sam: 1000000,
	});

	const selectedIt = useMemo(() => itineraries.find((i) => i.id === selectedItId), [itineraries, selectedItId]);
	const budgetCalc = useMemo(() => selectedIt ? calcItineraryBudget(selectedIt) : null, [selectedIt]);

	const allSpending = useMemo(() => {
		if (!budgetCalc) return { anUong: 0, luuTru: 0, diChuyen: 0, vuiChoi: customBudgets.vuiChoi, mua_sam: customBudgets.mua_sam, total: 0 };
		const base = { ...budgetCalc, vuiChoi: customBudgets.vuiChoi, mua_sam: customBudgets.mua_sam };
		return { ...base, total: base.anUong + base.luuTru + base.diChuyen + base.vuiChoi + base.mua_sam };
	}, [budgetCalc, customBudgets]);

	const totalBudget = selectedIt?.totalBudget || 0;
	const overBudget = allSpending.total > totalBudget;
	const percentUsed = totalBudget > 0 ? Math.min((allSpending.total / totalBudget) * 100, 100) : 0;
	const remaining = totalBudget - allSpending.total;

	// Donut chart data
	const donutData = useMemo(() => {
		const items = BUDGET_CATEGORIES.map((c) => ({ label: c.label, value: allSpending[c.key as keyof typeof allSpending] as number }));
		return items.filter((i) => i.value > 0);
	}, [allSpending]);

	// Bar chart - daily spending
	const barData = useMemo(() => {
		if (!selectedIt) return { categories: [], series: [] };
		return {
			categories: selectedIt.days.map((d, i) => `Ngày ${i + 1}`),
			series: [
				{
					name: 'Ăn uống',
					data: selectedIt.days.map((d) => d.destinations.reduce((s, dest) => s + dest.chiPhiAnUong, 0)),
				},
				{
					name: 'Lưu trú',
					data: selectedIt.days.map((d) => d.destinations.reduce((s, dest) => s + dest.chiPhiLuuTru, 0)),
				},
				{
					name: 'Di chuyển',
					data: selectedIt.days.map((d) => d.destinations.reduce((s, dest) => s + dest.chiPhiDiChuyen, 0)),
				},
			],
		};
	}, [selectedIt]);

	const tableData = BUDGET_CATEGORIES.map((c) => ({
		key: c.key,
		icon: c.icon,
		label: c.label,
		color: c.color,
		amount: allSpending[c.key as keyof typeof allSpending] as number,
		percent: allSpending.total > 0 ? ((allSpending[c.key as keyof typeof allSpending] as number) / allSpending.total) * 100 : 0,
		isCustom: ['vuiChoi', 'mua_sam'].includes(c.key),
	}));

	return (
		<div>
			{/* Header + select */}
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
				<div>
					<h2 className='tp-section-title'>💰 Quản lý <span>ngân sách</span></h2>
					<p className='tp-section-subtitle'>Theo dõi và kiểm soát chi tiêu cho chuyến du lịch</p>
				</div>
				<Select
					value={selectedItId}
					onChange={setSelectedItId}
					style={{ width: 240 }}
					placeholder='Chọn lịch trình'
				>
					{itineraries.map((it) => (
						<Option key={it.id} value={it.id}>{it.name}</Option>
					))}
				</Select>
			</div>

			{!selectedIt ? (
				<Card style={{ borderRadius: 16, textAlign: 'center', padding: 60 }}>
					<WalletOutlined style={{ fontSize: 48, color: '#C9A84C', marginBottom: 16 }} />
					<Title level={4} style={{ color: '#8B7355' }}>Chọn một lịch trình để xem ngân sách</Title>
				</Card>
			) : (
				<>
					{/* Budget alert */}
					{overBudget ? (
						<Alert
							className='tp-budget-over'
							type='error' showIcon
							icon={<WarningOutlined style={{ color: '#ff4d4f' }} />}
							message={
								<span style={{ fontWeight: 700, color: '#cf1322', fontSize: 15 }}>
									⚠️ Vượt ngân sách {formatVND(Math.abs(remaining))}!
								</span>
							}
							description={`Tổng chi tiêu ước tính ${formatVND(allSpending.total)} vượt quá ngân sách ${formatVND(totalBudget)}. Cân nhắc điều chỉnh lịch trình.`}
							style={{ marginBottom: 20, borderRadius: 12 }}
						/>
					) : (
						<Alert
							type='success' showIcon
							icon={<CheckCircleOutlined />}
							message={<span style={{ fontWeight: 600 }}>Ngân sách hợp lý! Còn dư {formatVND(remaining)}</span>}
							style={{ marginBottom: 20, borderRadius: 12 }}
						/>
					)}

					{/* Stat cards */}
					<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
						{[
							{ label: 'Ngân sách', value: formatVND(totalBudget), icon: '💼', border: '#C9A84C' },
							{ label: 'Ước tính chi', value: formatVND(allSpending.total), icon: overBudget ? '📈' : '📉', border: overBudget ? '#ff4d4f' : '#52c41a' },
							{ label: 'Còn lại', value: formatVND(Math.abs(remaining)), icon: remaining >= 0 ? '✅' : '❌', border: remaining >= 0 ? '#52c41a' : '#ff4d4f' },
							{ label: 'Chi/ngày TB', value: formatVND(allSpending.total / Math.max(selectedIt.days.length, 1)), icon: '📅', border: '#1890ff' },
						].map((stat) => (
							<Col xs={12} md={6} key={stat.label}>
								<div className='tp-stat-card' style={{ borderLeftColor: stat.border, position: 'relative' }}>
									<div className='stat-icon'>{stat.icon}</div>
									<div className='stat-label'>{stat.label}</div>
									<div className='stat-value' style={{ fontSize: 18 }}>{stat.value}</div>
								</div>
							</Col>
						))}
					</Row>

					{/* Progress */}
					<Card style={{ borderRadius: 16, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
						<Row align='middle' gutter={16}>
							<Col xs={24} sm={4} style={{ textAlign: 'center' }}>
								<div style={{ fontSize: 36 }}>{overBudget ? '🔴' : percentUsed > 80 ? '🟡' : '🟢'}</div>
							</Col>
							<Col xs={24} sm={20}>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
									<Text strong style={{ fontSize: 15 }}>Mức sử dụng ngân sách</Text>
									<Text strong style={{ color: overBudget ? '#ff4d4f' : '#C9A84C', fontSize: 18 }}>
										{percentUsed.toFixed(1)}%
									</Text>
								</div>
								<Progress
									percent={Math.min(percentUsed, 100)}
									strokeColor={overBudget ? '#ff4d4f' : percentUsed > 80 ? '#faad14' : '#C9A84C'}
									trailColor='#f0f0f0'
									strokeWidth={16}
									showInfo={false}
									style={{ borderRadius: 8 }}
								/>
								<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
									<Text type='secondary' style={{ fontSize: 12 }}>0đ</Text>
									<Text type='secondary' style={{ fontSize: 12 }}>{formatVND(totalBudget)}</Text>
								</div>
							</Col>
						</Row>
					</Card>

					<Row gutter={[20, 20]}>
						{/* Donut chart */}
						<Col xs={24} lg={10}>
							<Card
								title={<span style={{ fontFamily: 'Georgia, serif' }}>🥧 Phân bổ ngân sách</span>}
								style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
								bodyStyle={{ padding: '16px 20px' }}
							>
								{donutData.length > 0 ? (
									<Chart
										type='donut'
										height={280}
										series={donutData.map((d) => d.value)}
										options={{
											labels: donutData.map((d) => d.label),
											colors: CATEGORY_COLORS,
											legend: { position: 'bottom' },
											plotOptions: {
												pie: {
													donut: {
														labels: {
															show: true,
															total: {
																show: true, label: 'Tổng chi',
																formatter: () => formatVND(allSpending.total),
															},
														},
													},
												},
											},
											tooltip: {
												y: { formatter: (val: number) => formatVND(val) },
											},
											dataLabels: { enabled: false },
										}}
									/>
								) : (
									<div style={{ textAlign: 'center', padding: 40, color: '#8B7355' }}>
										Chưa có dữ liệu chi tiêu
									</div>
								)}
							</Card>
						</Col>

						{/* Category breakdown */}
						<Col xs={24} lg={14}>
							<Card
								title={<span style={{ fontFamily: 'Georgia, serif' }}>📋 Chi tiết theo hạng mục</span>}
								style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
								bodyStyle={{ padding: '16px 20px' }}
							>
								<div>
									{tableData.map((row) => (
										<div key={row.key} style={{ marginBottom: 16 }}>
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
												<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
													<span style={{ fontSize: 18 }}>{row.icon}</span>
													<Text strong style={{ fontSize: 14 }}>{row.label}</Text>
													{row.isCustom && (
														<Tag color='orange' style={{ fontSize: 10, borderRadius: 8 }}>Tùy chỉnh</Tag>
													)}
												</div>
												<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
													{row.isCustom ? (
														<InputNumber
															size='small'
															value={customBudgets[row.key]}
															onChange={(v) => setCustomBudgets((prev) => ({ ...prev, [row.key]: v || 0 }))}
															formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
															parser={(v) => parseInt(v!.replace(/,/g, '')) as any}
															style={{ width: 140, borderRadius: 6 }}
															min={0} step={100000}
														/>
													) : (
														<Text strong style={{ fontFamily: 'Georgia, serif', fontSize: 15 }}>
															{formatVND(row.amount)}
														</Text>
													)}
													<Tag style={{ borderRadius: 10, minWidth: 48, textAlign: 'center' }}>
														{row.percent.toFixed(1)}%
													</Tag>
												</div>
											</div>
											<Progress
												percent={row.percent}
												strokeColor={row.color}
												trailColor='#f0f0f0'
												showInfo={false}
												strokeWidth={8}
											/>
										</div>
									))}
								</div>
							</Card>
						</Col>
					</Row>

					{/* Bar chart - daily */}
					{barData.categories.length > 0 && (
						<Card
							title={<span style={{ fontFamily: 'Georgia, serif' }}>📊 Chi tiêu theo ngày</span>}
							style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginTop: 20 }}
							bodyStyle={{ padding: '16px 20px' }}
						>
							<Chart
								type='bar'
								height={280}
								series={barData.series}
								options={{
									chart: { stacked: true },
									colors: ['#C9A84C', '#1890ff', '#52c41a'],
									xaxis: { categories: barData.categories },
									yaxis: { labels: { formatter: (v: number) => `${(v / 1000000).toFixed(1)}M` } },
									tooltip: { y: { formatter: (v: number) => formatVND(v) } },
									legend: { position: 'top' },
									plotOptions: { bar: { columnWidth: '50%', borderRadius: 6 } },
									dataLabels: { enabled: false },
								}}
							/>
						</Card>
					)}
				</>
			)}
		</div>
	);
};

export default NganSach;
