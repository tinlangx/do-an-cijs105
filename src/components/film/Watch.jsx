import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Button, Space, Card, Typography, Tag } from 'antd';
import { FILMS } from './data.js';

const { Title } = Typography;

export default function Watch() {
  const { category, slug, ep } = useParams();
  const list = FILMS[category] || [];
  const film = list.find(f => f.slug === slug);
  if (!film) return <Navigate to="/film" replace />;

  const epNum = Number(ep) || 1;
  const total = film.episodes.length;
  const prev = Math.max(1, epNum - 1);
  const next = Math.min(total, epNum + 1);

  // link của tập hiện tại
  const currentEp = film.episodes.find(e => e.ep === epNum) || film.episodes[0];
  const videoUrl = currentEp?.url || '';

  return (
    <div className="film-watch">
      <div className="film-player-wrap">
        <div className="film-player">
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?autoplay=0`}
            title={`${film.title} - Tập ${epNum}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <Space className="film-player-actions">
          <Button><Link to={`/film/${film.category}/${film.slug}/watch/${prev}`}>⟨ Tập trước</Link></Button>
          <Button><Link to={`/film/${film.category}/${film.slug}/watch/${next}`}>Tập tiếp theo ⟩</Link></Button>
          {/* <Button>🖵 Mở rộng</Button> */}
          {/* <Button>🌙 Tắt đèn</Button> */}
        </Space>
      </div>

      <Card className="film-watch-meta">
        <Title className="title" level={4}>{film.title} — Tập {epNum} Vietsub</Title>
        <Tag className="tag-hd">FULL HD</Tag>
        <div className="film-episodes-grid">
          {film.episodes.map(e => (
            <Link
              key={e.ep}
              to={`/film/${film.category}/${film.slug}/watch/${e.ep}`}
              className={`film-ep-btn ${e.ep === epNum ? 'is-active' : ''}`}
            >
              {e.ep}
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function getYouTubeId(url) {
  const rules = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const r of rules) {
    const m = url?.match(r);
    if (m) return m[1];
  }
  return url || '';
}
