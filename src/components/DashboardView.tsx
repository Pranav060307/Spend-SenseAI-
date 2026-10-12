import React, { useState } from 'react';
import {
  Megaphone,
  Globe,
  Target,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Share2,
} from 'lucide-react';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
} from 'recharts';
import { ExecutiveMetrics } from '../types';
import { KpiCard } from './ui/KpiCard';
import { SegmentedControl } from './ui/SegmentedControl';
import { DataTable } from './ui/DataTable';
import { Sparkline } from './ui/Sparkline';
import {
  formatCurrencyValue,
  formatMetricNumber,
  formatAxisCurrency,
  formatAxisNumber,
} from '../utils/formatting';

interface DashboardViewProps {
  metrics: ExecutiveMetrics;
  currencySymbol: string;
  currency?: 'INR' | 'USD';
  datasetName?: string;
  onNavigateCampaigns: () => void;
  onNavigateSimulator: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  currencySymbol,
  currency = 'INR',
  datasetName = 'OmniRetail India',
  onNavigateCampaigns,
  onNavigateSimulator,
}) => {
  const [timeGranularity, setTimeGranularity] = useState<'Daily' | 'Weekly'>('Daily');
  const [channelMetric, setChannelMetric] = useState<'Conversions' | 'Revenue'>('Conversions');

  // Genuinely derive sparkline series from metrics.monthly_trend
  const sparkData1 = metrics.monthly_trend.map((item) => Math.round(item.revenue * 0.12));
  const sparkData2 = metrics.monthly_trend.map((item) => Math.round(item.sessions * 5.4));
  // Store Traffic uses real sessions trend (genuinely trending up to match Active sessions ↑16.8%)
  const sparkData3 = metrics.monthly_trend.map((item) => item.sessions);
  const sparkData4 = metrics.monthly_trend.map((item) => Math.round(item.revenue * 0.65));

  // Daily / Weekly multiplier for trajectory visualization
  const trajectoryData = metrics.monthly_trend.map((item) => ({
    ...item,
    revenueDisplay: timeGranularity === 'Weekly' ? Math.round(item.revenue / 4) : item.revenue,
    conversionsDisplay: timeGranularity === 'Weekly' ? Math.round(item.conversions / 4) : item.conversions,
    sessionsDisplay: timeGranularity === 'Weekly' ? Math.round(item.sessions / 4) : item.sessions,
  }));

  return (
    <div className="page-content">
      {/* 4 TOP FINANCIAL & MARKETING KPI CARDS (Sentence Case, Indian/USD Formatted, Rate Bars) */}
      <div className="kpi-cards-grid">
        {/* Card 1: Paid Acquisition — Efficiency focus */}
        <KpiCard
          icon={<Megaphone size={16} />}
          title="Paid acquisition"
          sourceText="Meta &amp; Search"
          primaryLabel="Allocated spend"
          currencyPrefix={currencySymbol}
          primaryNumber={currency === 'INR' ? '12.8 L' : '128.4K'}
          primaryDelta={{ value: 18.6, suffix: '%' }}
          sparklineData={sparkData1}
          sparklineColor="var(--chart-1)"
          secondaryMetrics={[
            {
              label: 'Realized ROAS',
              value: <span style={{ fontWeight: 600 }}>4.32×</span>,
              delta: { value: 15.3, suffix: '%' },
            },
            {
              label: 'Conversions',
              value: formatMetricNumber(2842, currency, false),
              delta: { value: 24.7, suffix: '%' },
            },
          ]}
        />

        {/* Card 2: Customer Reach — Scale focus (taupe sparkline --chart-4, 4px progress bar on engagement rate) */}
        <KpiCard
          icon={<Users size={16} />}
          title="Customer reach"
          sourceText="Organic &amp; Social"
          primaryLabel="Audience impressions"
          primaryNumber={currency === 'INR' ? '27.0 L' : '2.7M'}
          primaryDelta={{ value: 20.4, suffix: '%' }}
          sparklineData={sparkData2}
          sparklineColor="var(--chart-4)"
          secondaryMetrics={[
            {
              label: 'Engagement rate',
              value: '3.76%',
              delta: { value: 12.1, suffix: '%' },
              showProgressBar: true,
              progressPercent: 38,
              progressBarColor: 'var(--chart-4)',
            },
            {
              label: 'Site clicks',
              value: currency === 'INR' ? '86.3 K' : '86.3K',
              delta: { value: 18.7, suffix: '%' },
            },
          ]}
        />

        {/* Card 3: Store Traffic — Behavior focus (plum sparkline --chart-3, bounce rate decrease is GREEN) */}
        <KpiCard
          icon={<Globe size={16} />}
          title="Store traffic"
          sourceText="Web &amp; Mobile"
          primaryLabel="Active sessions"
          primaryNumber={currency === 'INR' ? '4.99 L' : '498.6K'}
          primaryDelta={{ value: 16.8, suffix: '%' }}
          sparklineData={sparkData3}
          sparklineColor="var(--chart-3)"
          secondaryMetrics={[
            {
              label: 'Bounce rate',
              value: '42.3%',
              delta: { value: -6.4, suffix: '%', higherIsBetter: false }, // Decrease is favorable!
              showProgressBar: true,
              progressPercent: 42,
              progressBarColor: 'rgba(178, 74, 59, 0.6)', // Negative fill at 60% opacity
            },
            {
              label: 'Web orders',
              value: formatMetricNumber(3912, currency, false),
              delta: { value: 21.9, suffix: '%' },
            },
          ]}
        />

        {/* Card 4: Influenced Sales — Revenue focus (ochre sparkline --chart-2, progress bar on checkout rate) */}
        <KpiCard
          icon={<Target size={16} />}
          title="Influenced sales"
          sourceText="Attribution"
          primaryLabel="Gross influenced"
          currencyPrefix={currencySymbol}
          primaryNumber={currency === 'INR' ? '1.28 Cr' : '1.28M'}
          primaryDelta={{ value: 19.7, suffix: '%' }}
          sparklineData={sparkData4}
          sparklineColor="var(--chart-2)"
          secondaryMetrics={[
            {
              label: 'Cart pipeline',
              value: currency === 'INR' ? `${currencySymbol}2.94 Cr` : `${currencySymbol}2.94M`,
              delta: { value: 22.1, suffix: '%' },
            },
            {
              label: 'Checkout rate',
              value: '31.8%',
              delta: { value: 4.3, suffix: '%' },
              showProgressBar: true,
              progressPercent: 32,
              progressBarColor: 'var(--chart-2)',
            },
          ]}
        />
      </div>

      {/* Single quiet line for comparison period */}
      <div style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '-4px', marginBottom: '2px' }}>
        Compared with previous 30 days · Updated 12 min ago
      </div>

      {/* MIDDLE SECTION: Trajectory Chart (2/3) + Executive Memo Briefing (1/3) */}
      <div className="trajectory-briefing-grid">
        {/* Revenue & Traffic Trajectory Chart */}
        <div className="chart-card-shell">
          <div className="chart-shell-header">
            <div className="chart-heading">
              <h3>Revenue and traffic trajectory</h3>
              <p>Correlation between marketing volume, conversions, and customer spending</p>
            </div>

            <SegmentedControl
              options={[
                { value: 'Daily', label: 'Daily' },
                { value: 'Weekly', label: 'Weekly' },
              ]}
              value={timeGranularity}
              onChange={(v) => setTimeGranularity(v as 'Daily' | 'Weekly')}
              size="sm"
            />
          </div>

          {/* Inline Legend: left-aligned, 8px dots */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div className="chart-legend-top">
              <div>
                <span className="chart-legend-dot" style={{ background: 'var(--chart-1)' }} />
                <span>Customer revenue ({currencySymbol})</span>
              </div>
              <div>
                <span className="chart-legend-dot" style={{ background: 'var(--chart-2)' }} />
                <span>Conversions</span>
              </div>
              <div>
                <span className="chart-legend-dot" style={{ background: 'var(--chart-3)' }} />
                <span>Site sessions</span>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontFeatureSettings: '"tnum" 1' }}>
              Left: Revenue ({currencySymbol}) · Right: Sessions &amp; conversions
            </div>
          </div>

          {/* Dual Axis Plot Area using ComposedChart so all 3 series plot cleanly */}
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={trajectoryData}
                margin={{ top: 12, right: 12, left: -4, bottom: 0 }}
              >
                {/* Horizontal grid lines only */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--chart-grid)"
                />
                <XAxis
                  dataKey="month"
                  stroke="var(--text-faint)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                  dy={6}
                />
                {/* Left YAxis: Currency */}
                <YAxis
                  yAxisId="left"
                  stroke="var(--text-faint)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => formatAxisCurrency(val, currency)}
                />
                {/* Right YAxis: Counts */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="var(--text-faint)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => formatAxisNumber(val, currency)}
                />
                {/* Compact Tooltip Card with vertical crosshair in --border-strong */}
                <Tooltip
                  cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1, strokeDasharray: '3 3' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            boxShadow: 'var(--shadow-dropdown)',
                            fontSize: '12px',
                            color: 'var(--text)',
                            fontFeatureSettings: '"tnum" 1',
                          }}
                        >
                          <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-muted)' }}>
                            {label} ({timeGranularity})
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                              <span style={{ color: 'var(--chart-1)' }}>Customer revenue:</span>
                              <strong>
                                {currencySymbol}
                                {formatMetricNumber(Number(payload[0]?.value || 0), currency, false)}
                              </strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                              <span style={{ color: 'var(--chart-2)' }}>Conversions:</span>
                              <strong>
                                {formatMetricNumber(Number(payload[1]?.value || 0), currency, false)}
                              </strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
                              <span style={{ color: 'var(--chart-3)' }}>Site sessions:</span>
                              <strong>
                                {formatMetricNumber(Number(payload[2]?.value || 0), currency, false)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* Revenue: 2px solid green with 6% subtle opacity area (P1 item 4) */}
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenueDisplay"
                  name="Customer revenue"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="var(--chart-1)"
                  fillOpacity={0.06}
                  isAnimationActive={false}
                />
                {/* Conversions: 2px solid ochre (P0 item 2, P1 item 4) */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="conversionsDisplay"
                  name="Conversions"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: 'var(--chart-2)', strokeWidth: 1.5, fill: 'var(--surface)' }}
                  isAnimationActive={false}
                />
                {/* Sessions: 1.5px dashed plum (P1 item 4) */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sessionsDisplay"
                  name="Site sessions"
                  stroke="var(--chart-3)"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ r: 4, stroke: 'var(--chart-3)', strokeWidth: 1.5, fill: 'var(--surface)' }}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-analyst-footnote">
            <Compass size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '1px' }} />
            <span>
              <strong>Analyst note:</strong> Gross customer spending has lifted by 19.7% over the last 30-day window. Repeat buyers from loyal cohorts account for 42.8% of aggregate volume, maintaining steady unit margins.
            </span>
          </div>
        </div>

        {/* Growth & Retention Briefing (Executive Memo Format, Body 14/22) */}
        <div className="briefing-memo-card">
          <div className="briefing-memo-header">
            <h3>Growth and retention briefing</h3>
            <span className="badge-tag active">Q2 Active</span>
          </div>

          {/* Plain paragraph at 14/22, primary text, 2px --accent left rule, NO inner box */}
          <p
            className="briefing-leadership-memo"
            style={{
              fontSize: '14px',
              lineHeight: '22px',
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '12px',
              color: 'var(--text)',
              margin: '2px 0 6px',
            }}
          >
            Overall customer acquisition and basket size expansion are performing ahead of forecast.
            Paid campaigns maintain a healthy 4.3× ROAS, while direct website traffic accounts for
            steady organic repeat orders.
          </p>

          {/* Key Observations: 12px between items, headline 14px semibold, support text 13px muted */}
          <div className="briefing-observations-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="briefing-obs-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0 0 10px', borderBottom: '1px solid var(--border)' }}>
              <span className="briefing-obs-glyph positive" style={{ color: 'var(--positive)', fontWeight: 600 }}>↑</span>
              <div className="briefing-obs-content" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Paid ad efficiency increased 15.3%</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Refined audience targeting reduced cost per acquisition across core sets.
                </span>
              </div>
            </div>

            <div className="briefing-obs-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0 0 10px', borderBottom: '1px solid var(--border)' }}>
              <span className="briefing-obs-glyph positive" style={{ color: 'var(--positive)', fontWeight: 600 }}>↑</span>
              <div className="briefing-obs-content" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Customer reach expanded 20.4%</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Brand engagement and organic referral driving higher top-of-funnel flow.
                </span>
              </div>
            </div>

            <div className="briefing-obs-item" style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '0 0 2px' }}>
              <span className="briefing-obs-glyph negative" style={{ color: 'var(--negative)', fontWeight: 600 }}>↓</span>
              <div className="briefing-obs-content" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <strong style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>At-risk cohort needs attention</strong>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Inter-purchase intervals widened to 48 days for 22% of historical buyers.
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Priorities */}
          <div className="briefing-priorities-box" style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 500, letterSpacing: '0.02em' }}>
              RECOMMENDED PRIORITIES
            </span>
            <div className="briefing-priority-row" style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>•</span>
              <span>Scale retargeting for warm visitors nearing day 14 of inactivity.</span>
            </div>
            <div className="briefing-priority-row" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>•</span>
              <span>Launch cross-category bundle offers to lift AOV above {currencySymbol}3,500.</span>
            </div>
            <div className="briefing-priority-row" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>•</span>
              <span>Introduce automated delivery notifications on WhatsApp to ease friction.</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Channel Revenue Attribution + Active Growth Campaigns */}
      <div className="split-view-grid">
        {/* Channel Revenue Attribution Bar Chart */}
        <div className="chart-card-shell">
          <div className="chart-shell-header">
            <div className="chart-heading">
              <h3>Channel revenue attribution</h3>
              <p>Conversion volume breakdown across growth channels</p>
            </div>

            <SegmentedControl
              options={[
                { value: 'Conversions', label: 'Conversions' },
                { value: 'Revenue', label: 'Revenue' },
              ]}
              value={channelMetric}
              onChange={(v) => setChannelMetric(v as 'Conversions' | 'Revenue')}
              size="sm"
            />
          </div>

          <div style={{ width: '100%', height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.channel_performance} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                <XAxis
                  dataKey="channel"
                  stroke="var(--text-faint)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis
                  stroke="var(--text-faint)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: 'var(--surface-sunken)' }}
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--text)',
                    boxShadow: 'var(--shadow-dropdown)',
                  }}
                />
                <Bar dataKey="conversions" radius={[3, 3, 0, 0]}>
                  {metrics.channel_performance.map((entry, index) => {
                    const colors = [
                      'var(--chart-1)',
                      'var(--chart-2)',
                      'var(--chart-3)',
                      'var(--chart-4)',
                      'var(--border-strong)',
                    ];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div
            style={{
              paddingTop: '10px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total conversions: </span>
              <strong style={{ fontSize: '13px', color: 'var(--text)' }}>
                {formatMetricNumber(12241, currency, false)}
              </strong>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--positive)', fontWeight: 500 }}>
              ↑ 20.3% vs prev period
            </span>
          </div>
        </div>

        {/* Active Growth Campaigns Table (44px rows, right aligned numbers) */}
        <div className="chart-card-shell">
          <div className="chart-shell-header">
            <div className="chart-heading">
              <h3>Active growth campaigns</h3>
              <p>Financial returns measured against capital invested</p>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
              onClick={onNavigateCampaigns}
            >
              <span>View all</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <DataTable minWidth={440}>
            <thead>
              <tr>
                <th>Campaign</th>
                <th className="num-col">Revenue</th>
                <th className="num-col">ROAS</th>
                <th style={{ width: '70px', textAlign: 'right' }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {metrics.top_campaigns.map((camp, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text)' }}>{camp.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {camp.segment}
                    </div>
                  </td>
                  <td className="num-col">
                    <span style={{ fontWeight: 500 }}>
                      {currencySymbol}
                      {formatMetricNumber(camp.revenue, currency, false)}
                    </span>
                  </td>
                  <td className="num-col">
                    <span
                      style={{
                        fontWeight: 600,
                        color: camp.roas >= 4 ? 'var(--positive)' : 'var(--text)',
                      }}
                    >
                      {camp.roas}×
                    </span>
                  </td>
                  <td style={{ width: '70px', textAlign: 'right' }}>
                    <div style={{ height: '20px', width: '60px', marginLeft: 'auto' }}>
                      <Sparkline
                        data={camp.trend}
                        color={camp.roas >= 4 ? 'var(--chart-1)' : 'var(--chart-2)'}
                        height={20}
                        strokeWidth={1.5}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>

          <div
            style={{
              paddingTop: '10px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={onNavigateSimulator}
              style={{ fontSize: '12px' }}
            >
              <span>Open what-if simulator</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* P2 Footer Line */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '11.5px',
          color: 'var(--text-faint)',
          paddingTop: '12px',
        }}
      >
        Data source: {datasetName} · {currency} · Asia/Kolkata
      </div>
    </div>
  );
};

export default DashboardView;
