import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Row, Col, Button, Space, Statistic, Modal, Typography, Tag } from 'antd';
import './game.css'; // quan trọng: dùng style chung

const { Title } = Typography;

const SIZE = 4;
const START_TILES = 2;
const LOCAL_BEST = 'game2048_best';

function emptyBoard(){ return Array.from({length:SIZE}, ()=>Array(SIZE).fill(0)); }
function clone(m){ return m.map(r=>r.slice()); }
function rndEmpty(m){ const e=[]; for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++) if(m[r][c]===0)e.push({r,c}); return e.length? e[Math.floor(Math.random()*e.length)] : null; }
function addTile(m){ const cell=rndEmpty(m); if(!cell) return m; const v=Math.random()<0.9?2:4; const n=clone(m); n[cell.r][cell.c]=v; return n; }
function transpose(m){ const t=emptyBoard(); for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++) t[c][r]=m[r][c]; return t; }
function reverseRows(m){ return m.map(r=>r.slice().reverse()); }
function compressRow(r){ const a=r.filter(v=>v!==0); while(a.length<SIZE)a.push(0); return a; }
function mergeRow(r){ let s=0; const a=r.slice(); for(let i=0;i<SIZE-1;i++){ if(a[i]!==0 && a[i]===a[i+1]){ a[i]*=2; s+=a[i]; a[i+1]=0; i++; } } return {row:a, score:s}; }
function moveLeft(m){ let moved=false, add=0; const n=m.map(row=>{ const c1=compressRow(row); const {row:mg,score}=mergeRow(c1); const c2=compressRow(mg); if(!moved && c2.some((v,i)=>v!==row[i])) moved=true; add+=score; return c2; }); return {next:n,moved,addScore:add}; }
function moveRight(m){ const r=reverseRows(m); const k=moveLeft(r); return {next:reverseRows(k.next), moved:k.moved, addScore:k.addScore}; }
function moveUp(m){ const t=transpose(m); const k=moveLeft(t); return {next:transpose(k.next), moved:k.moved, addScore:k.addScore}; }
function moveDown(m){ const t=transpose(m); const k=moveRight(t); return {next:transpose(k.next), moved:k.moved, addScore:k.addScore}; }
function hasMoves(m){ for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++) if(m[r][c]===0) return true;
  for(let r=0;r<SIZE;r++)for(let c=0;c<SIZE;c++){ const v=m[r][c]; if(r+1<SIZE && m[r+1][c]===v) return true; if(c+1<SIZE && m[r][c+1]===v) return true; } return false; }

