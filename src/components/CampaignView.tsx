import React, { useState } from 'react';
import {
  Sparkles,
  MessageSquare,
  Mail,
  Check,
  Copy,
  Languages,
  SlidersHorizontal,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampaignProposal, RFMSegmentType, SegmentSummary } from '../types';
import { generateSmartCampaign, AgentContext } from '../services/aiAgent';
import { PageHeader } from './ui/PageHeader';
import { SegmentedControl } from './ui/SegmentedControl';

interface CampaignViewProps {
  segments: SegmentSummary[];
  currencySymbol: string;
  context: AgentContext;
  initialSegment?: RFMSegmentType;
  onSendToSimulator: (proposal: CampaignProposal) => void;
}

export const CampaignView: React.FC<CampaignViewProps> = ({
  segments,
  currencySymbol,
  context,
  initialSegment = 'At-Risk Spenders',
  onSendToSimulator,
}) => {
  const [objective, setObjective] = useState('Reactivate At-Risk Customers (Win-Back)');
  const [targetSegment, setTargetSegment] = useState<RFMSegmentType>(initialSegment);
  const [budget, setBudget] = useState<number>(10000);
  const [activeLang, setActiveLang] = useState<'en' | 'hi' | 'mr'>('en');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Proposal state
  const [proposal, setProposal] = useState<CampaignProposal>(() =>
    generateSmartCampaign(
      'Reactivate At-Risk Customers (Win-Back)',
      initialSegment,
      10000,
      currencySymbol,
      context
    )
  );

  const handleGenerate = () => {
    const newProp = generateSmartCampaign(
      objective,
      targetSegment,
      budget,
      currencySymbol,
      context
    );
    setProposal(newProp);
    confetti({
      particleCount: 40,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#2F6B4F', '#B8893E', '#7D5C7A'],
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedSegmentSummary = segments.find((s) => s.type === targetSegment) || segments[0];

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="Campaign studio"
        description="Turn customer spending data and budget limits into structured, high-ROAS marketing campaigns."
        actions={
          <button type="button" className="btn-primary" onClick={handleGenerate}>
            <Sparkles size={14} />
            <span>Generate campaign</span>
          </button>
        }
      />

      {/* Form Controls Card */}
      <div className="chart-card-shell campaign-controls-grid">
        {/* Objective */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-faint)' }}>
            Campaign objective
          </label>
          <select
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="header-control"
            style={{ width: '100%', height: '36px', fontSize: '12.5px' }}
          >
            <option value="Reactivate At-Risk Customers (Win-Back)">
              Reactivate At-Risk Customers (Win-Back)
            </option>
            <option value="Drive 2nd Repeat Purchase for New Buyers">
              Drive 2nd Repeat Purchase for New Buyers
            </option>
            <option value="VIP Loyalty Upsell & High-Ticket Bundles">
              VIP Loyalty Upsell &amp; High-Ticket Bundles
            </option>
            <option value="Clear Aging Inventory with Flash Voucher">
              Clear Aging Inventory with Flash Voucher
            </option>
          </select>
        </div>

        {/* Target Segment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-faint)' }}>
            Target cohort
          </label>
          <select
            value={targetSegment}
            onChange={(e) => setTargetSegment(e.target.value as RFMSegmentType)}
            className="header-control"
            style={{ width: '100%', height: '36px', fontSize: '12.5px' }}
          >
            {segments.map((s) => (
              <option key={s.type} value={s.type}>
                {s.label} ({s.customer_count} profiles)
              </option>
            ))}
          </select>
        </div>

        {/* Marketing Budget */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-faint)' }}>
            Marketing budget ({currencySymbol})
          </label>
          <SegmentedControl
            options={[
              { value: '5000', label: `${currencySymbol}5K` },
              { value: '10000', label: `${currencySymbol}10K` },
              { value: '25000', label: `${currencySymbol}25K` },
            ]}
            value={String(budget)}
            onChange={(val) => setBudget(Number(val))}
            size="md"
          />
        </div>

        {/* Run CTA */}
        <div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleGenerate}
            style={{ height: '36px', width: '100%', justifyContent: 'center' }}
          >
            <Sparkles size={14} />
            <span>Generate</span>
          </button>
        </div>
      </div>

      {/* Generated Campaign Output Layout */}
      <div className="split-view-grid">
        {/* Left Column: Strategy & Financial Projections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-card-shell">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-tag active">
                  {proposal.target_segment}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-faint)' }}>
                  ~{proposal.target_audience_size} customers
                </span>
              </div>

              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--positive)' }}>
                Projected ROAS {proposal.projected_outcomes.estimated_roas}×
              </span>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                {proposal.title}
              </h3>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                {proposal.strategy_rationale}
              </p>
            </div>

            {/* Budget Split Breakdown */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--text-faint)',
                  marginBottom: '8px',
                }}
              >
                PROPOSED BUDGET ALLOCATION ({currencySymbol}
                {proposal.budget.toLocaleString()})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {proposal.budget_split.map((split, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'var(--surface-sunken)',
                      borderRadius: 'var(--radius-control)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 500, color: 'var(--text)' }}>
                        {split.channel}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {split.purpose}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                        {currencySymbol}
                        {split.amount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {split.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Projections Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Projected orders</span>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                  {proposal.projected_outcomes.projected_conversions}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Est. revenue</span>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--positive)' }}>
                  {currencySymbol}
                  {proposal.projected_outcomes.projected_revenue.toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Gross margin</span>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                  {currencySymbol}
                  {proposal.projected_outcomes.gross_profit.toLocaleString()}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Estimated ROI</span>
                <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--positive)' }}>
                  +{proposal.projected_outcomes.estimated_roi_percent}%
                </div>
              </div>
            </div>

            {/* Send to What-If simulator button */}
            <div style={{ paddingTop: '6px' }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => onSendToSimulator(proposal)}
              >
                <SlidersHorizontal size={13} style={{ color: 'var(--accent)' }} />
                <span>Simulate &amp; compare in What-If Simulator →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Channel Creatives with Multilingual (EN, HI, MR) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="chart-card-shell">
            {/* Header with Language Tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Languages size={15} style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text)' }}>
                  Deployable Creatives
                </h3>
              </div>

              {/* Language switcher */}
              <SegmentedControl
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'hi', label: 'हिंदी' },
                  { value: 'mr', label: 'मराठी' },
                ]}
                value={activeLang}
                onChange={(val) => setActiveLang(val as 'en' | 'hi' | 'mr')}
                size="sm"
              />
            </div>

            {/* WhatsApp Creative Mockup */}
            <div
              style={{
                background: 'var(--surface-sunken)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-control)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)' }}>
                  <MessageSquare size={14} style={{ color: 'var(--positive)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>WhatsApp Direct Message</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(proposal.creatives.whatsapp[activeLang], 'wa')}
                  className="btn-secondary"
                  style={{ height: '24px', padding: '0 6px', fontSize: '11px' }}
                >
                  {copiedKey === 'wa' ? <Check size={11} color="var(--positive)" /> : <Copy size={11} />}
                  <span>{copiedKey === 'wa' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div
                style={{
                  background: 'var(--surface)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  lineHeight: 1.55,
                  color: 'var(--text)',
                  border: '1px solid var(--border)',
                  borderLeft: '3px solid var(--positive)',
                }}
              >
                {proposal.creatives.whatsapp[activeLang]}
              </div>

              <div
                style={{
                  padding: '6px 10px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  color: 'var(--text-muted)',
                }}
              >
                <strong>Call to action: </strong> {proposal.creatives.whatsapp.cta}
              </div>
            </div>

            {/* Email Sequence */}
            <div
              style={{
                background: 'var(--surface-sunken)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-control)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text)' }}>
                  <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Targeted Email Sequence</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      `${proposal.creatives.email.subject}\n\n${proposal.creatives.email.body}`,
                      'email'
                    )
                  }
                  className="btn-secondary"
                  style={{ height: '24px', padding: '0 6px', fontSize: '11px' }}
                >
                  {copiedKey === 'email' ? <Check size={11} color="var(--positive)" /> : <Copy size={11} />}
                  <span>{copiedKey === 'email' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>
                Subject: {proposal.creatives.email.subject}
              </div>

              <div
                style={{
                  background: 'var(--surface)',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  lineHeight: 1.5,
                  color: 'var(--text-muted)',
                  whiteSpace: 'pre-line',
                  border: '1px solid var(--border)',
                }}
              >
                {proposal.creatives.email.body}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignView;
