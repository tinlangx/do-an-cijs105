import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Row, Col, Card, Button, Tag, Typography } from 'antd';
import { FILMS } from './data.js';

const { Title, Paragraph } = Typography;

export default function FilmDetail() {
  const { category, slug } = useParams();
  const list = FILMS[category] || [];
  const film = list.find(f => f.slug === slug);
  if (!film) return <Navigate to="/film" replace />;

  const popular = (FILMS[category] || []).slice(0, 6);

  return (
    <div className="film-detail">
      <Row gutter={24}>
        <Col xs={24} md={8}>
          <Card cover={<img src={film.poster} alt={film.title} />}>
            <Button type="primary" block size="large">
              <Link to={`/film/${film.category}/${film.slug}/watch/1`}>▶ Xem phim</Link>
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Title level={3} style={{color:'white', fontWeight:'600', fontSize:'35px'}}>{film.title}</Title>
          <Paragraph type="secondary">⏱ {film.duration}</Paragraph>
          <div style={{ marginBottom: 8 }}>
            {film.tags.map(t => <Tag key={t}>{t}</Tag>)}
          </div>
          <Paragraph className="film-detail-des">{film.description}</Paragraph>

          <div className="film-episodes">
            <div className="film-episodes-head">
              <Tag>FULL HD</Tag>
            </div>
            <div className="film-episodes-grid">
              {film.episodes.map(e => (
                <Link
                  key={e.ep}
                  to={`/film/${film.category}/${film.slug}/watch/${e.ep}`}
                  className="film-ep-btn"
                >
                  {e.ep}
                </Link>
              ))}
            </div>
          </div>
        </Col>

        {/* <Col xs={24} md={8} className="film-sidebar">
          <Card title="Xem nhiều">
            {popular.map(p => (
              <Link key={p.id} to={`/film/${p.category}/${p.slug}`} className="film-sideitem">
                <img src={p.poster} alt={p.title} />
                <span>{p.title}</span>
              </Link>
            ))}
          </Card>
        </Col> */}
      </Row>
    </div>
  );
}
