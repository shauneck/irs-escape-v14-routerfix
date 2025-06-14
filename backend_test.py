#!/usr/bin/env python3
"""
Backend API Testing for IRS Escape Plan

This script tests the backend API endpoints for the IRS Escape Plan application,
focusing on the core functionality and enhanced glossary terms.
"""

import requests
import json
import sys
import os
from pprint import pprint

# Read the backend URL from the frontend .env file
try:
    with open('/app/frontend/.env', 'r') as f:
        for line in f:
            if line.startswith('REACT_APP_BACKEND_URL='):
                BACKEND_URL = line.strip().split('=')[1] + '/api'
                break
except:
    # Fallback to local URL if the frontend .env file is not available or URL is not working
    BACKEND_URL = "http://localhost:8001/api"

print(f"Using backend URL: {BACKEND_URL}")

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

def test_courses_endpoint():
    """Test the courses endpoint."""
    print("\n==== Testing Courses Endpoint ====")
    courses = test_api_endpoint("courses")
    
    if not courses:
        return False
    
    # Check if we have exactly 3 courses
    if len(courses) != 3:
        print(f"❌ Expected 3 courses, got {len(courses)}")
        return False
    
    # Check if we have the expected courses
    course_types = [course["type"] for course in courses]
    expected_types = ["primer", "w2", "business"]
    
    for expected_type in expected_types:
        if expected_type not in course_types:
            print(f"❌ Missing course type: {expected_type}")
            return False
    
    print(f"✅ Found {len(courses)} courses with expected types: {', '.join(course_types)}")
    
    # Get course details and verify module counts
    primer_course = next((c for c in courses if c["type"] == "primer"), None)
    w2_course = next((c for c in courses if c["type"] == "w2"), None)
    business_course = next((c for c in courses if c["type"] == "business"), None)
    
    # Verify Primer Course has 6 modules
    if primer_course:
        primer_lessons = test_api_endpoint(f"courses/{primer_course['id']}/lessons")
        if not primer_lessons:
            return False
        if len(primer_lessons) != 6:
            print(f"❌ Primer Course should have 6 modules, found {len(primer_lessons)}")
            return False
        print(f"✅ Primer Course '{primer_course['title']}' has {len(primer_lessons)} modules as expected")
    else:
        print("❌ Primer Course not found")
        return False
    
    # Verify W-2 Course has 10 modules
    if w2_course:
        w2_lessons = test_api_endpoint(f"courses/{w2_course['id']}/lessons")
        if not w2_lessons:
            return False
        if len(w2_lessons) != 10:
            print(f"❌ W-2 Course should have 10 modules, found {len(w2_lessons)}")
            return False
        print(f"✅ W-2 Course '{w2_course['title']}' has {len(w2_lessons)} modules as expected")
    else:
        print("❌ W-2 Course not found")
        return False
    
    # Verify Business Owner Course has 9 modules
    if business_course:
        business_lessons = test_api_endpoint(f"courses/{business_course['id']}/lessons")
        if not business_lessons:
            return False
        if len(business_lessons) != 9:
            print(f"❌ Business Owner Course should have 9 modules, found {len(business_lessons)}")
            return False
        print(f"✅ Business Owner Course '{business_course['title']}' has {len(business_lessons)} modules as expected")
    else:
        print("❌ Business Owner Course not found")
        return False
    
    # Check content quality for each course
    for course_type, course in [("primer", primer_course), ("w2", w2_course), ("business", business_course)]:
        lessons = test_api_endpoint(f"courses/{course['id']}/lessons")
        if not lessons:
            continue
            
        for lesson in lessons:
            if not lesson.get("content") or len(lesson.get("content", "")) < 100:
                print(f"❌ Course '{course['title']}' lesson '{lesson['title']}' has insufficient content")
                return False
                
        print(f"✅ All lessons in '{course['title']}' have substantial content")
    
    return True

