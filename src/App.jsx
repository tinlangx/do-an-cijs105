import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/header/AppHeader.jsx';
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import PublicOnlyRoute from './routes/PublicOnlyRoute.jsx';
import Home from './pages/Home.jsx';
import AppLearn from './components/AppLearn.jsx';
import Html from './components/learn/Html.jsx';
import Css from './components/learn/Css.jsx';
import Js from './components/learn/Js.jsx';
import ReactDoc from './components/learn/ReactDoc.jsx';
import Notes from './components/learn/Notes.jsx';
import Todo from './components/learn/Todo.jsx';
import AppFilm from './components/AppFilm.jsx';

const { Content } = Layout;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppHeader />
      <Content style={{ padding: 0, margin: 0 }}>
        <Routes>
          {/* Trang sau đăng nhập: HOME */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Khu học tập có sidebar */}
          <Route path="/learn" element={<ProtectedRoute><AppLearn /></ProtectedRoute>}>
            <Route index element={<Navigate to="todo" replace />} />
            <Route path="html" element={<Html />} />
            <Route path="css" element={<Css />} />
            <Route path="js" element={<Js />} />
            <Route path="react" element={<ReactDoc />} />
            {/* <Route path="notes" element={<Notes />} /> */}
            <Route path="todo" element={<Todo />} />
          </Route>
          <Route path="/film/*" element={<AppFilm />} />



          {/* Auth */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />
        </Routes>
      </Content>
    </Layout>
  );
}
