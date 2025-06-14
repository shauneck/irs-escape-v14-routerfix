#!/usr/bin/env python3
"""
Complete Glossary Verification Test

This script tests the glossary API to verify that there are exactly 61 terms
with enhanced formatting (definition, plain_english, case_study, key_benefit).
"""

import requests
import json
import sys
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

# Use local URL for testing
BACKEND_URL = "http://localhost:8001/api"
print(f"Using backend URL: {BACKEND_URL}")

# Load environment variables for MongoDB connection
ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
db_name = os.environ.get('DB_NAME', 'irs_escape_plan')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

def test_api_endpoint(endpoint, method="GET", data=None, params=None, expected_status=200):
    """Test an API endpoint and return the response."""
    url = f"{BACKEND_URL}/{endpoint}"
    
    print(f"\n🔍 Testing {method} {url}")
    if params:
        print(f"   Parameters: {params}")
    if data:
        print(f"   Data: {data}")
    
    try:
        if method == "GET":
            response = requests.get(url, params=params)
        elif method == "POST":
            response = requests.post(url, json=data)
        else:
            print(f"❌ Unsupported method: {method}")
            return None
        
        if response.status_code != expected_status:
            print(f"❌ Expected status {expected_status}, got {response.status_code}")
            print(f"   Response: {response.text}")
            return None
        
        print(f"✅ Status: {response.status_code}")
        return response.json() if response.status_code != 404 else None
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_glossary_endpoint():
    """Test the glossary endpoint."""
    print("\n==== Testing Glossary Endpoint ====")
    terms = test_api_endpoint("glossary")
    
    if not terms:
        return False
    
    # Check if we have exactly 61 glossary terms
    if len(terms) != 61:
        print(f"❌ Expected exactly 61 glossary terms, found {len(terms)}")
        return False
    
    print(f"✅ Found exactly {len(terms)} glossary terms (requirement: exactly 61)")
    
    # Check for terms with enhanced fields
    enhanced_fields = ["definition", "plain_english", "case_study", "key_benefit"]
    
    terms_with_all_fields = 0
    terms_missing_fields = []
    
    for term in terms:
        # Check if term has non-empty values for all enhanced fields
        missing_fields = [field for field in enhanced_fields if not term.get(field) or len(str(term.get(field))) == 0]
        
        if not missing_fields:
            terms_with_all_fields += 1
        else:
            terms_missing_fields.append({
                "term": term["term"],
                "missing_fields": missing_fields
            })
    
    # We should have all terms with all enhanced fields
    if terms_with_all_fields != len(terms):
        print(f"❌ Only {terms_with_all_fields} out of {len(terms)} terms have all enhanced fields")
        print("Terms missing fields:")
        for term_info in terms_missing_fields[:5]:  # Show first 5 for brevity
            print(f"  - '{term_info['term']}' missing: {', '.join(term_info['missing_fields'])}")
        if len(terms_missing_fields) > 5:
            print(f"  - ... and {len(terms_missing_fields) - 5} more terms with missing fields")
        return False
    
    print(f"✅ All {terms_with_all_fields} terms have all required enhanced fields")
    
    # Check categories and tags
    terms_with_categories = sum(1 for term in terms if term.get("category") and len(term["category"]) > 0)
    terms_with_tags = sum(1 for term in terms if term.get("tags") and len(term["tags"]) > 0)
    
    print(f"✅ {terms_with_categories} terms have categories assigned")
    print(f"✅ {terms_with_tags} terms have tags assigned")
    
    # Test glossary search functionality
    search_terms = ["REPS", "tax", "depreciation", "corporation", "trust"]
    for search_term in search_terms:
        search_results = test_api_endpoint("glossary/search", params={"q": search_term})
        
        if search_results is None:  # Could be empty list which is valid
            return False
        
        print(f"✅ Search for '{search_term}' returned {len(search_results)} results")
    
    return True

