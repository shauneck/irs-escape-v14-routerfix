#!/usr/bin/env python3
"""
Enhanced Glossary Terms Implementation - Batch 2
Enhances the next 10 glossary terms (11-20) with comprehensive content including:
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

# Enhanced glossary terms data - Batch 2 (Terms 11-20)
ENHANCED_TERMS_BATCH_2 = [
    {
        "term": "Deferred Sales Trust (DST)",
        "definition": "A trust-based structure that allows property owners to defer capital gains taxes on appreciated assets by selling to a trust that pays installments over time, while the trust invests sale proceeds to generate returns that fund the installment payments.",
        "category": "Advanced Strategy",
        "related_terms": ["Capital Gains", "Installment Sale", "Trust", "Tax Deferral"],
        "tags": ["deferred sales trust", "capital gains deferral", "installment sale", "trust structure"],
        "plain_english": "A legal structure that lets you sell appreciated property to a special trust instead of directly to a buyer. This delays your capital gains taxes while the trust invests the money and pays you installments over time.",
        "case_study": "Patricia owned commercial real estate worth $4M with a $500K basis, creating a $3.5M capital gain. Instead of paying $1.2M in taxes immediately, she sold to a DST that paid her $400K annually for 15 years. The trust invested the proceeds, and Patricia received her payments while deferring taxes until each installment was received.",
        "key_benefit": "Defers large capital gains taxes while providing steady income stream and potential for investment growth on the full sale proceeds before taxes are paid.",
        "client_name": "Patricia",
        "structure": "Deferred Sales Trust for commercial real estate exit",
        "implementation": "Sold $4M commercial property to DST with 15-year installment plan",
        "results": "Deferred $1.2M in immediate taxes while receiving $400K annually with investment growth potential"
    },
    {
        "term": "C-Corp + MSO",
        "definition": "Strategic dual-entity structure combining a C-Corporation with a Management Services Organization to optimize income flow, reduce tax rates, and create operational flexibility while accessing corporate benefits and deductions.",
        "category": "Business Structure",
        "related_terms": ["C-Corp", "MSO", "Entity Planning", "Income Shifting"],
        "tags": ["c-corp", "mso", "dual entity", "income optimization"],
        "plain_english": "A business setup using two companies: a main C-Corp for operations and an MSO for management services. This lets you shift income between entities to get the best tax treatment and maximum flexibility.",
        "case_study": "Dr. Martinez restructured his medical practice using a C-Corp for clinical operations and an MSO for administrative services. The MSO captured $180K annually at 21% corporate rates instead of his 37% personal rate, saving $28K in taxes while building corporate equity for potential QSBS treatment.",
        "key_benefit": "Maximizes tax efficiency by optimizing income flow between entities, potentially saving 16%+ on shifted income while building valuable corporate equity.",
        "client_name": "Dr. Martinez",
        "structure": "Medical practice C-Corp + MSO restructuring",
        "implementation": "Created MSO to capture $180K in management fees at corporate rates",
        "results": "Saved $28K annually in taxes while building QSBS-eligible corporate equity"
    },
    {
        "term": "Tax-Free Reorganization (F-Reorg)",
        "definition": "IRC §368 transaction that allows businesses to change their corporate structure, state of incorporation, or other fundamental characteristics without triggering immediate tax consequences, often used to convert entities for QSBS qualification or operational optimization.",
        "category": "Business Strategy",
        "related_terms": ["QSBS", "Corporate Restructuring", "Entity Planning", "Tax-Free Exchange"],
        "tags": ["f-reorganization", "corporate restructuring", "qsbs", "tax-free"],
        "plain_english": "A legal way to change your business structure (like converting from LLC to C-Corp) without paying taxes on the conversion. This is often used to set up businesses for better tax treatment later.",
        "case_study": "Alex's LLC-structured software company was valued at $2M when he decided to pursue QSBS benefits. Through an F-Reorg, he converted to C-Corp without triggering taxes on the conversion, starting his 5-year QSBS holding period. When he sold 6 years later for $12M, he excluded $10M from federal taxes.",
        "key_benefit": "Enables strategic entity changes without immediate tax consequences, opening access to powerful benefits like QSBS while preserving existing business value.",
        "client_name": "Alex",
        "structure": "LLC to C-Corp F-Reorganization for QSBS qualification",
        "implementation": "Tax-free conversion of $2M LLC to C-Corp to start QSBS clock",
        "results": "Achieved $10M capital gains exclusion on eventual $12M sale through QSBS qualification"
    },
    {
        "term": "Bonus Depreciation",
        "definition": "Federal tax provision under IRC §168(k) allowing businesses to immediately deduct 100% of the cost of qualifying business property in the year it's placed in service, rather than depreciating it over multiple years according to normal depreciation schedules.",
        "category": "Business Tax",
        "related_terms": ["Depreciation", "Section 179", "Business Deductions", "Equipment Purchase"],
        "tags": ["bonus depreciation", "100% depreciation", "equipment deduction", "first-year writeoff"],
        "plain_english": "A tax rule that lets businesses write off the full cost of equipment, vehicles, and certain improvements in the same year they buy them, instead of spreading the deduction over many years.",
        "case_study": "Rachel's architecture firm purchased $150K in computers, software, and office equipment. Using bonus depreciation, she deducted the entire amount in year one, reducing her taxable income by $150K and saving $52K in federal and state taxes - cash flow she used for additional business investments.",
        "key_benefit": "Accelerates tax benefits to improve cash flow and reduce current-year liability, effectively providing a 30-40% discount on qualifying business assets through immediate tax savings.",
        "client_name": "Rachel",
        "structure": "Bonus depreciation for architecture firm equipment purchase",
        "implementation": "Purchased $150K in business equipment with immediate 100% deduction",
        "results": "Generated $52K in immediate tax savings, improving cash flow for business growth"
    },
    {
        "term": "Qualified Intermediary (QI)",
        "definition": "Independent third party that facilitates like-kind exchanges under IRC §1031 by holding exchange funds and coordinating the transfer of relinquished and replacement properties to ensure compliance with exchange timing and procedural requirements.",
        "category": "Real Estate Strategy",
        "related_terms": ["1031 Exchange", "Like-Kind Exchange", "Real Estate", "Tax Deferral"],
        "tags": ["qualified intermediary", "1031 exchange", "like-kind exchange", "real estate"],
        "plain_english": "A specialized company that handles the paperwork and money transfers for 1031 exchanges, ensuring you follow all the rules to defer taxes when swapping one investment property for another.",
        "case_study": "Thomas wanted to exchange his $800K rental duplex for a $1.2M apartment building. His Qualified Intermediary held the $800K sale proceeds, identified the replacement property within 45 days, and completed the exchange within 180 days, allowing Thomas to defer $180K in capital gains taxes.",
        "key_benefit": "Ensures 1031 exchange compliance while handling complex timing and procedural requirements, enabling successful tax deferral on real estate transactions.",
        "client_name": "Thomas",
        "structure": "1031 exchange facilitated by Qualified Intermediary",
        "implementation": "Exchanged $800K duplex for $1.2M apartment building through QI",
        "results": "Successfully deferred $180K in capital gains taxes while upgrading investment property"
    },
    {
        "term": "MSO (Management Services Organization)",
        "definition": "Business entity that provides administrative, management, and support services to other businesses, often used in tax planning to shift income from high-tax personal rates to lower corporate tax rates while maintaining operational control.",
        "category": "Business Structure",
        "related_terms": ["C-Corp", "Income Shifting", "Entity Planning", "Business Structure"],
        "tags": ["mso", "management services", "income shifting", "business structure"],
        "plain_english": "A separate business that provides management and administrative services to your main business. This structure lets you move some income to the MSO where it might be taxed at lower corporate rates.",
        "case_study": "Susan's dental practice generated $450K annually, all taxed at personal rates up to 37%. She created an MSO that provided practice management services for $120K annually, captured at 21% corporate rates. This saved $19K in annual taxes while building corporate equity.",
        "key_benefit": "Shifts income from high personal tax rates to lower corporate rates while building valuable business equity, typically saving 16%+ on shifted income.",
        "client_name": "Susan",
        "structure": "Dental practice MSO for income optimization",
        "implementation": "Created MSO capturing $120K in management fees at corporate rates",
        "results": "Saved $19K annually while building corporate equity for potential exit strategies"
    },
    {
        "term": "Capital Gains Harvesting",
        "definition": "Strategic realization of capital gains in low-income years or coordination with offsetting losses to minimize overall tax impact, often combined with tax-loss harvesting to optimize after-tax investment returns.",
        "category": "Investment Strategy",
        "related_terms": ["Capital Gains", "Tax-Loss Harvesting", "Investment Strategy", "Tax Optimization"],
        "tags": ["capital gains harvesting", "tax optimization", "investment strategy", "gain realization"],
        "plain_english": "Strategically selling investments that have gained value during years when you're in lower tax brackets or have losses to offset the gains, minimizing the taxes you'll pay.",
        "case_study": "During a sabbatical year with only $40K in income, Maria harvested $80K in capital gains from her investment portfolio, staying within the 0% capital gains bracket. This allowed her to reset her basis in appreciated assets without paying any federal capital gains taxes.",
        "key_benefit": "Optimizes tax impact of investment gains through strategic timing, potentially achieving 0% tax rates on capital gains in low-income years.",
        "client_name": "Maria",
        "structure": "Capital gains harvesting during low-income sabbatical year",
        "implementation": "Realized $80K in capital gains while in 0% capital gains tax bracket",
        "results": "Reset basis in appreciated assets with zero federal capital gains tax liability"
    },
    {
        "term": "Section 1202 (QSBS)",
        "definition": "IRC §1202 provision allowing shareholders of qualifying small business corporations to exclude up to $10 million or 10 times their basis (whichever is greater) in capital gains from federal taxation when stock is held for at least 5 years.",
        "category": "Business Exit Strategy",
        "related_terms": ["QSBS", "C-Corp", "Capital Gains Exclusion", "Small Business Stock"],
        "tags": ["section 1202", "qsbs", "capital gains exclusion", "small business"],
        "plain_english": "A special tax law that lets small business owners sell their company stock completely tax-free at the federal level if they structure it as a C-Corp and hold it for 5+ years. The exclusion can be worth millions.",
        "case_study": "Carlos founded a fintech startup as a C-Corp and held his Section 1202 stock for 7 years. When the company was acquired for $15M, he qualified for $10M in capital gains exclusion, avoiding $3.7M in federal taxes and keeping significantly more of his life's work.",
        "key_benefit": "Provides the largest possible federal tax exclusion for business exits, potentially saving $3.7M+ in federal taxes and representing the ultimate goal for entrepreneur tax planning.",
        "client_name": "Carlos",
        "structure": "Section 1202 QSBS qualification for fintech startup exit",
        "implementation": "Maintained C-Corp structure and 7-year holding period for optimal qualification",
        "results": "Excluded $10M from federal taxation on $15M acquisition, saving $3.7M in taxes"
    },
    {
        "term": "Installment Sale",
        "definition": "Tax election under IRC §453 allowing sellers to recognize capital gains over multiple years as payments are received, rather than recognizing the entire gain in the year of sale, potentially reducing overall tax burden through bracket management.",
        "category": "Exit Strategy",
        "related_terms": ["Capital Gains", "Tax Timing", "Business Sale", "Payment Plans"],
        "tags": ["installment sale", "gain recognition", "tax timing", "bracket management"],
        "plain_english": "A way to sell your business or property by receiving payments over several years and only paying taxes as you receive each payment, potentially keeping you in lower tax brackets.",
        "case_study": "Instead of receiving $6M upfront for his manufacturing business, David structured a 6-year installment sale receiving $1M annually. This kept him in the 20% capital gains bracket each year instead of the 37% rate on a lump sum, saving over $1M in federal taxes.",
        "key_benefit": "Reduces overall tax rate through bracket arbitrage while providing predictable income stream, often saving 15-17% compared to lump-sum gain recognition.",
        "client_name": "David",
        "structure": "6-year installment sale for manufacturing business exit",
        "implementation": "Structured $6M sale as $1M annual payments to optimize tax brackets",
        "results": "Saved over $1M in federal taxes through bracket management vs. lump-sum sale"
    },
    {
        "term": "Entity Layering",
        "definition": "Strategic use of multiple business entities in a coordinated structure to optimize tax treatment, provide asset protection, and create operational flexibility while maintaining compliance with tax and legal requirements.",
        "category": "Advanced Strategy",
        "related_terms": ["Business Structure", "Asset Protection", "Tax Optimization", "Multi-Entity Planning"],
        "tags": ["entity layering", "multi-entity", "asset protection", "tax optimization"],
        "plain_english": "Using multiple related business entities working together to get the best tax treatment and protection. Like having different companies that each do specific jobs to optimize your overall business structure.",
        "case_study": "Rebecca's consulting business uses entity layering: an LLC for operations, a C-Corp MSO for management services, and a holding company for real estate. This structure reduced her overall tax rate from 37% to an effective 24% while providing comprehensive asset protection.",
        "key_benefit": "Maximizes tax efficiency and asset protection through strategic entity coordination, often reducing effective tax rates by 10-15% while providing superior liability protection.",
        "client_name": "Rebecca",
        "structure": "Multi-entity layering for consulting business optimization",
        "implementation": "Coordinated LLC, C-Corp MSO, and holding company structure",
        "results": "Reduced effective tax rate from 37% to 24% with enhanced asset protection"
    }
]

async def enhance_glossary_terms_batch_2():
    """Update or create enhanced glossary terms for batch 2."""
    print("Starting glossary enhancement - Batch 2 (Terms 11-20)...")
    
    for term_data in ENHANCED_TERMS_BATCH_2:
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
    
    print(f"\n🎯 Enhanced {len(ENHANCED_TERMS_BATCH_2)} glossary terms successfully!")
    print("\nBatch 2 Enhanced terms (11-20):")
    for i, term in enumerate(ENHANCED_TERMS_BATCH_2, 11):
        print(f"{i:2d}. {term['term']}")

async def main():
    """Main execution function."""
    try:
        await enhance_glossary_terms_batch_2()
        print("\n✅ Glossary enhancement batch 2 completed successfully!")
        
        # Get total count of glossary terms
        total_terms = await db.glossary.count_documents({})
        print(f"\n📊 Total glossary terms in database: {total_terms}")
        
    except Exception as e:
        print(f"❌ Error during enhancement: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())