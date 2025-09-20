import React, { useEffect, useState } from 'react';
import { Typography, Card, Input, Button, List, message } from 'antd';

const STORAGE_KEY = 'notes';

export default function Notes() {
  const [notes, setNotes] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { return []; }
  });
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    const v = text.trim();
    if (!v) return message.warning('Nhập nội dung ghi chú');
    setNotes([{ id: Date.now(), text: v }, ...notes]);
    setText('');
  };

  const remove = (id) => setNotes(notes.filter(n => n.id !== id));

  return (
    <Card className="page-card">
      <Typography.Title level={3}>Ghi chú</Typography.Title>
      <div className="notes-input">
        <Input.TextArea
          rows={3}
          placeholder="Nhập ghi chú..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button type="primary" style={{ marginTop: 8 }} onClick={addNote}>Lưu</Button>
      </div>
      <List
        style={{ marginTop: 16 }}
        dataSource={notes}
        locale={{ emptyText: 'Chưa có ghi chú' }}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button size="small" danger onClick={() => remove(item.id)}>Xoá</Button>
            ]}
          >
            <Typography.Paragraph style={{ marginBottom: 0 }}>
              {item.text}
            </Typography.Paragraph>
          </List.Item>
        )}
      />
    </Card>
  );
}
