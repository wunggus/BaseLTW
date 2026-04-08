import { useState } from 'react';

export type TLoaiHinh = 'bien' | 'nui' | 'thanh-pho' | 'lang-que' | 'di-tich';

export interface IDestination {
	id: string;
	name: string;
	location: string;
	loaiHinh: TLoaiHinh;
	image: string;
	rating: number;
	reviewCount: number;
	description: string;
	thoiGianThamQuan: number; // hours
	chiPhiAnUong: number; // VND/day
	chiPhiLuuTru: number; // VND/night
	chiPhiDiChuyen: number; // VND
	popularityScore: number;
	tags: string[];
	createdAt: string;
}

export interface IItineraryDay {
	date: string;
	destinations: IDestination[];
	notes: string;
}

export interface IItinerary {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	days: IItineraryDay[];
	totalBudget: number;
	createdAt: string;
	status: 'draft' | 'planned' | 'completed';
}

export interface IBudgetCategory {
	label: string;
	amount: number;
	color: string;
	icon: string;
}

// ==== MOCK DATA ====
const MOCK_DESTINATIONS: IDestination[] = [
	{
		id: 'd1',
		name: 'Vịnh Hạ Long',
		location: 'Quảng Ninh',
		loaiHinh: 'bien',
		image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80',
		rating: 4.9,
		reviewCount: 12540,
		description:
			'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi hùng vĩ, hang động kỳ bí và làn nước xanh biếc tuyệt đẹp.',
		thoiGianThamQuan: 48,
		chiPhiAnUong: 300000,
		chiPhiLuuTru: 1200000,
		chiPhiDiChuyen: 500000,
		popularityScore: 98,
		tags: ['Thiên nhiên', 'Di sản UNESCO', 'Chèo thuyền', 'Hang động'],
		createdAt: '2024-01-01',
	},
	{
		id: 'd2',
		name: 'Phố Cổ Hội An',
		location: 'Quảng Nam',
		loaiHinh: 'thanh-pho',
		image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&q=80',
		rating: 4.8,
		reviewCount: 9870,
		description:
			'Thành phố cổ được bảo tồn hoàn hảo với kiến trúc độc đáo, đèn lồng rực rỡ và ẩm thực đặc sắc miền Trung.',
		thoiGianThamQuan: 36,
		chiPhiAnUong: 200000,
		chiPhiLuuTru: 800000,
		chiPhiDiChuyen: 300000,
		popularityScore: 95,
		tags: ['Di sản UNESCO', 'Ẩm thực', 'Văn hóa', 'Mua sắm'],
		createdAt: '2024-01-02',
	},
	{
		id: 'd3',
		name: 'Sa Pa',
		location: 'Lào Cai',
		loaiHinh: 'nui',
		image: 'https://images.unsplash.com/photo-1591802887872-b1eae1e92e01?w=800&q=80',
		rating: 4.7,
		reviewCount: 7620,
		description:
			'Thị trấn miền núi huyền ảo với ruộng bậc thang tuyệt đẹp, cộng đồng dân tộc thiểu số đặc sắc và khí hậu mát mẻ quanh năm.',
		thoiGianThamQuan: 48,
		chiPhiAnUong: 250000,
		chiPhiLuuTru: 700000,
		chiPhiDiChuyen: 600000,
		popularityScore: 90,
		tags: ['Leo núi', 'Văn hóa dân tộc', 'Ruộng bậc thang', 'Khí hậu mát'],
		createdAt: '2024-01-03',
	},
	{
		id: 'd4',
		name: 'Mũi Né',
		location: 'Bình Thuận',
		loaiHinh: 'bien',
		image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
		rating: 4.6,
		reviewCount: 5430,
		description: 'Thiên đường biển với đồi cát vàng óng, làng chài đầy màu sắc và môn thể thao lướt ván diều hấp dẫn.',
		thoiGianThamQuan: 48,
		chiPhiAnUong: 220000,
		chiPhiLuuTru: 900000,
		chiPhiDiChuyen: 400000,
		popularityScore: 85,
		tags: ['Biển', 'Đồi cát', 'Lướt ván', 'Resort'],
		createdAt: '2024-01-04',
	},
	{
		id: 'd5',
		name: 'Đà Lạt',
		location: 'Lâm Đồng',
		loaiHinh: 'nui',
		image: 'https://images.unsplash.com/photo-1585083100374-1d5e25b41a68?w=800&q=80',
		rating: 4.8,
		reviewCount: 11200,
		description:
			'Thành phố ngàn hoa với khí hậu ôn đới dễ chịu, thông reo, thác nước và kiến trúc Pháp cổ kính lãng mạn.',
		thoiGianThamQuan: 48,
		chiPhiAnUong: 180000,
		chiPhiLuuTru: 750000,
		chiPhiDiChuyen: 350000,
		popularityScore: 92,
		tags: ['Hoa', 'Thác nước', 'Cafe', 'Lãng mạn'],
		createdAt: '2024-01-05',
	},
	{
		id: 'd6',
		name: 'Tràng An',
		location: 'Ninh Bình',
		loaiHinh: 'di-tich',
		image: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=800&q=80',
		rating: 4.7,
		reviewCount: 6890,
		description:
			'Cảnh quan thiên nhiên hùng vĩ với núi đá vôi, hang động và sông ngòi uốn khúc, từng là kinh đô cổ của Việt Nam.',
		thoiGianThamQuan: 24,
		chiPhiAnUong: 150000,
		chiPhiLuuTru: 500000,
		chiPhiDiChuyen: 250000,
		popularityScore: 88,
		tags: ['Di sản UNESCO', 'Chèo thuyền', 'Lịch sử', 'Hang động'],
		createdAt: '2024-01-06',
	},
	{
		id: 'd7',
		name: 'Phú Quốc',
		location: 'Kiên Giang',
		loaiHinh: 'bien',
		image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
		rating: 4.9,
		reviewCount: 13400,
		description:
			'Đảo ngọc thiên đường với bãi biển trong xanh, rừng nhiệt đới hoang sơ và hải sản tươi ngon phong phú.',
		thoiGianThamQuan: 72,
		chiPhiAnUong: 350000,
		chiPhiLuuTru: 2000000,
		chiPhiDiChuyen: 1500000,
		popularityScore: 97,
		tags: ['Đảo', 'Lặn biển', 'Resort 5 sao', 'Hải sản'],
		createdAt: '2024-01-07',
	},
	{
		id: 'd8',
		name: 'Hà Nội',
		location: 'Hà Nội',
		loaiHinh: 'thanh-pho',
		image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&q=80',
		rating: 4.6,
		reviewCount: 18900,
		description:
			'Thủ đô nghìn năm văn hiến với Hồ Hoàn Kiếm thơ mộng, phố cổ tấp nập và ẩm thực đường phố nổi tiếng thế giới.',
		thoiGianThamQuan: 48,
		chiPhiAnUong: 200000,
		chiPhiLuuTru: 1000000,
		chiPhiDiChuyen: 200000,
		popularityScore: 96,
		tags: ['Thủ đô', 'Ẩm thực', 'Phố cổ', 'Văn hóa'],
		createdAt: '2024-01-08',
	},
];