export default function Game2048(){
  const [board, setBoard] = useState(()=>{ let b=emptyBoard(); for(let i=0;i<START_TILES;i++) b=addTile(b); return b; });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(()=>Number(localStorage.getItem(LOCAL_BEST)||0));

  // chỉ chặn khi thua, còn thắng thì vẫn chơi
  const [status, setStatus] = useState('Đang chơi'); // 'Đang chơi' | 'Thua'
  const [won, setWon] = useState(false);
  const [winOpen, setWinOpen] = useState(false);
  const [loseOpen, setLoseOpen] = useState(false);

  const maxTile = useMemo(()=> Math.max(...board.flat()), [board]);

  const reset = () => {
    let b=emptyBoard(); for(let i=0;i<START_TILES;i++) b=addTile(b);
    setBoard(b); setScore(0); setStatus('Đang chơi'); setWon(false);
    setWinOpen(false); setLoseOpen(false);
  };

  const applyMove = (dir) => {
    if (status === 'Thua') return;
    const fn = dir==='left'?moveLeft:dir==='right'?moveRight:dir==='up'?moveUp:moveDown;
    const {next,moved,addScore} = fn(board);
    if(!moved) return;
    const withTile = addTile(next);
    setBoard(withTile);
    const s = score + addScore;
    setScore(s);
    if(s>best){ setBest(s); localStorage.setItem(LOCAL_BEST,String(s)); }
  };

  const onKey = useCallback((e)=>{
    const k=e.key.toLowerCase();
    if(['arrowleft','a'].includes(k)){ e.preventDefault(); applyMove('left'); }
    else if(['arrowright','d'].includes(k)){ e.preventDefault(); applyMove('right'); }
    else if(['arrowup','w'].includes(k)){ e.preventDefault(); applyMove('up'); }
    else if(['arrowdown','s'].includes(k)){ e.preventDefault(); applyMove('down'); }
  },[board,score,best,status]);

  useEffect(()=>{ window.addEventListener('keydown', onKey); return ()=>window.removeEventListener('keydown', onKey); },[onKey]);

  useEffect(()=>{
    if(!won && maxTile>=2048){ setWon(true); setWinOpen(true); }
    if(status!=='Thua' && !hasMoves(board)){ setStatus('Thua'); setLoseOpen(true); }
  },[board,maxTile,status,won]);

  const statusText = status==='Thua' ? 'Thua' : (won ? 'Đã đạt 2048 (tiếp tục chơi)' : 'Đang chơi');
  const statusColor = status==='Thua' ? 'red' : (won ? 'gold' : 'green');

  return (
    <>
      <Row gutter={[16,16]}>
        <Col xs={24} md={14} lg={12}>
          <Card bordered={false}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:8 }}>
              <Space wrap>
                <Button className="g-btn g-btn--primary" type="primary" onClick={reset}>Chơi mới</Button>
                <Tag color={statusColor}>{statusText}</Tag>
              </Space>
              <Space size={16}>
                <Statistic title="Điểm" value={score} />
                <Statistic title="Kỷ lục" value={best} />
              </Space>
            </div>

            {/* Board 2048 - dùng class để nhận CSS đẹp */}
            <div className="board2048">
              {board.map((row,r)=>
                row.map((val,c)=>(
                  <div key={`${r}-${c}`} className="cell2048" data-val={val}>
                    {val !== 0 ? val : ''}
                  </div>
                ))
              )}
            </div>

            <div style={{ marginTop:14 }}>
              <Title level={5}>Phím điều khiển</Title>
              <div className="keycaps">
                <span className="key">↑</span><span className="key">↓</span>
                <span className="key">←</span><span className="key">→</span>
                <span style={{ width: 8 }} />
                <span className="key key--light">W</span>
                <span className="key key--light">A</span>
                <span className="key key--light">S</span>
                <span className="key key--light">D</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={10} lg={12}>
          <Card bordered={false} className="rules-card" title="Luật nhanh">
            <ul style={{ marginLeft: 18 }}>
              <li>Gộp các ô số cùng giá trị khi trượt theo 4 hướng.</li>
              <li>Mỗi lượt sau khi trượt sẽ xuất hiện ô mới (2 hoặc 4).</li>
              <li>Đạt ô <b>2048</b> sẽ hiện chúc mừng, nhưng bạn vẫn có thể chơi tiếp để đạt điểm cao hơn.</li>
            </ul>
          </Card>
        </Col>
      </Row>

      {/* Modals */}
      <Modal
        open={winOpen}
        onCancel={()=>setWinOpen(false)}
        footer={[
          <Button key="ok" type="primary" onClick={()=>setWinOpen(false)}>Tiếp tục chơi</Button>,
          <Button key="again" onClick={reset}>Chơi mới</Button>,
        ]}
      >
        <Title level={3} style={{ textAlign:'center' }}>YOU WIN!</Title>
        <Space style={{ width:'100%', justifyContent:'center' }}>
          <Statistic title="Điểm hiện tại" value={score} />
          <Statistic title="Kỷ lục" value={best} />
        </Space>
        <p style={{ marginTop:12, textAlign:'center' }}>Bạn có thể tiếp tục chơi để nâng điểm và kỷ lục.</p>
      </Modal>

      <Modal
        open={loseOpen}
        onCancel={()=>setLoseOpen(false)}
        footer={[
          <Button key="again" type="primary" onClick={reset}>Chơi lại</Button>,
        ]}
      >
        <Title level={3} style={{ textAlign:'center' }}>Hết nước đi!</Title>
        <Space style={{ width:'100%', justifyContent:'center' }}>
          <Statistic title="Điểm" value={score} />
          <Statistic title="Kỷ lục" value={best} />
        </Space>
      </Modal>
    </>
  );
}
