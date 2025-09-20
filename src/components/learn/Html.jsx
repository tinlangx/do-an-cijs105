import React, { useMemo, useRef, useState } from 'react';
import {
  Typography, Card, Divider, Button, Modal, Radio, Space, List, Alert, Tag, message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

/* -------------------------- 20 BÀI HỌC CƠ BẢN -------------------------- */
const LESSONS = [
  { id: 1, title: 'Doctype & Khung tài liệu', content: <>Dùng <code>&lt;!DOCTYPE html&gt;</code> để bật chế độ chuẩn; khung chính gồm <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, <code>&lt;body&gt;</code>.</> },
  { id: 2, title: 'Thuộc tính lang', content: <>Đặt <code>lang</code> trên <code>&lt;html&gt;</code> (vd <Tag>lang="vi"</Tag>) để SEO & trợ năng hiểu ngôn ngữ.</> },
  { id: 3, title: 'Meta charset & viewport', content: <><code>&lt;meta charset="UTF-8"&gt;</code> hiển thị TV; <code>viewport</code> cho mobile.</> },
  { id: 4, title: 'Thẻ title & head cơ bản', content: <>Viết <code>&lt;title&gt;</code> ngắn gọn; thêm description, canonical, OG/Twitter khi cần.</> },
  { id: 5, title: 'Heading (H1–H6)', content: <>Mỗi trang nên có <code>&lt;h1&gt;</code> duy nhất; theo thứ bậc logic để dễ truy cập.</> },
  { id: 6, title: 'Đoạn văn & inline semantics', content: <>Dùng <code>&lt;p&gt;</code>, <code>&lt;strong&gt;</code>, <code>&lt;em&gt;</code>, <code>&lt;code&gt;</code>… để nhấn mạnh ý.</> },
  { id: 7, title: 'Liên kết (a)', content: <>Dùng <code>&lt;a href&gt;</code>; nếu <Tag>target="_blank"</Tag> thì thêm <Tag>rel="noopener noreferrer"</Tag>.</> },
  { id: 8, title: 'Hình ảnh (img)', content: <>Luôn có <code>alt</code>, nên thêm <Tag>loading="lazy"</Tag> và <Tag>width/height</Tag> tránh layout shift.</> },
  { id: 9, title: 'Danh sách (ul/ol/dl)', content: <>Tổ chức mục/ bước; dùng <code>dl/dt/dd</code> cho thuật ngữ – định nghĩa.</> },
  { id: 10, title: 'Bảng (table) chuẩn', content: <>Dùng <code>caption</code>, <code>thead</code>/<code>tbody</code>, <code>th</code> có <Tag>scope</Tag> để rõ nghĩa.</> },
  { id: 11, title: 'Form & label', content: <>Kết hợp <code>&lt;label for&gt;</code> với <code>id</code> của input để tăng trợ năng.</> },
  { id: 12, title: 'Input types & ràng buộc', content: <>Tận dụng <code>type="email|url|number|date|file|range"</code>…; dùng <Tag>required</Tag>, <Tag>min/max</Tag>, <Tag>pattern</Tag>.</> },
  { id: 13, title: 'Button vs Link', content: <>Nút thao tác trong trang → <code>&lt;button&gt;</code>; điều hướng trang → <code>&lt;a&gt;</code>.</> },
  { id: 14, title: 'Semantic layout', content: <>Dùng <code>header</code>, <code>nav</code>, <code>main</code>, <code>section</code>, <code>article</code>, <code>aside</code>, <code>footer</code>.</> },
  { id: 15, title: 'Audio/Video & track', content: <>Cung cấp <code>&lt;source&gt;</code> và phụ đề với <code>&lt;track kind="subtitles"&gt;</code>.</> },
  { id: 16, title: 'iFrame & sandbox', content: <>Nhúng trang ngoài với <code>&lt;iframe&gt;</code>; dùng <Tag>sandbox</Tag>, <Tag>title</Tag> để an toàn & a11y.</> },
  { id: 17, title: 'A11y: alt/role/keyboard', content: <>Ảnh cần <code>alt</code>; phần tử tương tác phải focusable; chỉ dùng ARIA khi thiếu thẻ semantic.</> },
  { id: 18, title: 'SEO căn bản', content: <>Title + meta description; heading rõ ràng; canonical; nội dung chất lượng.</> },
  { id: 19, title: 'Hiệu năng tải', content: <>Dùng <Tag>defer</Tag> cho JS; ảnh WebP/AVIF + <Tag>loading="lazy"</Tag>; <code>preconnect</code>/<code>preload</code>.</> },
  { id: 20, title: 'Microdata/Schema & time', content: <>Gắn schema.org (JSON-LD/Microdata) và <code>&lt;time datetime&gt;</code> để máy hiểu dữ liệu.</> },
];

/* -------------------------- 20 CÂU HỎI TRẮC NGHIỆM -------------------------- */
const BANK = [
  { id: 1, q: 'Khai báo HTML5 hợp lệ là gì?', options: ['<!DOCTYPE html>', '<doctype html5>', '<?html 5?>', '<html doctype="5">'], correct: 0 },
  { id: 2, q: 'Thuộc tính lang nên đặt ở đâu?', options: ['<head lang="vi">', '<body lang="vi">', '<html lang="vi">', 'Ở thẻ nào cũng được'], correct: 2 },
  { id: 3, q: 'Mã hoá tiếng Việt chuẩn:', options: ['<meta charset="UTF-8">', '<meta charset="VI">', '<charset=UTF8>', '<meta codepage="65001">'], correct: 0 },
  { id: 4, q: 'Thẻ nào chứa metadata (title/meta/link/script)?', options: ['<main>', '<head>', '<section>', '<footer>'], correct: 1 },
  { id: 5, q: 'Heading đúng là:', options: ['Nhiều <h1> mỗi trang', 'Một <h1> chính, còn lại h2–h6', 'Chỉ dùng h3 trở xuống', 'Tất cả đều h1'], correct: 1 },
  { id: 6, q: 'Thẻ nào để nhấn mạnh mạnh mẽ nội dung?', options: ['<em>', '<strong>', '<i>', '<u>'], correct: 1 },
  { id: 7, q: 'Khi target="_blank" nên thêm gì?', options: ['rel="nofollow"', 'rel="noopener noreferrer"', 'download', 'referrerpolicy="no-referrer"'], correct: 1 },
  { id: 8, q: 'Thuộc tính quan trọng nhất của <img> là:', options: ['title', 'alt', 'width', 'decoding'], correct: 1 },
  { id: 9, q: 'Danh sách không thứ tự dùng:', options: ['<ol>', '<ul>', '<dl>', '<list>'], correct: 1 },
  { id: 10, q: 'Trong bảng, để xác định tiêu đề cột dùng:', options: ['<td scope="col">', '<th scope="col">', '<thead scope="col">', '<tr scope="col">'], correct: 1 },
  { id: 11, q: 'Liên kết label–input chuẩn:', options: ['<label id="email">', '<label for="email">', '<label name="email">', '<label data-for="email">'], correct: 1 },
  { id: 12, q: 'Ràng buộc HTML5 không phải là:', options: ['required', 'min/max', 'pattern', 'validate-js'], correct: 3 },
  { id: 13, q: 'Điều hướng sang trang khác nên dùng:', options: ['<button>', '<a>', '<div onclick>', '<span role="link">'], correct: 1 },
  { id: 14, q: 'Thẻ semantic mô tả vùng điều hướng:', options: ['<section>', '<article>', '<nav>', '<aside>'], correct: 2 },
  { id: 15, q: 'Phụ đề cho video dùng:', options: ['<source kind="subtitles">', '<track kind="subtitles">', '<caption>', '<legend>'], correct: 1 },
  { id: 16, q: 'Thuộc tính tăng an toàn cho iFrame:', options: ['download', 'sandbox', 'loading', 'sizes'], correct: 1 },
  { id: 17, q: 'A11y: hình trang trí thuần nên đặt alt:', options: ['"Hình trang trí"', '"image"', '"" (chuỗi rỗng)', 'Bỏ alt'], correct: 2 },
  { id: 18, q: 'Thành phần SEO cơ bản nhất:', options: ['background-color', 'title + meta description', 'hr', 'marquee'], correct: 1 },
  { id: 19, q: 'Tối ưu tải JS nên dùng:', options: ['defer', 'inline hết', 'blocking', 'alert trước khi load'], correct: 0 },
  { id: 20, q: 'Để mô tả ngày máy hiểu được:', options: ['<date value="...">', '<time datetime="YYYY-MM-DD">', '<p date="...">', '<meta date="...">'], correct: 1 },
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

export default function Html() {
  /* Quiz state */
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState([]);        // 10 câu đã rút
  const [answers, setAnswers] = useState({});          // {questionId: optionIndex}
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const firstMissingRef = useRef(null);

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
    // tìm câu chưa trả lời
    const missing = selected.filter(q => answers[q.id] === undefined);
    if (missing.length) {
      setShowErrors(true);
      message.warning(`Bạn còn ${missing.length} câu chưa trả lời`);
      // cuộn tới câu thiếu đầu tiên
      const firstId = missing[0].id;
      const el = document.getElementById(`quiz-q-${firstId}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitted(true);
  };

  const resetQuiz = () => {
    openQuiz(); // rút đề mới
  };

  /* ------------------------------ RENDER ------------------------------ */
  return (
    <Card className="page-card">
      <Title level={2}>HTML — 20 Bài Học Cơ Bản</Title>

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

      {/* MODAL QUIZ */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        width={900}
        footer={null}
        title={`Kiểm tra trắc nghiệm HTML (10 câu ngẫu nhiên)`}
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
                        // Tô màu sau khi nộp bài:
                        // - Nếu trả lời đúng: đáp án người dùng chọn => XANH
                        // - Nếu trả lời sai: dòng đáp án ĐÚNG => ĐỎ
                        let style = {};
                        if (submitted) {
                          const correct = q.correct;
                          if (userPick === correct && optIdx === userPick) {
                            style = { color: '#389e0d', fontWeight: 600 };
                          } else if (userPick !== correct && optIdx === correct) {
                            style = { color: '#cf1322', fontWeight: 600 };
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
