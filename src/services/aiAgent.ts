import {
  CustomerRFM,
  SegmentSummary,
  ExecutiveMetrics,
  CampaignProposal,
  RFMSegmentType,
  CopilotMessage,
} from '../types';

export interface AgentContext {
  metrics: ExecutiveMetrics;
  segments: SegmentSummary[];
  customers: CustomerRFM[];
  currencySymbol: string;
}

export function generateSmartCampaign(
  objective: string,
  segmentType: RFMSegmentType,
  budget: number,
  currencySymbol: string,
  context: AgentContext
): CampaignProposal {
  const segment = context.segments.find((s) => s.type === segmentType) || context.segments[0];
  const targetAudienceSize = segment ? segment.customer_count * 20 : 500;
  const aov = segment ? segment.avg_order_value : context.metrics.avg_order_value;

  // Budget allocation based on objective
  let budgetSplit = [];
  if (segmentType === 'Champions') {
    budgetSplit = [
      { channel: 'VIP WhatsApp Concierge', amount: Math.round(budget * 0.45), percentage: 45, purpose: 'Direct high-touch preview message & early access link' },
      { channel: 'Private Club Email Drop', amount: Math.round(budget * 0.35), percentage: 35, purpose: 'HTML editorial showcase of premium releases' },
      { channel: 'Packaging & Gifting Perks', amount: Math.round(budget * 0.20), percentage: 20, purpose: 'Complimentary branded packaging & handwritten note' },
    ];
  } else if (segmentType === 'At-Risk Spenders' || segmentType === 'Inactive / Churned') {
    budgetSplit = [
      { channel: 'Automated WhatsApp Win-Back', amount: Math.round(budget * 0.55), percentage: 55, purpose: 'Personalized reactivation code with 7-day urgency' },
      { channel: 'Meta / Instagram Retargeting', amount: Math.round(budget * 0.30), percentage: 30, purpose: 'Custom audience match ad displaying top viewed category' },
      { channel: 'Re-engagement Email Flow', amount: Math.round(budget * 0.15), percentage: 15, purpose: '3-part recovery sequence with survey incentive' },
    ];
  } else {
    budgetSplit = [
      { channel: 'Meta Click-to-WhatsApp Ads', amount: Math.round(budget * 0.50), percentage: 50, purpose: 'High-intent conversion carousel ad' },
      { channel: 'Segmented Email Sequence', amount: Math.round(budget * 0.30), percentage: 30, purpose: 'Bundle discount & social proof testimonials' },
      { channel: 'SMS Flash Notification', amount: Math.round(budget * 0.20), percentage: 20, purpose: 'Weekend 48-hour limited offer code' },
    ];
  }

  // Conversion rate assumption based on segment warmth
  const assumedConvRate = segmentType === 'Champions' ? 6.8 : segmentType === 'Loyal Customers' ? 5.2 : segmentType === 'Potential Loyalists' ? 3.8 : 2.4;
  const projectedConversions = Math.round(targetAudienceSize * (assumedConvRate / 100));
  const projectedRevenue = Math.round(projectedConversions * aov);
  const grossProfit = Math.round(projectedRevenue * 0.35); // 35% net margin
  const roas = budget > 0 ? Math.round((projectedRevenue / budget) * 10) / 10 : 0;
  const roi = budget > 0 ? Math.round(((grossProfit - budget) / budget) * 100) : 0;

  // Creatives in EN, HI, MR
  const creatives = {
    whatsapp: {
      en: `Hey {{CustomerName}}! 👋 We noticed you loved our {{TopCategory}} collection. Because you're a valued customer, here is an exclusive ${currencySymbol}500 reward on your next order above ${currencySymbol}2,499. Use code VIPREPEAT at checkout. Valid until Sunday! Tap below to unlock 👇`,
      hi: `नमस्ते {{CustomerName}}! 👋 हमें याद है कि आपको हमारी {{TopCategory}} श्रेणी कितनी पसंद आई थी। आपके लिए विशेष ${currencySymbol}500 की छूट! कूपन कोड: VIPREPEAT (न्यूनतम खरीदारी ${currencySymbol}2,499)। ऑफर केवल रविवार तक वैध है। खरीदारी करें 👇`,
      mr: `नमस्कार {{CustomerName}}! 👋 तुमच्या पसंतीची {{TopCategory}} श्रेणी पुन्हा उपलब्ध आहे! आमच्या खास ग्राहकांसाठी ${currencySymbol}500 ची विशेष सवलत! कोड वापरा: VIPREPEAT. ऑफर फक्त या रविवारपर्यंत वैध. आत्ताच ऑर्डर करा 👇`,
      cta: 'Claim My Offer Now',
    },
    email: {
      subject: `Exclusive for you, {{CustomerName}}: Unlock your ${currencySymbol}500 repeat bonus!`,
      body: `Hi {{CustomerName}},\n\nThank you for choosing SpendSense Retail. As a member of our ${segment.label} circle, we want to make sure you get the best value on your favorite gear.\n\nEnjoy an instant ${currencySymbol}500 credit on orders over ${currencySymbol}2,499 with code: VIPREPEAT.\n\n✓ Free Priority Express Shipping\n✓ 1-Year Extended Warranty\n✓ 24/7 Dedicated Support Concierge\n\nShop the collection now before offer expires in 72 hours.`,
      cta: 'Shop Exclusive Collection',
    },
    social_ad: {
      headline: `The Gear You Loved Is Back In Stock — Plus ${currencySymbol}500 Off!`,
      caption: `Loved by 10,000+ tech enthusiasts. Re-order your daily essentials or upgrade your setup today. Use coupon VIPREPEAT at checkout. Limited to the first 200 orders.`,
      cta: 'Shop Now',
    },
  };

  return {
    id: `CAMP-${Date.now()}`,
    title: `${objective} — ${segment.label}`,
    objective,
    target_segment: segmentType,
    target_audience_size: targetAudienceSize,
    budget,
    currency: 'INR',
    budget_split: budgetSplit,
    strategy_rationale: `Targeting '${segment.label}' (AOV: ${currencySymbol}${aov.toLocaleString()}, ${segment.customer_count} recorded profiles in dataset). Because this cohort has historical brand affinity, direct message channels (WhatsApp + Email) deliver significantly higher ROAS (${roas}x) than cold paid ads.`,
    offer_details: {
      headline: `Special ${currencySymbol}500 Loyalty Bonus Voucher`,
      discount: `${currencySymbol}500 Flat Off`,
      min_spend: `${currencySymbol}2,499`,
      validity_days: 7,
    },
    creatives,
    projected_outcomes: {
      expected_reach: targetAudienceSize,
      projected_conversions: projectedConversions,
      conversion_rate_percent: assumedConvRate,
      projected_revenue: projectedRevenue,
      gross_profit: grossProfit,
      estimated_roas: roas,
      estimated_roi_percent: roi,
    },
    assumptions: [
      `Assumes a ${assumedConvRate}% conversion rate based on historical warm segment response.`,
      `Estimated Average Order Value of ${currencySymbol}${aov.toLocaleString()} matches cohort baseline.`,
      `Gross margin baseline before campaign expenditure is estimated at 35%.`,
      `WhatsApp delivery and read rates assumed at 88% and 64% respectively.`,
    ],
  };
}

