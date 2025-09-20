import React from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext.jsx';
import './auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await register(values); // auto login
      message.success('Đăng ký thành công!');
      navigate('/', { replace: true });
    } catch (e) {
      message.error(e.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="auth-center">
      <Card title="Đăng ký" className="auth-card">
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
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
            rules={[{ required: true, message: 'Nhập mật khẩu' }, { min: 6, message: 'Ít nhất 6 ký tự' }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>Tạo tài khoản</Button>
          </Form.Item>
          <Typography.Text>
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </Typography.Text>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
