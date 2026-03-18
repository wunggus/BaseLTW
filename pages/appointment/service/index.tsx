import React,{useState,useEffect} from 'react';
import {Table,Button,Modal,Form,Input,InputNumber} from 'antd';
import {getServices,createService,deleteService} from '@/services/appointment/service';

export default () => {

  const [data,setData]=useState([]);
  const [visible,setVisible]=useState(false);

  const load=async()=>{
    const res=await getServices();
    setData(res);
  }

  useEffect(()=>{
    load();
  },[])

  const submit=async(values:any)=>{
    await createService(values);
    setVisible(false);
    load();
  }

  const columns=[
    {title:'Name',dataIndex:'name'},
    {title:'Price',dataIndex:'price'},
    {title:'Duration',dataIndex:'duration'},
    {
      title:'Action',
      render:(r:any)=>(
        <Button danger onClick={async()=>{
          await deleteService(r.id);
          load();
        }}>
          Delete
        </Button>
      )
    }
  ]

  return(
    <>
      <Button type="primary" onClick={()=>setVisible(true)}>Add</Button>

      <Table rowKey="id" columns={columns} dataSource={data}/>

      <Modal open={visible} footer={null} onCancel={()=>setVisible(false)}>
        <Form onFinish={submit}>
          <Form.Item name="name" label="Service">
            <Input/>
          </Form.Item>

          <Form.Item name="price" label="Price">
            <InputNumber/>
          </Form.Item>

          <Form.Item name="duration" label="Minutes">
            <InputNumber/>
          </Form.Item>

          <Button htmlType="submit">Save</Button>
        </Form>
      </Modal>
    </>
  )
}