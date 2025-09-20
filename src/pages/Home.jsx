import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import './home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Card className="home-container">
      {/* <Typography.Title level={3}>Trang chủ</Typography.Title> */}
      <Typography.Paragraph>
        Chào mừng <b>{user?.name}</b>! Hôm nay bạn muốn làm gì đây?
      </Typography.Paragraph>

      <Space>
        {/* Nút đi tới AppShell (khu học tập có sidebar) */}
        <Button className="lean-btn" type="primary" onClick={() => navigate('learn')}>
          CHĂM CHỈ HỌC TẬP
        </Button>

        {/* Tuỳ chọn: nhảy thẳng vào 1 mục */}
        {/* <Button onClick={() => navigate('/learn/html')}>HTML</Button>
        <Button onClick={() => navigate('/learn/css')}>CSS</Button>
        <Button onClick={() => navigate('/learn/js')}>JS</Button>
        <Button onClick={() => navigate('/learn/react')}>React</Button> */}
        {/* Vào trang Home của web phim */}
        <Button className="film-btn" type="primary" onClick={() => navigate('/film')}>
          XEM PHIM GIẢI TRÍ
        </Button>

        {/* Nhảy thẳng đến 1 thể loại */}
        {/* <Button onClick={() => navigate('/film/tu-tien')}>Tu Tiên</Button>
        <Button onClick={() => navigate('/film/luyen-cap')}>Luyện Cấp</Button> */}

        {/* (Tuỳ chọn) Xem ngay 1 phim (tập 1) */}
        {/* <Button onClick={() => navigate('/film/tu-tien/tu-tien-1/watch/1')}>
          ▶ Xem ngay Tu Tiên 1
        </Button> */}
      </Space>
    </Card>
  );
};

export default Home;
