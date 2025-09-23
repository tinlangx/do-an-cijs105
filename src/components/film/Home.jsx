import React from 'react';
import { Card, Typography, Row, Col, Tag, Button, Empty } from 'antd';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, FILMS } from './data.js';

const { Title } = Typography;

// Card tái dùng
function FilmCard({ f, onWatch }) {
  return (
    <Card
      hoverable
      className="film-card"
      cover={
        <div
          className="film-card-cover"
          onClick={() => onWatch(f)}
          role="button"
        >
          <img src={f.poster} alt={f.title} loading="lazy" />
          <div className="film-card-title">
            <span className="film-card-name">{f.title}</span>
            <span className="film-card-duration">20 phút</span>
          </div>
        </div>
      }
      actions={[
        <Button type="primary" size="small" onClick={() => onWatch(f)}>
          ▶ Xem ngay
        </Button>,
        <Link to={`/film/${f.category}/${f.slug}`}>Chi tiết</Link>,
      ]}
    />
  );
}

export default function Home() {
  const { category } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const q =
    new URLSearchParams(location.search).get('q')?.trim().toLowerCase() || '';

  const allFilms = Object.values(FILMS).flat();
  const goWatch = (f) => navigate(`/film/${f.category}/${f.slug}/watch/1`);

  // ------ CHẾ ĐỘ TÌM KIẾM ------
  if (q) {
    const results = allFilms.filter((f) =>
      f.title.toLowerCase().includes(q)
    );

    return (
      // key để remount khi chỉ đổi ?q=...
      <div className="film-home" key={location.search}>
        <section className="film-section">
          <div className="film-section-head">
            <Title level={4} className="film-section-title">
              Kết quả cho “{q}”
            </Title>
            <Tag color="blue">{results.length} phim</Tag>
          </div>

          {results.length === 0 ? (
            <Empty description="Không tìm thấy phim phù hợp" />
          ) : (
            <Row gutter={[16, 16]} justify="start" wrap align="top">
              {results.map((f) => (
                <Col
                  key={f.id}
                  xs={24}
                  sm={12}
                  md={8}
                  lg={6}
                  xl={4}
                  className="film-col"
                >
                  <FilmCard f={f} onWatch={goWatch} />
                </Col>
              ))}
            </Row>
          )}
        </section>
      </div>
    );
  }

  // ------ TRANG CHỦ THEO DANH MỤC ------
  const cats = category
    ? CATEGORIES.filter((c) => c.key === category)
    : CATEGORIES;

  return (
    <div className="film-home">
      {cats.map((cat) => (
        <section key={cat.key} className="film-section">
          <div className="film-section-head">
            <Title level={4} className="film-section-title">{cat.name}</Title>
            <Tag color="purple">New</Tag>
          </div>

          <Row gutter={[16, 16]}>
            {(FILMS[cat.key] || []).map((f) => (
              <Col xs={12} sm={8} md={6} lg={6} xl={4} key={f.id}>
                <FilmCard f={f} onWatch={goWatch} />
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </div>
  );
}
