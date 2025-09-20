// AppHeader.jsx
import React from 'react';
import { Layout, Space, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';        // ← thêm
import { useAuth } from '../../auth/AuthContext.jsx';
import Clock from './Clock.jsx';
import './header.css';

const { Header } = Layout;

const AppHeader = () => {
  const { user, isAuthed, logout } = useAuth();
  const navigate = useNavigate();                      // ← thêm

  return (
    <Header className="app-header">
      <Typography.Text
        className="brand"
        strong
        onClick={() => navigate('/')}                  // ← về Home
        style={{ cursor: 'pointer' }}                  // ← hiển thị dạng clickable
      >
        HOME
      </Typography.Text>

      <div className="header-center">
        <Clock />
      </div>

      <div className="header-right">
        {isAuthed && (
          <Space align="center">
            <Typography.Text className="hello">
              Xin chào, <b>{user.name}</b>
            </Typography.Text>
            <Button onClick={logout}>Log out</Button>
          </Space>
        )}
      </div>
    </Header>
  );
};

export default AppHeader;
