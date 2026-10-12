import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { SegmentationView } from './components/SegmentationView';
import { CampaignView } from './components/CampaignView';
import { SimulatorView } from './components/SimulatorView';
import { CopilotView } from './components/CopilotView';
import { ChurnAffinityView } from './components/ChurnAffinityView';
import { BudgetOptimizerView } from './components/BudgetOptimizerView';
import { FeedbackView } from './components/FeedbackView';
import { DataStudioView } from './components/DataStudioView';
import { DATASET_PRESETS } from './data/sampleDatasets';
import {
  computeRFM,
  computeExecutiveMetrics,
  computeProductAffinities,
} from './utils/analytics';
import { Transaction, RFMSegmentType, CampaignProposal } from './types';
import { AgentContext } from './services/aiAgent';
import { ThemeProvider, useTheme } from './components/ui/ThemeProvider';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [currentDatasetId, setCurrentDatasetId] = useState<string>('omni_retail_india');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  const [targetedSegment, setTargetedSegment] = useState<RFMSegmentType>('At-Risk Spenders');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const { theme, toggleTheme } = useTheme();

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    return DATASET_PRESETS[0].transactions;
  });

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  // Compute analytics dynamically from active dataset
  const { customers, segments } = useMemo(() => {
    return computeRFM(transactions);
  }, [transactions]);

  const metrics = useMemo(() => {
    return computeExecutiveMetrics(transactions, customers);
  }, [transactions, customers]);

  const affinities = useMemo(() => {
    return computeProductAffinities(transactions);
  }, [transactions]);

  const agentContext: AgentContext = useMemo(() => {
    return {
      metrics,
      segments,
      customers,
      currencySymbol,
    };
  }, [metrics, segments, customers, currencySymbol]);

  // Dataset change handler
  const handleSelectDataset = (id: string) => {
    const found = DATASET_PRESETS.find((p) => p.id === id);
    if (found) {
      setCurrentDatasetId(id);
      setTransactions(found.transactions);
      setCurrency(found.currency);
    }
  };

  const handleCustomUpload = (customTxs: Transaction[], filename: string) => {
    setCurrentDatasetId('custom');
    setTransactions(customTxs);
  };

  const handleTargetSegmentFromList = (seg: RFMSegmentType | string, budget?: number) => {
    setTargetedSegment(seg as RFMSegmentType);
    setActiveTab('campaign_generator');
    setIsMobileMenuOpen(false);
  };

  const handleSendProposalToSimulator = (proposal: CampaignProposal) => {
    setActiveTab('what_if_simulator');
    setIsMobileMenuOpen(false);
  };

  const handleSelectNavTab = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const activeDatasetName =
    DATASET_PRESETS.find((p) => p.id === currentDatasetId)?.name || 'Custom Uploaded CSV';

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="app-container">
      {/* Mobile Drawer Backdrop */}
      <div
        className={`mobile-drawer-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleSelectNavTab}
        currency={currency}
        setCurrency={setCurrency}
        datasetName={activeDatasetName}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Container */}
      <main className="app-main" id="main-content">
        {/* Top Header */}
        <Header
          currentDatasetId={currentDatasetId}
          onSelectDataset={handleSelectDataset}
          onOpenUpload={() => {
            setActiveTab('data_studio');
            setIsMobileMenuOpen(false);
          }}
          onOpenCopilot={() => {
            setActiveTab('ai_copilot');
            setIsMobileMenuOpen(false);
          }}
          dateRange="12 May – 11 Jun 2026"
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* Route 1: Growth Overview */}
        {activeTab === 'overview' && (
          <DashboardView
            metrics={metrics}
            currencySymbol={currencySymbol}
            currency={currency}
            datasetName={activeDatasetName}
            onNavigateCampaigns={() => setActiveTab('campaign_generator')}
            onNavigateSimulator={() => setActiveTab('what_if_simulator')}
          />
        )}

        {/* Route 2: Customer Segments */}
        {activeTab === 'rfm_segments' && (
          <SegmentationView
            customers={customers}
            segments={segments}
            currencySymbol={currencySymbol}
            onTargetSegment={handleTargetSegmentFromList}
          />
        )}

        {/* Route 3: Campaign Studio */}
        {activeTab === 'campaign_generator' && (
          <CampaignView
            segments={segments}
            currencySymbol={currencySymbol}
            context={agentContext}
            initialSegment={targetedSegment}
            onSendToSimulator={handleSendProposalToSimulator}
          />
        )}

        {/* Route 4: What-If Simulator */}
        {activeTab === 'what_if_simulator' && (
          <SimulatorView currencySymbol={currencySymbol} />
        )}

        {/* Route 5: Growth Copilot */}
        {activeTab === 'ai_copilot' && (
          <CopilotView
            context={agentContext}
            transactions={transactions}
            onNavigateToCampaign={(seg, budget) => {
              if (seg) setTargetedSegment(seg);
              setActiveTab('campaign_generator');
            }}
            onNavigateToSimulator={() => setActiveTab('what_if_simulator')}
            onNavigateToSegments={() => setActiveTab('rfm_segments')}
          />
        )}

        {/* Route 6: Churn & Bundles */}
        {activeTab === 'churn_affinity' && (
          <ChurnAffinityView
            customers={customers}
            affinities={affinities}
            currencySymbol={currencySymbol}
            onTargetCustomer={handleTargetSegmentFromList}
          />
        )}

        {/* Route 7: Budget Allocator */}
        {activeTab === 'budget_optimizer' && (
          <BudgetOptimizerView
            currencySymbol={currencySymbol}
            onTargetSegment={handleTargetSegmentFromList}
          />
        )}

        {/* Route 8: Customer Sentiment */}
        {activeTab === 'feedback_intelligence' && (
          <FeedbackView currencySymbol={currencySymbol} />
        )}

        {/* Route 9: Data Ingestion */}
        {activeTab === 'data_studio' && (
          <DataStudioView
            currentDatasetId={currentDatasetId}
            transactions={transactions}
            onLoadDataset={handleSelectDataset}
            onCustomUpload={handleCustomUpload}
            currencySymbol={currencySymbol}
          />
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
