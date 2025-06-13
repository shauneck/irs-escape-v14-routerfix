#!/usr/bin/env python3
"""
Enhanced Glossary Terms Implementation
Enhances the first 10 glossary terms with comprehensive content including:
- Clear technical definitions
- Plain English explanations
- Real-world case studies
- Key benefits
"""

import asyncio
import os
import uuid
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Enhanced glossary terms data
ENHANCED_TERMS = [
    {
        "term": "REPS (Real Estate Professional Status)",
        "definition": "IRS designation under IRC §469(c)(7) that allows qualifying individuals to treat real estate activities as active business rather than passive investments, removing passive loss limitations and enabling real estate losses to offset W-2 income dollar-for-dollar.",
        "category": "Real Estate Tax",
        "related_terms": ["Material Participation", "Passive Loss Limitation", "Active vs Passive Income", "IRS Time Test"],
        "tags": ["real estate", "tax status", "w2 offset", "active income"],
        "plain_english": "A special tax status that lets you use losses from rental properties to reduce your regular job income taxes. Without this status, rental losses can only reduce rental income. With REPS, you can use them to reduce your salary taxes too.",
        "case_study": "Sarah, a software engineer earning $180K annually, qualified for REPS by spending 1,200 hours managing her short-term rental portfolio. Her properties generated $45K in depreciation losses, which she used to eliminate $15K in federal taxes on her W-2 income - money that would have been trapped without REPS qualification.",
        "key_benefit": "Transforms real estate from a passive investment into an active tax reduction tool, potentially saving high-income W-2 earners $20K-50K+ annually in federal taxes.",
        "client_name": "Sarah",
        "structure": "REPS qualification strategy for tech professional",
        "implementation": "Documented 1,200+ hours of active property management across STR portfolio",
        "results": "Used $45K in depreciation to eliminate $15K in federal taxes on W-2 income"
    },
    {
        "term": "QOF (Qualified Opportunity Fund)",
        "definition": "Tax-advantaged investment vehicle under IRC §1400Z-2 designed to encourage investment in designated low-income communities. QOFs allow investors to defer capital gains taxes and potentially eliminate taxes on new appreciation after 10+ years.",
        "category": "Investment Strategy",
        "related_terms": ["Capital Gains", "Tax Deferral", "Investment Strategy", "Opportunity Zones"],
        "tags": ["capital gains", "tax deferral", "investment", "economic development"],
        "plain_english": "A special investment fund that lets you delay paying taxes on profits from selling stocks, real estate, or businesses. If you hold the investment for 10+ years, you never pay taxes on any new profits it makes.",
        "case_study": "Marcus sold his tech company for $2M, creating a $1.6M capital gains tax bill. Instead of paying $600K immediately, he invested the full proceeds into a QOF real estate development project. After 10 years, his investment grew to $3.8M - paying zero taxes on the original gain or the new $1.8M growth.",
        "key_benefit": "Defers immediate capital gains taxes while building wealth in a tax-free growth environment, potentially saving 20-37% on both original gains and all future appreciation.",
        "client_name": "Marcus",
        "structure": "QOF investment for business sale proceeds deferral",
        "implementation": "Invested $2M business sale proceeds into QOF real estate development within 180-day window",
        "results": "Deferred $600K in immediate taxes and achieved tax-free growth to $3.8M over 10 years"
    },
    {
        "term": "QSBS (Qualified Small Business Stock)",
        "definition": "Under IRC §1202, stock in qualifying C-corporations that meets specific requirements, allowing shareholders to exclude up to $10 million in capital gains from federal taxation when sold after holding for at least 5 years.",
        "category": "Business Exit Strategy",
        "related_terms": ["C-Corp", "Capital Gains", "Exit Planning", "Business Structure"],
        "tags": ["business exit", "capital gains exclusion", "c-corp", "startup"],
        "plain_english": "A special tax benefit for small business owners who sell their company stock. If you structure properly and wait 5 years, you can sell up to $10 million of your business tax-free at the federal level.",
        "case_study": "Jennifer founded a software company, properly structured it as a C-Corp, and held her QSBS for 6 years. When she sold for $8M, she qualified for the full QSBS exclusion, avoiding $2.6M in federal capital gains taxes - money she reinvested to start her next venture.",
        "key_benefit": "Eliminates up to $3.7M in federal taxes on business exits, making it the most powerful wealth preservation tool for entrepreneurs and startup founders.",
        "client_name": "Jennifer",
        "structure": "QSBS qualification for software company exit",
        "implementation": "Structured C-Corp from inception and maintained compliance for 6-year holding period",
        "results": "Achieved $8M tax-free business sale, avoiding $2.6M in federal capital gains taxes"
    },
    {
        "term": "Loan-Based Split Dollar",
        "definition": "Life insurance arrangement where one party (typically a business) loans premium payments to another party (typically a trust) to purchase life insurance, with the lender recovering loan amounts and the borrower owning policy growth and death benefits.",
        "category": "Estate Planning",
        "related_terms": ["Life Insurance", "Estate Planning", "Trust", "Asset Protection"],
        "tags": ["life insurance", "estate planning", "split dollar", "wealth transfer"],
        "plain_english": "A strategy where your business loans money to a trust to buy life insurance on your life. Your business gets its loan money back, while the trust owns the policy and all its growth - creating wealth outside your taxable estate.",
        "case_study": "Dr. Williams' medical practice loaned $50K annually to his irrevocable trust to purchase life insurance. Over 15 years, the practice recovered its $750K in loans, while the trust accumulated $1.8M in tax-free cash value and a $5M death benefit - all outside his taxable estate.",
        "key_benefit": "Creates substantial wealth outside your estate while your business funds the premiums, potentially transferring millions tax-free to beneficiaries while maintaining liquidity.",
        "client_name": "Dr. Williams",
        "structure": "Split-dollar life insurance for estate planning",
        "implementation": "Medical practice loans $50K annually to irrevocable trust for premium payments",
        "results": "Built $1.8M tax-free wealth and $5M death benefit outside estate over 15 years"
    },
    {
        "term": "Irrevocable Grantor Trust",
        "definition": "Trust structure where the grantor irrevocably transfers assets but retains certain powers that make them responsible for income taxes, allowing trust assets to grow without tax burden while removing appreciation from the grantor's estate.",
        "category": "Estate Planning",
        "related_terms": ["Estate Planning", "Trust", "Asset Protection", "Wealth Transfer"],
        "tags": ["trust", "estate planning", "asset protection", "wealth transfer"],
        "plain_english": "A permanent trust where you give away assets but still pay the taxes on the income they generate. This lets the trust keep all its earnings and grow faster, while removing the assets from your taxable estate.",
        "case_study": "Robert transferred $1M in growth stocks to an irrevocable grantor trust for his children. Over 10 years, he paid $180K in taxes on the trust's income, but this allowed the trust to grow to $3.2M tax-free - wealth that would have been in his taxable estate if he'd kept it personally.",
        "key_benefit": "Accelerates wealth transfer by removing tax drag from trust growth while shifting appreciating assets out of your estate, potentially saving millions in estate taxes.",
        "client_name": "Robert",
        "structure": "Irrevocable grantor trust for growth stock transfer",
        "implementation": "Transferred $1M growth portfolio to trust while retaining grantor tax status",
        "results": "Trust grew to $3.2M tax-free over 10 years while removing assets from taxable estate"
    },
    {
        "term": "C-Corp (C Corporation)",
        "definition": "Corporate entity taxed separately from its owners under Subchapter C of the Internal Revenue Code, subject to corporate income tax rates (currently 21%) with the ability to retain earnings and provide extensive fringe benefits to owner-employees.",
        "category": "Business Structure",
        "related_terms": ["Business Structure", "Entity Planning", "QSBS", "Corporate Tax Rates"],
        "tags": ["business structure", "corporate tax", "entity planning", "double taxation"],
        "plain_english": "A business structure that's taxed as its own entity at 21% corporate rates. Unlike other business types, profits don't automatically flow to your personal tax return, letting you control when and how income reaches you personally.",
        "case_study": "Lisa's consulting firm generated $400K annually as an LLC, creating a $148K personal tax burden. After converting to C-Corp, she pays herself $120K salary and retains $280K in the corporation at 21% rates, reducing her total tax burden by $43K annually while building corporate wealth.",
        "key_benefit": "Provides access to the lowest federal business tax rate (21%), enables income timing control, and creates qualification path for QSBS benefits - potentially saving high earners 16%+ on retained business income.",
        "client_name": "Lisa",
        "structure": "LLC to C-Corp conversion for tax optimization",
        "implementation": "Restructured consulting firm to retain earnings at corporate rates vs. personal rates",
        "results": "Reduced annual tax burden by $43K while building corporate equity for potential QSBS exit"
    },
    {
        "term": "S-Corp (S Corporation)",
        "definition": "Pass-through entity election under Subchapter S that eliminates corporate-level taxation while requiring owners to take reasonable salary subject to payroll taxes, with remaining profits distributed without additional employment taxes.",
        "category": "Business Structure",
        "related_terms": ["Business Structure", "Entity Planning", "Payroll Tax", "Pass-Through Taxation"],
        "tags": ["business structure", "s-corp election", "payroll tax savings", "pass-through"],
        "plain_english": "A business election that lets you pay yourself a reasonable salary (with normal payroll taxes) and take additional profits as distributions (without payroll taxes). This can save 15.3% on the profit portion.",
        "case_study": "James' freelance business earned $180K annually as a sole proprietor, creating $27K in self-employment taxes. After S-Corp election with $80K salary and $100K distributions, his employment taxes dropped to $12K, saving $15K annually while maintaining the same total income.",
        "key_benefit": "Eliminates self-employment taxes on business profits above reasonable salary, typically saving business owners $5K-25K annually depending on income level.",
        "client_name": "James",
        "structure": "Sole proprietor to S-Corp election for payroll tax optimization",
        "implementation": "Elected S-Corp status with $80K reasonable salary and $100K distributions",
        "results": "Reduced self-employment taxes from $27K to $12K, saving $15K annually"
    },
    {
        "term": "Installment Sale (Section 453)",
        "definition": "Tax method under IRC §453 that allows sellers to spread capital gains recognition over multiple years by receiving payments over time, potentially reducing overall tax burden through rate arbitrage and annual exclusion utilization.",
        "category": "Exit Strategy",
        "related_terms": ["Capital Gains", "Exit Planning", "Tax Timing", "Business Sale"],
        "tags": ["installment sale", "capital gains", "tax timing", "business exit"],
        "plain_english": "A way to sell your business or property by receiving payments over several years instead of all at once. This spreads out the tax burden and can keep you in lower tax brackets compared to receiving a lump sum.",
        "case_study": "Michael sold his manufacturing business for $5M using a 5-year installment plan ($1M annually). Instead of paying 37% on the entire gain immediately, he stayed in the 20% capital gains bracket each year, saving $850K in federal taxes while earning interest on the deferred payments.",
        "key_benefit": "Reduces overall tax rate through bracket management while providing steady income stream, potentially saving 17%+ on large capital gains compared to lump-sum recognition.",
        "client_name": "Michael",
        "structure": "5-year installment sale for manufacturing business exit",
        "implementation": "Structured $5M business sale as $1M annual payments over 5 years",
        "results": "Saved $850K in federal taxes through bracket arbitrage vs. lump-sum sale"
    },
    {
        "term": "Passive Losses",
        "definition": "Tax losses from passive activities (investments where the taxpayer doesn't materially participate) that are generally limited to offsetting only passive income under IRC §469, with excess losses suspended until future passive income or property disposition.",
        "category": "Tax Rules",
        "related_terms": ["Passive Loss Limitation", "Material Participation", "REPS", "Real Estate"],
        "tags": ["passive losses", "tax limitations", "real estate", "investment losses"],
        "plain_english": "Losses from investments where you're not actively involved (like rental properties managed by others) that can usually only reduce income from similar passive investments, not your job income.",
        "case_study": "Kevin owned rental properties that generated $30K in depreciation losses annually, but as a passive investor, these losses couldn't offset his $200K W-2 income. The losses accumulated as 'suspended' until he either generates passive income or qualifies for REPS to make them active.",
        "key_benefit": "Understanding passive loss limitations helps identify opportunities to activate suspended losses through REPS qualification or material participation, potentially unlocking thousands in previously unusable tax benefits.",
        "client_name": "Kevin",
        "structure": "Passive real estate investment with suspended losses",
        "implementation": "Accumulated $30K annual depreciation losses from rental properties",
        "results": "Suspended losses totaling $150K over 5 years, awaiting REPS qualification to activate"
    },
    {
        "term": "Advanced Depreciation (Bonus Depreciation & Section 179)",
        "definition": "Accelerated depreciation methods allowing businesses to immediately deduct 100% of qualifying asset costs in the year of purchase (Bonus Depreciation) or elect to expense up to $1.16M in equipment annually (Section 179), rather than depreciating over multiple years.",
        "category": "Business Tax",
        "related_terms": ["Depreciation", "Business Deductions", "Strategic Deductions", "Equipment Purchases"],
        "tags": ["bonus depreciation", "section 179", "equipment deduction", "tax acceleration"],
        "plain_english": "Tax rules that let businesses write off the full cost of equipment, vehicles, and certain improvements immediately instead of spreading the deduction over many years. This creates large first-year tax savings.",
        "case_study": "Amanda's dental practice purchased $240K in new equipment and technology. Using bonus depreciation, she deducted the entire amount in year one, reducing her taxable income by $240K and saving $86K in federal and state taxes - cash flow she reinvested in practice growth.",
        "key_benefit": "Accelerates tax benefits to improve cash flow and reduce current-year tax liability, potentially saving 30-40% of equipment costs through immediate tax deductions rather than waiting years for depreciation benefits.",
        "client_name": "Amanda", 
        "structure": "Equipment purchase with bonus depreciation for dental practice",
        "implementation": "Purchased $240K in dental equipment with immediate 100% deduction",
        "results": "Generated $86K in immediate tax savings, improving cash flow for practice expansion"
    }
]

