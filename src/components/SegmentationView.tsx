import React, { useState } from 'react';
import {
  Search,
  Send,
  Clock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { CustomerRFM, SegmentSummary, RFMSegmentType } from '../types';
import { PageHeader } from './ui/PageHeader';
import { DataTable } from './ui/DataTable';

interface SegmentationViewProps {
  customers: CustomerRFM[];
  segments: SegmentSummary[];
  currencySymbol: string;
  onTargetSegment: (segment: RFMSegmentType) => void;
}

export const SegmentationView: React.FC<SegmentationViewProps> = ({
  customers,
  segments,
  currencySymbol,
  onTargetSegment,
}) => {
  const [selectedSegment, setSelectedSegment] = useState<RFMSegmentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Filter customers
  const filteredCustomers = customers.filter((cust) => {
    const matchesSegment = selectedSegment === 'ALL' || cust.segment === selectedSegment;
    const matchesRisk = riskFilter === 'ALL' || cust.churn_risk === riskFilter;
    const matchesSearch =
      cust.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.customer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSegment && matchesRisk && matchesSearch;
  });

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="Customer behavioral segmentation (RFM analysis)"
        description="Empirical customer grouping based on recency of visit, purchase frequency, and monetary spend."
        badge={
          <span className="badge-tag">
            <UserCheck size={12} style={{ color: 'var(--accent)' }} />
            <span>5 verified cohorts</span>
          </span>
        }
      />

      {/* 5 Segment Cards Grid */}
      <div className="rfm-matrix-grid">
        {segments.map((seg) => {
          const isSelected = selectedSegment === seg.type;
          return (
            <div
              key={seg.type}
              className={`rfm-segment-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedSegment(selectedSegment === seg.type ? 'ALL' : seg.type)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
                  {seg.type}
                </span>
                <span className="badge-tag" style={{ fontSize: '11px' }}>
                  {seg.customer_count} buyers
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', minHeight: '34px', lineHeight: 1.45 }}>
                {seg.description}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  padding: '8px 0',
                  borderTop: '1px solid var(--border)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 500 }}>Total spend</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
                    {currencySymbol}
                    {seg.total_revenue.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 500 }}>Revenue share</div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--accent)' }}>
                    {seg.revenue_share}%
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text)' }}>Strategy: </strong>
                {seg.recommended_action}
              </div>

              <button
                type="button"
                className="btn-secondary"
                style={{
                  marginTop: 'auto',
                  justifyContent: 'center',
                  fontSize: '12px',
                  height: '30px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTargetSegment(seg.type);
                }}
              >
                <Send size={12} style={{ color: 'var(--accent)' }} />
                <span>Target cohort</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Customers List Card */}
      <div className="chart-card-shell">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
              Customer cohort records ({filteredCustomers.length})
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Individual RFM score breakdowns, inter-purchase velocity, and churn risk tags
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--surface)',
                padding: '0 10px',
                height: '32px',
                borderRadius: 'var(--radius-control)',
                border: '1px solid var(--border)',
              }}
            >
              <Search size={13} style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search name, ID, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text)',
                  fontSize: '12px',
                  width: '160px',
                }}
              />
            </div>

            {/* Churn Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="header-control"
              style={{ height: '32px', fontSize: '12px' }}
            >
              <option value="ALL">All Churn Tiers</option>
              <option value="Critical">Critical Churn Risk</option>
              <option value="High">High Inactivity</option>
              <option value="Medium">Medium Retention</option>
              <option value="Low">Healthy / Active</option>
            </select>

            {selectedSegment !== 'ALL' && (
              <button
                type="button"
                className="btn-secondary"
                style={{ height: '32px', fontSize: '12px' }}
                onClick={() => setSelectedSegment('ALL')}
              >
                Clear Filter
              </button>
            )}
          </div>
        </div>

        <DataTable minWidth={760}>
          <thead>
            <tr>
              <th>Customer profile</th>
              <th>Recency (R)</th>
              <th className="num-col">Orders (F)</th>
              <th className="num-col">Total spend (M)</th>
              <th className="num-col">RFM Index</th>
              <th>Assigned cohort</th>
              <th>Retention health</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.slice(0, 15).map((cust) => {
              const initials = cust.customer_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2);

              const getRiskClass = (risk: string) => {
                if (risk === 'Critical') return 'badge-tag negative';
                if (risk === 'High') return 'badge-tag';
                if (risk === 'Low') return 'badge-tag active';
                return 'badge-tag';
              };

              return (
                <tr key={cust.customer_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="user-avatar" style={{ width: '24px', height: '24px', fontSize: '10px' }}>
                        {initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--text)' }}>{cust.customer_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {cust.customer_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={11} style={{ color: 'var(--text-faint)' }} />
                      <span>{cust.recency_days}d ago</span>
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-faint)' }}>Tier {cust.r_score}/5</div>
                  </td>
                  <td className="num-col">
                    <div style={{ fontWeight: 500 }}>{cust.frequency}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-faint)' }}>Tier {cust.f_score}/5</div>
                  </td>
                  <td className="num-col">
                    <div style={{ fontWeight: 500 }}>
                      {currencySymbol}
                      {cust.monetary.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text-faint)' }}>
                      Avg {currencySymbol}
                      {cust.avg_order_value.toLocaleString()}
                    </div>
                  </td>
                  <td className="num-col">
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
                      {cust.rfm_score.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <span className="badge-tag">{cust.segment}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11.5px',
                        fontWeight: 500,
                        color:
                          cust.churn_risk === 'Critical'
                            ? 'var(--negative)'
                            : cust.churn_risk === 'High'
                            ? 'var(--chart-2)'
                            : cust.churn_risk === 'Low'
                            ? 'var(--positive)'
                            : 'var(--text-muted)',
                      }}
                    >
                      {cust.churn_risk} Risk
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => onTargetSegment(cust.segment)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>Target</span>
                      <ArrowRight size={11} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </DataTable>
      </div>
    </div>
  );
};

export default SegmentationView;
