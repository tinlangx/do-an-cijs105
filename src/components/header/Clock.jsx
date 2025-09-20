import React, { useEffect, useState } from 'react';

const Clock = ({ showSeconds = true }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    second: showSeconds ? '2-digit' : undefined,
    hour12: false
  });

  const date = now.toLocaleDateString('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <div className="header-clock" aria-label="Đồng hồ hệ thống">
      <span className="clock-time">{time}</span>
      <span className="clock-date">{date}</span>
    </div>
  );
};

export default Clock;