const MOCK_ITINERARIES: IItinerary[] = [
	{
		id: 'it1',
		name: 'Khám phá miền Bắc',
		startDate: '2024-06-01',
		endDate: '2024-06-07',
		days: [
			{ date: '2024-06-01', destinations: [MOCK_DESTINATIONS[7]], notes: 'Tham quan Hồ Hoàn Kiếm' },
			{ date: '2024-06-02', destinations: [MOCK_DESTINATIONS[0]], notes: 'Cruise Hạ Long' },
			{ date: '2024-06-03', destinations: [MOCK_DESTINATIONS[5]], notes: 'Tràng An' },
		],
		totalBudget: 15000000,
		createdAt: '2024-05-01',
		status: 'completed',
	},
	{
		id: 'it2',
		name: 'Biển hè 2024',
		startDate: '2024-07-10',
		endDate: '2024-07-15',
		days: [
			{ date: '2024-07-10', destinations: [MOCK_DESTINATIONS[6]], notes: 'Bay ra Phú Quốc' },
			{ date: '2024-07-11', destinations: [MOCK_DESTINATIONS[3]], notes: 'Mũi Né' },
		],
		totalBudget: 20000000,
		createdAt: '2024-06-15',
		status: 'planned',
	},
	{
		id: 'it3',
		name: 'Miền Trung tươi đẹp',
		startDate: '2024-08-01',
		endDate: '2024-08-05',
		days: [
			{ date: '2024-08-01', destinations: [MOCK_DESTINATIONS[1]], notes: 'Phố Cổ Hội An' },
		],
		totalBudget: 12000000,
		createdAt: '2024-07-01',
		status: 'draft',
	},
];

// Thống kê lịch trình theo tháng
export const MONTHLY_STATS = [
	{ month: 'T1', count: 12, revenue: 48000000 },
	{ month: 'T2', count: 18, revenue: 72000000 },
	{ month: 'T3', count: 25, revenue: 105000000 },
	{ month: 'T4', count: 31, revenue: 140000000 },
	{ month: 'T5', count: 45, revenue: 195000000 },
	{ month: 'T6', count: 68, revenue: 298000000 },
	{ month: 'T7', count: 92, revenue: 415000000 },
	{ month: 'T8', count: 78, revenue: 360000000 },
	{ month: 'T9', count: 54, revenue: 240000000 },
	{ month: 'T10', count: 39, revenue: 172000000 },
	{ month: 'T11', count: 29, revenue: 128000000 },
	{ month: 'T12', count: 22, revenue: 96000000 },
];

export default () => {
	const [destinations, setDestinations] = useState<IDestination[]>(MOCK_DESTINATIONS);
	const [itineraries, setItineraries] = useState<IItinerary[]>(MOCK_ITINERARIES);
	const [currentItinerary, setCurrentItinerary] = useState<IItinerary | null>(null);

	const addDestination = (dest: IDestination) => {
		setDestinations((prev) => [...prev, dest]);
	};

	const updateDestination = (id: string, updates: Partial<IDestination>) => {
		setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
	};

	const deleteDestination = (id: string) => {
		setDestinations((prev) => prev.filter((d) => d.id !== id));
	};

	const addItinerary = (it: IItinerary) => {
		setItineraries((prev) => [it, ...prev]);
	};

	const updateItinerary = (id: string, updates: Partial<IItinerary>) => {
		setItineraries((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
	};

	const deleteItinerary = (id: string) => {
		setItineraries((prev) => prev.filter((i) => i.id !== id));
	};

	const calcItineraryBudget = (it: IItinerary) => {
		const allDests = it.days.flatMap((d) => d.destinations);
		const anUong = allDests.reduce((s, d) => s + d.chiPhiAnUong, 0);
		const luuTru = allDests.reduce((s, d) => s + d.chiPhiLuuTru, 0);
		const diChuyen = allDests.reduce((s, d) => s + d.chiPhiDiChuyen, 0);
		const total = anUong + luuTru + diChuyen;
		return { anUong, luuTru, diChuyen, total };
	};

	return {
		destinations,
		setDestinations,
		itineraries,
		setItineraries,
		currentItinerary,
		setCurrentItinerary,
		addDestination,
		updateDestination,
		deleteDestination,
		addItinerary,
		updateItinerary,
		deleteItinerary,
		calcItineraryBudget,
	};
};
