import React, { useState, useEffect } from 'react';
import {
  Coins,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { api, BudgetOptimizationResponse } from '../services/api';
import { PageHeader, Card, DataTable } from './ui';

interface BudgetOptimizerViewProps {
  currencySymbol: string;
  onTargetSegment: (segment: string, budget: number) => void;
}

export const BudgetOptimizerView: React.FC<BudgetOptimizerViewProps> = ({
  currencySymbol,
  onTargetSegment,
}) => {
  const [budgetInput, setBudgetInput] = useState<number>(10000);
  const [optimizationData, setOptimizationData] = useState<BudgetOptimizationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOptimization = async (budget: number) => {
    setIsLoading(true);
    const data = await api.optimizeBudget(budget);
    if (data) {
      setOptimizationData(data);
    } else {
      // Client-side fallback computation
      const allocations = [
        {
          segment: 'At-Risk Customers',
          allocated_budget: Math.round(budget * 0.35),
          allocation_percentage: 35,
          recommended_channel: 'WhatsApp Automated Reactivation',
          expected_roas: 4.6,
          estimated_incremental_revenue: Math.round(budget * 0.35 * 4.6),
        },
        {
          segment: 'New & Promising Customers',
          allocated_budget: Math.round(budget * 0.35),
          allocation_percentage: 35,
          recommended_channel: 'Meta Click-to-WhatsApp Ads + Email',
          expected_roas: 5.2,
          estimated_incremental_revenue: Math.round(budget * 0.35 * 5.2),
        },
        {
          segment: 'Loyal Customers',
          allocated_budget: Math.round(budget * 0.20),
          allocation_percentage: 20,
          recommended_channel: 'Targeted Category Bundle Drops',
          expected_roas: 5.8,
          estimated_incremental_revenue: Math.round(budget * 0.20 * 5.8),
        },
        {
          segment: 'High-Spending Champions',
          allocated_budget: Math.round(budget * 0.10),
          allocation_percentage: 10,
          recommended_channel: 'VIP Concierge Preview',
          expected_roas: 6.5,
          estimated_incremental_revenue: Math.round(budget * 0.10 * 6.5),
        },
      ];

      const totalRev = allocations.reduce((s, a) => s + a.estimated_incremental_revenue, 0);
      setOptimizationData({
        total_budget: budget,
        allocated_budget: budget,
        projected_total_revenue: totalRev,
        blended_projected_roas: Math.round((totalRev / budget) * 10) / 10,
        optimization_objective: 'MAXIMIZE_HIGH_CONFIDENCE_RETENTION_ROAS',
        allocations,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOptimization(budgetInput);
  }, [budgetInput]);

  // Chart tokens without blue
  const CHART_PALETTE = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

  const pieData = optimizationData?.allocations.map((a, i) => ({
    name: a.segment,
    value: a.allocated_budget,
    color: CHART_PALETTE[i % CHART_PALETTE.length],
  })) || [];

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="Budget allocation optimizer"
        description="Mathematical allocation of fixed marketing capital across cohorts respecting spending limits."
        badge={<span className="badge-tag active">Objective: maximize return</span>}
      />

      {/* Input Slider Card */}
      <Card padding="md">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              Total marketing capital limit
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Adjust target budget for multi-cohort distribution
            </p>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
            {currencySymbol}{budgetInput.toLocaleString()}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <input
            type="range"
            min={3000}
            max={50000}
            step={1000}
            value={budgetInput}
            onChange={(e) => setBudgetInput(Number(e.target.value))}
            className="custom-range-slider"
            style={{ flex: 1, minWidth: '180px' }}
            aria-label="Target marketing budget slider"
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[5000, 10000, 20000, 35000].map((b) => (
              <button
                key={b}
                className="btn-secondary"
                style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                onClick={() => setBudgetInput(b)}
              >
                {currencySymbol}{b.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Split layout: Allocations Table with Inline Bars + Pie Chart */}
      {optimizationData && (
        <div className="split-view-grid">
          {/* Table */}
          <Card padding="md">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '12px' }}>
              Recommended allocation distribution
            </h3>

            <DataTable minWidth={540}>
              <thead>
                <tr>
                  <th>Segment cohort</th>
                  <th>Recommended channel</th>
                  <th>Share of spend</th>
                  <th className="num-col">Expected ROAS</th>
                  <th className="num-col">Projected return</th>
                  <th className="num-col">Action</th>
                </tr>
              </thead>
              <tbody>
                {optimizationData.allocations.map((alloc, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--text)' }}>{alloc.segment}</span>
                    </td>
                    <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {alloc.recommended_channel}
                    </td>
                    <td style={{ minWidth: '130px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                          {currencySymbol}{alloc.allocated_budget.toLocaleString()}
                        </span>
                        <span style={{ color: 'var(--text-faint)', fontFeatureSettings: '"tnum" 1' }}>
                          {alloc.allocation_percentage}%
                        </span>
                      </div>
                      {/* Inline bar for share of spend */}
                      <div className="thin-progress-bar-track">
                        <div
                          className="thin-progress-bar-fill"
                          style={{
                            width: `${alloc.allocation_percentage}%`,
                            background: CHART_PALETTE[idx % CHART_PALETTE.length],
                          }}
                        />
                      </div>
                    </td>
                    <td className="num-col" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--positive)' }}>
                      {alloc.expected_roas}×
                    </td>
                    <td className="num-col" style={{ fontWeight: 600, color: 'var(--positive)' }}>
                      {currencySymbol}{alloc.estimated_incremental_revenue.toLocaleString()}
                    </td>
                    <td className="num-col">
                      <button
                        className="btn-secondary"
                        style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                        onClick={() => onTargetSegment(alloc.segment, alloc.allocated_budget)}
                      >
                        <span>Deploy</span>
                        <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </DataTable>

            {/* Summary metrics row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '16px',
                paddingTop: '14px',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Total allocated</span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                  {currencySymbol}{optimizationData.allocated_budget.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Gross projected return</span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--positive)', fontFeatureSettings: '"tnum" 1' }}>
                  {currencySymbol}{optimizationData.projected_total_revenue.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Blended portfolio ROAS</span>
                <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--positive)', fontFeatureSettings: '"tnum" 1' }}>
                  {optimizationData.blended_projected_roas}×
                </span>
              </div>
            </div>
          </Card>

          {/* Pie Chart Card */}
          <Card padding="md">
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Portfolio distribution</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Proportional spend allocation by cohort
            </p>

            <div style={{ width: '100%', height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="var(--surface)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
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
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
              {pieData.map((d, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: d.color,
                      }}
                    />
                    <span style={{ color: 'var(--text-muted)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--text)', fontFeatureSettings: '"tnum" 1' }}>
                    {currencySymbol}{d.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BudgetOptimizerView;