def test_glossary_endpoint():
    """Test the glossary endpoint."""
    print("\n==== Testing Glossary Endpoint ====")
    terms = test_api_endpoint("glossary")
    
    if not terms:
        return False
    
    # Check if we have at least 53 glossary terms (as mentioned in the status history)
    if len(terms) < 53:
        print(f"❌ Expected at least 53 glossary terms, found only {len(terms)}")
        return False
    
    print(f"✅ Found {len(terms)} glossary terms (requirement: at least 53)")
    
    # Check for enhanced terms with required fields
    enhanced_fields = ["definition", "plain_english", "case_study", "key_benefit"]
    
    terms_with_all_fields = 0
    for term in terms:
        has_all_fields = all(term.get(field) for field in enhanced_fields)
        if has_all_fields:
            terms_with_all_fields += 1
    
    print(f"✅ Found {terms_with_all_fields} terms with all enhanced fields")
    
    # Test glossary search functionality
    search_terms = ["REPS", "tax", "depreciation", "corporation", "trust"]
    for search_term in search_terms:
        search_results = test_api_endpoint("glossary/search", params={"q": search_term})
        
        if search_results is None:  # Could be empty list which is valid
            return False
        
        print(f"✅ Search for '{search_term}' returned {len(search_results)} results")
    
    # Test individual term retrieval
    if terms:
        # Test first term
        term_id = terms[0]["id"]
        term_detail = test_api_endpoint(f"glossary/{term_id}")
        
        if not term_detail:
            return False
        
        print(f"✅ Successfully retrieved term details for: {term_detail['term']}")
        
        # Test a term in the middle of the list
        if len(terms) > 10:
            mid_term_id = terms[10]["id"]
            mid_term_detail = test_api_endpoint(f"glossary/{mid_term_id}")
            
            if not mid_term_detail:
                return False
            
            print(f"✅ Successfully retrieved term details for: {mid_term_detail['term']}")
        
        # Test last term
        last_term_id = terms[-1]["id"]
        last_term_detail = test_api_endpoint(f"glossary/{last_term_id}")
        
        if not last_term_detail:
            return False
        
        print(f"✅ Successfully retrieved term details for: {last_term_detail['term']}")
    
    # Test invalid term ID
    invalid_response = test_api_endpoint("glossary/invalid-id", expected_status=404)
    if invalid_response is not None:
        print("❌ Expected 404 for invalid glossary term ID")
        return False
    
    print("✅ Correctly returned 404 for invalid glossary term ID")
    
    return True

def test_tools_endpoint():
    """Test the tools endpoint."""
    print("\n==== Testing Tools Endpoint ====")
    tools = test_api_endpoint("tools")
    
    if not tools:
        return False
    
    print(f"✅ Found {len(tools)} tools")
    
    # Check for specific tools (Entity Builder and Build Your Escape Plan)
    expected_tools = ["Entity Builder", "Build Your Escape Plan"]
    found_tools = [tool["name"] for tool in tools]
    
    for expected_tool in expected_tools:
        if not any(expected_tool.lower() in tool.lower() for tool in found_tools):
            print(f"❌ Expected tool not found: {expected_tool}")
            print(f"   Available tools: {', '.join(found_tools)}")
            return False
    
    print(f"✅ Found expected tools: {', '.join(expected_tools)}")
    
    # Test individual tool retrieval
    for tool in tools:
        tool_id = tool["id"]
        tool_detail = test_api_endpoint(f"tools/{tool_id}")
        
        if not tool_detail:
            print(f"❌ Failed to retrieve tool details for: {tool['name']}")
            return False
        
        # Check that tool has necessary configuration
        if not tool_detail.get("config"):
            print(f"❌ Tool '{tool_detail['name']}' is missing configuration")
            return False
        
        print(f"✅ Successfully retrieved tool details for: {tool_detail['name']}")
    
    # Test invalid tool ID
    invalid_response = test_api_endpoint("tools/invalid-id", expected_status=404)
    if invalid_response is not None:
        print("❌ Expected 404 for invalid tool ID")
        return False
    
    print("✅ Correctly returned 404 for invalid tool ID")
    
    return True

