import React, { useMemo, useState } from 'react';
import {
  Typography, Card, Divider, Button, Modal, Radio, Space, List, Alert, Tag, message,
} from 'antd';

const { Title, Paragraph, Text } = Typography;

/* -------------------------- 20 BÀI HỌC CSS -------------------------- */
const LESSONS = [
  { id: 1, title: 'Khái niệm & Cú pháp', content: <>CSS dùng để trình bày HTML: quy tắc gồm <code>selector</code> + <code>{`{ property: value; }`}</code>. Có thể viết <i>external</i>, <i>internal</i> hoặc <i>inline</i>.</> },
  { id: 2, title: 'Cascade & Specificity', content: <>Quy tắc áp dụng theo <b>tính kế thừa</b>, <b>nguồn</b> và <b>độ ưu tiên</b>. Độ ưu tiên: <Tag>inline</Tag> &gt; <Tag>id</Tag> &gt; <Tag>class/pseudo</Tag> &gt; <Tag>tag</Tag>. <Tag>!important</Tag> ghi đè cuối.</> },
  { id: 3, title: 'Box Model', content: <>Mọi phần tử là 1 hộp: <Tag>content</Tag> + <Tag>padding</Tag> + <Tag>border</Tag> + <Tag>margin</Tag>. Dùng <Tag>box-sizing: border-box</Tag> để dễ tính.</> },
  { id: 4, title: 'Display', content: <>Giá trị thường dùng: <Tag>block</Tag>, <Tag>inline</Tag>, <Tag>inline-block</Tag>, <Tag>flex</Tag>, <Tag>grid</Tag>, <Tag>none</Tag>.</> },
  { id: 5, title: 'Position & Stacking', content: <>Các chế độ: <Tag>static</Tag>, <Tag>relative</Tag>, <Tag>absolute</Tag>, <Tag>fixed</Tag>, <Tag>sticky</Tag>. <Tag>z-index</Tag> phụ thuộc <i>stacking context</i>.</> },
  { id: 6, title: 'Units', content: <>Đơn vị tuyệt đối: <Tag>px</Tag>; tương đối: <Tag>%</Tag>, <Tag>em</Tag>, <Tag>rem</Tag>, <Tag>vh/vw</Tag>, <Tag>fr</Tag> (Grid).</> },
  { id: 7, title: 'Màu sắc & Nền', content: <>Định dạng màu: <Tag>hex</Tag>, <Tag>rgb/rgba</Tag>, <Tag>hsl/hsla</Tag>. Nền: <Tag>background</Tag>, <Tag>background-size</Tag>, <Tag>repeat</Tag>, <Tag>position</Tag>.</> },
  { id: 8, title: 'Biên & Góc bo', content: <>Thuộc tính: <Tag>border</Tag>, <Tag>border-radius</Tag>, <Tag>outline</Tag> (không chiếm chỗ, hữu ích cho focus).</> },
  { id: 9, title: 'Khoảng cách & Kích thước', content: <>Dùng <Tag>margin/padding</Tag>, <Tag>width/height</Tag>, <Tag>min/max</Tag>, <Tag>overflow</Tag>.</> },
  { id: 10, title: 'Typography', content: <>Font: <Tag>font-family</Tag>, <Tag>font-size</Tag>, <Tag>line-height</Tag>, <Tag>font-weight</Tag>, <Tag>letter-spacing</Tag>. Dùng hệ font dự phòng.</> },
  { id: 11, title: 'Selectors cơ bản', content: <>Tag, class (<code>.btn</code>), id (<code>#menu</code>), nhóm (<code>h1, h2</code>), con cháu (<code>.a .b</code>), con trực tiếp (<code>.a &gt; .b</code>).</> },
  { id: 12, title: 'Pseudo-classes & Pseudo-elements', content: <><Tag>:hover</Tag>, <Tag>:focus</Tag>, <Tag>:nth-child()</Tag>, <Tag>::before</Tag>, <Tag>::after</Tag>…</> },
  { id: 13, title: 'Flexbox', content: <>Trục chính/chéo; canh hàng với <Tag>justify-content</Tag>, <Tag>align-items</Tag>; item có <Tag>flex</Tag>, <Tag>order</Tag>.</> },
  { id: 14, title: 'CSS Grid', content: <>Khai báo <Tag>display: grid</Tag>, <Tag>grid-template-columns</Tag> (có thể dùng <Tag>repeat()</Tag>, <Tag>minmax()</Tag>, <Tag>fr</Tag>), <Tag>gap</Tag>, <Tag>grid-area</Tag>.</> },
  { id: 15, title: 'Responsive & Media Queries', content: <>Dùng <code>@media</code> theo chiều rộng (vd: <code>@media (max-width: 768px)</code>). Sử dụng <Tag>clamp()</Tag> và unit linh hoạt.</> },
  { id: 16, title: 'Biến CSS (Custom Properties)', content: <>Khai báo ở <code>:root</code> (vd: <code>--primary</code>), dùng với <code>var(--primary)</code>. Có thể chuyển theme động.</> },
  { id: 17, title: 'Transitions & Animations', content: <>Chuyển cảnh mượt với <Tag>transition</Tag>; hoạt ảnh với <code>@keyframes</code> + <Tag>animation</Tag>. Ưu tiên thuộc tính không gây reflow: <Tag>transform</Tag>, <Tag>opacity</Tag>.</> },
  { id: 18, title: 'BEM & Tổ chức CSS', content: <>Đặt tên <b>BEM</b>: <i>Block__Element--Modifier</i>. Tránh chồng chéo selector, tách module theo tính năng.</> },
  { id: 19, title: 'Hiệu năng & Tối ưu tải', content: <>Giảm độ phức tạp selector; tránh <Tag>*</Tag>; nén CSS; dùng <Tag>content-visibility</Tag>, <Tag>will-change</Tag> hợp lý.</> },
  { id: 20, title: 'Modern CSS', content: <>Logical properties (<Tag>margin-inline</Tag>…), container queries (<code>@container</code>), <Tag>subgrid</Tag>, <Tag>has()</Tag> selector (trình duyệt mới).</> },
];

/* -------------------------- 20 CÂU HỎI TRẮC NGHIỆM -------------------------- */
const BANK = [
  { id: 1, q: 'Thuộc tính nào đặt kích thước hộp tính cả padding & border?', options: ['box-model', 'box-type', 'box-sizing: border-box', 'content-box'], correct: 2 },
  { id: 2, q: 'Độ ưu tiên cao nhất trong các lựa chọn sau?', options: ['.btn .icon', 'header nav a', '#id', 'a'], correct: 2 },
  { id: 3, q: 'Thuộc tính tạo bố cục một chiều theo trục chính là?', options: ['grid', 'flex', 'inline-block', 'float'], correct: 1 },
  { id: 4, q: 'Tạo lưới 3 cột đều trong CSS Grid?', options: ['grid-template: 3;', 'grid-template-columns: auto auto auto;', 'grid-template-columns: 1fr 1fr 1fr;', 'columns: 3;'], correct: 2 },
  { id: 5, q: 'Đơn vị nên dùng cho font-size linh hoạt?', options: ['px', 'rem', 'cm', 'vh'], correct: 1 },
  { id: 6, q: 'Thuộc tính căn dọc item trong Flex container?', options: ['align-items', 'justify-items', 'place-content', 'text-align'], correct: 0 },
  { id: 7, q: 'Tạo trạng thái khi rê chuột vào link:', options: [':focus', '::after', ':hover', ':active'], correct: 2 },
  { id: 8, q: 'Ẩn phần tử nhưng vẫn chiếm chỗ:', options: ['visibility: hidden', 'display: none', 'opacity: 0', 'position: absolute'], correct: 0 },
  { id: 9, q: 'Thuộc tính nào không kế thừa mặc định?', options: ['color', 'font-family', 'line-height', 'margin'], correct: 3 },
  { id: 10, q: 'Tạo bo tròn hoàn toàn cho avatar vuông 100x100:', options: ['border-radius: 10px', 'border-radius: 50%', 'clip-path: circle(0)', 'outline-radius: 50%'], correct: 1 },
  { id: 11, q: 'Viết media query cho màn hình ≤ 768px:', options: ['@media (min-width: 768px)', '@media (max-width: 768px)', '@media screen 768', '@media (width <= 768px) /* chưa chuẩn */'], correct: 1 },
  { id: 12, q: 'Khai báo biến CSS & sử dụng đúng:', options: [':root { primary: #1677ff } .btn { color: var(primary) }', ':root { --primary: #1677ff } .btn { color: var(--primary) }', '--primary: #1677ff; .btn { color: var(--primary) }', ':root { --primary: #1677ff } .btn { color: primary }'], correct: 1 },
  { id: 13, q: 'Thuộc tính nào gây reflow nặng nhất khi animate?', options: ['opacity', 'transform', 'left/top (position)', 'filter'], correct: 2 },
  { id: 14, q: 'Chính tả đúng của pseudo-element?', options: ['::before', ':before:', 'before::', ':before::'], correct: 0 },
  { id: 15, q: 'Tạo khoảng cách ngang giữa các cột Grid/Flex hiện đại:', options: ['column-gap / gap', 'margin-left cho mỗi item', 'padding container', 'letter-spacing'], correct: 0 },
  { id: 16, q: 'Thuộc tính đặt phần tử “dính” khi cuộn:', options: ['position: fixed', 'position: sticky', 'position: absolute', 'position: relative'], correct: 1 },
  { id: 17, q: 'Selector chọn phần tử LI đầu tiên trong UL:', options: ['ul li:first', 'ul > li:first-child', 'ul:first-child li', 'li:first'], correct: 1 },
  { id: 18, q: 'Màu trong suốt 50% dùng:', options: ['rgba(0,0,0,0.5)', 'rgb(0,0,0,0.5)', 'hex #00050', 'hsl(0 0% 0% / 50) đều đúng'], correct: 0 },
  { id: 19, q: 'Tổ chức theo BEM cho nút chính:', options: ['.button__primary--block', '.button--primary', '.button.primary', '.primary__button'], correct: 1 },
  { id: 20, q: 'Tạo transition mượt cho opacity 200ms:', options: ['transition: opacity 200ms;', 'animation: opacity 200ms;', 'transition: 200ms all ease 0s opacity;', 'transition-opacity: 200ms;'], correct: 0 },
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

export default function Css() {
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
      <Title level={2}>CSS — 20 Bài Học Cơ Bản</Title>

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
        title="Kiểm tra trắc nghiệm CSS (10 câu ngẫu nhiên)"
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
                            style = { color: '#cf1322', fontWeight: 600 }; // sai -> tô đỏ dòng ĐÚNG
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
