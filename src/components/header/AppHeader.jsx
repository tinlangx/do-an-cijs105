import React, { useState } from 'react';
import { Layout, Button, Typography, Space, Drawer, Menu, Divider } from 'antd';
import { MenuOutlined, AppstoreOutlined, ReadOutlined, VideoCameraOutlined, PlayCircleOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import './header.css';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const navigate = useNavigate();
  const { user, isAuthed, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const go = (to) => {
    setOpen(false);
    navigate(to);
  };

  const menuItems = [
    { key: 'home', icon: <HomeOutlined />, label: 'Trang chủ', onClick: () => go('/') },
    { key: 'learn', icon: <ReadOutlined />, label: 'Khu học tập', onClick: () => go('/learn/html') },
    { key: 'film', icon: <VideoCameraOutlined />, label: 'Web xem phim', onClick: () => go('/film') },
    { key: 'game', icon: <PlayCircleOutlined />, label: 'Khu game', onClick: () => go('/game') },
  ];

  return (
    <>
      <Header className="app-header">
        {/* Nút menu trái */}
        <div className="header-left">
          <Button
            type="text"
            className="menu-btn"
            icon={<MenuOutlined />}
            onClick={() => setOpen(true)}
          />
        </div>

        {/* Tiêu đề ở giữa */}
        <Text
          className="brand-center"
          strong
          onClick={() => navigate('/')}
        >
          HOME
        </Text>

        {/* Góc phải: chào + logout */}
        <div className="header-right">
          {isAuthed && (
            <Space align="center" size={12}>
              <Text className="hello">Xin chào, <b>{user?.name}</b></Text>
              <Button onClick={handleLogout} icon={<LogoutOutlined />}>Log out</Button>
            </Space>
          )}
        </div>
      </Header>

      {/* Drawer menu */}
      <Drawer
        title={<Space><AppstoreOutlined /> <span>Menu</span></Space>}
        placement="left"
        width={280}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Menu
          mode="inline"
          items={menuItems}
          onClick={({ key }) => {
            const found = menuItems.find(i => i.key === key);
            if (found?.onClick) found.onClick();
          }}
          style={{ borderRight: 0 }}
        />
        <Divider />
        {isAuthed && (
          <Button
            block
            type="default"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        )}
      </Drawer>
    </>
  );
};

export default AppHeader;
