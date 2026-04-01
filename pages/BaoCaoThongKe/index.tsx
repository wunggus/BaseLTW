import ColumnChart from '@/components/Chart/ColumnChart';
import { Card, Col, Row, Spin, Statistic, Typography } from 'antd';
import {
	AuditOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	TeamOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Title } = Typography;

const BaoCaoThongKePage = () => {
	const { getAllModel: getAllCLB, danhSachTatCa, getAllCLB: fetchCLB } = useModel('cauLacBo.cauLacBo');
	const { getAllModel: getAllDangKy } = useModel('dangKyThanhVien.dangKyThanhVien');

	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		tongCLB: 0,
		pending: 0,
		approved: 0,
		rejected: 0,
	});

	const [chartData, setChartData] = useState<{
		xAxis: string[];
		pending: number[];
		approved: number[];
		rejected: number[];
	}>({ xAxis: [], pending: [], approved: [], rejected: [] });

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		setLoading(true);
		try {
			const [clubs, registrations] = await Promise.all([
				fetchCLB(),
				getAllDangKy(false, undefined, undefined, undefined, undefined, false),
			]);

			// Summary stats
			const pending = registrations.filter((r: DangKyThanhVien.IRecord) => r.trangThai === 'Pending').length;
			const approved = registrations.filter((r: DangKyThanhVien.IRecord) => r.trangThai === 'Approved').length;
			const rejected = registrations.filter((r: DangKyThanhVien.IRecord) => r.trangThai === 'Rejected').length;

			setStats({ tongCLB: clubs.length, pending, approved, rejected });

			// Chart data: group by CLB
			const xAxis: string[] = [];
			const pendingArr: number[] = [];
			const approvedArr: number[] = [];
			const rejectedArr: number[] = [];

			clubs.forEach((clb: CauLacBo.IRecord) => {
				const clbRegs = registrations.filter((r: DangKyThanhVien.IRecord) => r.cauLacBoId === clb._id);
				xAxis.push(clb.tenCLB);
				pendingArr.push(clbRegs.filter((r: DangKyThanhVien.IRecord) => r.trangThai === 'Pending').length);
				approvedArr.push(clbRegs.filter((r: DangKyThanhVien.IRecord) => r.trangThai === 'Approved').length);
				rejectedArr.push(clbRegs.filter((r: DangKyThanhVien.IRecord) => r.trangThai === 'Rejected').length);
			});

			setChartData({ xAxis, pending: pendingArr, approved: approvedArr, rejected: rejectedArr });
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const summaryCards = [
		{
			title: 'Tổng câu lạc bộ',
			value: stats.tongCLB,
			icon: <TeamOutlined style={{ fontSize: 28, color: '#1890ff' }} />,
			color: '#1890ff',
			bg: '#e6f7ff',
		},
		{
			title: 'Chờ duyệt',
			value: stats.pending,
			icon: <ClockCircleOutlined style={{ fontSize: 28, color: '#fa8c16' }} />,
			color: '#fa8c16',
			bg: '#fff7e6',
		},
		{
			title: 'Đã duyệt',
			value: stats.approved,
			icon: <CheckCircleOutlined style={{ fontSize: 28, color: '#52c41a' }} />,
			color: '#52c41a',
			bg: '#f6ffed',
		},
		{
			title: 'Từ chối',
			value: stats.rejected,
			icon: <CloseCircleOutlined style={{ fontSize: 28, color: '#ff4d4f' }} />,
			color: '#ff4d4f',
			bg: '#fff1f0',
		},
	];

	return (
		<Spin spinning={loading}>
			<div style={{ padding: '0 0 24px' }}>
				<Title level={4} style={{ marginBottom: 20 }}>
					<AuditOutlined style={{ marginRight: 8 }} />
					Báo cáo & Thống kê
				</Title>

				{/* Summary Cards */}
				<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
					{summaryCards.map((card) => (
						<Col xs={24} sm={12} lg={6} key={card.title}>
							<Card
								style={{
									borderRadius: 8,
									border: `1px solid ${card.color}22`,
									background: card.bg,
								}}
								bodyStyle={{ padding: '20px 24px' }}
							>
								<div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
									<div
										style={{
											width: 56,
											height: 56,
											borderRadius: 12,
											background: `${card.color}22`,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											flexShrink: 0,
										}}
									>
										{card.icon}
									</div>
									<Statistic
										title={
											<span style={{ fontSize: 13, color: '#666' }}>{card.title}</span>
										}
										value={card.value}
										valueStyle={{ fontSize: 28, fontWeight: 700, color: card.color }}
									/>
								</div>
							</Card>
						</Col>
					))}
				</Row>

				{/* Column Chart */}
				<Card
					title='Số đơn đăng ký theo từng câu lạc bộ'
					bordered={false}
					style={{ borderRadius: 8 }}
				>
					{chartData.xAxis.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
							Chưa có dữ liệu để hiển thị
						</div>
					) : (
						<ColumnChart
							title='Số đơn đăng ký theo CLB'
							xAxis={chartData.xAxis}
							yAxis={[chartData.pending, chartData.approved, chartData.rejected]}
							yLabel={['Chờ duyệt', 'Đã duyệt', 'Từ chối']}
							colors={['#fa8c16', '#52c41a', '#ff4d4f']}
							height={380}
							formatY={(val: number) => `${val} đơn`}
						/>
					)}
				</Card>
			</div>
		</Spin>
	);
};

export default BaoCaoThongKePage;