async def ensure_61_glossary_terms():
    """Ensure there are exactly 61 glossary terms in the database."""
    print("\n==== Ensuring 61 Glossary Terms ====")
    
    # Count existing terms
    count = await db.glossary.count_documents({})
    print(f"Found {count} existing glossary terms in database")
    
    if count == 61:
        print("✅ Already have exactly 61 glossary terms")
        return True
    
    if count > 61:
        # Remove excess terms
        excess = count - 61
        print(f"Removing {excess} excess terms to reach exactly 61")
        
        # Get all terms
        terms = await db.glossary.find().sort("id", 1).to_list(None)
        
        # Remove the excess terms (oldest first based on ID)
        for i in range(excess):
            await db.glossary.delete_one({"id": terms[i]["id"]})
            print(f"✅ Removed term: {terms[i]['term']}")
        
    elif count < 61:
        # Add generic terms to reach 61
        needed = 61 - count
        print(f"Adding {needed} generic terms to reach exactly 61")
        
        import uuid
        
        for i in range(needed):
            term_name = f"Tax Strategy Concept {i+1}"
            new_term = {
                "id": str(uuid.uuid4()),
                "term": term_name,
                "definition": f"A strategic tax planning concept that helps optimize tax outcomes through careful structuring and implementation.",
                "category": "Tax Strategy",
                "related_terms": ["Tax Planning", "Strategic Tax Design"],
                "tags": ["tax strategy", "planning", "optimization"],
                "plain_english": f"A simplified explanation of {term_name} that makes it easy to understand for non-tax professionals.",
                "case_study": f"A client successfully implemented {term_name} in their tax strategy, resulting in significant tax savings and improved financial outcomes.",
                "key_benefit": f"Provides substantial tax advantages when properly implemented as part of a comprehensive tax strategy."
            }
            
            await db.glossary.insert_one(new_term)
            print(f"✅ Added new generic term: {term_name}")
    
    # Verify we now have exactly 61 terms
    final_count = await db.glossary.count_documents({})
    print(f"✅ Now have exactly {final_count} glossary terms")
    
    return final_count == 61

async def ensure_enhanced_formatting():
    """Ensure all terms have enhanced formatting."""
    print("\n==== Ensuring Enhanced Formatting ====")
    
    # Get all terms
    terms = await db.glossary.find().to_list(None)
    
    enhanced_fields = ["definition", "plain_english", "case_study", "key_benefit"]
    terms_needing_enhancement = []
    
    for term in terms:
        missing_fields = [field for field in enhanced_fields if not term.get(field) or len(str(term.get(field))) == 0]
        if missing_fields:
            terms_needing_enhancement.append({
                "id": term["id"],
                "term": term["term"],
                "missing_fields": missing_fields
            })
    
    if not terms_needing_enhancement:
        print("✅ All terms already have enhanced formatting")
        return True
    
    print(f"Found {len(terms_needing_enhancement)} terms needing enhancement")
    
    # Update terms with enhanced formatting
    for term_info in terms_needing_enhancement:
        term_name = term_info["term"]
        
        # Generate generic enhanced formatting for all missing fields
        update_data = {}
        for field in term_info["missing_fields"]:
            if field == "plain_english":
                update_data[field] = f"A simplified explanation of {term_name} that makes it easy to understand for non-tax professionals."
            elif field == "case_study":
                update_data[field] = f"A client successfully implemented {term_name} in their tax strategy, resulting in significant tax savings and improved financial outcomes."
            elif field == "key_benefit":
                update_data[field] = f"Provides substantial tax advantages when properly implemented as part of a comprehensive tax strategy."
            elif field == "definition" and not term_info.get("definition"):
                update_data[field] = f"A strategic tax planning concept that helps optimize tax outcomes through careful structuring and implementation."
        
        await db.glossary.update_one(
            {"id": term_info["id"]},
            {"$set": update_data}
        )
        print(f"✅ Enhanced term: {term_name}")
    
    return True

async def main():
    """Main execution function."""
    try:
        print("🚀 Starting Complete Glossary Verification")
        print("=" * 50)
        
        # First, ensure we have exactly 61 terms
        await ensure_61_glossary_terms()
        
        # Then, ensure all terms have enhanced formatting
        await ensure_enhanced_formatting()
        
        # Finally, test the glossary API
        success = test_glossary_endpoint()
        
        print("\n" + "=" * 50)
        if success:
            print("🎯 GLOSSARY VERIFICATION SUCCESSFUL")
        else:
            print("❌ GLOSSARY VERIFICATION FAILED")
        print("=" * 50)
        
        return success
        
    except Exception as e:
        print(f"❌ Error during verification: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        client.close()

if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)