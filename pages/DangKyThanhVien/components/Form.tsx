import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Form, Input, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const { Text } = Typography;

const GIOI_TINH_OPTIONS = [
	{ label: 'Nam', value: 'Nam' },
	{ label: 'Nữ', value: 'Nữ' },
	{ label: 'Khác', value: 'Khác' },
];

const FormDangKy = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('dangKyThanhVien.dangKyThanhVien');
	const { danhSachTatCa, getAllCLB } = useModel('cauLacBo.cauLacBo');
	const title = props?.title ?? 'Đơn đăng ký';

	useEffect(() => {
		getAllCLB();
	}, []);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: DangKyThanhVien.IRecord) => {
		if (edit) {
			putModel(record?._id ?? '', values).catch((er: any) => console.log(er));
		} else {
			postModel({ ...values, trangThai: 'Pending' })
				.then(() => form.resetFields())
				.catch((er: any) => console.log(er));
		}
	};

	return (
		<Card title={(isView ? 'Xem ' : edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='hoTen' label='Họ và tên' rules={[...rules.required, ...rules.length(250)]}>
					<Input placeholder='Họ và tên' disabled={isView} />
				</Form.Item>

				<Form.Item name='email' label='Email' rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
					<Input placeholder='Email' disabled={isView} />
				</Form.Item>

				<Form.Item name='sdt' label='Số điện thoại'>
					<Input placeholder='Số điện thoại' disabled={isView} />
				</Form.Item>

				<Form.Item name='gioiTinh' label='Giới tính'>
					<Select options={GIOI_TINH_OPTIONS} placeholder='Chọn giới tính' disabled={isView} />
				</Form.Item>

				<Form.Item name='diaChi' label='Địa chỉ'>
					<Input placeholder='Địa chỉ' disabled={isView} />
				</Form.Item>

				<Form.Item name='soTruong' label='Sở trường'>
					<Input.TextArea rows={2} placeholder='Sở trường của bạn' disabled={isView} />
				</Form.Item>

				<Form.Item name='cauLacBoId' label='Câu lạc bộ' rules={rules.required}>
					<Select
						placeholder='Chọn câu lạc bộ'
						disabled={isView}
						options={danhSachTatCa.map((clb) => ({ label: clb.tenCLB, value: clb._id }))}
						showSearch
						filterOption={(input, option) =>
							(option?.label as string)?.toLowerCase().includes(input.toLowerCase())
						}
					/>
				</Form.Item>

				<Form.Item name='lyDoDangKy' label='Lý do đăng ký'>
					<Input.TextArea rows={3} placeholder='Lý do bạn muốn tham gia' disabled={isView} />
				</Form.Item>

				{isView && record?.trangThai === 'Rejected' && record?.ghiChu && (
					<Form.Item label='Lý do từ chối'>
						<Text type='danger'>{record.ghiChu}</Text>
					</Form.Item>
				)}

				{!isView && (
					<div className='form-footer'>
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit ? 'Thêm mới' : 'Lưu lại'}
						</Button>
						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</div>
				)}
				{isView && (
					<div className='form-footer'>
						<Button onClick={() => setVisibleForm(false)}>Đóng</Button>
					</div>
				)}
			</Form>
		</Card>
	);
};

export default FormDangKy;
