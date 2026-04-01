import { Form, Modal, Select, Typography } from 'antd';
import { useModel } from 'umi';

const { Text } = Typography;

const ModalDoiCLB = () => {
	const [form] = Form.useForm();
	const { visibleDoiCLB, setVisibleDoiCLB, idsDoiCLB, doiCLBModel, formSubmiting } =
		useModel('dangKyThanhVien.dangKyThanhVien');
	const { danhSachTatCa, getAllCLB } = useModel('cauLacBo.cauLacBo');

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			await doiCLBModel(idsDoiCLB, values.cauLacBoId);
			form.resetFields();
		} catch (err) {
			console.log(err);
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setVisibleDoiCLB(false);
	};

	return (
		<Modal
			open={visibleDoiCLB}
			onCancel={handleCancel}
			onOk={handleOk}
			confirmLoading={formSubmiting}
			title='Đổi câu lạc bộ'
			okText='Xác nhận đổi CLB'
			cancelText='Hủy'
			destroyOnClose
		>
			<Text>
				Bạn đang đổi CLB cho <Text strong>{idsDoiCLB.length}</Text> thành viên. Vui lòng chọn CLB muốn chuyển đến.
			</Text>
			<Form form={form} layout='vertical' style={{ marginTop: 16 }}>
				<Form.Item
					name='cauLacBoId'
					label='Câu lạc bộ đích'
					rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ!' }]}
				>
					<Select
						placeholder='Chọn câu lạc bộ'
						showSearch
						filterOption={(input, option) =>
							(option?.label as string)?.toLowerCase().includes(input.toLowerCase())
						}
						options={danhSachTatCa.map((clb) => ({ label: clb.tenCLB, value: clb._id }))}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default ModalDoiCLB;
