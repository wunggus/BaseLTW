import React,{useState,useEffect} from 'react';
import {Table,Rate,Input} from 'antd';
import {getReviews} from '@/services/appointment/review';

export default ()=>{

  const [data,setData]=useState([]);

  useEffect(()=>{
    getReviews().then(setData);
  },[])

  const columns=[
    {title:'Employee',dataIndex:'employeeId'},
    {
      title:'Rating',
      render:(r:any)=><Rate disabled defaultValue={r.rating}/>
    },
    {title:'Comment',dataIndex:'comment'},
    {
      title:'Reply',
      render:(r:any)=><Input defaultValue={r.reply}/>
    }
  ]

  return <Table rowKey="id" columns={columns} dataSource={data}/>
}