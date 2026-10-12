import React from 'react';

export interface SparklineProps {
  data: number[] | { v: number }[];
  color?: string;
  height?: number;
  strokeWidth?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  color = 'var(--chart-1)',
  height = 40,
  strokeWidth = 1.5,
}) => {
  const points = data.map((d) => (typeof d === 'number' ? d : d.v));
  if (points.length < 2) return <div style={{ height }} />;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const padding = 5;
  const width = 120;
  const usableHeight = height - padding * 2;

  // Normalized coordinate points
  const coords = points.map((val, idx) => ({
    x: (idx / (points.length - 1)) * (width - padding * 2) + padding,
    y: height - padding - ((val - min) / range) * usableHeight,
  }));

  // Build smooth cubic monotone spline path
  let pathD = `M ${coords[0].x.toFixed(2)} ${coords[0].y.toFixed(2)}`;

  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[Math.max(0, i - 1)];
    const p1 = coords[i];
    const p2 = coords[i + 1];
    const p3 = coords[Math.min(coords.length - 1, i + 2)];

    // Catmull-Rom to Cubic Bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    pathD += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  const lastPoint = coords[coords.length - 1];

  return (
    <div style={{ height, width: '100%' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}
        aria-hidden="true"
      >
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* 3px dot on the last point */}
        <circle
          cx={lastPoint.x.toFixed(2)}
          cy={lastPoint.y.toFixed(2)}
          r={3}
          fill={color}
        />
      </svg>
    </div>
  );
};

export default Sparkline;
