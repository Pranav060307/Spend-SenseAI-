import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Calculator,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { SimulationScenario } from '../types';
import { calculateSimulation } from '../utils/analytics';
import { PageHeader, Card } from './ui';

interface SimulatorViewProps {
  currencySymbol: string;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ currencySymbol }) => {
  // Scenario A: Discount for Loyal Customers
  const [scenA, setScenA] = useState({
    id: 'SCEN-A',
    name: 'Strategy A: Loyalty Rewards for Active Buyers',
    target_segment: 'Loyal Customers' as const,
    budget: 8000,
    target_audience_size: 450,
    assumed_conversion_rate: 6.5,
    assumed_aov: 4200,
    gross_margin_percent: 42,
    discount_cost_percent: 10,
  });

  // Scenario B: Win-Back Offer for Inactive Customers
  const [scenB, setScenB] = useState({
    id: 'SCEN-B',
    name: 'Strategy B: Win-Back Sequence for Lapsed Buyers',
    target_segment: 'Inactive / Churned' as const,
    budget: 8000,
    target_audience_size: 600,
    assumed_conversion_rate: 3.2,
    assumed_aov: 3100,
    gross_margin_percent: 42,
    discount_cost_percent: 15,
  });

  // Calculate live results
  const resultA: SimulationScenario = calculateSimulation(scenA);
  const resultB: SimulationScenario = calculateSimulation(scenB);

  // Comparison data for Recharts
  const comparisonData = [
    {
      metric: 'Projected Revenue',
      'Strategy A (Loyalty)': resultA.projected_revenue,
      'Strategy B (Win-Back)': resultB.projected_revenue,
    },
    {
      metric: 'Total Cost',
      'Strategy A (Loyalty)': resultA.cost_total,
      'Strategy B (Win-Back)': resultB.cost_total,
    },
    {
      metric: 'Net Margin',
      'Strategy A (Loyalty)': resultA.net_profit,
      'Strategy B (Win-Back)': resultB.net_profit,
    },
  ];

  const profitDiff = resultA.net_profit - resultB.net_profit;
  const isAWin = profitDiff > 0;

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="What-if financial modeling"
        description="Compare expected capital allocation, conversion sensitivity, and projected net margins before committing ad spend."
        badge={
          <span className="badge-tag">
            <Calculator size={12} />
            Sensitivity model • Modeled projections
          </span>
        }
      />

      {/* Side-by-side scenarios grid */}
      <div className="simulator-layout">
        {/* Strategy A */}
        <Card className="simulator-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge-tag active">Strategy A</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--positive)', fontFeatureSettings: '"tnum" 1' }}>
              Modeled ROAS: {resultA.projected_roas}×
            </span>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{scenA.name}</h3>

          {/* Interactive Sliders (Inputs on left / top) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Budget */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Allocated spend</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {currencySymbol}{scenA.budget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={30000}
                step={1000}
                value={scenA.budget}
                onChange={(e) => setScenA({ ...scenA, budget: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy A allocated spend"
              />
            </div>

            {/* Target Audience Size */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target audience reach</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {scenA.target_audience_size} profiles
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={1500}
                step={50}
                value={scenA.target_audience_size}
                onChange={(e) => setScenA({ ...scenA, target_audience_size: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy A target audience reach"
              />
            </div>

            {/* Conversion Rate */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Modeled conversion rate</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {scenA.assumed_conversion_rate}%
                </span>
              </div>
              <input
                type="range"
                min={1.0}
                max={15.0}
                step={0.5}
                value={scenA.assumed_conversion_rate}
                onChange={(e) => setScenA({ ...scenA, assumed_conversion_rate: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy A conversion rate"
              />
            </div>

            {/* Discount / Incentive Cost */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Incentive / discount</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {scenA.discount_cost_percent}% off
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={scenA.discount_cost_percent}
                onChange={(e) => setScenA({ ...scenA, discount_cost_percent: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy A discount percentage"
              />
            </div>
          </div>

          {/* Computed Results (Projected outcomes on right / bottom) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              padding: '12px',
              background: 'var(--surface-sunken)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Modeled conversions</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                {resultA.projected_conversions} orders
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Projected revenue</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--positive)', fontFeatureSettings: '"tnum" 1' }}>
                {currencySymbol}{resultA.projected_revenue.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Projected margin</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--positive)', fontFeatureSettings: '"tnum" 1' }}>
                {currencySymbol}{resultA.net_profit.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Breakeven volume</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                {resultA.breakeven_conversions} orders
              </span>
            </div>
          </div>
        </Card>

        {/* Strategy B */}
        <Card className="simulator-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="badge-tag">Strategy B</span>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--positive)', fontFeatureSettings: '"tnum" 1' }}>
              Modeled ROAS: {resultB.projected_roas}×
            </span>
          </div>

          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>{scenB.name}</h3>

          {/* Interactive Sliders */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Budget */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Allocated spend</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {currencySymbol}{scenB.budget.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={2000}
                max={30000}
                step={1000}
                value={scenB.budget}
                onChange={(e) => setScenB({ ...scenB, budget: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy B allocated spend"
              />
            </div>

            {/* Target Audience Size */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Target audience reach</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {scenB.target_audience_size} profiles
                </span>
              </div>
              <input
                type="range"
                min={100}
                max={1500}
                step={50}
                value={scenB.target_audience_size}
                onChange={(e) => setScenB({ ...scenB, target_audience_size: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy B target audience reach"
              />
            </div>

            {/* Conversion Rate */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Modeled conversion rate</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {scenB.assumed_conversion_rate}%
                </span>
              </div>
              <input
                type="range"
                min={1.0}
                max={15.0}
                step={0.5}
                value={scenB.assumed_conversion_rate}
                onChange={(e) => setScenB({ ...scenB, assumed_conversion_rate: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy B conversion rate"
              />
            </div>

            {/* Discount / Incentive Cost */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Incentive / discount</span>
                <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {scenB.discount_cost_percent}% off
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                step={1}
                value={scenB.discount_cost_percent}
                onChange={(e) => setScenB({ ...scenB, discount_cost_percent: Number(e.target.value) })}
                className="custom-range-slider"
                aria-label="Strategy B discount percentage"
              />
            </div>
          </div>

          {/* Computed Results */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              padding: '12px',
              background: 'var(--surface-sunken)',
              borderRadius: '8px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Modeled conversions</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                {resultB.projected_conversions} orders
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Projected revenue</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--chart-2)', fontFeatureSettings: '"tnum" 1' }}>
                {currencySymbol}{resultB.projected_revenue.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Projected margin</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--chart-2)', fontFeatureSettings: '"tnum" 1' }}>
                {currencySymbol}{resultB.net_profit.toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Breakeven volume</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                {resultB.breakeven_conversions} orders
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Side-by-side Comparison Visualizer and Advisor Memo */}
      <div className="split-view-grid">
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                Financial trade-off comparison
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Direct margin projection: Loyalty nurture vs Win-back
              </p>
            </div>
          </div>

          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis
                  dataKey="metric"
                  stroke="var(--text-faint)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  stroke="var(--text-faint)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  tickFormatter={(val) => `${currencySymbol}${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: 'var(--surface-sunken)' }}
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--text)',
                    boxShadow: 'var(--shadow-card)',
                  }}
                  formatter={(val: any) => [`${currencySymbol}${Number(val).toLocaleString()}`, '']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                />
                <Bar
                  dataKey="Strategy A (Loyalty)"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Strategy B (Win-Back)"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Humanized Financial Advisor Executive Memo */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              Advisor evaluation memo
            </h3>
            <span className="badge-tag">Grounded Model</span>
          </div>

          <div
            style={{
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '12px',
              fontSize: '13.5px',
              lineHeight: 1.55,
              color: 'var(--text)',
              marginBottom: '16px',
            }}
          >
            <strong>{isAWin ? 'Strategy A delivers higher immediate net cash flow.' : 'Strategy B unlocks larger long-term cohort recovery.'}</strong>
            <p style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '12.5px' }}>
              Under modeled assumptions, Strategy A yields an additional{' '}
              <strong style={{ color: 'var(--text)' }}>
                {currencySymbol}{Math.abs(profitDiff).toLocaleString()}
              </strong>{' '}
              in net profit because active customer intent converts at a higher baseline (6.5% vs 3.2%).
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '8px 0',
                borderTop: '1px solid var(--border)',
                fontSize: '12.5px',
              }}
            >
              <span style={{ color: 'var(--positive)', fontWeight: 600 }}>↑</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ color: 'var(--text)' }}>Low downside risk (Strategy A)</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                  Requires only {resultA.breakeven_conversions} orders to completely offset campaign outlay.
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '8px 0',
                borderTop: '1px solid var(--border)',
                fontSize: '12.5px',
              }}
            >
              <span style={{ color: 'var(--chart-2)', fontWeight: 600 }}>•</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong style={{ color: 'var(--text)' }}>Cohort preservation (Strategy B)</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                  Win-back sequences recover customers before customer lifetime value decays permanently.
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SimulatorView;
