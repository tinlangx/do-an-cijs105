import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Card>
      {/* <Typography.Title level={3}>Trang chủ</Typography.Title> */}
      <Typography.Paragraph>
        Chào mừng <b>{user?.name}</b>! Hôm nay bạn muốn làm gì đây?
      </Typography.Paragraph>

      <Space>
        {/* Nút đi tới AppShell (khu học tập có sidebar) */}
        <Button type="primary" onClick={() => navigate('learn')}>
          Vào khu học tập
        </Button>

        {/* Tuỳ chọn: nhảy thẳng vào 1 mục */}
        {/* <Button onClick={() => navigate('/learn/html')}>HTML</Button>
        <Button onClick={() => navigate('/learn/css')}>CSS</Button>
        <Button onClick={() => navigate('/learn/js')}>JS</Button>
        <Button onClick={() => navigate('/learn/react')}>React</Button> */}
      </Space>
    </Card>
  );
};

export default Home;
