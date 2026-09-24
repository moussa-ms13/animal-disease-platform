import React from 'react';

export default function Sparkline({ data = [], color = 'currentColor', label = '', width = 88, height = 24 }) {
  const values = data.length ? data : [0, 0];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const y = height - 3 - ((value - min) / range) * (height - 6);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <span className="sparkline" role="img" aria-label={label}>
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true" focusable="false">
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}
