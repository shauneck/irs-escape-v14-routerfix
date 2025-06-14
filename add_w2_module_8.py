#!/usr/bin/env python3
"""
Add Missing Module 8 to W-2 Course

This script will:
1. Add "Mapping Your Tax Exposure" as module 8 for W-2 course
2. Update "The IRS Escape Plan" to be module 9
3. Ensure the course has exactly 9 modules
"""

import asyncio
import os
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

# Define the missing module 8 content
MODULE_8_CONTENT = {
    "id": "w2_module_8_mapping",
    "title": "Mapping Your Tax Exposure",
    "description": "Module 8 of 9 - Comprehensive assessment of your W-2 tax situation and strategic planning opportunities",
    "content": """**Mapping Your Tax Exposure** for W-2 earners requires a systematic approach to identify optimization opportunities across income, deductions, timing, and strategic planning. This module walks you through a comprehensive assessment to create your personalized tax reduction roadmap.

## What You'll Learn

<ul>
  <li><strong>Complete W-2 income analysis</strong> including salary, bonuses, RSUs, and equity compensation</li>
  <li><strong>Identification of available deduction strategies</strong> specific to your situation</li>
  <li><strong>Strategic timing opportunities</strong> for income recognition and expense acceleration</li>
  <li><strong>Entity structure planning</strong> for additional income sources</li>
  <li><strong>Real estate investment readiness assessment</strong> for REPS qualification</li>
</ul>

## W-2 Tax Exposure Assessment Framework

### 1. **Income Stream Analysis**

**Primary W-2 Income:**
• Annual salary and projected growth
• Bonus structure and timing control opportunities
• Stock compensation (RSUs, ISOs, ESPPs) and vesting schedules
• Geographic income sourcing (state tax implications)

**Secondary Income Sources:**
• Consulting or freelance income (1099 potential)
• Investment income (dividends, interest, capital gains)
• Rental property income (current or planned)
• Business income from side ventures

### 2. **Deduction Opportunity Mapping**

**Standard vs. Itemized Analysis:**
• Current deduction method and optimization potential
• State and local tax (SALT) limitations and planning
• Charitable giving strategy and timing
• Mortgage interest and other debt considerations

**Business Deduction Potential:**
• Home office usage and documentation
• Professional development and education expenses
• Equipment and technology needs
• Travel and transportation expenses

### 3. **Strategic Planning Opportunities**

**Real Estate Investment Readiness:**
• Available capital for real estate investment
• Time availability for material participation (750-hour test)
• Risk tolerance and investment experience
• Geographic preferences and market knowledge

**Entity Structure Planning:**
• Consulting or side business potential
• LLC or S-Corp election opportunities
• Family entity planning for asset protection
• Trust planning for estate and tax optimization

## Helen's Tax Exposure Mapping

Let's walk through Helen's comprehensive assessment to see how this framework applies:

**Helen's Starting Position:**
• $180K base salary + $220K annual RSU vesting
• 37% marginal tax rate on salary
• 20% long-term capital gains rate on RSUs (after 1-year holding)
• Standard deduction utilization
• No strategic tax planning beyond 401(k) contributions

**Income Stream Analysis:**
• **W-2 Salary:** $180K with 5% annual increases projected
• **RSU Vesting:** $220K annually, creating tax spikes each vesting date
• **Investment Income:** $35K annually from taxable investment accounts
• **Geographic Factors:** California resident (high state taxes)

**Deduction Opportunity Assessment:**
• Currently using standard deduction ($27,700 for 2023)
• Potential itemized deductions: $15K (below standard)
• **Opportunity:** Create business deductions through consulting entity
• **Opportunity:** Charitable giving bunching strategies

**Strategic Planning Assessment:**
• **Real Estate Readiness:** High (strong income, good credit, investment experience)
• **Time Availability:** Medium (can achieve 750-hour test with STR focus)
• **Risk Tolerance:** Medium-high (comfortable with real estate investment)
• **Capital Available:** $400K in liquid investments for real estate down payments

### Helen's Optimization Roadmap

**Phase 1: Foundation (Months 1-6)**
1. **QOF Investment:** Invest RSU gains in Qualified Opportunity Fund
2. **STR Acquisition:** Purchase short-term rental properties in opportunity zones
3. **Entity Setup:** Establish LLC for consulting income and business deductions

**Phase 2: Implementation (Months 7-18)**
1. **REPS Qualification:** Achieve 750-hour material participation in STR management
2. **Cost Segregation:** Accelerate depreciation on STR properties
3. **Business Development:** Scale consulting entity for additional deductions

**Phase 3: Optimization (Months 19-24)**
1. **Depreciation Offset:** Use STR depreciation to offset W-2 income
2. **Income Timing:** Strategic RSU sales and tax-loss harvesting
3. **Advanced Planning:** Trust structures and estate planning integration

## Your Personal Assessment

**Step 1: Income Documentation**
• List all current income sources and amounts
• Identify timing control opportunities
• Project income growth over next 3-5 years
• Assess geographic and state tax implications

**Step 2: Deduction Analysis**
• Calculate current standard vs. itemized benefit
• Identify potential business activities and deductions
• Assess charitable giving and timing opportunities
• Review investment-related deductions

**Step 3: Strategic Readiness**
• Evaluate capital available for real estate investment
• Assess time availability for material participation
• Review risk tolerance and investment experience
• Identify professional advisor team needs

**Step 4: Implementation Planning**
• Prioritize highest-impact opportunities
• Create timeline for strategy implementation
• Identify required professional services (CPA, attorney, etc.)
• Set up monitoring and adjustment processes

## Risk Assessment and Mitigation

**Implementation Risks:**
• **Audit Risk:** Ensure all strategies are well-documented and defensible
• **Liquidity Risk:** Maintain adequate cash reserves for real estate investments
• **Time Risk:** Realistically assess ability to meet material participation requirements
• **Market Risk:** Diversify real estate investments across markets and property types

**Mitigation Strategies:**
• **Professional Guidance:** Work with experienced tax professionals
• **Documentation:** Maintain detailed records of all activities and investments
• **Conservative Estimates:** Use conservative projections for planning purposes
• **Regular Reviews:** Quarterly assessment and strategy adjustments

## Tax Exposure Reduction Timeline

**Immediate Actions (30 days):**
• Complete comprehensive income and deduction analysis
• Identify highest-impact quick wins
• Establish entity structures if needed
• Begin professional advisor team assembly

**Short-term Implementation (3-6 months):**
• Execute real estate investment strategy
• Begin material participation activities
• Implement business deduction strategies
• Establish monitoring and tracking systems

**Long-term Optimization (6-24 months):**
• Achieve REPS qualification
• Maximize depreciation benefits
• Scale successful strategies
• Integrate advanced planning techniques

---

🎯 **Ready to create your escape plan?** Take the Module 8 quiz to earn +50 XP and move to the final module where we'll integrate everything into your complete IRS Escape Plan.""",
    "duration_minutes": 60,
    "order_index": 7,  # 0-based indexing for module 8
    "xp_available": 150
}

