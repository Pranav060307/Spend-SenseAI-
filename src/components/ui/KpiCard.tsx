import React from 'react';
import { Delta } from './Delta';
import { Sparkline } from './Sparkline';

export interface SecondaryMetric {
  label: string;
  value: React.ReactNode;
  delta?: {
    value: number | string;
    higherIsBetter?: boolean;
    suffix?: string;
  };
  showProgressBar?: boolean;
  progressPercent?: number;
  progressBarColor?: string;
}

export interface KpiCardProps {
  icon: React.ReactNode;
  title: string;
  sourceText?: string;
  primaryLabel: string;
  currencyPrefix?: string;
  primaryNumber: string | number;
  primaryDelta: {
    value: number | string;
    higherIsBetter?: boolean;
    suffix?: string;
  };
  comparisonText?: string;
  sparklineData: number[] | { v: number }[];
  sparklineColor?: string;
  secondaryMetrics: [SecondaryMetric, SecondaryMetric];
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  icon,
  title,
  sourceText,
  primaryLabel,
  currencyPrefix,
  primaryNumber,
  primaryDelta,
  comparisonText,
  sparklineData,
  sparklineColor = 'var(--chart-1)',
  secondaryMetrics,
  className = '',
}) => {
  return (
    <div className={`kpi-card-unit ${className}`}>
      {/* Header: [icon] Section title ... Source (top-right, 12px --text-faint, baseline-aligned) */}
      <div className="kpi-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="kpi-title-left" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span className="kpi-line-icon" aria-hidden="true" style={{ display: 'inline-flex', color: 'var(--text-muted)' }}>
            {icon}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{title}</span>
        </div>
        {sourceText && (
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text-faint)',
              whiteSpace: 'nowrap',
              marginLeft: '8px',
            }}
          >
            {sourceText}
          </span>
        )}
      </div>

      {/* Primary metric block */}
      <div className="kpi-metric-block" style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '2px' }}>
        <span className="kpi-metric-label" style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
          {primaryLabel}
        </span>
        <div className="kpi-primary-val-row" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            className="kpi-primary-number"
            style={{
              fontSize: '28px',
              lineHeight: '32px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: 'var(--text)',
              fontFeatureSettings: '"tnum" 1',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {currencyPrefix && (
              <span
                style={{
                  fontSize: '0.8em',
                  color: 'var(--text-muted)',
                  fontWeight: 500,
                  marginRight: '1px',
                }}
              >
                {currencyPrefix}
              </span>
            )}
            {primaryNumber}
          </span>
          <Delta
            value={primaryDelta.value}
            suffix={primaryDelta.suffix || '%'}
            higherIsBetter={primaryDelta.higherIsBetter !== undefined ? primaryDelta.higherIsBetter : true}
          />
        </div>
        {comparisonText && (
          <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>{comparisonText}</span>
        )}
      </div>

      {/* Sparkline (smooth monotone curves, 1.5px stroke, no fill, 3px dot on last point) */}
      <div className="kpi-sparkline-area" style={{ height: '40px', width: '100%', margin: '4px 0' }}>
        <Sparkline data={sparklineData} color={sparklineColor} height={40} strokeWidth={1.5} />
      </div>

      {/* Subtle Divider */}
      <div className="kpi-card-divider" style={{ height: '1px', background: 'var(--border)', width: '100%' }} />

      {/* Secondary metrics row */}
      <div className="kpi-secondary-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {secondaryMetrics.map((sec, idx) => (
          <div key={idx} className="kpi-secondary-cell" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 500 }}>
              {sec.label}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', fontSize: '13.5px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
              <span>{sec.value}</span>
              {sec.delta && (
                <Delta
                  value={sec.delta.value}
                  suffix={sec.delta.suffix || '%'}
                  higherIsBetter={sec.delta.higherIsBetter !== undefined ? sec.delta.higherIsBetter : true}
                />
              )}
            </div>
            {/* 4px height progress bar on rate metrics */}
            {sec.showProgressBar && (
              <div
                style={{
                  height: '4px',
                  background: 'var(--border)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  marginTop: '4px',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: '2px',
                    width: `${Math.min(100, Math.max(0, sec.progressPercent || 0))}%`,
                    background: sec.progressBarColor || 'var(--chart-2)',
                    transition: 'width 200ms ease-out',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KpiCard;
