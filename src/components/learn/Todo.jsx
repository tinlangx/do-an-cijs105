import { useEffect, useMemo, useState } from "react";
import { Tabs, Input, Button, Checkbox, Empty, Popconfirm, message, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { nanoid } from "nanoid";
import "./todo.css";

const TABS = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

export default function Todo() {
  const [tab, setTab] = useState(TABS.ALL);
  const [tasks, setTasks] = useState(() => {
    try {
      const raw = localStorage.getItem("todos_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos_v1", JSON.stringify(tasks));
  }, [tasks]);

  const filtered = useMemo(() => {
    if (tab === TABS.ACTIVE) return tasks.filter(t => t.active);
    if (tab === TABS.COMPLETED) return tasks.filter(t => !t.active);
    return tasks;
  }, [tasks, tab]);

  const canAdd = tab !== TABS.COMPLETED && text.trim().length > 0;

  const handleAdd = () => {
    if (!canAdd) return;
    const newTask = { id: nanoid(), title: text.trim(), active: true };
    setTasks(prev => [newTask, ...prev]);
    setText("");
  };

  const toggle = (id) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, active: !t.active } : t)));
  };

  const removeOne = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    message.success("Đã xoá 1 task hoàn thành");
  };

  const clearCompleted = () => {
    const remain = tasks.filter(t => t.active);
    setTasks(remain);
    message.success("Đã xoá tất cả task hoàn thành");
  };

  const completedCount = tasks.filter(t => !t.active).length;

  return (
    <div className="todo-wrap">
      <Typography.Title level={2} className="todo-title">TO-DO</Typography.Title>

      <Tabs
        centered
        activeKey={tab}
        onChange={setTab}
        items={[
          { key: TABS.ALL, label: "All" },
          { key: TABS.ACTIVE, label: "Active" },
          { key: TABS.COMPLETED, label: "Completed" },
        ]}
      />

      {/* Form thêm task - chỉ hiện ở All & Active */}
      {tab !== TABS.COMPLETED && (
        <div className="add-row">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="add details"
            onPressEnter={handleAdd}
            size="large"
          />
          <Button type="primary" size="large" onClick={handleAdd} disabled={!canAdd}>
            Add
          </Button>
        </div>
      )}

      <div className="list">
        {filtered.length === 0 ? (
          <Empty description="Chưa có công việc" />
        ) : (
          filtered.map((t) => (
            <div className="task-item" key={t.id}>
              <div className="task-left">
                <Checkbox checked={!t.active ? true : false} onChange={() => toggle(t.id)} />
                <span className={`task-text ${t.active ? "" : "is-done"}`}>{t.title}</span>
              </div>

              {/* Chỉ hiện nút xoá ở tab Completed */}
              {tab === TABS.COMPLETED && (
                <Popconfirm
                  title="Xoá task này?"
                  okText="Xoá"
                  cancelText="Huỷ"
                  placement="left"
                  onConfirm={() => removeOne(t.id)}
                >
                  <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer xoá tất cả chỉ ở tab Completed */}
      {tab === TABS.COMPLETED && (
        <div className="footer">
          <Popconfirm
            title="Xoá tất cả task đã hoàn thành?"
            okText="Xoá hết"
            cancelText="Huỷ"
            onConfirm={clearCompleted}
            disabled={completedCount === 0}
          >
            <Button danger disabled={completedCount === 0}>
              delete all
            </Button>
          </Popconfirm>
        </div>
      )}
    </div>
  );
}
