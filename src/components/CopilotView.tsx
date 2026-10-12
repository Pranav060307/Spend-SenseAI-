import React, { useState } from 'react';
import {
  Send,
  Terminal,
  ArrowRight,
  Key,
  ShieldCheck,
  RefreshCw,
  GitBranch,
  BarChart3,
  Users,
  Megaphone,
  SlidersHorizontal,
} from 'lucide-react';
import { CopilotMessage, RFMSegmentType, Transaction } from '../types';
import { api, AgentChatResponse } from '../services/api';
import { handleCopilotQuery, AgentContext } from '../services/aiAgent';
import { PageHeader, Card } from './ui';

interface CopilotViewProps {
  context: AgentContext;
  transactions: Transaction[];
  onNavigateToCampaign: (segment?: RFMSegmentType, budget?: number) => void;
  onNavigateToSimulator: () => void;
  onNavigateToSegments: () => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  context,
  transactions,
  onNavigateToCampaign,
  onNavigateToSimulator,
  onNavigateToSegments,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      tool_invocations: [
        {
          tool_name: 'CustomerAnalyticsTool.connect()',
          result_summary: `Linked to active dataset (${context.metrics.unique_customers} profiles, ${context.metrics.total_orders} transactions).`,
        },
      ],
      text: `Hello. I am your SpendSense Financial & Marketing Intelligence Agent.\n\nWhenever you submit a query, I dispatch verified internal tools (Customer Analytics, RFM Cohort Classifier, Campaign Generator, Budget Simulator) to compute deterministic figures before synthesizing strategic recommendations.\n\nSelect a preset financial inquiry or ask a custom question below.`,
      suggested_actions: [
        { label: 'Why did repeat purchases decrease?', action_type: 'filter_data' },
        { label: 'How should I allocate a ₹10,000 campaign budget?', action_type: 'generate_campaign' },
      ],
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activePipeline, setActivePipeline] = useState<AgentChatResponse | null>(null);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);

  const presetQuestions = [
    'Why did repeat purchases decrease?',
    'How should I use a ₹10,000 campaign budget?',
    'Compare discounting loyal users vs win-back campaign',
    'Which customer segment has the highest risk of churn?',
    'Explain the revenue trend in simple words',
  ];

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: text.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsThinking(true);

    // Call Python FastAPI agent endpoint
    const backendRes = await api.askAgent(text, transactions, context.currencySymbol);

    if (backendRes) {
      setActivePipeline(backendRes);
      const assistantMsg: CopilotMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tool_invocations: backendRes.tools_called.map((t) => ({
          tool_name: t.tool,
          result_summary: t.output_summary,
        })),
        text: `${backendRes.explanation}\n\n${backendRes.recommendation}`,
        suggested_actions: backendRes.suggested_actions.map((a) => ({
          label: a.label,
          action_type: a.type as any,
          payload: { segment: a.segment, budget: a.budget },
        })),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } else {
      // Graceful fallback to client engine
      setTimeout(() => {
        const reply = handleCopilotQuery(text, context);
        setMessages((prev) => [...prev, reply]);
      }, 500);
    }

    setIsThinking(false);
  };

  const handleActionClick = (action: any) => {
    if (action.action_type === 'campaign' || action.action_type === 'generate_campaign') {
      onNavigateToCampaign(action.payload?.segment, action.payload?.budget);
    } else if (action.action_type === 'simulator' || action.action_type === 'open_simulator') {
      onNavigateToSimulator();
    } else if (action.action_type === 'segments' || action.action_type === 'view_segment') {
      onNavigateToSegments();
    }
  };

  return (
    <div className="page-content">
      {/* Page Header */}
      <PageHeader
        title="Growth copilot"
        description="Grounded in your actual transaction dataset and verified analytical tool dispatches."
        badge={<span className="badge-tag active">Verified pipeline</span>}
        actions={
          <button
            className="btn-secondary"
            onClick={() => setShowKeyModal(!showKeyModal)}
            style={{ fontSize: '12px' }}
          >
            <Key size={13} style={{ color: 'var(--text-muted)' }} />
            <span>{geminiApiKey ? 'API configured' : 'Configure LLM Key'}</span>
          </button>
        }
      />

      {showKeyModal && (
        <Card style={{ padding: '14px 18px', background: 'var(--surface-sunken)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                Gemini 1.5 Pro / Flash Key
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Optional. SpendSense operates deterministically out-of-the-box with the local analytics engine.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  color: 'var(--text)',
                  fontSize: '12px',
                  width: '220px',
                }}
              />
              <button
                className="btn-primary"
                style={{ height: '30px', padding: '0 12px' }}
                onClick={() => setShowKeyModal(false)}
              >
                Save
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Visual Pipeline Architecture Banner */}
      <Card padding="sm">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitBranch size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text)' }}>
              Deterministic tool dispatch architecture
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
            Zero-hallucination verification
          </span>
        </div>

        <div className="pipeline-nodes-grid">
          <div
            style={{
              background: 'var(--surface-sunken)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <BarChart3 size={15} style={{ color: 'var(--chart-1)' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Analytics tool</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Spend &amp; frequency decay</div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface-sunken)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Users size={15} style={{ color: 'var(--chart-2)' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Segmentation tool</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>RFM 5-cohort classifier</div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface-sunken)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Megaphone size={15} style={{ color: 'var(--chart-3)' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Campaign engine</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>Multi-channel creative</div>
            </div>
          </div>

          <div
            style={{
              background: 'var(--surface-sunken)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <SlidersHorizontal size={15} style={{ color: 'var(--chart-4)' }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Budget simulator</div>
              <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>ROAS &amp; margin projections</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Copilot Workspace */}
      <div className="copilot-container">
        {/* Left: Quick Prompts List */}
        <Card padding="md" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
              Analytical Questions
            </h4>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
              Click to dispatch verified workflows
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {presetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                style={{
                  textAlign: 'left',
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  color: 'var(--text)',
                  fontSize: '12px',
                  lineHeight: 1.4,
                  cursor: 'pointer',
                  transition: 'border-color 120ms ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: 'auto',
              padding: '10px 12px',
              background: 'var(--surface-sunken)',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--positive)', fontSize: '11px', fontWeight: 600 }}>
              <ShieldCheck size={13} />
              <span>Grounded Execution</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
              Outputs reflect calculated metrics directly from your ingested transactions.
            </p>
          </div>
        </Card>

        {/* Right: Max Reading Width 720px Chat Layout with Sticky Input */}
        <Card padding="none" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div className="copilot-reading-area">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    width: '100%',
                    alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {/* Tool Invocations for Assistant */}
                  {msg.tool_invocations?.map((tool, tIdx) => (
                    <div
                      key={tIdx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        background: 'var(--surface-sunken)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Terminal size={11} />
                      <span>{tool.tool_name}</span>
                      <span style={{ color: 'var(--text-faint)' }}>• {tool.result_summary}</span>
                    </div>
                  ))}

                  {/* Message Body: User has subtle surface-sunken block; Assistant has NO bubbles */}
                  {msg.sender === 'user' ? (
                    <div className="chat-bubble-user">
                      {msg.text}
                    </div>
                  ) : (
                    <div className="chat-bubble-assistant">
                      <div
                        style={{
                          borderLeft: '2px solid var(--accent)',
                          paddingLeft: '14px',
                          whiteSpace: 'pre-line',
                        }}
                      >
                        {msg.text}
                      </div>

                      {/* Suggested Action Buttons */}
                      {msg.suggested_actions && (
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '8px',
                            marginTop: '12px',
                            paddingLeft: '16px',
                          }}
                        >
                          {msg.suggested_actions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              onClick={() => handleActionClick(act)}
                              className="btn-secondary"
                              style={{ height: '28px', padding: '0 8px', fontSize: '11.5px' }}
                            >
                              <span>{act.label}</span>
                              <ArrowRight size={11} style={{ color: 'var(--text-muted)' }} />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12.5px',
                    color: 'var(--text-muted)',
                    borderLeft: '2px solid var(--accent)',
                    paddingLeft: '14px',
                  }}
                >
                  <RefreshCw size={13} className="animate-spin" style={{ color: 'var(--accent)' }} />
                  <span>Executing tool dispatch and synthesizing response...</span>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Input Bar at Bottom */}
          <div
            style={{
              borderTop: '1px solid var(--border)',
              background: 'var(--surface)',
              padding: '12px 16px',
              position: 'sticky',
              bottom: 0,
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              style={{
                maxWidth: '720px',
                margin: '0 auto',
                display: 'flex',
                gap: '8px',
              }}
            >
              <input
                type="text"
                placeholder="Ask about repeat purchase trends, budget allocation, or churn risk..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  flex: 1,
                  height: '36px',
                  padding: '0 12px',
                  background: 'var(--surface-sunken)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  color: 'var(--text)',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                className="btn-primary"
                disabled={!inputVal.trim() || isThinking}
                style={{ height: '36px', padding: '0 16px' }}
                aria-label="Send question"
              >
                <Send size={14} />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CopilotView;
