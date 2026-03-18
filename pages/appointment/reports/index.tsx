import React,{useEffect,useState} from 'react';
import {Card,Statistic,Row,Col} from 'antd';
import {getReport} from '@/services/appointment/report';

export default ()=>{

  const [data,setData]=useState<any>({});

  useEffect(()=>{
    getReport().then(setData);
  },[])

  return(
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title="Appointments Today" value={data.today}/>
        </Card>
      </Col>

      <Col span={8}>
        <Card>
          <Statistic title="Monthly Revenue" value={data.revenue}/>
        </Card>
      </Col>

      <Col span={8}>
        <Card>
          <Statistic title="Completed Services" value={data.completed}/>
        </Card>
      </Col>
    </Row>
  )
}