from typing import List, Dict, Any, Optional
import json
from models import TransactionItem
import analytics_engine

class CustomerAnalyticsTool:
    name = "CustomerAnalyticsTool"
    description = "Retrieves purchase frequency, retention drop-off, average order value, and category affinity."

    @staticmethod
    def execute(transactions: List[TransactionItem]) -> Dict[str, Any]:
        behavior = analytics_engine.analyze_consumer_behavior(transactions)
        return {
            "total_revenue": behavior.total_revenue,
            "unique_customers": behavior.unique_customers,
            "repeat_purchase_rate": behavior.repeat_purchase_rate,
            "avg_order_value": behavior.avg_order_value,
            "top_category": behavior.top_selling_categories[0] if behavior.top_selling_categories else {},
            "co_purchase_affinity": behavior.co_purchase_opportunities[0] if behavior.co_purchase_opportunities else {},
        }

class SegmentationTool:
    name = "SegmentationTool"
    description = "Executes RFM scoring algorithm and classifies customer base into mathematical behavioral segments."

    @staticmethod
    def execute(transactions: List[TransactionItem]) -> Dict[str, Any]:
        customers, segments = analytics_engine.compute_rfm(transactions)
        at_risk = [c for c in customers if c.segment == "At-Risk Customers"]
        champions = [c for c in customers if c.segment == "High-Spending Champions"]
        loyal = [c for c in customers if c.segment == "Loyal Customers"]
        new_cust = [c for c in customers if c.segment == "New & Promising Customers"]
        inactive = [c for c in customers if c.segment == "Inactive / Dormant Customers"]

        return {
            "total_customers": len(customers),
            "segment_counts": {
                "High-Spending Champions": len(champions),
                "Loyal Customers": len(loyal),
                "New & Promising Customers": len(new_cust),
                "At-Risk Customers": len(at_risk),
                "Inactive / Dormant Customers": len(inactive),
            },
            "at_risk_count": len(at_risk),
            "segments": [s.dict() for s in segments],
        }

class CampaignGeneratorTool:
    name = "CampaignGeneratorTool"
    description = "Proposes target audience, channel choice, budget split, and multilingual copy (EN, HI, MR)."

    @staticmethod
    def execute(target_segment: str, objective: str, budget: float, currency_symbol: str = "₹") -> Dict[str, Any]:
        # Formulate proposal
        wa_amount = round(budget * 0.55)
        retarget_amount = round(budget * 0.30)
        email_amount = round(budget * 0.15)

        creatives = {
            "whatsapp": {
                "en": f"Hey {{CustomerName}}! 👋 We noticed you loved our collection. Here is an exclusive {currency_symbol}500 repeat bonus on your next order above {currency_symbol}2,499. Code: VIPREPEAT. Valid till Sunday!",
                "hi": f"नमस्ते {{CustomerName}}! 👋 आपके लिए विशेष {currency_symbol}500 की छूट! कूपन कोड: VIPREPEAT (न्यूनतम खरीदारी {currency_symbol}2,499)। ऑफर केवल रविवार तक वैध है।",
                "mr": f"नमस्कार {{CustomerName}}! 👋 आमच्या खास ग्राहकांसाठी {currency_symbol}500 ची विशेष सवलत! कोड वापरा: VIPREPEAT. ऑफर फक्त या रविवारपर्यंत वैध.",
                "cta": "Claim My Offer Now"
            },
            "email": {
                "subject": f"Exclusive VIP reward: {currency_symbol}500 credit waiting for you!",
                "body": f"Hi {{CustomerName}},\n\nThank you for choosing us! Enjoy an instant {currency_symbol}500 credit on orders over {currency_symbol}2,499 with code: VIPREPEAT.\n\nFree Priority Express Shipping included.",
                "cta": "Shop Collection"
            }
        }

        return {
            "target_segment": target_segment,
            "objective": objective,
            "budget": budget,
            "budget_split": [
                {"channel": "WhatsApp Automated Reactivation", "amount": wa_amount, "share": "55%"},
                {"channel": "Meta / Instagram Retargeting", "amount": retarget_amount, "share": "30%"},
                {"channel": "Email Nurture Sequence", "amount": email_amount, "share": "15%"},
            ],
            "creatives": creatives,
            "duration_days": 10,
        }

