import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, DatePicker, Form, Input, Switch, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useEffect } from 'react';
import { useModel } from 'umi';
import moment from 'moment';

const { Editor } = require('@tinymce/tinymce-react');

const FormCauLacBo = (props: any) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm } =
		useModel('cauLacBo.cauLacBo');
	const title = props?.title ?? 'Câu lạc bộ';

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngayThanhLap: record.ngayThanhLap ? moment(record.ngayThanhLap) : undefined,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const payload = {
			...values,
			ngayThanhLap: values.ngayThanhLap ? values.ngayThanhLap.toISOString() : undefined,
		};
		if (edit) {
			putModel(record?._id ?? '', payload).catch((er: any) => console.log(er));
		} else {
			postModel(payload)
				.then(() => form.resetFields())
				.catch((er: any) => console.log(er));
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + title?.toLowerCase()}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item name='tenCLB' label='Tên câu lạc bộ' rules={[...rules.required, ...rules.length(250)]}>
					<Input placeholder='Tên câu lạc bộ' />
				</Form.Item>

				<Form.Item name='anhDaiDien' label='Ảnh đại diện (URL)'>
					<Input placeholder='https://...' />
				</Form.Item>

				<Form.Item name='ngayThanhLap' label='Ngày thành lập'>
					<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' placeholder='Chọn ngày thành lập' />
				</Form.Item>

				<Form.Item name='chuNhiem' label='Chủ nhiệm CLB'>
					<Input placeholder='Họ tên chủ nhiệm' />
				</Form.Item>

				<Form.Item name='moTa' label='Mô tả'>
					<Input.TextArea rows={4} placeholder='Mô tả về câu lạc bộ' />
				</Form.Item>

				<Form.Item name='hoatDong' label='Hoạt động' valuePropName='checked' initialValue={true}>
					<Switch checkedChildren='Có' unCheckedChildren='Không' />
				</Form.Item>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormCauLacBo;