async def add_module_8_to_w2_course():
    """Add the missing module 8 to W-2 course."""
    print("🔧 Adding Module 8 to W-2 Escape Plan course...")
    
    # Get the W-2 course
    w2_course = await db.courses.find_one({"type": "w2"})
    if not w2_course:
        print("❌ W-2 course not found!")
        return
    
    print(f"✅ Found W-2 course: {w2_course['title']}")
    print(f"📊 Current lessons count: {len(w2_course['lessons'])}")
    
    # Show current structure
    print("\n📋 Current module structure:")
    for i, lesson in enumerate(w2_course['lessons']):
        print(f"   {i+1}. {lesson['title']} (order_index: {lesson['order_index']})")
    
    # Add the new module 8 and update order_index for module 9
    lessons = w2_course['lessons']
    
    # Insert module 8 at the correct position
    lessons.insert(7, MODULE_8_CONTENT)  # Insert at position 7 (becomes module 8)
    
    # Update order_index for "The IRS Escape Plan" to be module 9
    for lesson in lessons:
        if lesson['title'] == "The IRS Escape Plan":
            lesson['order_index'] = 8  # 0-based indexing for module 9
    
    print(f"\n✅ Added Module 8: {MODULE_8_CONTENT['title']}")
    print(f"📊 New lessons count: {len(lessons)}")
    
    # Update the course with the new structure
    update_result = await db.courses.update_one(
        {"type": "w2"},
        {
            "$set": {
                "lessons": lessons,
                "total_lessons": len(lessons)
            }
        }
    )
    
    if update_result.modified_count > 0:
        print("✅ W-2 course structure updated successfully!")
    else:
        print("❌ Failed to update course structure")
    
    # Verify the update
    print("\n🔍 Verifying updated structure...")
    updated_course = await db.courses.find_one({"type": "w2"})
    print(f"📊 Updated lessons count: {len(updated_course['lessons'])}")
    print("\n📋 Final module structure:")
    for i, lesson in enumerate(updated_course['lessons']):
        print(f"   {i+1}. {lesson['title']} (order_index: {lesson['order_index']})")
    
    return len(updated_course['lessons'])

async def main():
    """Main execution function."""
    try:
        print("🚀 Adding Module 8 to W-2 Course")
        print("=" * 50)
        
        final_count = await add_module_8_to_w2_course()
        
        print("\n" + "=" * 50)
        print("🎯 MODULE 8 ADDITION COMPLETE")
        print("=" * 50)
        print(f"✅ Final course has {final_count} modules")
        
        if final_count == 9:
            print("🎉 SUCCESS: W-2 course now has exactly 9 modules as required!")
        else:
            print(f"⚠️ WARNING: Expected 9 modules, got {final_count}")
        
    except Exception as e:
        print(f"❌ Error during module addition: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())