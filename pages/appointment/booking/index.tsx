import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, TimePicker, Select } from 'antd';
import { getBookings, createBooking } from '@/services/appointment/booking';
import { getEmployees } from '@/services/appointment/employee';
import { getServices } from '@/services/appointment/service';

export default () => {
  const [data, setData] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [visible, setVisible] = useState(false);

  const load = async () => {
    const bookings = await getBookings();
    const emps = await getEmployees();
    const svcs = await getServices();

    setData(bookings || []);
    setEmployees(emps || []);
    setServices(svcs || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (values: any) => {
    await createBooking(values);
    setVisible(false);
    load();
  };

  const columns = [
    { title: 'Customer', dataIndex: 'customerName' },
    { title: 'Date', dataIndex: 'date' },
    { title: 'Start', dataIndex: 'startTime' },
    { title: 'End', dataIndex: 'endTime' },
    { title: 'Status', dataIndex: 'status' },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setVisible(true)}>
        Book
      </Button>

      <Table rowKey="id" columns={columns} dataSource={data} />

      <Modal visible={visible} footer={null} onCancel={() => setVisible(false)}>
        <Form layout="vertical" onFinish={submit}>
          <Form.Item name="customerName" label="Customer" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="employeeId" label="Employee" rules={[{ required: true }]}>
            <Select
              options={(employees || []).map((e: any) => ({
                value: e.id,
                label: e.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="serviceId" label="Service" rules={[{ required: true }]}>
            <Select
              options={(services || []).map((s: any) => ({
                value: s.id,
                label: s.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Save
          </Button>
        </Form>
      </Modal>
    </>
  );
};