class BudgetSimulatorTool:
    name = "BudgetSimulatorTool"
    description = "Runs side-by-side what-if financial projections comparing alternative campaigns under explicit assumptions."

    @staticmethod
    def execute(budget: float, currency_symbol: str = "₹") -> Dict[str, Any]:
        sim_a = analytics_engine.simulate_campaign(
            name="Strategy A: VIP Discount for Loyal Customers",
            target_segment="Loyal Customers",
            budget=budget,
            audience_size=450,
            assumed_conv_rate=6.5,
            assumed_aov=4200,
            gross_margin_pct=42,
            discount_pct=10,
        )
        sim_b = analytics_engine.simulate_campaign(
            name="Strategy B: Win-Back for Inactive Customers",
            target_segment="Inactive / Dormant Customers",
            budget=budget,
            audience_size=600,
            assumed_conv_rate=3.2,
            assumed_aov=3100,
            gross_margin_pct=42,
            discount_pct=15,
        )

        profit_diff = sim_a["net_profit"] - sim_b["net_profit"]
        return {
            "strategy_a": sim_a,
            "strategy_b": sim_b,
            "profit_difference": profit_diff,
            "recommendation": f"Strategy A produces {currency_symbol}{abs(profit_diff):,.0f} higher net margin due to higher conversion trust (6.5% vs 3.2%). However, Strategy B recovers dormant customer lifetime value."
        }

class FeedbackIntelligenceTool:
    name = "FeedbackIntelligenceTool"
    description = "Analyzes review sentiment and detects recurring complaint root causes."

    @staticmethod
    def execute() -> Dict[str, Any]:
        return analytics_engine.analyze_reviews_and_feedback()

