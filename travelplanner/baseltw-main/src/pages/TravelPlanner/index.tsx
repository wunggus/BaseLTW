import React from 'react';
import { Outlet, useLocation, history } from 'umi';
import { Menu, Layout } from 'antd';
import {
	CompassOutlined, CalendarOutlined, DollarOutlined, SettingOutlined,
} from '@ant-design/icons';
import './style.less';

const { Content } = Layout;

const NAV_ITEMS = [
	{ key: '/travel/kham-pha', icon: <CompassOutlined />, label: 'Khám phá' },
	{ key: '/travel/lich-trinh', icon: <CalendarOutlined />, label: 'Lịch trình' },
	{ key: '/travel/ngan-sach', icon: <DollarOutlined />, label: 'Ngân sách' },
	{ key: '/travel/admin', icon: <SettingOutlined />, label: 'Quản trị' },
];

const TravelPlannerLayout: React.FC = () => {
	const location = useLocation();

	return (
		<div style={{ minHeight: '100vh', background: '#FAF7F0' }}>
			{/* Top navigation */}
			<div style={{
				background: 'white',
				borderBottom: '1px solid #f0ebe0',
				padding: '0 24px',
				marginBottom: 24,
				boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
				position: 'sticky', top: 0, zIndex: 100,
			}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
					<div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
						<span style={{ fontSize: 22 }}>✈️</span>
						<span style={{
							fontFamily: 'Georgia, Times New Roman, serif',
							fontWeight: 700, fontSize: 16,
							color: '#0F1B2D',
							letterSpacing: '-0.3px',
						}}>
							Travel<span style={{ color: '#C9A84C' }}>Planner</span>
						</span>
					</div>
					<Menu
						mode='horizontal'
						selectedKeys={[location.pathname]}
						onClick={({ key }) => history.push(key)}
						items={NAV_ITEMS}
						style={{ border: 'none', flex: 1, background: 'transparent' }}
					/>
				</div>
			</div>

			<div style={{ padding: '0 24px 40px' }}>
				<Outlet />
			</div>
		</div>
	);
};

export default TravelPlannerLayout;
