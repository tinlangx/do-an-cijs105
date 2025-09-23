import React, { useState } from 'react';
import { Card, Segmented, Typography } from 'antd';
import GameBoard from './game/GameBoard';
import Game2048 from './game/Game2048';
import './game/game.css';

const { Title, Paragraph, Text } = Typography;

export default function AppGame() {
  const [tab, setTab] = useState('board'); // 'board' | '2048'

  return (
    <div className="game-wrap">
      {/* Header */}
      <div className="game-header">
        <div className="game-header-left">
          <Title level={2} style={{ margin: 0 }}>Game</Title>
          <Paragraph className="game-sub">
            <Text strong>Game Board</Text> – xếp số về thứ tự <Text code>1 → 15</Text> &nbsp;|&nbsp;
            <Text strong>Game 2048</Text> – gộp số để đạt <Text code>2048</Text>.
          </Paragraph>
        </div>

        <Segmented
          className="game-tabs"
          value={tab}
          onChange={setTab}
          options={[
            { label: 'Game Board', value: 'board' },
            { label: 'Game 2048', value: '2048' },
          ]}
        />
      </div>

      {/* Surface */}
      <Card className="game-surface" bordered={false}>
        {tab === 'board' ? (
          <div className="game-panel">
            <GameBoard />
          </div>
        ) : (
          <div className="game-panel">
            <Game2048 />
          </div>
        )}
      </Card>
    </div>
  );
}
