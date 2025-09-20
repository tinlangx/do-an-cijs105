import React, { useMemo, useState } from 'react';
import {
  Typography, Card, Divider, Button, Modal, Radio, Space, List, Alert, Tag, message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

/* -------------------------- 20 BÀI HỌC REACT -------------------------- */
const LESSONS = [
  { id: 1, title: 'React & SPA', content: <>React là thư viện xây UI theo <b>component</b>, thường dùng cho SPA. Kết hợp Router/State manager để tạo ứng dụng hoàn chỉnh.</> },
  { id: 2, title: 'Vite + React', content: <>Khởi tạo nhanh với Vite. React hoạt động theo <i>render → commit</i>; state thay đổi → render lại.</> },
  { id: 3, title: 'JSX', content: <>JSX là cú pháp giống HTML trong JS. Phải <b>return 1 root</b>; dùng <code>&lt;&gt;…&lt;/&gt;</code> (Fragment) khi cần.</> },
  { id: 4, title: 'Component hàm', content: <>Hiện đại ưu tiên <b>function component</b>. Props là input <i>bất biến</i>; không được sửa props bên trong con.</> },
  { id: 5, title: 'State & setState/useState', content: <>State là dữ liệu thay đổi theo thời gian. Dùng <Tag>useState</Tag> và <b>không mutate trực tiếp</b> — luôn dùng setter.</> },
  { id: 6, title: 'Render & Key', content: <>Khi render list phải có <Tag>key</Tag> <b>ổn định</b> (id), tránh dùng index nếu có thể để hạn chế lỗi.</> },
  { id: 7, title: 'Sự kiện', content: <>Sự kiện là <i>SyntheticEvent</i>. Truyền handler như <code>onClick=&#123;handle&#125;</code>, không gọi trực tiếp.</> },
  { id: 8, title: 'useEffect & vòng đời', content: <>Dùng <Tag>useEffect</Tag> cho side-effect. Mảng phụ thuộc <code>[]</code> chạy sau lần mount; đối số trả về dùng để <b>cleanup</b>.</> },
  { id: 9, title: 'useRef', content: <>Giữ <b>giá trị mutable</b> mà không gây re-render và trỏ tới DOM qua prop <Tag>ref</Tag>.</> },
  { id: 10, title: 'Tối ưu: memo, useMemo, useCallback', content: <>Bọc component bằng <Tag>React.memo</Tag>; nhớ giá trị với <Tag>useMemo</Tag> và hàm với <Tag>useCallback</Tag> khi cần.</> },
  { id: 11, title: 'Context & useContext', content: <>Tránh <i>prop drilling</i> với <Tag>createContext</Tag> + <Tag>useContext</Tag>. Kết hợp <Tag>useReducer</Tag> cho state phức tạp.</> },
  { id: 12, title: 'Form: Controlled vs Uncontrolled', content: <>Controlled: giá trị đến từ state (<code>value/onChange</code>). Uncontrolled: đọc từ DOM qua <Tag>ref</Tag>.</> },
  { id: 13, title: 'React Router', content: <>Khai báo <code>&lt;Routes/&gt;</code>, <code>&lt;Route/&gt;</code>; điều hướng bằng <Tag>useNavigate</Tag>; lồng route với <Tag>&lt;Outlet/&gt;</Tag>.</> },
  { id: 14, title: 'Bảo vệ tuyến', content: <>Dùng component điều kiện + <Tag>&lt;Navigate/&gt;</Tag> để chuyển hướng khi chưa đăng nhập.</> },
  { id: 15, title: 'Fetch dữ liệu', content: <>Dùng <code>fetch</code>/<code>axios</code> trong <Tag>useEffect</Tag> (có cleanup/AbortController). Có thể dùng thư viện như React Query/SWR.</> },
  { id: 16, title: 'Error Boundary', content: <>Bắt lỗi <b>rendering</b> của cây con (không bắt lỗi async trong handler). Tạo bằng class hoặc thư viện hỗ trợ.</> },
  { id: 17, title: 'Code Splitting', content: <>Tải lười component bằng <Tag>React.lazy</Tag> + <Tag>&lt;Suspense fallback/&gt;</Tag>.</> },
  { id: 18, title: 'Hiệu năng & UX', content: <>Khoáy động lớn hãy ảo hóa list (virtualization). Dùng <Tag>useTransition</Tag>/<Tag>startTransition</Tag> cho update không khẩn cấp.</> },
  { id: 19, title: 'DevTools & Testing', content: <>React DevTools để kiểm tra props/state. Test với Jest/RTL/Vitest; viết component <i>pure</i> dễ test.</> },
  { id: 20, title: 'Best Practices', content: <>Không mutate state; key ổn định; tách module/Hook; tránh side-effect trong render; dùng env <code>import.meta.env</code> với Vite.</> },
];

/* -------------------------- 20 CÂU HỎI TRẮC NGHIỆM -------------------------- */
const BANK = [
  { id: 1, q: 'Cách chuẩn tạo component hiện nay?', options: ['Class component', 'Function component', 'HTML template', 'jQuery widget'], correct: 1 },
  { id: 2, q: 'Để trả về nhiều phần tử kề nhau cần bọc bằng?', options: ['<div>', '<span>', '<>…</> (Fragment)', 'Không thể'], correct: 2 },
  { id: 3, q: 'Truyền dữ liệu từ cha xuống con dùng?', options: ['state', 'props', 'context', 'ref'], correct: 1 },
  { id: 4, q: 'Tạo state trong function component dùng?', options: ['this.setState', 'useState', 'createState', 'setState trực tiếp'], correct: 1 },
  { id: 5, q: 'Khi render danh sách, thuộc tính nào bắt buộc?', options: ['name', 'data-id', 'key', 'title'], correct: 2 },
  { id: 6, q: 'Giá trị key tốt nhất là?', options: ['index của mảng', 'Math.random()', 'id ổn định của phần tử', 'toString()'], correct: 2 },
  { id: 7, q: 'useEffect với [] chạy khi nào?', options: ['Mỗi render', 'Sau lần render đầu', 'Trước render đầu', 'Không bao giờ'], correct: 1 },
  { id: 8, q: 'Dọn dẹp (cleanup) trong useEffect đặt ở đâu?', options: ['Trong setTimeout', 'Giá trị trả về của effect', 'Trong render', 'Trong props'], correct: 1 },
  { id: 9, q: 'Lưu giá trị mutable không gây re-render dùng?', options: ['useMemo', 'useRef', 'useCallback', 'useReducer'], correct: 1 },
  { id: 10, q: 'Giảm re-render không cần thiết của component con dùng?', options: ['React.memo', 'useId', 'StrictMode', 'Portal'], correct: 0 },
  { id: 11, q: 'Ghi nhớ một hàm phụ thuộc để truyền xuống props dùng?', options: ['useMemo', 'useCallback', 'useRef', 'memoizeAll'], correct: 1 },
  { id: 12, q: 'Tránh prop drilling nhiều tầng dùng?', options: ['Redux', 'Context API (createContext/useContext)', 'LocalStorage', 'EventEmitter thuần'], correct: 1 },
  { id: 13, q: 'Điều hướng trang bằng React Router trong code dùng?', options: ['useRoute', 'useNavigate', 'navigate() của window', 'Router.push'], correct: 1 },
  { id: 14, q: 'Chuyển hướng có điều kiện thường trả về component nào?', options: ['<Link>', '<Navigate>', '<Outlet>', '<Suspense>'], correct: 1 },
  { id: 15, q: 'Tách code component tải lười dùng?', options: ['React.defer', 'React.lazy + Suspense', 'useEffect', 'Service Worker'], correct: 1 },
  { id: 16, q: 'Error Boundary bắt loại lỗi nào?', options: ['Lỗi sự kiện async', 'Lỗi render của cây con', 'Lỗi Node.js', 'Lỗi CSS'], correct: 1 },
  { id: 17, q: 'Tránh rò rỉ khi fetch trong effect nên?', options: ['Không cần làm gì', 'Dùng AbortController và cleanup', 'Dùng setInterval', 'Dùng var thay let'], correct: 1 },
  { id: 18, q: 'Input “controlled” mô tả đúng là?', options: ['Giá trị lưu trong DOM', 'Giá trị do state điều khiển (value/onChange)', 'Không có onChange', 'Chỉ dùng ref'], correct: 1 },
  { id: 19, q: 'Đánh dấu update không khẩn cấp để không chặn UI dùng?', options: ['useDeferredValue', 'useId', 'useTransition/startTransition', 'useImperativeHandle'], correct: 2 },
  { id: 20, q: 'Thuộc tính nào truyền ref xuống DOM?', options: ['key', 'ref', 'id', 'data-ref'], correct: 1 },
];

/* ------------------------------ TIỆN ÍCH ------------------------------ */
const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function ReactDoc() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const total = selected.length;
  const score = useMemo(() => {
    if (!submitted) return 0;
    return selected.reduce((acc, q) => acc + ((answers[q.id] ?? -1) === q.correct ? 1 : 0), 0);
  }, [submitted, selected, answers]);

  const openQuiz = () => {
    const ten = shuffle(BANK).slice(0, 10);
    setSelected(ten);
    setAnswers({});
    setSubmitted(false);
    setShowErrors(false);
    setOpen(true);
  };

  const onSubmit = () => {
    const missing = selected.filter(q => answers[q.id] === undefined);
    if (missing.length) {
      setShowErrors(true);
      message.warning(`Bạn còn ${missing.length} câu chưa trả lời`);
      const firstId = missing[0].id;
      const el = document.getElementById(`quiz-q-${firstId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitted(true);
  };

  const resetQuiz = () => openQuiz();

  return (
    <Card className="page-card">
      <Title level={2}>React — 20 Bài Học Cơ Bản</Title>

      {LESSONS.map(item => (
        <section key={item.id} style={{ marginBottom: 20 }}>
          <Title level={4}>{item.id}. {item.title}</Title>
          <Paragraph>{item.content}</Paragraph>
        </section>
      ))}

      <Divider />
      <div className="lesson-bottom-cta" style={{ marginTop: 8 }}>
        <Button type="primary" size="large" onClick={openQuiz}>
          KIỂM TRA TRẮC NGHIỆM
        </Button>
      </div>

      {/* Modal Quiz */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        width={900}
        footer={null}
        title="Kiểm tra trắc nghiệm React (10 câu ngẫu nhiên)"
        centered
        className="quiz-modal"
        styles={{
          body: {           // phần cuộn
            maxHeight: 'calc(100vh - 260px)', // trừ header modal + title + actions
            overflowY: 'auto',
            paddingRight: 8
          },
          content: { paddingBottom: 8 } // tránh chèn nút
        }}

      >
        {!submitted && (
          <Alert
            showIcon
            type="info"
            message="Chọn 1 đáp án cho mỗi câu. Bấm Nộp bài để chấm điểm."
            style={{ marginBottom: 12 }}
          />
        )}

        <List
          dataSource={selected}
          renderItem={(q, idx) => {
            const userPick = answers[q.id];
            const isMissing = showErrors && userPick === undefined;

            return (
              <List.Item key={q.id} id={`quiz-q-${q.id}`}>
                <div className={`quiz-item ${isMissing ? 'quiz-missing' : ''}`} style={{ width: '100%' }}>
                  <Paragraph strong style={{ marginBottom: 8 }}>
                    {idx + 1}. {q.q}
                  </Paragraph>

                  <Radio.Group
                    onChange={(e) => {
                      setAnswers({ ...answers, [q.id]: e.target.value });
                      if (showErrors) setShowErrors(false);
                    }}
                    value={userPick}
                    disabled={submitted}
                  >
                    <Space direction="vertical">
                      {q.options.map((label, optIdx) => {
                        let style = {};
                        if (submitted) {
                          const correct = q.correct;
                          if (userPick === correct && optIdx === userPick) {
                            style = { color: '#389e0d', fontWeight: 600 }; // đúng -> xanh
                          } else if (userPick !== correct && optIdx === correct) {
                            style = { color: '#cf1322', fontWeight: 600 }; // sai -> đỏ ở đáp án ĐÚNG
                          }
                        }
                        return (
                          <Radio key={optIdx} value={optIdx} style={style}>
                            {label}
                          </Radio>
                        );
                      })}
                    </Space>
                  </Radio.Group>
                </div>
              </List.Item>
            );
          }}
        />

        <Divider />
        {!submitted ? (
          <Space className="quiz-actions">
            <Button onClick={() => setOpen(false)}>Đóng</Button>
            <Button type="primary" onClick={onSubmit}>Nộp bài</Button>
          </Space>
        ) : (
          <Space className="quiz-actions quiz-actions--done" align="center">
            <Button onClick={() => setOpen(false)}>Đóng</Button>
            <Button type="primary" onClick={resetQuiz}>Làm đề khác</Button>
            <Text style={{ marginLeft: 8, fontWeight: 600 }}>
              Bạn đạt <Text style={{ color: '#1677ff' }}>{score}/{total}</Text> điểm
            </Text>
          </Space>
        )}

      </Modal>
    </Card>
  );
}
