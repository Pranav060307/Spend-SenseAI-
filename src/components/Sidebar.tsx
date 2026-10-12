import React, { useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  Send,
  SlidersHorizontal,
  Bot,
  Layers,
  Database,
  ArrowUpRight,
  PieChart,
  MessageSquareHeart,
  TrendingUp,
  X,
} from 'lucide-react';
import { SegmentedControl } from './ui/SegmentedControl';

export type NavTab = 
  | 'overview'
  | 'rfm_segments'
  | 'campaign_generator'
  | 'what_if_simulator'
  | 'ai_copilot'
  | 'churn_affinity'
  | 'budget_optimizer'
  | 'feedback_intelligence'
  | 'data_studio';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  currency: 'INR' | 'USD';
  setCurrency: (c: 'INR' | 'USD') => void;
  datasetName: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  datasetName,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const sidebarRef = useRef<HTMLElement>(null);

  // Trap focus and handle escape key when mobile drawer is open
  useEffect(() => {
    if (!isMobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onCloseMobile) {
        onCloseMobile();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onCloseMobile]);

  const coreNavItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Growth overview',
      icon: <LayoutDashboard size={16} className="nav-icon" />,
      badge: 'Live',
    },
    {
      id: 'rfm_segments',
      label: 'Customer segments',
      icon: <Users size={16} className="nav-icon" />,
    },
    {
      id: 'campaign_generator',
      label: 'Campaign studio',
      icon: <Send size={16} className="nav-icon" />,
    },
    {
      id: 'what_if_simulator',
      label: 'What-if simulator',
      icon: <SlidersHorizontal size={16} className="nav-icon" />,
      badge: 'Model',
    },
    {
      id: 'ai_copilot',
      label: 'Growth copilot',
      icon: <Bot size={16} className="nav-icon" />,
    },
  ];

  const advancedNavItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'churn_affinity',
      label: 'Churn and bundles',
      icon: <Layers size={16} className="nav-icon" />,
    },
    {
      id: 'budget_optimizer',
      label: 'Budget allocator',
      icon: <PieChart size={16} className="nav-icon" />,
    },
    {
      id: 'feedback_intelligence',
      label: 'Customer sentiment',
      icon: <MessageSquareHeart size={16} className="nav-icon" />,
    },
    {
      id: 'data_studio',
      label: 'Data ingestion',
      icon: <Database size={16} className="nav-icon" />,
    },
  ];

  const handleItemClick = (id: NavTab) => {
    setActiveTab(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`app-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}
      aria-label="Sidebar navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-wrapper">
          <div className="brand-logo-mark" aria-hidden="true">
            <TrendingUp size={14} />
          </div>
          <div className="brand-info">
            <span className="brand-title">
              SpendSense <span className="hq-badge">HQ</span>
            </span>
            <span className="brand-tag">Consumer finance &amp; retention</span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onCloseMobile}
            aria-label="Close navigation"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Nav list */}
      <nav className="sidebar-nav">
        <span className="nav-section-title">Growth &amp; retention</span>
        {coreNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badge === 'Live' ? 'live-badge' : item.badge === 'Model' ? 'model-badge' : ''}`}>
                  {item.badge === 'Live' && <span className="live-dot" aria-hidden="true" />}
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <span className="nav-section-title">Intelligence &amp; operations</span>
        {advancedNavItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleItemClick(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge && (
                <span className={`nav-badge ${item.badge === 'Live' ? 'live-badge' : item.badge === 'Model' ? 'model-badge' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Currency Switcher Segmented Control */}
        <div className="sidebar-currency-box">
          <div className="sidebar-currency-label">
            <span>Currency</span>
            <span style={{ color: 'var(--text)', fontWeight: 600 }}>
              {currency === 'INR' ? '₹ INR' : '$ USD'}
            </span>
          </div>
          <SegmentedControl
            options={[
              { value: 'INR', label: '₹ INR' },
              { value: 'USD', label: '$ USD' },
            ]}
            value={currency}
            onChange={(val) => setCurrency(val as 'INR' | 'USD')}
            size="sm"
          />
        </div>
      </nav>

      {/* Pinned Footer */}
      <div className="sidebar-footer">
        <div className="status-row">
          <span className="status-dot-active" aria-hidden="true" />
          <span>Analytics engine online</span>
        </div>

        <div className="user-card" tabIndex={0} role="button" aria-label="Alex Morgan user profile">
          <div className="user-avatar" aria-hidden="true">AM</div>
          <div className="user-meta">
            <span className="name">Alex Morgan</span>
            <span className="role">Marketing &amp; Growth Lead</span>
          </div>
          <ArrowUpRight size={13} style={{ marginLeft: 'auto', color: 'var(--text-faint)' }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
