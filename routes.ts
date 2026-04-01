export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	///////////////////////////////////
	// QUAN LY CAU LAC BO
	{
		name: 'QuanLyCLB',
		path: '/quan-ly-clb',
		icon: 'TeamOutlined',
		routes: [
			{
				name: 'CauLacBo',
				path: '/quan-ly-clb/cau-lac-bo',
				component: './CauLacBo',
				icon: 'BankOutlined',
			},
			{
				name: 'DangKyThanhVien',
				path: '/quan-ly-clb/dang-ky-thanh-vien',
				component: './DangKyThanhVien',
				icon: 'FormOutlined',
			},
			{
				name: 'ThanhVienCLB',
				path: '/quan-ly-clb/thanh-vien',
				component: './ThanhVienCLB',
				icon: 'UserOutlined',
			},
			{
				name: 'BaoCaoThongKe',
				path: '/quan-ly-clb/bao-cao',
				component: './BaoCaoThongKe',
				icon: 'BarChartOutlined',
			},
		],
	},

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
