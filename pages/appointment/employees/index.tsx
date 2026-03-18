import React, {useEffect, useState} from 'react';
import {Table, Button, Modal, Form, Input, InputNumber} from 'antd';
import {getEmployees, createEmployee, deleteEmployee} from '@/services/appointment/employee';

export default () => {

  const [data,setData] = useState([]);
  const [visible,setVisible] = useState(false);

  const load = async () =>{
    const res = await getEmployees();
    setData(res);
  }

  useEffect(()=>{
    load();
  },[])

  const submit = async(values:any)=>{
    await createEmployee(values);
    setVisible(false);
    load();
  }

  const columns = [
    {title:'Name',dataIndex:'name'},
    {title:'Phone',dataIndex:'phone'},
    {title:'Max/day',dataIndex:'maxCustomersPerDay'},
    {
      title:'Action',
      render:(r:any)=>(
        <Button danger onClick={async()=>{
          await deleteEmployee(r.id);
          load();
        }}>
          Delete
        </Button>
      )
    }
  ]

  return (
    <>
      <Button type="primary" onClick={()=>setVisible(true)}>Add</Button>

      <Table rowKey="id" columns={columns} dataSource={data}/>

      <Modal open={visible} footer={null} onCancel={()=>setVisible(false)}>
        <Form onFinish={submit}>
          <Form.Item name="name" label="Name">
            <Input/>
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input/>
          </Form.Item>

          <Form.Item name="maxCustomersPerDay" label="Max/day">
            <InputNumber/>
          </Form.Item>

          <Button htmlType="submit">Save</Button>
        </Form>
      </Modal>
    </>
  )

}