import React from 'react';
import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './learn/learn.css';

const { Sider, Content } = Layout;

const items = [
  { key: '/learn/todo', label: 'APP TO-DO' },
  { key: '/learn/html', label: 'HTML' },
  { key: '/learn/css', label: 'CSS' },
  { key: '/learn/js', label: 'JAVASCRIPT' },
  { key: '/learn/react', label: 'REACT' },
  // { key: '/learn/notes', label: 'GHI CHÚ' },

];

export default function AppLearn() {
  const location = useLocation();
  const navigate = useNavigate();

  // đồng bộ item đang chọn theo URL hiện tại
  const selectedKeys = [items.find(i => location.pathname.startsWith(i.key))?.key || '/html'];

  return (
    <Layout className="app-learn">
      <Sider width={220} className="app-sider" style={{ position: 'sticky', top: 64, height: 'calc(100vh - 64px)', overflow: 'auto' }}>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