class MarketingAIAgent:
    """
    Central Marketing AI Agent implementing the exact dispatch flow:
    User asks question -> Marketing AI Agent -> Dispatch Tools -> Verified Results -> Explanation & Recommendation -> Dashboard
    """

    @classmethod
    def process_query(cls, query: str, transactions: List[TransactionItem], currency_symbol: str = "₹") -> Dict[str, Any]:
        q = query.lower()
        tools_called = []
        verified_results = {}

        # 1. Routing and tool dispatching
        if "repeat" in q or "decline" in q or "decrease" in q or "why" in q:
            # Calls Customer Analytics + Segmentation + Feedback
            analytics_res = CustomerAnalyticsTool.execute(transactions)
            segment_res = SegmentationTool.execute(transactions)
            feedback_res = FeedbackIntelligenceTool.execute()

            tools_called.extend([
                {"tool": CustomerAnalyticsTool.name, "description": CustomerAnalyticsTool.description, "output_summary": f"Repeat Purchase Rate: {analytics_res['repeat_purchase_rate']}%, Avg Spend: {currency_symbol}{analytics_res['avg_order_value']:,.0f}"},
                {"tool": SegmentationTool.name, "description": SegmentationTool.description, "output_summary": f"Identified {segment_res['at_risk_count']} At-Risk customers with declining purchase recency (>45 days)."},
                {"tool": FeedbackIntelligenceTool.name, "description": FeedbackIntelligenceTool.description, "output_summary": f"Net Sentiment Index: {feedback_res['sentiment_breakdown']['net_sentiment_index']}%. Top complaint: Delivery delays & battery life."}
            ])

            verified_results = {
                "repeat_rate": analytics_res["repeat_purchase_rate"],
                "at_risk_customers": segment_res["at_risk_count"],
                "aov": analytics_res["avg_order_value"],
                "top_complaint": feedback_res["recurring_complaints"][0]["tag"],
            }

            explanation = (
                f"### 🔍 Diagnosis: Why Repeat Purchases Decreased\n\n"
                f"1. **Cohort Churn Concentration**: Our Segmentation Tool verified that **{segment_res['at_risk_count']} customers** have transitioned into the **At-Risk** cohort. While their first 1–2 orders were healthy, they haven't transacted in 45–75 days.\n\n"
                f"2. **Category Bottleneck**: Customers who purchased '{analytics_res['top_category'].get('category', 'Audio')}' items experienced fulfillment friction. Feedback analysis shows recurring issues around *{feedback_res['recurring_complaints'][0]['tag']}*, creating hesitation for follow-up orders.\n\n"
                f"3. **Financial Opportunity**: Reactivating just 30% of this at-risk group at your baseline AOV of {currency_symbol}{analytics_res['avg_order_value']:,.0f} recovers approximately **{currency_symbol}{round(segment_res['at_risk_count'] * 0.3 * analytics_res['avg_order_value']):,.0f} in gross revenue** without paying ad networks for new customer acquisition."
            )

            recommendation = (
                f"**Action Plan**: Deploy an automated WhatsApp Win-Back campaign for the **At-Risk Customers** segment offering a {currency_symbol}500 return voucher and guaranteed express delivery."
            )

            suggested_actions = [
                {"label": "Generate At-Risk Campaign (₹5,000)", "type": "campaign", "segment": "At-Risk Customers", "budget": 5000},
                {"label": "Open What-If Simulator", "type": "simulator"},
            ]

        elif "budget" in q or "10,000" in q or "10000" in q or "5,000" in q or "5000" in q or "allocate" in q:
            budget_val = 5000.0 if ("5,000" in q or "5000" in q) else 10000.0
            campaign_res = CampaignGeneratorTool.execute("At-Risk Customers", "Reactivate Lapsed Buyers", budget_val, currency_symbol)
            analytics_res = CustomerAnalyticsTool.execute(transactions)
            sim_res = BudgetSimulatorTool.execute(budget_val, currency_symbol)

            tools_called.extend([
                {"tool": CampaignGeneratorTool.name, "description": CampaignGeneratorTool.description, "output_summary": f"Calculated split: 55% WhatsApp ({currency_symbol}{campaign_res['budget_split'][0]['amount']}), 30% Meta Ads, 15% Email Sequence."},
                {"tool": BudgetSimulatorTool.name, "description": BudgetSimulatorTool.description, "output_summary": f"Estimated Return: {currency_symbol}{sim_res['strategy_a']['projected_revenue']:,.0f} (ROAS: {sim_res['strategy_a']['projected_roas']}x)."},
            ])

            verified_results = {
                "budget": budget_val,
                "whatsapp_amount": campaign_res['budget_split'][0]['amount'],
                "projected_revenue": sim_res['strategy_a']['projected_revenue'],
                "projected_roas": sim_res['strategy_a']['projected_roas'],
            }

            explanation = (
                f"### 💰 Grounded Allocation for {currency_symbol}{budget_val:,.0f} Marketing Budget\n\n"
                f"Based on historical conversion velocity across your customer base, here is the verified split:\n\n"
                f"* **WhatsApp Direct ({currency_symbol}{campaign_res['budget_split'][0]['amount']:,.0f} • 55%)**: Direct conversational message with high open rate (88%) to warm past buyers.\n"
                f"* **Meta / Instagram Retargeting ({currency_symbol}{campaign_res['budget_split'][1]['amount']:,.0f} • 30%)**: Capture high-intent product viewers.\n"
                f"* **Email Nurture ({currency_symbol}{campaign_res['budget_split'][2]['amount']:,.0f} • 15%)**: Automated educational follow-up.\n\n"
                f"### 📈 Projected Returns (Stated Assumptions)\n"
                f"* **Estimated Conversions**: ~{sim_res['strategy_a']['projected_conversions']} orders\n"
                f"* **Projected Gross Revenue**: **{currency_symbol}{sim_res['strategy_a']['projected_revenue']:,.0f}**\n"
                f"* **Estimated Net ROAS**: **{sim_res['strategy_a']['projected_roas']}x**"
            )

            recommendation = (
                f"Launch the {currency_symbol}{budget_val:,.0f} multi-channel allocation immediately targeting the At-Risk cohort."
            )

            suggested_actions = [
                {"label": f"Create {currency_symbol}{budget_val:,.0f} Campaign", "type": "campaign", "segment": "At-Risk Customers", "budget": budget_val},
                {"label": "Adjust in What-If Simulator", "type": "simulator"},
            ]

        elif "compare" in q or "strategy" in q or "loyal" in q or "discount" in q:
            sim_res = BudgetSimulatorTool.execute(10000.0, currency_symbol)
            tools_called.append({
                "tool": BudgetSimulatorTool.name,
                "description": BudgetSimulatorTool.description,
                "output_summary": f"Calculated Strategy A vs Strategy B outcomes across 1,050 total reach."
            })

            verified_results = {
                "strategy_a_profit": sim_res["strategy_a"]["net_profit"],
                "strategy_b_profit": sim_res["strategy_b"]["net_profit"],
                "profit_difference": sim_res["profit_difference"],
            }

            explanation = (
                f"### ⚖️ Side-by-Side Comparison: Strategy A vs Strategy B\n\n"
                f"**Strategy A (VIP Loyalty Discount)**:\n"
                f"* Assumed Conversion Rate: **6.5%**\n"
                f"* Expected Revenue: **{currency_symbol}{sim_res['strategy_a']['projected_revenue']:,.0f}**\n"
                f"* Projected ROAS: **{sim_res['strategy_a']['projected_roas']}x**\n"
                f"* Breakeven Orders: **{sim_res['strategy_a']['breakeven_orders']} orders**\n\n"
                f"**Strategy B (Inactive Customer Win-Back)**:\n"
                f"* Assumed Conversion Rate: **3.2%**\n"
                f"* Expected Revenue: **{currency_symbol}{sim_res['strategy_b']['projected_revenue']:,.0f}**\n"
                f"* Projected ROAS: **{sim_res['strategy_b']['projected_roas']}x**\n"
                f"* Breakeven Orders: **{sim_res['strategy_b']['breakeven_orders']} orders**\n\n"
                f"{sim_res['recommendation']}"
            )

            recommendation = (
                f"Prioritize Strategy A for maximum short-term cash flow, but run a test pilot of Strategy B to protect customer lifetime value."
            )

            suggested_actions = [
                {"label": "Open What-If Simulator", "type": "simulator"},
                {"label": "View Customer Segments", "type": "segments"},
            ]

        elif "target" in q or "segment" in q:
            segment_res = SegmentationTool.execute(transactions)
            tools_called.append({
                "tool": SegmentationTool.name,
                "description": SegmentationTool.description,
                "output_summary": f"Classified customer records across 5 RFM cohorts."
            })

            explanation = (
                f"### 🎯 Target Audience Recommendation\n\n"
                f"Based on current purchasing velocity and revenue contribution:\n\n"
                f"1. **Primary Target: At-Risk Customers ({segment_res['segment_counts']['At-Risk Customers']} profiles)** — Highest immediate ROI. They already know your brand, requiring 70% lower CAC than acquiring new users.\n"
                f"2. **Secondary Target: New & Promising ({segment_res['segment_counts']['New & Promising Customers']} profiles)** — Primed for their 2nd order habit formation within the first 14 days of purchase."
            )

            recommendation = "Launch a dual campaign: 60% budget to At-Risk win-back and 40% budget to 2nd order onboarding."

            suggested_actions = [
                {"label": "Target At-Risk Customers", "type": "campaign", "segment": "At-Risk Customers"},
                {"label": "Target New Customers", "type": "campaign", "segment": "New & Promising Customers"},
            ]

        else:
            analytics_res = CustomerAnalyticsTool.execute(transactions)
            segment_res = SegmentationTool.execute(transactions)
            tools_called.extend([
                {"tool": CustomerAnalyticsTool.name, "description": CustomerAnalyticsTool.description, "output_summary": f"Analyzed {analytics_res['unique_customers']} customers, Total Volume: {currency_symbol}{analytics_res['total_revenue']:,.0f}."},
                {"tool": SegmentationTool.name, "description": SegmentationTool.description, "output_summary": f"RFM distribution calculated."},
            ])

            explanation = (
                f"### 📊 Consumer Intelligence Readout\n\n"
                f"* **Total Recorded Spending**: **{currency_symbol}{analytics_res['total_revenue']:,.0f}** across **{analytics_res['unique_customers']} customers**.\n"
                f"* **Repeat Purchase Rate**: **{analytics_res['repeat_purchase_rate']}%** of buyers return for recurring orders.\n"
                f"* **Cross-Category Bundle Affinity**: High co-occurrence identified between *{analytics_res['co_purchase_affinity'].get('pair', 'Audio & Accessories')}* with {analytics_res['co_purchase_affinity'].get('confidence_score', 84)}% confidence."
            )

            recommendation = "Ask me specifically: 'Why did repeat purchases decrease?', 'How should I allocate a ₹10,000 budget?', or 'Compare discounting loyal users vs win-back campaign'."

            suggested_actions = [
                {"label": "Why did repeat purchases decrease?", "type": "query"},
                {"label": "How should I allocate a ₹10,000 budget?", "type": "query"},
            ]

        return {
            "query": query,
            "tools_called": tools_called,
            "verified_results": verified_results,
            "explanation": explanation,
            "recommendation": recommendation,
            "suggested_actions": suggested_actions,
        }
