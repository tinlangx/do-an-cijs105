import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import './auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onFinish = async (values) => {
    try {
      await login(values);
      message.success('Đăng nhập thành công!');
      navigate('/', { replace: true });
    } catch (e) {
      message.error(e.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <div className="auth-center">
      <Card title="Đăng nhập" className="auth-card">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}
          >
            <Input placeholder="you@email.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Nhập mật khẩu' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Đăng nhập</Button>
          </Form.Item>
          <Typography.Text>
            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