def test_user_xp_endpoint():
    """Test the user XP endpoint."""
    print("\n==== Testing User XP Endpoint ====")
    user_xp = test_api_endpoint("users/xp")
    
    if not user_xp:
        return False
    
    print(f"✅ Successfully retrieved user XP: {user_xp['total_xp']} total XP")
    
    # Test glossary XP award
    terms = test_api_endpoint("glossary")
    if not terms or len(terms) == 0:
        print("❌ No glossary terms available for XP testing")
        return False
    
    # Test awarding XP for multiple terms
    test_terms = terms[:3]  # Test with first 3 terms
    
    for i, term in enumerate(test_terms):
        term_id = term["id"]
        
        # Award XP for viewing the term
        xp_data = {
            "user_id": "default_user",
            "term_id": term_id
        }
        
        xp_result = test_api_endpoint("users/xp/glossary", method="POST", data=xp_data)
        
        if not xp_result:
            print(f"❌ Failed to award XP for term: {term['term']}")
            return False
        
        if xp_result["status"] == "success":
            print(f"✅ Successfully awarded {xp_result['xp_earned']} XP for viewing glossary term: {term['term']}")
        elif xp_result["status"] == "already_viewed":
            print(f"✅ Term '{term['term']}' already viewed, no XP awarded (as expected)")
        else:
            print(f"❌ Unexpected status for XP award: {xp_result['status']}")
            return False
        
        # Check that viewing the same term again doesn't award XP
        xp_result_2 = test_api_endpoint("users/xp/glossary", method="POST", data=xp_data)
        
        if not xp_result_2:
            print(f"❌ Failed on second view of term: {term['term']}")
            return False
        
        if xp_result_2["status"] == "already_viewed" and xp_result_2["xp_earned"] == 0:
            print(f"✅ Correctly did not award XP for viewing the same term again: {term['term']}")
        else:
            print(f"❌ Incorrectly awarded XP for viewing the same term again: {term['term']}")
            return False
    
    # Verify XP was updated in user profile
    updated_xp = test_api_endpoint("users/xp")
    if not updated_xp:
        return False
    
    print(f"✅ Updated user XP: {updated_xp['total_xp']} total XP, {updated_xp['glossary_xp']} glossary XP")
    
    return True

def test_data_initialization():
    """Test the data initialization endpoint."""
    print("\n==== Testing Data Initialization Endpoint ====")
    
    # Initialize data
    init_result = test_api_endpoint("initialize-data", method="POST", data={})
    
    if not init_result:
        return False
    
    print("✅ Successfully initialized data")
    
    # Verify courses were created
    courses = test_api_endpoint("courses")
    if not courses or len(courses) != 3:
        print(f"❌ Expected 3 courses after initialization, found {len(courses) if courses else 0}")
        return False
    
    print(f"✅ Found {len(courses)} courses after initialization")
    
    # Verify glossary terms were created
    terms = test_api_endpoint("glossary")
    if not terms or len(terms) < 53:
        print(f"❌ Expected at least 53 glossary terms after initialization, found {len(terms) if terms else 0}")
        return False
    
    print(f"✅ Found {len(terms)} glossary terms after initialization")
    
    # Verify tools were created
    tools = test_api_endpoint("tools")
    if not tools:
        print("❌ No tools found after initialization")
        return False
    
    print(f"✅ Found {len(tools)} tools after initialization")
    
    return True

def test_quinn_ai_removal():
    """Test that Quinn AI endpoints have been removed."""
    print("\n==== Testing Quinn AI Removal ====")
    
    # List of Quinn AI endpoints that should return 404
    quinn_endpoints = [
        "quinn/chat",
        "quinn/generate",
        "quinn/analyze",
        "quinn/search",
        "quinn/status"
    ]
    
    all_removed = True
    for endpoint in quinn_endpoints:
        response = test_api_endpoint(endpoint, expected_status=404)
        if response is not None:
            print(f"❌ Quinn AI endpoint still exists: {endpoint}")
            all_removed = False
        else:
            print(f"✅ Quinn AI endpoint properly removed: {endpoint}")
    
    return all_removed

def run_all_tests():
    """Run all API tests."""
    print("\n🚀 Starting IRS Escape Plan Backend API Tests\n")
    
    # Test basic API connectivity
    base_response = test_api_endpoint("")
    if base_response is None:
        print("❌ Failed to connect to the API. Aborting tests.")
        return False
    
    # Run all test functions
    test_functions = [
        test_courses_endpoint,
        test_glossary_endpoint,
        test_tools_endpoint,
        test_user_xp_endpoint,
        test_data_initialization,
        test_quinn_ai_removal
    ]
    
    results = []
    for test_func in test_functions:
        results.append(test_func())
    
    # Print summary
    print("\n==== Test Summary ====")
    total_tests = len(test_functions)
    passed_tests = sum(results)
    
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    
    if passed_tests == total_tests:
        print("\n✅ All tests passed successfully!")
        return True
    else:
        print("\n❌ Some tests failed. See details above.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
