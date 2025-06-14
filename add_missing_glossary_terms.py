#!/usr/bin/env python3
"""
Add Missing Glossary Terms Script

This script adds the remaining glossary terms to reach the required 61 terms
with enhanced formatting (definition, plain_english, case_study, key_benefit).
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
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
db_name = os.environ.get('DB_NAME', 'irs_escape_plan')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Additional glossary terms to reach 61 total
ADDITIONAL_TERMS = [
    {
        "term": "Tax Liability Calculator",
        "definition": "A computational tool that estimates total tax obligations based on income, deductions, credits, and filing status, providing a projection of potential tax burden before filing.",
        "category": "Tax Tools",
        "related_terms": ["Effective Tax Rate", "Tax Planning", "Tax Projection"],
        "tags": ["calculator", "tax estimation", "planning tool", "tax projection"],
        "plain_english": "A tool that helps you estimate how much tax you'll owe based on your income, deductions, and credits. It gives you a preview of your tax situation before you file.",
        "case_study": "Mark, a freelance consultant with variable income, used the Tax Liability Calculator quarterly to estimate his tax payments. By projecting his annual liability of $42,000, he avoided underpayment penalties by making accurate quarterly payments instead of facing a surprise tax bill in April.",
        "key_benefit": "Prevents tax surprises by providing advance knowledge of potential tax obligations, allowing for proactive planning and strategic timing of income and deductions.",
        "client_name": "Mark",
        "structure": "Quarterly tax liability projection for variable income",
        "implementation": "Used calculator to estimate $42,000 annual tax liability and schedule quarterly payments",
        "results": "Avoided underpayment penalties and managed cash flow effectively throughout the year"
    },
    {
        "term": "Payment Plan Estimator",
        "definition": "A financial planning tool that calculates monthly payment amounts, total interest, and repayment timelines for IRS installment agreements based on outstanding tax debt, helping taxpayers evaluate affordability of different payment options.",
        "category": "Tax Resolution",
        "related_terms": ["Installment Agreement", "Tax Debt", "Penalty Abatement", "IRS Collections"],
        "tags": ["payment plan", "installment agreement", "tax debt", "resolution tool"],
        "plain_english": "A calculator that shows you what your monthly payments would be if you set up a payment plan with the IRS for taxes you owe. It helps you figure out if you can afford the payments and how long it will take to pay off your tax debt.",
        "case_study": "Jennifer owed $28,000 in back taxes and couldn't pay in full. Using the Payment Plan Estimator, she determined she could afford $500 monthly payments, resulting in a 60-month plan with $4,200 in additional interest and penalties - knowledge that helped her budget accordingly and avoid defaulting on the agreement.",
        "key_benefit": "Provides clarity on repayment options and total costs, helping taxpayers make informed decisions about resolving tax debt while avoiding unrealistic payment commitments that could lead to default.",
        "client_name": "Jennifer",
        "structure": "IRS installment agreement for $28,000 tax liability",
        "implementation": "Established 60-month payment plan at $500 monthly based on estimator calculations",
        "results": "Successfully budgeted for tax debt resolution while avoiding agreement default"
    },
    {
        "term": "Offer in Compromise Qualifier",
        "definition": "An assessment tool that evaluates a taxpayer's eligibility for the IRS Offer in Compromise program based on income, expenses, asset equity, and ability to pay, providing an estimate of potential settlement amounts for resolving tax debt for less than the full amount owed.",
        "category": "Tax Resolution",
        "related_terms": ["Offer in Compromise", "Tax Settlement", "IRS Collections", "Reasonable Collection Potential"],
        "tags": ["OIC", "tax settlement", "debt resolution", "compromise"],
        "plain_english": "A tool that helps you figure out if you might qualify to settle your tax debt with the IRS for less than you owe. It looks at your income, expenses, and assets to determine if the IRS might accept a reduced payment offer.",
        "case_study": "After a business failure, Daniel owed $120,000 in taxes but had limited income and assets. The OIC Qualifier assessed his financial situation and estimated he could settle for $18,000. He submitted an offer based on this amount, which the IRS accepted, saving him $102,000 while resolving his tax debt completely.",
        "key_benefit": "Provides realistic expectations about settlement possibilities before investing time and application fees in the OIC process, potentially saving thousands in tax debt for qualifying taxpayers.",
        "client_name": "Daniel",
        "structure": "Offer in Compromise for $120,000 tax liability",
        "implementation": "Submitted $18,000 settlement offer based on qualifier assessment",
        "results": "Achieved $102,000 reduction in tax debt through accepted OIC"
    },
    {
        "term": "Entity Builder",
        "definition": "A strategic planning tool that analyzes business activities, income levels, growth projections, and tax objectives to recommend optimal entity structures (LLC, S-Corp, C-Corp, etc.) and potential multi-entity arrangements for maximizing tax benefits and liability protection.",
        "category": "Business Planning",
        "related_terms": ["Business Structure", "Entity Planning", "LLC", "S-Corp", "C-Corp"],
        "tags": ["entity selection", "business structure", "tax optimization", "liability protection"],
        "plain_english": "A tool that helps you choose the best type of business structure based on your specific situation. It recommends whether you should be an LLC, S-Corporation, C-Corporation, or use multiple entities to save on taxes and protect your assets.",
        "case_study": "Michelle's consulting business was growing rapidly at $250K annual revenue. The Entity Builder analyzed her situation and recommended an S-Corp structure with a separate real estate holding LLC. This dual-entity approach saved her $12,800 in self-employment taxes annually while providing enhanced liability protection for her business assets.",
        "key_benefit": "Eliminates guesswork in entity selection by providing data-driven recommendations tailored to your specific business activities, potentially saving thousands in taxes while optimizing legal protection.",
        "client_name": "Michelle",
        "structure": "Consulting business entity optimization",
        "implementation": "Established S-Corp with separate real estate holding LLC based on Entity Builder recommendation",
        "results": "Saved $12,800 annually in self-employment taxes with enhanced asset protection"
    },
    {
        "term": "Build Your Escape Plan",
        "definition": "A comprehensive tax strategy development tool that creates personalized multi-year tax reduction roadmaps based on income sources, entity structures, investment activities, and financial goals, providing step-by-step implementation guidance for legally minimizing tax burden.",
        "category": "Tax Strategy",
        "related_terms": ["Tax Planning", "Strategic Tax Design", "Tax Roadmap", "Implementation Plan"],
        "tags": ["tax strategy", "personalized plan", "implementation roadmap", "tax reduction"],
        "plain_english": "A planning tool that creates a custom tax reduction strategy specifically for your situation. It gives you a step-by-step roadmap showing exactly which tax strategies to implement and when, based on your income, investments, and goals.",
        "case_study": "Jason, a physician earning $450K annually, used the Build Your Escape Plan tool to create a 3-year tax reduction strategy. Following the personalized roadmap, he implemented entity restructuring, real estate investments, and retirement strategies in the recommended sequence, reducing his effective tax rate from 37% to 22% and saving $168,000 in taxes over three years.",
        "key_benefit": "Transforms generic tax knowledge into a specific, actionable implementation plan tailored to your unique situation, eliminating confusion about which strategies apply to you and in what order to implement them.",
        "client_name": "Jason",
        "structure": "3-year personalized tax reduction roadmap for medical professional",
        "implementation": "Sequenced implementation of entity restructuring, real estate investments, and retirement strategies",
        "results": "Reduced effective tax rate from 37% to 22%, saving $168,000 over three years"
    },
    {
        "term": "Cost Segregation Study",
        "definition": "An engineering-based analysis that identifies and reclassifies components of commercial or investment real estate from longer-life categories (39 or 27.5 years) to shorter-life categories (5, 7, or 15 years), accelerating depreciation deductions and improving cash flow through tax savings.",
        "category": "Real Estate Tax",
        "related_terms": ["Depreciation", "Real Estate", "Tax Acceleration", "Bonus Depreciation"],
        "tags": ["cost segregation", "accelerated depreciation", "real estate tax", "property deductions"],
        "plain_english": "A specialized study that breaks down the components of a building to let you write off parts of it faster for tax purposes. Instead of depreciating the entire building over 27.5 or 39 years, you can depreciate certain components over just 5-15 years.",
        "case_study": "Elizabeth purchased a $1.2M commercial property that would normally provide $30,800 in annual depreciation. After a cost segregation study, 28% of the building value was reclassified to 5-15 year property, generating $178,000 in first-year depreciation when combined with bonus depreciation - creating $65,860 in immediate tax savings.",
        "key_benefit": "Dramatically accelerates tax deductions to generate immediate cash flow benefits, often providing 5-10 times more depreciation in the first year compared to standard depreciation methods.",
        "client_name": "Elizabeth",
        "structure": "Cost segregation study for $1.2M commercial property",
        "implementation": "Reclassified 28% of building components to shorter recovery periods",
        "results": "Generated $178,000 first-year depreciation and $65,860 immediate tax savings"
    },
    {
        "term": "Material Participation",
        "definition": "IRS standard under IRC §469 that determines whether a taxpayer is actively involved in a business or rental activity, requiring significant, regular, continuous, and substantial involvement to qualify for treating losses as active rather than passive.",
        "category": "Tax Rules",
        "related_terms": ["Passive Activity", "REPS", "Active vs Passive Income", "Passive Loss Limitation"],
        "tags": ["material participation", "active involvement", "passive activity", "tax treatment"],
        "plain_english": "A set of IRS tests that determine if you're actively involved enough in a business or investment to treat it as an active activity rather than a passive investment. This affects whether you can use losses to offset your other income.",
        "case_study": "Richard owned a side business that generated $30K in losses. By documenting 520 hours of work in the business (meeting the 500-hour material participation test), he qualified the activity as non-passive, allowing him to deduct the full $30K loss against his $180K W-2 income and saving $11,100 in taxes.",
        "key_benefit": "Transforms tax treatment of business and investment activities by allowing losses to offset ordinary income like W-2 wages, potentially saving thousands in taxes through strategic activity management.",
        "client_name": "Richard",
        "structure": "Material participation documentation for side business",
        "implementation": "Tracked and documented 520 hours of business activity to meet 500-hour test",
        "results": "Deducted $30K business loss against W-2 income, saving $11,100 in taxes"
    },
    {
        "term": "Short-Term Rental (STR)",
        "definition": "Residential property rented for periods of less than 30 days, subject to special tax treatment under IRC §469(c)(7) that may allow for active loss treatment when material participation requirements are met, creating significant tax advantages compared to traditional long-term rentals.",
        "category": "Real Estate Tax",
        "related_terms": ["Material Participation", "REPS", "Depreciation", "Active vs Passive Income"],
        "tags": ["short-term rental", "vacation rental", "airbnb", "active rental"],
        "plain_english": "A property you rent out for short stays (less than 30 days) like on Airbnb or VRBO. These have special tax advantages because they're treated more like a business than a passive investment if you're actively involved in managing them.",
        "case_study": "Sophia converted her long-term rental property to a short-term rental and actively managed the property, meeting material participation requirements. The property generated $15K in cash flow but showed a $25K tax loss due to depreciation. Because of STR's special tax treatment, she used this loss to offset her W-2 income, saving $9,250 in taxes.",
        "key_benefit": "Creates potential for both positive cash flow and tax losses that can offset W-2 or other active income, effectively making the IRS a partner in your real estate investment through tax savings.",
        "client_name": "Sophia",
        "structure": "Long-term rental conversion to actively managed STR",
        "implementation": "Documented material participation while generating both cash flow and tax losses",
        "results": "Used $25K tax loss to offset W-2 income while maintaining $15K positive cash flow"
    }
]

async def count_existing_terms():
    """Count the number of existing glossary terms."""
    count = await db.glossary.count_documents({})
    return count

async def add_missing_terms():
    """Add missing glossary terms to reach 61 total."""
    existing_count = await count_existing_terms()
    print(f"Found {existing_count} existing glossary terms")
    
    if existing_count >= 61:
        print("Already have 61 or more glossary terms. No need to add more.")
        return
    
    terms_to_add = ADDITIONAL_TERMS[:61-existing_count]
    print(f"Adding {len(terms_to_add)} new terms to reach 61 total")
    
    for term_data in terms_to_add:
        # Check if term already exists
        existing_term = await db.glossary.find_one({"term": term_data["term"]})
        
        if existing_term:
            print(f"Term already exists: {term_data['term']}")
            continue
        
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
        print(f"✅ Added new term: {term_data['term']}")
    
    final_count = await count_existing_terms()
    print(f"\n🎯 Now have {final_count} glossary terms in total")

async def verify_enhanced_formatting():
    """Verify that all terms have enhanced formatting."""
    terms = await db.glossary.find().to_list(None)
    
    enhanced_fields = ["definition", "plain_english", "case_study", "key_benefit"]
    terms_with_all_fields = 0
    terms_missing_fields = []
    
    for term in terms:
        missing_fields = [field for field in enhanced_fields if not term.get(field) or len(str(term.get(field))) == 0]
        
        if not missing_fields:
            terms_with_all_fields += 1
        else:
            terms_missing_fields.append({
                "term": term["term"],
                "missing_fields": missing_fields
            })
    
    print(f"\n📊 Enhanced Formatting Verification:")
    print(f"   • Total terms: {len(terms)}")
    print(f"   • Terms with all enhanced fields: {terms_with_all_fields}")
    
    if terms_missing_fields:
        print(f"   • Terms missing enhanced fields: {len(terms_missing_fields)}")
        for term_info in terms_missing_fields[:5]:  # Show first 5 for brevity
            print(f"     - '{term_info['term']}' missing: {', '.join(term_info['missing_fields'])}")
        if len(terms_missing_fields) > 5:
            print(f"     - ... and {len(terms_missing_fields) - 5} more terms with missing fields")
    else:
        print("   • All terms have complete enhanced formatting!")

async def main():
    """Main execution function."""
    try:
        print("🚀 Starting Missing Glossary Terms Addition")
        print("=" * 50)
        
        await add_missing_terms()
        await verify_enhanced_formatting()
        
        print("\n" + "=" * 50)
        print("🎯 GLOSSARY ENHANCEMENT COMPLETE")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Error during glossary enhancement: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())