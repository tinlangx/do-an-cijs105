import React from 'react';
import { Layout, Input, Typography, Menu, Button } from 'antd';
import { Routes, Route, useNavigate, useLocation, Navigate, Link } from 'react-router-dom';
import Home from './film/Home.jsx';
import FilmDetail from './film/FilmDetail.jsx';
import Watch from './film/Watch.jsx';
import './film/film.css';

const { Header, Content } = Layout;

export default function AppFilm() {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const menuItems = [
        { key: '/film/tu-tien', label: 'Tu Tiên' },
        { key: '/film/luyen-cap', label: 'Luyện Cấp' },
        { key: '/film/trung-sinh', label: 'Trùng Sinh' },
        { key: '/film/kiem-hiep', label: 'Kiếm Hiệp' },
        { key: '/film/xuyen-khong', label: 'Xuyên Không' },
    ];
    const selectedKey = menuItems.find(m => pathname.startsWith(m.key))?.key || '';

    return (
        <Layout className="film-layout" style={{ minHeight: '100vh' }}>
            <Header className="film-header">
                <div className="film-topbar">
                    {/* Brand */}
                    <Link to="/film" className="film-brand">Hoạt Hình 3D</Link>

                    {/* Menu phân loại */}
                    <Menu
                        mode="horizontal"
                        selectedKeys={[selectedKey]}
                        className="film-menu"
                        items={menuItems}
                        onClick={({ key }) => navigate(key)}
                    />

                    {/* Tìm kiếm (bên phải) */}
                    <Input.Search
                        allowClear
                        className="film-search"
                        size='large'
                        placeholder="Nhập tên phim cần tìm…"
                        onSearch={(text) => {
                            const q = (text || '').trim();
                            if (q) navigate(`/film?q=${encodeURIComponent(q)}`);
                            else navigate('/film');
                        }}
                    />
                </div>
            </Header>

            <Content className="film-content">
                <Routes>
                    <Route index element={<Home />} />
                    <Route path=":category" element={<Home />} />
                    <Route path=":category/:slug" element={<FilmDetail />} />
                    <Route path=":category/:slug/watch/:ep" element={<Watch />} />
                    <Route path="*" element={<Navigate to="/film" replace />} />
                </Routes>
            </Content>

            <footer className="film-footer">
                <Typography.Text type="secondary">Phim hoạt hình 3d cập nhật nhanh nhất</Typography.Text>
            </footer>
        </Layout>
    );
}
