import React, { useState } from 'react';
import { Form, Input, Button, Table } from 'antd';
import { getDiplomas } from '@/services/diploma/diploma';

export default () => {
  const [data, setData] = useState<any[]>([]);

  const onSearch = async (values: any) => {
    const filled = Object.values(values).filter(v => v);
    if (filled.length < 2) {
      alert('Nhập ít nhất 2 trường');
      return;
    }

    const load = async () => {
    try {
        const res = await getBookings();
        setData(Array.isArray(res) ? res : []);
    } catch (err) {
        setData([]);
    }
    };
  };

  return (
    <>
      <Form onFinish={onSearch} layout="inline">
        <Form.Item name="soHieu">
          <Input placeholder="Số hiệu" />
        </Form.Item>

        <Form.Item name="soVaoSo">
          <Input placeholder="Số vào sổ" />
        </Form.Item>

        <Form.Item name="msv">
          <Input placeholder="MSV" />
        </Form.Item>

        <Form.Item name="hoTen">
          <Input placeholder="Họ tên" />
        </Form.Item>

        <Form.Item name="ngaySinh">
          <Input placeholder="Ngày sinh" />
        </Form.Item>

        <Button htmlType="submit">Tra cứu</Button>
      </Form>

      <Table rowKey="id" dataSource={data} columns={[
        { title: 'Họ tên', dataIndex: 'hoTen' },
        { title: 'MSV', dataIndex: 'msv' },
        { title: 'Số hiệu', dataIndex: 'soHieu' },
      ]}/>
    </>
  );
};