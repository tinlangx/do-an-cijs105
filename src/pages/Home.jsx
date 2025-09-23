import React from 'react';
import { Row, Col, Card, Typography, Space, Button, Statistic, Divider } from 'antd';
import { PlayCircleFilled, BookFilled, ThunderboltFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import './home.css';

const { Title, Paragraph, Text } = Typography;

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-wrap">
      {/* HERO */}
      <section className="home-hero">
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={14}>
            <Space direction="vertical" size={14} style={{ width: '100%' }}>
              <Title level={2} className="home-title" style={{ fontSize: '20px' }}>
                Chào mừng <Text strong style={{ color: 'rgb(105 126 248)', fontSize: '20px' }}>{user?.name}</Text> 👋
              </Title>
              <Paragraph className="home-sub">
                Hôm nay bạn muốn làm gì? Bắt đầu học nhanh, xem phim thư giãn, hay chơi game luyện não.
              </Paragraph>

              <Space size={12} wrap>
                <Button
                  className="btn-pill btn-learn"
                  type="primary"
                  size="large"
                  icon={<BookFilled />}
                  onClick={() => navigate('/learn')}
                >
                  Chăm chỉ học tập
                </Button>

                <Button
                  className="btn-pill btn-film"
                  type="primary"
                  size="large"
                  icon={<PlayCircleFilled />}
                  onClick={() => navigate('/film')}
                >
                  Xem phim giải trí
                </Button>

                <Button
                  className="btn-pill btn-game"
                  size="large"
                  icon={<ThunderboltFilled />}
                  onClick={() => navigate('/game')}
                >
                  Vào web game
                </Button>
              </Space>

              {/* quick stats */}
              <div className="home-stats">
                <Statistic title="Chuỗi ngày học" value={3} suffix="ngày" />
                <Statistic title="Bài đã hoàn thành" value={12} />
                <Statistic title="Điểm game cao nhất" value={2048} />
              </div>
            </Space>
          </Col>

          {/* Hình minh hoạ/hero art */}
          <Col xs={24} md={10}>
            <div className="hero-art">
              <div className="blob a" />
              <div className="blob b" />
              <div className="hero-card">
                <Title level={4} style={{ marginBottom: 8, color: 'white' }}>Mục tiêu hôm nay</Title>
                <ul className="hero-list">
                  <li>Ôn lại HTML cơ bản</li>
                  <li>Làm 1 đề quiz CSS</li>
                  <li>Chơi game 10 phút</li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* ACTION GRID */}
      <section className="home-actions">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable className="home-card" onClick={() => navigate('/learn')}>
              <div className="card-icon learn">📘</div>
              <Title level={4}>Khu học tập</Title>
              <Paragraph>HTML • CSS • JS • React, App To-Do, thi trắc nghiệm, câu hỏi random.</Paragraph>
              <Button type="primary" className="btn-ghost">Vào học</Button>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card hoverable className="home-card" onClick={() => navigate('/film')}>
              <div className="card-icon film">🎬</div>
              <Title level={4}>Web xem phim</Title>
              <Paragraph>Danh mục Tu Tiên, Luyện Cấp... nội dung hấp dẫn, chất lượng FULL HD.</Paragraph>
              <Button type="primary" className="btn-ghost">Xem ngay</Button>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card hoverable className="home-card" onClick={() => navigate('/game')}>
              <div className="card-icon game">🎮</div>
              <Title level={4}>Khu game</Title>
              <Paragraph>Chọn Game Board hoặc 2048. Rèn luyện tư duy, luyện tập phản xạ.</Paragraph>
              <Button type="primary" className="btn-ghost">Chơi liền</Button>
            </Card>
          </Col>
        </Row>
      </section>

      {/* <Divider /> */}

      {/* CONTINUE LATER */}
      {/* <section className="home-continue">
        <Title level={4} style={{ marginBottom: 8 }}>Tiếp tục gần đây</Title>
        <Row gutter={[14, 14]}>
          <Col xs={24} md={12} lg={8}>
            <Card className="continue-item" onClick={() => navigate('/learn/html')}>
              <span className="dot html" />
              <div>
                <div className="continue-title">HTML — 20 bài cơ bản</div>
                <div className="continue-sub">Đang ở bài 7: Thẻ semantic</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="continue-item" onClick={() => navigate('/film?q=tu tien 1')}>
              <span className="dot film" />
              <div>
                <div className="continue-title">Tu Tiên 1</div>
                <div className="continue-sub">Tập 12 • 20 phút</div>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="continue-item" onClick={() => navigate('/game')}>
              <span className="dot game" />
              <div>
                <div className="continue-title">Game 2048</div>
                <div className="continue-sub">Best: 2048 • Điểm: 5320</div>
              </div>
            </Card>
          </Col>
        </Row>
      </section> */}
    </div>
  );
}
