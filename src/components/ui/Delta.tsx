import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export interface DeltaProps {
  value: number | string;
  suffix?: string;
  comparisonText?: string;
  higherIsBetter?: boolean;
  className?: string;
}

export const Delta: React.FC<DeltaProps> = ({
  value,
  suffix = '%',
  comparisonText,
  higherIsBetter = true,
  className = '',
}) => {
  let num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  if (isNaN(num)) num = 0;

  const isZero = Math.abs(num) < 0.001;
  const isPositive = num > 0;
  const isFavourable = isPositive ? higherIsBetter : !higherIsBetter;

  const statusClass = isZero ? 'neutral' : isFavourable ? 'positive' : 'negative';
  const formattedVal = Math.abs(num).toFixed(1);

  return (
    <span
      className={`delta-val ${statusClass} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        fontWeight: 500,
        fontFeatureSettings: '"tnum" 1',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center' }} aria-hidden="true">
        {isZero ? (
          <Minus size={12} strokeWidth={2.2} />
        ) : isPositive ? (
          <ArrowUp size={12} strokeWidth={2.2} />
        ) : (
          <ArrowDown size={12} strokeWidth={2.2} />
        )}
      </span>
      <span>
        {formattedVal}
        {suffix}
      </span>
      {comparisonText && (
        <span style={{ color: 'var(--text-faint)', marginLeft: '2px', fontWeight: 400 }}>
          {comparisonText}
        </span>
      )}
    </span>
  );
};

export default Delta;
