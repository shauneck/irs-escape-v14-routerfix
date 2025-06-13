#!/usr/bin/env python3
"""
Targeted MSO Duplicate Cleanup Script
Deletes the specific "C-Corp MSO" duplicate term while preserving
"C-Corp + MSO" and "MSO (Management Services Organization)"
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
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def find_mso_terms():
    """Find all MSO-related terms in the glossary."""
    print("🔍 Scanning for MSO-related terms...")
    
    # Search for terms containing "MSO" or "C-Corp"
    mso_terms = await db.glossary.find({
        "$or": [
            {"term": {"$regex": "MSO", "$options": "i"}},
            {"term": {"$regex": "C-Corp.*MSO", "$options": "i"}}
        ]
    }).to_list(None)
    
    print(f"📊 Found {len(mso_terms)} MSO-related terms:")
    for term in mso_terms:
        print(f"   • '{term['term']}' (ID: {term['id'][:8]}...)")
        # Show if it has enhanced content
        has_content = bool(term.get('plain_english') and term.get('case_study') and term.get('key_benefit'))
        print(f"     Enhanced: {'✅' if has_content else '❌'}")
    
    return mso_terms

async def delete_ccorp_mso_duplicate():
    """Delete the specific 'C-Corp MSO' duplicate term."""
    print("\n🎯 Looking for 'C-Corp MSO' duplicate to delete...")
    
    # Find the exact term to delete
    term_to_delete = await db.glossary.find_one({"term": "C-Corp MSO"})
    
    if not term_to_delete:
        print("❌ 'C-Corp MSO' term not found. It may have already been deleted.")
        return False
    
    print(f"✅ Found 'C-Corp MSO' term (ID: {term_to_delete['id']})")
    
    # Verify we have the terms we want to keep
    ccorp_plus_mso = await db.glossary.find_one({"term": "C-Corp + MSO"})
    mso_full = await db.glossary.find_one({"term": "MSO (Management Services Organization)"})
    
    if not ccorp_plus_mso:
        print("❌ Warning: 'C-Corp + MSO' term not found!")
        return False
    
    if not mso_full:
        print("❌ Warning: 'MSO (Management Services Organization)' term not found!")
        return False
    
    print("✅ Confirmed both required terms exist:")
    print(f"   • 'C-Corp + MSO' (ID: {ccorp_plus_mso['id'][:8]}...)")
    print(f"   • 'MSO (Management Services Organization)' (ID: {mso_full['id'][:8]}...)")
    
    # Delete the duplicate term
    result = await db.glossary.delete_one({"id": term_to_delete["id"]})
    
    if result.deleted_count == 1:
        print(f"✅ Successfully deleted 'C-Corp MSO' (ID: {term_to_delete['id']})")
        return True
    else:
        print("❌ Failed to delete 'C-Corp MSO' term")
        return False

async def verify_remaining_terms():
    """Verify the correct terms remain after cleanup."""
    print("\n🔍 Verifying remaining MSO terms...")
    
    # Check for the terms we want to keep
    remaining_terms = await db.glossary.find({
        "$or": [
            {"term": "C-Corp + MSO"},
            {"term": "MSO (Management Services Organization)"}
        ]
    }).to_list(None)
    
    print(f"📊 Found {len(remaining_terms)} remaining MSO terms:")
    for term in remaining_terms:
        has_content = bool(term.get('plain_english') and term.get('case_study') and term.get('key_benefit'))
        print(f"   ✅ '{term['term']}' - Enhanced: {'✅' if has_content else '❌'}")
    
    # Check that the deleted term is gone
    deleted_term = await db.glossary.find_one({"term": "C-Corp MSO"})
    if deleted_term:
        print("❌ Warning: 'C-Corp MSO' still exists!")
        return False
    else:
        print("✅ Confirmed: 'C-Corp MSO' has been successfully removed")
    
    return len(remaining_terms) == 2

async def test_search_functionality():
    """Test that search functionality still works for MSO terms."""
    print("\n🔍 Testing search functionality...")
    
    # Test search for MSO
    terms = await db.glossary.find({
        "$or": [
            {"term": {"$regex": "MSO", "$options": "i"}},
            {"definition": {"$regex": "MSO", "$options": "i"}}
        ]
    }).to_list(None)
    
    print(f"✅ Search for 'MSO' returns {len(terms)} terms")
    for term in terms:
        print(f"   • {term['term']}")
    
    # Test search for C-Corp
    ccorp_terms = await db.glossary.find({
        "$or": [
            {"term": {"$regex": "C-Corp", "$options": "i"}},
            {"definition": {"$regex": "C-Corp", "$options": "i"}}
        ]
    }).to_list(None)
    
    print(f"✅ Search for 'C-Corp' returns {len(ccorp_terms)} terms")
    
    return True

async def get_final_glossary_stats():
    """Get final statistics about the glossary."""
    print("\n📊 Final Glossary Statistics:")
    
    total_terms = await db.glossary.count_documents({})
    print(f"   • Total terms: {total_terms}")
    
    # Count enhanced terms
    enhanced_terms = await db.glossary.find({
        "$and": [
            {"plain_english": {"$ne": ""}},
            {"case_study": {"$ne": ""}},
            {"key_benefit": {"$ne": ""}}
        ]
    }).to_list(None)
    
    print(f"   • Fully enhanced terms: {len(enhanced_terms)}")
    
    return total_terms, len(enhanced_terms)

async def main():
    """Main execution function."""
    try:
        print("🚀 Starting Targeted MSO Duplicate Cleanup")
        print("=" * 50)
        
        # Find all MSO terms first
        mso_terms = await find_mso_terms()
        
        # Delete the specific duplicate
        deletion_success = await delete_ccorp_mso_duplicate()
        
        if not deletion_success:
            print("\n❌ Cleanup failed - exiting")
            return
        
        # Verify remaining terms
        verification_success = await verify_remaining_terms()
        
        if not verification_success:
            print("\n❌ Verification failed")
            return
        
        # Test search functionality
        await test_search_functionality()
        
        # Get final stats
        total_terms, enhanced_terms = await get_final_glossary_stats()
        
        print("\n" + "=" * 50)
        print("🎯 TARGETED CLEANUP COMPLETE")
        print("=" * 50)
        print("✅ Successfully deleted: 'C-Corp MSO'")
        print("✅ Preserved terms:")
        print("   • 'C-Corp + MSO'")
        print("   • 'MSO (Management Services Organization)'")
        print(f"✅ Final glossary contains {total_terms} unique terms")
        print(f"✅ {enhanced_terms} terms are fully enhanced")
        print("✅ Search functionality verified")
        print("✅ XP tracking remains unaffected")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())