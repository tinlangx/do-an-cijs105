import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button, Space, Typography } from 'antd';
import './learn/learn.css';

const { Title, Paragraph, Text } = Typography;

export default function AppLearn() {
  const navigate = useNavigate();

  const menu = [
    { to: '/learn/todo',  name: 'APP TO-DO' },
    { to: '/learn/html',  name: 'HTML' },
    { to: '/learn/css',   name: 'CSS' },
    { to: '/learn/js',    name: 'JAVASCRIPT' },
    { to: '/learn/react', name: 'REACT' },
  ];

  return (
    <div className="learn-wrap">
      {/* HERO */}
      <section className="learn-hero">
        <Space direction="vertical" size={10} style={{ width: '100%' }}>
          <Title level={2} className="learn-title">Khu Học Tập</Title>
          <Paragraph className="learn-sub">
            <Text strong>HTML</Text> • <Text strong>CSS</Text> • <Text strong>JavaScript</Text> • <Text strong>React</Text> — và các bài học có quiz tự chấm.
          </Paragraph>

          {/* <Space size={12} wrap>
            <Button className="btn-pill btn-learn" type="primary" onClick={() => navigate('/learn/html')}>
              Bắt đầu HTML
            </Button>
            <Button className="btn-pill" onClick={() => navigate('/learn/css')}>Qua CSS</Button>
            <Button className="btn-pill" onClick={() => navigate('/learn/js')}>Qua JS</Button>
            <Button className="btn-pill" onClick={() => navigate('/learn/react')}>Qua React</Button>
          </Space> */}
        </Space>
      </section>

      {/* MAIN SHELL */}
      <section className="learn-shell">
        <aside className="learn-sidebar">
          <nav className="learn-menu">
            {menu.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `learn-menu-item ${isActive ? 'is-active' : ''}`}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="learn-content">
          <div className="learn-card">
            {/* các file Html.jsx, Css.jsx, Js.jsx, ReactDoc.jsx, Todo.jsx sẽ render tại đây */}
            <Outlet />
          </div>
        </main>
      </section>
    </div>
  );
}
