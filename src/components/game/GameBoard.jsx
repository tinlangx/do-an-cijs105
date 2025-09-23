import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Empty,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
} from 'antd';
import './game.css';

const { Title } = Typography;

const SIZE = 4; // 4x4
const GOAL = Array.from({ length: SIZE * SIZE - 1 }, (_, i) => i + 1).concat([null]);

/* ---------------- Helpers ---------------- */

function makeBoard() {
  return GOAL.slice();
}

function countInversions(list) {
  const arr = list.filter((x) => x !== null);
  let inv = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inv++;
    }
  }
  return inv;
}

function isSolvable(list) {
  const inv = countInversions(list);
  const emptyIndex = list.indexOf(null);
  const rowFromBottom = SIZE - Math.floor(emptyIndex / SIZE);
  if (SIZE % 2 === 1) return inv % 2 === 0;
  // SIZE chẵn:
  return rowFromBottom % 2 === 0 ? inv % 2 === 1 : inv % 2 === 0;
}

function shuffleSolvable(arr) {
  const a = arr.slice();
  // Fisher–Yates (không cần trộn ô cuối null)
  for (let i = a.length - 2; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (!isSolvable(a)) {
    const i = a.findIndex((x) => x !== null);
    const j = a.findIndex((x, idx) => x !== null && idx !== i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function idx2rc(idx) {
  return { r: Math.floor(idx / SIZE), c: idx % SIZE };
}

function within(r, c) {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

/* --------------- Component ---------------- */

export default function GameBoard() {
  const [board, setBoard] = useState(() => shuffleSolvable(makeBoard()));
  const [running, setRunning] = useState(false);     // true: đang chạy, false: tạm dừng/đứng yên
  const [started, setStarted] = useState(false);     // đã bấm "Bắt đầu" ít nhất 1 lần
  const [seconds, setSeconds] = useState(0);
  const [moves, setMoves] = useState(0);
  const [winOpen, setWinOpen] = useState(false);

  // Thành tích thắng: [{id, at, duration, seconds, moves}]
  const [records, setRecords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('puzzle_wins') || '[]');
    } catch {
      return [];
    }
  });

  // Timer
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const timeText = useMemo(() => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }, [seconds]);

  // Start / Pause toggle
  const startGame = () => {
    setBoard(shuffleSolvable(makeBoard()));
    setRunning(true);
    setStarted(true);
    setSeconds(0);
    setMoves(0);
    setWinOpen(false);
  };

  // Toggle tạm dừng / tiếp tục
  const togglePause = () => {
    if (!started) return;      // chưa bắt đầu thì bỏ qua
    setRunning((r) => !r);     // true -> false (pause), false -> true (resume)
  };

  // Move by mouse (chỉ khi running)
  const moveTile = (index) => {
    if (!running) return;
    const emptyIndex = board.indexOf(null);
    const { r, c } = idx2rc(index);
    const { r: er, c: ec } = idx2rc(emptyIndex);
    const isAdj = Math.abs(r - er) + Math.abs(c - ec) === 1;
    if (!isAdj) return;

    const next = board.slice();
    [next[index], next[emptyIndex]] = [next[emptyIndex], next[index]];
    setBoard(next);
    setMoves((m) => m + 1);
  };

  // Move by keyboard (ĐÃ ĐẢO CHIỀU)
  const moveByKey = (key) => {
    const emptyIndex = board.indexOf(null);
    const { r, c } = idx2rc(emptyIndex);
    let nr = r,
      nc = c;

    if (key === 'arrowup' || key === 'w') nr = r - 1; // ô phía trên
    if (key === 'arrowdown' || key === 's') nr = r + 1; // ô phía dưới
    if (key === 'arrowleft' || key === 'a') nc = c - 1; // ô bên trái
    if (key === 'arrowright' || key === 'd') nc = c + 1; // ô bên phải

    if (!within(nr, nc)) return;
    const idx = nr * SIZE + nc;
    moveTile(idx);
  };

  const keyHandler = useCallback(
    (e) => {
      if (!running) return;
      const k = e.key.toLowerCase();
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(k)) {
        e.preventDefault();
        moveByKey(k);
      }
    },
    [running, board]
  );

  useEffect(() => {
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [keyHandler]);

  // Win check -> lưu thành tích
  useEffect(() => {
    if (!running) return;
    const ok = board.every((v, i) => v === GOAL[i]);
    if (ok) {
      setRunning(false);
      const now = new Date();
      const rec = {
        id: now.getTime(),
        at: now.toLocaleString('vi-VN'),
        duration: timeText,
        seconds,
        moves,
      };
      setRecords((prev) => {
        const next = [rec, ...prev];
        localStorage.setItem('puzzle_wins', JSON.stringify(next));
        return next;
      });
      setWinOpen(true);
    }
  }, [board, running]); // eslint-disable-line react-hooks/exhaustive-deps

  // Table columns
  const columns = [
    { title: '#', dataIndex: 'stt', width: 70 },
    { title: 'Thời điểm', dataIndex: 'at' },
    { title: 'Thời gian chơi', dataIndex: 'duration', width: 140 },
    { title: 'Bước đi', dataIndex: 'moves', width: 100 },
  ];

  // Trạng thái hiển thị
  const statusText = running ? 'Đang chơi' : (started ? 'Tạm dừng' : 'Chưa bắt đầu');
  const statusColor = running ? 'green' : (started ? 'orange' : 'red');

  return (
    <>
      <Row gutter={[16, 16]}>
        {/* BOARD + HUD */}
        <Col xs={24} md={14} lg={12}>
          <Card className="game-panel" bordered={false}>
            <div className="hud">
              <Space wrap>
                <Button type="primary" onClick={startGame}>
                  Bắt đầu
                </Button>
                <Button onClick={togglePause} disabled={!started}>
                  {running ? 'Tạm dừng' : 'Tiếp tục'}
                </Button>
                <Tag color={statusColor}>{statusText}</Tag>
              </Space>
              <Space size={16}>
                <Statistic title="Bước đi" value={moves} />
                <Statistic title="Đồng hồ" value={timeText} />
              </Space>
            </div>

            <div className="board">
              {board.map((v, idx) => (
                <button
                  key={idx}
                  className={`cell ${v === null ? 'empty' : ''} ${v ? `v${v}` : ''}`}
                  onClick={() => v !== null && moveTile(idx)}
                  aria-label={v === null ? 'empty' : `tile-${v}`}
                >
                  {v !== null ? v : ''}
                </button>
              ))}
            </div>

            <div className="help">
              <Title level={5} style={{ marginTop: 16 }}>
                Hướng dẫn di chuyển
              </Title>
              <div className="keys">
                <span>↑</span> <span>←</span>
                <span>↓</span>
                <span>→</span>
                <span style={{ width: 10 }} />
                <span>W</span> <span>A</span>
                <span>S</span>
                <span>D</span>
              </div>
            </div>
          </Card>
        </Col>

        {/* RECORDS */}
        <Col xs={24} md={10} lg={12}>
          <Card title="Bảng thành tích" bordered={false} className="history">
            {records.length === 0 ? (
              <Empty description="Chưa có thành tích. Hãy hoàn thành một ván để lưu kết quả!" />
            ) : (
              <Table
                size="small"
                rowKey="id"
                columns={columns}
                dataSource={records.map((r, i) => ({ ...r, stt: i + 1 }))}
                pagination={{ pageSize: 8, showSizeChanger: true }}
              />
            )}
          </Card>
          <div style={{ marginTop: 8, textAlign: 'right' }}>
            <Button
              size="small"
              onClick={() => {
                localStorage.removeItem('puzzle_wins');
                setRecords([]);
              }}
            >
              Xoá toàn bộ thành tích
            </Button>
          </div>
        </Col>
      </Row>

      {/* WIN MODAL */}
      <Modal
        open={winOpen}
        onCancel={() => setWinOpen(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setWinOpen(false)}>
            OK
          </Button>,
          <Button key="again" onClick={startGame}>
            Chơi lại
          </Button>,
        ]}
      >
        <Title level={3} style={{ textAlign: 'center' }}>
          YOU WIN!
        </Title>
        <Space align="center" style={{ width: '100%', justifyContent: 'center' }}>
          <Statistic title="Tổng thời gian" value={timeText} />
          <Statistic title="Tổng bước đi" value={moves} />
        </Space>
      </Modal>
    </>
  );
}