async def enhance_glossary_terms():
    """Update or create enhanced glossary terms."""
    print("Starting glossary enhancement...")
    
    for term_data in ENHANCED_TERMS:
        # Check if term already exists
        existing_term = await db.glossary.find_one({"term": term_data["term"]})
        
        if existing_term:
            # Update existing term
            update_data = {
                "definition": term_data["definition"],
                "category": term_data["category"],
                "related_terms": term_data["related_terms"],
                "tags": term_data["tags"],
                "plain_english": term_data["plain_english"],
                "case_study": term_data["case_study"],
                "key_benefit": term_data["key_benefit"],
                "client_name": term_data["client_name"],
                "structure": term_data["structure"],
                "implementation": term_data["implementation"],
                "results": term_data["results"]
            }
            
            await db.glossary.update_one(
                {"id": existing_term["id"]},
                {"$set": update_data}
            )
            print(f"✅ Updated existing term: {term_data['term']}")
        else:
            # Create new term
            new_term = {
                "id": str(uuid.uuid4()),
                "term": term_data["term"],
                "definition": term_data["definition"],
                "category": term_data["category"],
                "related_terms": term_data["related_terms"],
                "tags": term_data["tags"],
                "plain_english": term_data["plain_english"],
                "case_study": term_data["case_study"],
                "key_benefit": term_data["key_benefit"],
                "client_name": term_data["client_name"],
                "structure": term_data["structure"],
                "implementation": term_data["implementation"],
                "results": term_data["results"]
            }
            
            await db.glossary.insert_one(new_term)
            print(f"✅ Created new term: {term_data['term']}")
    
    print(f"\n🎯 Enhanced {len(ENHANCED_TERMS)} glossary terms successfully!")
    print("\nEnhanced terms:")
    for i, term in enumerate(ENHANCED_TERMS, 1):
        print(f"{i:2d}. {term['term']}")

async def main():
    """Main execution function."""
    try:
        await enhance_glossary_terms()
        print("\n✅ Glossary enhancement completed successfully!")
    except Exception as e:
        print(f"❌ Error during enhancement: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())