import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Smile,
  Frown,
  Sparkles,
  AlertTriangle,
  Star,
} from 'lucide-react';
import { api, FeedbackIntelligenceResponse } from '../services/api';
import { PageHeader, Card } from './ui';

interface FeedbackViewProps {
  currencySymbol: string;
}

export const FeedbackView: React.FC<FeedbackViewProps> = ({ currencySymbol }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackIntelligenceResponse | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await api.getFeedbackIntelligence();
      if (data) setFeedbackData(data);
    };
    load();
  }, []);

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="Customer feedback and sentiment intelligence"
        description="Analyze customer reviews, identify recurring complaints, and trace root causes of repeat purchase deceleration."
        badge={<span className="badge-tag">3 friction themes detected</span>}
      />

      {/* Top Sentiment KPI Cards (Sentence case, no pill badges on numbers, inline icons) */}
      <div className="kpi-cards-grid">
        <Card className="kpi-card-unit">
          <div className="kpi-header-row">
            <div className="kpi-title-left">
              <Smile className="kpi-line-icon" />
              <span>Positive sentiment</span>
            </div>
            <span className="kpi-source-sub">Verified reviews</span>
          </div>
          <div className="kpi-metric-block">
            <span className="kpi-metric-label">High purchase intent</span>
            <div className="kpi-primary-val-row">
              <span className="kpi-primary-number">
                {feedbackData?.sentiment_breakdown.positive_percent || 60}%
              </span>
              <span className="delta-val positive">↑ Favourable</span>
            </div>
          </div>
        </Card>

        <Card className="kpi-card-unit">
          <div className="kpi-header-row">
            <div className="kpi-title-left">
              <Frown className="kpi-line-icon" />
              <span>Negative sentiment</span>
            </div>
            <span className="kpi-source-sub">Retention risk</span>
          </div>
          <div className="kpi-metric-block">
            <span className="kpi-metric-label">Deceleration risk</span>
            <div className="kpi-primary-val-row">
              <span className="kpi-primary-number" style={{ color: 'var(--negative)' }}>
                {feedbackData?.sentiment_breakdown.negative_percent || 25}%
              </span>
              <span className="delta-val negative">↓ Unfavourable</span>
            </div>
          </div>
        </Card>

        <Card className="kpi-card-unit">
          <div className="kpi-header-row">
            <div className="kpi-title-left">
              <Sparkles className="kpi-line-icon" />
              <span>Net sentiment index</span>
            </div>
            <span className="kpi-source-sub">Scale: -100 to +100</span>
          </div>
          <div className="kpi-metric-block">
            <span className="kpi-metric-label">Composite satisfaction score</span>
            <div className="kpi-primary-val-row">
              <span className="kpi-primary-number" style={{ color: 'var(--positive)' }}>
                +{feedbackData?.sentiment_breakdown.net_sentiment_index || 35.0}
              </span>
              <span className="delta-val neutral">• Standard</span>
            </div>
          </div>
        </Card>

        <Card className="kpi-card-unit">
          <div className="kpi-header-row">
            <div className="kpi-title-left">
              <MessageSquare className="kpi-line-icon" />
              <span>Total reviews parsed</span>
            </div>
            <span className="kpi-source-sub">Ingested cohort</span>
          </div>
          <div className="kpi-metric-block">
            <span className="kpi-metric-label">Sample density</span>
            <div className="kpi-primary-val-row">
              <span className="kpi-primary-number">
                {feedbackData?.total_reviews_analyzed || 50}
              </span>
              <span className="delta-val neutral">• 100% Parsed</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Recurring Complaints & Verified Customer Reviews */}
      <div className="split-view-grid">
        {/* Complaints Analysis */}
        <Card padding="md">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
            Recurring product complaints & sales impact
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Root-cause friction points depressing repeat repurchase rates
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {feedbackData?.recurring_complaints.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--negative)' }}>
                    {item.tag}
                  </span>
                  <span className="badge-tag">
                    {item.frequency} mentions
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text)' }}>Affected category:</strong> {item.category_affected}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--chart-2)' }}>
                  <strong>Financial impact:</strong> {item.revenue_impact_estimate}
                </div>

                <div
                  style={{
                    paddingTop: '6px',
                    borderTop: '1px solid var(--border)',
                    fontSize: '11.5px',
                    color: 'var(--accent)',
                  }}
                >
                  <strong>Recommended remediation:</strong> {item.suggested_action}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Customer Reviews Stream */}
        <Card padding="md">
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
            Verified customer review stream
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Natural language customer feedback with sentiment tags
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {feedbackData?.sample_reviews.map((rev) => (
              <div
                key={rev.review_id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={11} fill="var(--chart-2)" color="var(--chart-2)" />
                    ))}
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '4px' }}>
                      {rev.customer_id}
                    </span>
                  </div>

                  <span
                    className="badge-tag"
                    style={{
                      color:
                        rev.sentiment === 'positive'
                          ? 'var(--positive)'
                          : rev.sentiment === 'negative'
                          ? 'var(--negative)'
                          : 'var(--text-muted)',
                    }}
                  >
                    {rev.sentiment}
                  </span>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text)', lineHeight: 1.45 }}>
                  "{rev.review_text}"
                </div>

                <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                  {rev.product_name} • {rev.product_category}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FeedbackView;
