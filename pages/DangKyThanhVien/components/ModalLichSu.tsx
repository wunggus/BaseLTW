import { Modal, Tag, Timeline, Typography } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';

const { Text } = Typography;

const trangThaiConfig: Record<string, { color: string; icon: any; label: string }> = {
	Approved: { color: 'success', icon: <CheckCircleOutlined />, label: 'Đã duyệt' },
	Rejected: { color: 'error', icon: <CloseCircleOutlined />, label: 'Đã từ chối' },
	Pending: { color: 'processing', icon: <ClockCircleOutlined />, label: 'Chờ duyệt' },
};

const ModalLichSu = () => {
	const { visibleLichSu, setVisibleLichSu, lichSuRecord } = useModel('dangKyThanhVien.dangKyThanhVien');

	return (
		<Modal
			open={visibleLichSu}
			onCancel={() => setVisibleLichSu(false)}
			title='Lịch sử thao tác'
			footer={null}
			width={560}
			destroyOnClose
		>
			{lichSuRecord.length === 0 ? (
				<Text type='secondary'>Chưa có thao tác nào.</Text>
			) : (
				<Timeline style={{ marginTop: 16 }}>
					{[...lichSuRecord].reverse().map((item, i) => {
						const cfg = trangThaiConfig[item.thaoTac] ?? trangThaiConfig.Pending;
						return (
							<Timeline.Item key={i} color={cfg.color} dot={cfg.icon}>
								<div>
									<Tag color={cfg.color}>{cfg.label}</Tag>
									<Text style={{ marginLeft: 8 }}>
										{moment(item.thoiGian).format('HH:mm DD/MM/YYYY')}
									</Text>
								</div>
								{item.nguoiThucHien && (
									<div>
										<Text type='secondary'>Người thực hiện: </Text>
										<Text>{item.nguoiThucHien}</Text>
									</div>
								)}
								{item.lyDo && (
									<div>
										<Text type='secondary'>Lý do: </Text>
										<Text type='danger'>{item.lyDo}</Text>
									</div>
								)}
							</Timeline.Item>
						);
					})}
				</Timeline>
			)}
		</Modal>
	);
};

export default ModalLichSu;
