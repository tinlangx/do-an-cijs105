import React, { useMemo, useState } from 'react';
import {
  Typography, Card, Divider, Button, Modal, Radio, Space, List, Alert, Tag, message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

/* -------------------------- 20 BÀI HỌC JAVASCRIPT -------------------------- */
const LESSONS = [
  { id: 1, title: 'JavaScript & ECMAScript', content: <>JS chạy trên trình duyệt/Node.js; tiêu chuẩn là <b>ECMAScript</b> (ES6+ mang lại <i>let/const</i>, class, module…).</> },
  { id: 2, title: 'Biến & Kiểu dữ liệu', content: <>Dùng <Tag>let</Tag>/<Tag>const</Tag> (block scope) thay vì <Tag>var</Tag> (function scope). Kiểu nguyên thuỷ: string, number, boolean, null, undefined, bigint, symbol.</> },
  { id: 3, title: 'Toán tử so sánh', content: <><Tag>===</Tag> so sánh nghiêm ngặt (không ép kiểu); <Tag>==</Tag> có ép kiểu; khác <Tag>!==</Tag>.</> },
  { id: 4, title: 'Toán tử logic hiện đại', content: <>Dùng <Tag>??</Tag> (nullish coalescing) cho giá trị mặc định khi <i>null/undefined</i>; <Tag>?.</Tag> (optional chaining) truy cập an toàn.</> },
  { id: 5, title: 'Cấu trúc điều khiển', content: <>if/else, switch, vòng lặp <Tag>for</Tag>, <Tag>while</Tag>, <Tag>for...of</Tag> (giá trị), <Tag>for...in</Tag> (key thuộc tính liệt kê).</> },
  { id: 6, title: 'Hàm & Hoisting', content: <>Function declaration được hoist đầy đủ; function expression/arrow không. Luôn khai báo trước khi dùng để rõ ràng.</> },
  { id: 7, title: 'Scope & TDZ', content: <>Block scope với <Tag>let</Tag>/<Tag>const</Tag>, tồn tại <i>Temporal Dead Zone</i>; <Tag>var</Tag> có function scope.</> },
  { id: 8, title: 'Closures & IIFE', content: <>Closure “nhớ” môi trường khi tạo ra. IIFE giúp tạo scope ngay lập tức.</> },
  { id: 9, title: 'this & Arrow function', content: <>Arrow function <b>không</b> có <code>this</code> riêng; nó lấy <i>lexical this</i>. Dùng <code>call/apply/bind</code> cho function thường.</> },
  { id: 10, title: 'Destructuring & Rest/Spread', content: <>Trích xuất: <code>const &#123;a,b&#125; = obj</code>; gộp/tách: <code>[...arr]</code>, <code>&#123;...obj&#125;</code>.</> },
  { id: 11, title: 'Mảng thường dùng', content: <>map, filter, reduce, find, some, every, includes; thao tác: push/pop, shift/unshift, slice/splice.</> },
  { id: 12, title: 'Chuỗi & Template literals', content: <>Dùng `` `Hello ${'{name}'}` `` thay cho nối chuỗi +. Có <code>startsWith</code>, <code>includes</code>, <code>padStart</code>…</> },
  { id: 13, title: 'Module ES', content: <>Tách file với <Tag>export</Tag>/<Tag>import</Tag>; <Tag>export default</Tag> vs <Tag>named export</Tag>. Vite hỗ trợ ESM.</> },
  { id: 14, title: 'Promise & async/await', content: <>Promise có 3 trạng thái; <Tag>async/await</Tag> giúp viết bất đồng bộ tuyến tính; luôn <code>try/catch</code>.</> },
  { id: 15, title: 'Fetch API', content: <>Dùng <code>fetch(url)</code> → <code>res.json()</code>. Kiểm tra <code>res.ok</code> trước khi parse; handle lỗi mạng.</> },
  { id: 16, title: 'DOM & Sự kiện', content: <>Chọn phần tử: <code>querySelector</code>; lắng nghe: <code>addEventListener</code>; lan truyền: capture/bubble.</> },
  { id: 17, title: 'Event Loop', content: <>Microtask (Promise) chạy trước macrotask (setTimeout). Vì vậy <code>Promise.then</code> chạy trước <code>setTimeout(0)</code>.</> },
  { id: 18, title: 'Lỗi & Debug', content: <>Dùng <code>try/catch</code>, <code>throw</code>, <code>console.*</code>; đặt breakpoint trong DevTools.</> },
  { id: 19, title: 'OOP & Prototype', content: <>Class là cú pháp sugar của prototype; <Tag>extends</Tag>, <Tag>super</Tag>; phương thức thật ra nằm trên prototype.</> },
  { id: 20, title: 'Cấu trúc dữ liệu & Tips', content: <>Map/Set (giá trị unique), WeakMap/WeakSet (không giữ mạnh); debounce/throttle cho sự kiện dày đặc.</> },
];

/* -------------------------- 20 CÂU HỎI TRẮC NGHIỆM -------------------------- */
const BANK = [
  { id: 1, q: 'Khai báo biến không thể gán lại giá trị?', options: ['var', 'let', 'const', 'function'], correct: 2 },
  { id: 2, q: 'Toán tử so sánh nghiêm ngặt (không ép kiểu) là?', options: ['==', '===', '=', '!=='], correct: 1 },
  { id: 3, q: 'Tạo biến có phạm vi block {} là?', options: ['let', 'var', 'function', 'with'], correct: 0 },
  { id: 4, q: 'Toán tử lấy giá trị mặc định khi biến là null/undefined?', options: ['||', '??', '&&', '?:'], correct: 1 },
  { id: 5, q: 'Toán tử truy cập an toàn thuộc tính lồng nhau?', options: ['?.', '?=', '??', '!!'], correct: 0 },
  { id: 6, q: 'Vòng lặp duyệt giá trị của mảng tốt nhất là?', options: ['for...in', 'for...of', 'forEach với object', 'while...in'], correct: 1 },
  { id: 7, q: 'Hàm nào giữ nguyên "this" theo ngữ cảnh tạo ra?', options: ['function() {}', '() => {}', 'new Function()', 'bind(function)'], correct: 1 },
  { id: 8, q: 'Cách sao chép mảng và thêm 4 vào cuối một cách bất biến?', options: ['arr.push(4)', 'arr.concat(4); arr', '[...arr, 4]', 'arr = arr'], correct: 2 },
  { id: 9, q: 'Phương thức trả về mảng mới sau khi biến đổi từng phần tử?', options: ['forEach', 'map', 'reduce', 'filter'], correct: 1 },
  { id: 10, q: 'Tìm phần tử đầu tiên thoả điều kiện dùng?', options: ['filter', 'some', 'find', 'includes'], correct: 2 },
  { id: 11, q: 'Đợi nhiều Promise cùng lúc và reject nếu bất kỳ cái nào lỗi:', options: ['Promise.any', 'Promise.race', 'Promise.all', 'Promise.allSettled'], correct: 2 },
  { id: 12, q: 'Có thể dùng await ở đâu?', options: ['Trong hàm thường', 'Trong hàm async', 'Toàn cục mọi nơi', 'Trong setTimeout'], correct: 1 },
  { id: 13, q: 'Parse JSON từ phản hồi fetch?', options: ['response.text()', 'response.json()', 'JSON.parse(response)', 'await JSON(response)'], correct: 1 },
  { id: 14, q: 'Phát biểu đúng về hoisting:', options: ['let/const dùng được trước khi khai báo', 'Function declaration có thể gọi trước khi khai báo', 'Function expression được hoist hoàn toàn', 'Không có hoisting trong JS'], correct: 1 },
  { id: 15, q: 'this trong arrow function:', options: ['Thay đổi theo cách gọi', 'Có thể bind lại', 'Lấy từ lexical scope khi tạo', 'Là window luôn luôn'], correct: 2 },
  { id: 16, q: 'Ngăn hành vi mặc định của sự kiện?', options: ['event.stopPropagation()', 'event.preventDefault()', 'return false ngoài jQuery', 'event.stopImmediatePropagation()'], correct: 1 },
  { id: 17, q: 'Thứ tự event loop đúng?', options: ['setTimeout(0) chạy trước Promise.then', 'Promise.then chạy trước setTimeout(0)', 'Cả hai cùng lúc', 'Tùy trình duyệt, không xác định'], correct: 1 },
  { id: 18, q: 'Từ khoá dùng để kế thừa lớp?', options: ['inherit', 'prototype', 'extends', 'superOf'], correct: 2 },
  { id: 19, q: 'Cấu trúc dữ liệu lưu giá trị duy nhất (không trùng)?', options: ['Array', 'Object', 'Map', 'Set'], correct: 3 },
  { id: 20, q: 'Kỹ thuật giảm số lần gọi handler khi gõ/phóng to cửa sổ?', options: ['debounce', 'polling', 'batching', 'memo'], correct: 0 },
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

export default function Js() {
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
      <Title level={2}>JavaScript — 20 Bài Học Cơ Bản</Title>

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
        title="Kiểm tra trắc nghiệm JavaScript (10 câu ngẫu nhiên)"
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
