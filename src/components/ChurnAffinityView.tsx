import React from 'react';
import {
  TrendingDown,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { CustomerRFM, ProductAffinity, RFMSegmentType } from '../types';
import { PageHeader, Card, DataTable } from './ui';

interface ChurnAffinityViewProps {
  customers: CustomerRFM[];
  affinities: ProductAffinity[];
  currencySymbol: string;
  onTargetCustomer: (segment: RFMSegmentType) => void;
}

export const ChurnAffinityView: React.FC<ChurnAffinityViewProps> = ({
  customers,
  affinities,
  currencySymbol,
  onTargetCustomer,
}) => {
  const atRiskList = customers.filter(
    (c) => c.churn_risk === 'Critical' || c.churn_risk === 'High'
  );

  const getRiskBadge = (risk: string) => {
    if (risk === 'Critical') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontWeight: 500,
            color: 'var(--negative)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--negative)' }} />
          Critical
        </span>
      );
    }
    if (risk === 'High') {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            fontWeight: 500,
            color: 'var(--chart-2)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--chart-2)' }} />
          High
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '11.5px',
          fontWeight: 500,
          color: 'var(--text-muted)',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--border-strong)' }} />
        Low
      </span>
    );
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="Predictive churn risk and product bundles"
        description="Rule-based churn interval detector and cross-category market basket bundles."
        badge={<span className="badge-tag">{atRiskList.length} at-risk profiles</span>}
        actions={
          <button
            className="btn-primary"
            onClick={() => onTargetCustomer('At-Risk Spenders')}
          >
            <span>Automate win-back sequence</span>
          </button>
        }
      />

      <div className="split-view-grid">
        {/* Left: Customer Churn Early Warning Table */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingDown size={16} style={{ color: 'var(--text-muted)' }} />
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                  Customer churn early warning
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Inter-purchase interval exceeded historical frequency threshold
                </p>
              </div>
            </div>
          </div>

          <DataTable minWidth={480}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Last active</th>
                <th className="num-col">Past spend</th>
                <th>Risk indicator</th>
                <th>Recommended retention</th>
              </tr>
            </thead>
            <tbody>
              {atRiskList.map((cust) => (
                <tr key={cust.customer_id}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text)' }}>{cust.customer_name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {cust.customer_id}
                    </div>
                  </td>
                  <td>
                    <div>{cust.recency_days} days ago</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {cust.frequency} orders
                    </div>
                  </td>
                  <td className="num-col" style={{ fontWeight: 500, color: 'var(--text)' }}>
                    {currencySymbol}{cust.monetary.toLocaleString()}
                  </td>
                  <td>{getRiskBadge(cust.churn_risk)}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {cust.churn_risk === 'Critical'
                      ? `${currencySymbol}500 reactivation voucher (WhatsApp)`
                      : `15% off next order in ${cust.top_category}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>

        {/* Right: Co-Purchase Bundle Affinity Table */}
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <ShoppingBag size={16} style={{ color: 'var(--text-muted)' }} />
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                Co-purchase bundle affinity
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Frequent itemset patterns derived from transaction baskets
              </p>
            </div>
          </div>

          <DataTable minWidth={480}>
            <thead>
              <tr>
                <th>Bundle combination</th>
                <th className="num-col">Confidence</th>
                <th className="num-col">Bundle price</th>
                <th className="num-col">Savings</th>
                <th className="num-col">Action</th>
              </tr>
            </thead>
            <tbody>
              {affinities.map((aff, i) => (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 500, color: 'var(--text)' }}>{aff.primary_product}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      + {aff.recommended_product}
                    </div>
                  </td>
                  <td className="num-col" style={{ fontSize: '12px', color: 'var(--text)' }}>
                    {aff.confidence_score}%
                    <span style={{ display: 'block', fontSize: '10.5px', color: 'var(--text-faint)' }}>
                      {aff.co_purchase_count} orders
                    </span>
                  </td>
                  <td className="num-col" style={{ fontWeight: 500, color: 'var(--text)' }}>
                    {currencySymbol}{aff.discount_price.toLocaleString()}
                    <span
                      style={{
                        display: 'block',
                        fontSize: '11px',
                        color: 'var(--text-faint)',
                        textDecoration: 'line-through',
                      }}
                    >
                      {currencySymbol}{aff.bundle_price.toLocaleString()}
                    </span>
                  </td>
                  <td className="num-col" style={{ fontWeight: 500, color: 'var(--positive)' }}>
                    {currencySymbol}{aff.savings.toLocaleString()}
                  </td>
                  <td className="num-col">
                    <button
                      className="btn-secondary"
                      style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                      onClick={() => onTargetCustomer('Champions')}
                    >
                      Create promo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </Card>
      </div>
    </div>
  );
};

export default ChurnAffinityView;