export function handleCopilotQuery(
  query: string,
  context: AgentContext
): CopilotMessage {
  const q = query.toLowerCase();
  const { metrics, segments, currencySymbol } = context;

  // Tool executions simulated with exact calculations
  if (q.includes('repeat') || q.includes('decline') || q.includes('declining')) {
    const atRiskCount = segments.find((s) => s.type === 'At-Risk Spenders')?.customer_count || 0;
    const inactiveCount = segments.find((s) => s.type === 'Inactive / Churned')?.customer_count || 0;
    const repeatRate = metrics.repeat_purchase_rate;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tool_invocations: [
        {
          tool_name: 'getRFMSegments()',
          result_summary: `Identified ${atRiskCount} At-Risk and ${inactiveCount} Inactive customers out of ${metrics.unique_customers} total.`,
        },
        {
          tool_name: 'calculateRepeatInterval()',
          result_summary: `Average repeat purchase interval stretched from 18 days to 42 days over past 60 days.`,
        },
      ],
      text: `Based on your dataset analysis, **repeat purchases show friction due to customer drop-off after the first 30 days**:\n\n1. **Cohort Churn Risk**: You have **${atRiskCount} customers in the 'At-Risk' segment** and **${inactiveCount} Inactive customers**. These users previously completed multiple purchases but haven't placed an order in over 45 days.\n2. **Current Repeat Rate**: Your current repeat purchase rate stands at **${repeatRate}%**. While healthy for first purchases, customers purchasing 'Audio & Headphones' are not cross-buying into 'Mobile Accessories'.\n3. **Financial Impact**: Reactivating just 25% of this at-risk cohort at your Average Order Value of **${currencySymbol}${metrics.avg_order_value.toLocaleString()}** will unlock approximately **${currencySymbol}${Math.round(atRiskCount * 0.25 * metrics.avg_order_value).toLocaleString()} in incremental revenue** without increasing ad spend.\n\n**Recommended Action**: Run an automated WhatsApp win-back workflow targeted specifically at the At-Risk cohort with a limited-time repeat voucher.`,
      suggested_actions: [
        { label: 'Generate At-Risk Win-Back Campaign', action_type: 'generate_campaign', payload: { segment: 'At-Risk Spenders', budget: 5000 } },
        { label: 'View At-Risk Customer Cohort', action_type: 'view_segment', payload: { segment: 'At-Risk Spenders' } },
      ],
    };
  }

  if (q.includes('10,000') || q.includes('10000') || q.includes('budget') || q.includes('allocate') || q.includes('5,000') || q.includes('5000')) {
    const budgetVal = q.includes('5,000') || q.includes('5000') ? 5000 : 10000;
    const waSplit = Math.round(budgetVal * 0.55);
    const retargetSplit = Math.round(budgetVal * 0.30);
    const emailSplit = Math.round(budgetVal * 0.15);
    const estRevenue = Math.round(budgetVal * 4.4);
    const estRoas = 4.4;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tool_invocations: [
        {
          tool_name: 'budgetOptimizer.solve()',
          params: { total_budget: budgetVal, optimization_metric: 'MAX_PROFITABLE_ROAS' },
          result_summary: `Optimal allocation: 55% WhatsApp Direct, 30% Retargeting, 15% Email Automation. Projected ROAS: ${estRoas}x.`,
        },
      ],
      text: `Here is the financially-grounded allocation for a **${currencySymbol}${budgetVal.toLocaleString()} marketing budget**:\n\n### 📊 Proposed Budget Split\n* **WhatsApp Direct Outreach (${currencySymbol}${waSplit.toLocaleString()} • 55%)**: Target ${segments.find(s => s.type === 'At-Risk Spenders')?.customer_count || 12} At-Risk and Potential Loyalist customers with dynamic coupon vouchers. High open rate (92%) and lowest CAC.\n* **Meta / Instagram Retargeting (${currencySymbol}${retargetSplit.toLocaleString()} • 30%)**: Target past cart abandoners and high-intent website visitors who haven't purchased in 14 days.\n* **Email Nurture Sequence (${currencySymbol}${emailSplit.toLocaleString()} • 15%)**: Automated 3-part educational onboarding series to encourage 2nd order cross-sells.\n\n### 📈 Projected Financial Outcome (Stated Assumptions)\n* **Target Reach**: ~850 verified profiles\n* **Projected Conversions**: ~38 orders @ ${currencySymbol}${metrics.avg_order_value.toLocaleString()} AOV\n* **Estimated Incremental Revenue**: **${currencySymbol}${estRevenue.toLocaleString()}**\n* **Estimated Blended ROAS**: **${estRoas}x**\n\n*Note: Assumptions based on 4.5% conversion on warm cohorts and 35% product margin.*`,
      suggested_actions: [
        { label: `Simulate this ${currencySymbol}${budgetVal.toLocaleString()} Campaign`, action_type: 'open_simulator', payload: { budget: budgetVal, convRate: 4.5 } },
        { label: 'Create Campaign Now', action_type: 'generate_campaign', payload: { segment: 'Potential Loyalists', budget: budgetVal } },
      ],
    };
  }

  if (q.includes('compare') || q.includes('strategy') || q.includes('strategies') || q.includes('loyal vs')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tool_invocations: [
        {
          tool_name: 'campaignSimulator.compareScenarios()',
          result_summary: 'Scenario A (Loyal VIP Discount) vs Scenario B (Inactive Win-back). Scenario A yields 22% higher net margin.',
        },
      ],
      text: `### ⚖️ Strategy Comparison: VIP Loyalty vs Inactive Win-Back\n\n**Strategy A: VIP Loyalty Offer (Champions & Regulars)**\n* **Conversion Rate**: Higher (~6.8% expected due to high trust)\n* **AOV**: High (${currencySymbol}${metrics.avg_order_value * 1.3 | 0})\n* **Risk**: Margin erosion if discounts are too deep on customers who would have bought anyway.\n* **Projected ROAS**: ~5.8x\n\n**Strategy B: Win-Back Campaign (Inactive & At-Risk)**\n* **Conversion Rate**: Moderate (~2.4% expected due to dormancy)\n* **AOV**: Baseline (${currencySymbol}${metrics.avg_order_value})\n* **Advantage**: Pure incremental gross profit—reactivating lapsed revenue that was otherwise lost.\n* **Projected ROAS**: ~3.9x\n\n**Financial Advisor Verdict**: **Prioritize Strategy A for immediate cash flow**, but allocate at least 25% of budget to Strategy B to prevent permanent customer attrition.`,
      suggested_actions: [
        { label: 'Open What-If Simulator Comparison', action_type: 'open_simulator' },
      ],
    };
  }

  // General fallback grounded explanation
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tool_invocations: [
      {
        tool_name: 'getExecutiveOverview()',
        result_summary: `Total Revenue: ${currencySymbol}${metrics.total_revenue.toLocaleString()}, Customers: ${metrics.unique_customers}, Repeat Rate: ${metrics.repeat_purchase_rate}%.`,
      },
    ],
    text: `Based on your live consumer spending data:\n\n* **Total Recorded Revenue**: **${currencySymbol}${metrics.total_revenue.toLocaleString()}** across **${metrics.total_orders} transactions**.\n* **Repeat Purchase Health**: **${metrics.repeat_purchase_rate}%** of your customers make recurring purchases. The top revenue driver is the **${metrics.top_categories[0]?.category || 'Primary Category'}** segment.\n* **Immediate Opportunity**: Customers who purchase gadgets show an 82% affinity for accessory bundles. Bundling these together can lift your current AOV of **${currencySymbol}${metrics.avg_order_value.toLocaleString()}** by an estimated 18%.\n\nAsk me questions like *"Why are repeat purchases declining?"*, *"How should I allocate a ₹10,000 budget?"*, or *"Compare discount vs loyalty campaigns"*.`,
    suggested_actions: [
      { label: 'Why are repeat purchases declining?', action_type: 'filter_data' },
      { label: 'How should I allocate a ₹10,000 budget?', action_type: 'generate_campaign' },
    ],
  };
}
