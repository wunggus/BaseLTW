import { Alert, Form, Input, Modal, Typography } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const ModalTuChoi = () => {
	const [form] = Form.useForm();
	const { visibleTuChoi, setVisibleTuChoi, idsTuChoi, tuChoiNhieuModel, formSubmiting } =
		useModel('dangKyThanhVien.dangKyThanhVien');

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			await tuChoiNhieuModel(idsTuChoi, values.lyDo);
			form.resetFields();
		} catch (err) {
			console.log(err);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setVisibleTuChoi(false);
	};

	return (
		<Modal
			open={visibleTuChoi}
			onCancel={handleCancel}
			onOk={handleOk}
			confirmLoading={formSubmiting}
			title='Từ chối đơn đăng ký'
			okText='Xác nhận từ chối'
			cancelText='Hủy'
			okButtonProps={{ danger: true }}
			destroyOnClose
		>
			<Alert
				type='warning'
				showIcon
				message={
					<Text>
						Bạn đang từ chối <Text strong>{idsTuChoi.length}</Text> đơn đăng ký. Vui lòng nhập lý do từ chối.
					</Text>
				}
				style={{ marginBottom: 16 }}
			/>
			<Form form={form} layout='vertical'>
				<Form.Item
					name='lyDo'
					label='Lý do từ chối'
					rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
				>
					<Input.TextArea rows={4} placeholder='Nhập lý do từ chối...' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ModalTuChoi;
