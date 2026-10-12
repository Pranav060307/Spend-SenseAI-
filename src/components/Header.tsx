import React from 'react';
import {
  Calendar,
  UploadCloud,
  Bot,
  ChevronDown,
  Building2,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { DATASET_PRESETS } from '../data/sampleDatasets';

interface HeaderProps {
  currentDatasetId: string;
  onSelectDataset: (id: string) => void;
  onOpenUpload: () => void;
  onOpenCopilot: () => void;
  dateRange?: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDatasetId,
  onSelectDataset,
  onOpenUpload,
  onOpenCopilot,
  dateRange = '12 May – 11 Jun 2026',
  theme,
  onToggleTheme,
  onToggleMobileMenu,
}) => {
  const currentDataset = DATASET_PRESETS.find((p) => p.id === currentDatasetId) || DATASET_PRESETS[0];

  return (
    <header className="top-header" role="banner">
      <div className="header-left">
        {onToggleMobileMenu && (
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={onToggleMobileMenu}
            aria-label="Toggle navigation menu"
          >
            <Menu size={18} />
          </button>
        )}
        <div className="header-title-box">
          <h1 className="header-title">Marketing and financial intelligence</h1>
          <p className="header-subtitle">
            Real-time consumer spending patterns, RFM cohort retention, and capital allocation
          </p>
        </div>
      </div>

      <div className="header-actions">
        {/* Organization / Dataset Selector (truncated with tooltip, max 280px) */}
        <div className="header-select-wrapper" title={`Current Workspace: ${currentDataset.name}`}>
          <Building2
            size={13}
            style={{
              position: 'absolute',
              left: '9px',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
            aria-hidden="true"
          />
          <select
            value={currentDatasetId}
            onChange={(e) => onSelectDataset(e.target.value)}
            aria-label="Select Organization or Dataset"
          >
            {DATASET_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={12}
            style={{
              position: 'absolute',
              right: '8px',
              pointerEvents: 'none',
              color: 'var(--text-muted)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Date Range: Single Line Never Wraps */}
        <div
          className="header-control"
          style={{ cursor: 'default', whiteSpace: 'nowrap' }}
          title="Reporting time horizon: 12 May – 11 Jun 2026"
        >
          <Calendar size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
          <span style={{ whiteSpace: 'nowrap' }}>{dateRange}</span>
        </div>

        {/* Theme Toggle: Icon Button with aria-label (Sun/Moon, not text button) */}
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {theme === 'light' ? (
            <Moon size={14} aria-hidden="true" />
          ) : (
            <Sun size={14} aria-hidden="true" />
          )}
        </button>

        {/* Quick CSV Upload */}
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenUpload}
          title="Upload transaction CSV file"
        >
          <UploadCloud size={13} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
          <span>Upload CSV</span>
        </button>

        {/* Growth Copilot (Primary button in --accent) */}
        <button
          type="button"
          className="btn-primary"
          onClick={onOpenCopilot}
          title="Open Growth Copilot Agent"
        >
          <Bot size={14} aria-hidden="true" />
          <span>Growth Copilot</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
