#!/usr/bin/env python3
"""
Fix W-2 Escape Plan Course Structure

This script will:
1. Delete "The Exit Plan" module (incorrect module 2)
2. Delete "The Wealth Multiplier Loop" module 
3. Reorder remaining modules properly
4. Ensure "The IRS Escape Plan" becomes module 9
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

async def fix_w2_course_structure():
    """Fix the W-2 course structure according to requirements."""
    print("🔧 Starting W-2 Escape Plan course structure fix...")
    
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
    
    # Filter out the modules we need to remove
    lessons_to_keep = []
    removed_lessons = []
    
    for lesson in w2_course['lessons']:
        if lesson['title'] == "The Exit Plan":
            removed_lessons.append(lesson['title'])
            print(f"❌ Removing: {lesson['title']}")
        elif lesson['title'] == "The Wealth Multiplier Loop":
            removed_lessons.append(lesson['title'])
            print(f"❌ Removing: {lesson['title']}")
        else:
            lessons_to_keep.append(lesson)
    
    print(f"\n🗑️ Removed {len(removed_lessons)} modules: {removed_lessons}")
    print(f"✅ Keeping {len(lessons_to_keep)} modules")
    
    # Define the correct order for the remaining modules
    correct_order = [
        "The Real Problem with W-2 Income",
        "Repositioning W-2 Income for Strategic Impact", 
        "Stacking Offsets — The Tax Strategy Most W-2 Earners Miss",
        "Qualifying for REPS — The Gateway to Strategic Offsets",
        "Real Estate Professional Status (REPS)",
        "Short-Term Rentals (STRs)",
        "Oil & Gas Deductions",
        "Mapping Your Tax Exposure", 
        "The IRS Escape Plan"
    ]
    
    # Reorder lessons according to correct structure
    ordered_lessons = []
    for i, expected_title in enumerate(correct_order):
        found_lesson = None
        for lesson in lessons_to_keep:
            if lesson['title'] == expected_title:
                found_lesson = lesson
                break
        
        if found_lesson:
            # Update order_index to match correct position
            found_lesson['order_index'] = i
            ordered_lessons.append(found_lesson)
            print(f"✅ Module {i+1}: {found_lesson['title']}")
        else:
            print(f"⚠️ Missing expected module: {expected_title}")
    
    print(f"\n📊 Final structure: {len(ordered_lessons)} modules")
    
    # Update the course with the corrected structure
    update_result = await db.courses.update_one(
        {"type": "w2"},
        {
            "$set": {
                "lessons": ordered_lessons,
                "total_lessons": len(ordered_lessons)
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
    
    return len(ordered_lessons)

async def main():
    """Main execution function."""
    try:
        print("🚀 Starting W-2 Course Structure Fix")
        print("=" * 50)
        
        final_count = await fix_w2_course_structure()
        
        print("\n" + "=" * 50)
        print("🎯 W-2 COURSE STRUCTURE FIX COMPLETE")
        print("=" * 50)
        print(f"✅ Final course has {final_count} modules")
        print("✅ Course structure matches requirements")
        
        if final_count == 9:
            print("🎉 SUCCESS: W-2 course now has exactly 9 modules as required!")
        else:
            print(f"⚠️ WARNING: Expected 9 modules, got {final_count}")
        
    except Exception as e:
        print(f"❌ Error during course fix: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())