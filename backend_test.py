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
with open('/app/frontend/.env', 'r') as f:
    for line in f:
        if line.startswith('REACT_APP_BACKEND_URL='):
            BACKEND_URL = line.strip().split('=')[1] + '/api'
            break

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
        return response.json()
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

def test_courses_endpoint():
    """Test the courses endpoint."""
    print("\n==== Testing Courses Endpoint ====")
    courses = test_api_endpoint("courses")
    
    if not courses:
        return False
    
    # Check if we have the expected courses
    course_types = [course["type"] for course in courses]
    expected_types = ["primer", "w2", "business"]
    
    for expected_type in expected_types:
        if expected_type not in course_types:
            print(f"❌ Missing course type: {expected_type}")
            return False
    
    print(f"✅ Found {len(courses)} courses with expected types: {', '.join(course_types)}")
    
    # Test a specific course
    if courses:
        course_id = courses[0]["id"]
        course_detail = test_api_endpoint(f"courses/{course_id}")
        
        if not course_detail:
            return False
        
        print(f"✅ Successfully retrieved course details for: {course_detail['title']}")
        
        # Test course lessons
        lessons = test_api_endpoint(f"courses/{course_id}/lessons")
        
        if not lessons:
            return False
        
        print(f"✅ Found {len(lessons)} lessons for course: {course_detail['title']}")
        
        # Test course quiz
        quiz = test_api_endpoint(f"courses/{course_id}/quiz")
        
        if quiz is None:  # Could be empty list which is valid
            return False
        
        print(f"✅ Successfully retrieved quiz for course: {course_detail['title']}")
    
    return True

def test_glossary_endpoint():
    """Test the glossary endpoint."""
    print("\n==== Testing Glossary Endpoint ====")
    terms = test_api_endpoint("glossary")
    
    if not terms:
        return False
    
    print(f"✅ Found {len(terms)} glossary terms")
    
    # Check for enhanced terms
    enhanced_terms = [
        "REPS (Real Estate Professional Status)",
        "QOF (Qualified Opportunity Fund)",
        "QSBS (Qualified Small Business Stock)",
        "Loan-Based Split Dollar",
        "Irrevocable Grantor Trust",
        "C-Corp (C Corporation)",
        "S-Corp (S Corporation)",
        "Installment Sale (Section 453)",
        "Passive Losses",
        "Advanced Depreciation (Bonus Depreciation & Section 179)"
    ]
    
    found_enhanced_terms = []
    
    for term in terms:
        if term["term"] in enhanced_terms:
            # Check if it has all required fields
            required_fields = ["definition", "plain_english", "case_study", "key_benefit"]
            has_all_fields = all(term.get(field) for field in required_fields)
            
            if has_all_fields:
                found_enhanced_terms.append(term["term"])
            else:
                missing_fields = [field for field in required_fields if not term.get(field)]
                print(f"❌ Term '{term['term']}' is missing fields: {', '.join(missing_fields)}")
    
    print(f"✅ Found {len(found_enhanced_terms)} enhanced terms with all required fields")
    
    # Test glossary search for REPS
    search_results = test_api_endpoint("glossary/search", params={"q": "REPS"})
    
    if not search_results:
        return False
    
    print(f"✅ Search for 'REPS' returned {len(search_results)} results")
    
    # Test glossary search for QSBS
    search_results = test_api_endpoint("glossary/search", params={"q": "QSBS"})
    
    if not search_results:
        return False
    
    print(f"✅ Search for 'QSBS' returned {len(search_results)} results")
    
    # Test a specific term if available
    if terms:
        term_id = terms[0]["id"]
        term_detail = test_api_endpoint(f"glossary/{term_id}")
        
        if not term_detail:
            return False
        
        print(f"✅ Successfully retrieved term details for: {term_detail['term']}")
    
    return True

def test_tools_endpoint():
    """Test the tools endpoint."""
    print("\n==== Testing Tools Endpoint ====")
    tools = test_api_endpoint("tools")
    
    if not tools:
        return False
    
    print(f"✅ Found {len(tools)} tools")
    
    # Test a specific tool if available
    if tools:
        tool_id = tools[0]["id"]
        tool_detail = test_api_endpoint(f"tools/{tool_id}")
        
        if not tool_detail:
            return False
        
        print(f"✅ Successfully retrieved tool details for: {tool_detail['name']}")
    
    return True

def test_user_xp_endpoint():
    """Test the user XP endpoint."""
    print("\n==== Testing User XP Endpoint ====")
    user_xp = test_api_endpoint("users/xp/default_user")
    
    if not user_xp:
        return False
    
    print(f"✅ Successfully retrieved user XP: {user_xp['total_xp']} total XP")
    
    # Test glossary XP award
    if user_xp and "glossary" in test_api_endpoint(""):
        # Get a glossary term ID to use
        terms = test_api_endpoint("glossary")
        if terms:
            term_id = terms[0]["id"]
            
            # Award XP for viewing the term
            xp_data = {
                "user_id": "default_user",
                "term_id": term_id
            }
            
            xp_result = test_api_endpoint("users/xp/glossary", method="POST", data=xp_data)
            
            if not xp_result:
                return False
            
            print(f"✅ Successfully awarded XP for viewing glossary term: {xp_result['xp_earned']} XP")
            
            # Check that viewing the same term again doesn't award XP
            xp_result_2 = test_api_endpoint("users/xp/glossary", method="POST", data=xp_data)
            
            if not xp_result_2:
                return False
            
            if xp_result_2["status"] == "already_viewed" and xp_result_2["xp_earned"] == 0:
                print("✅ Correctly did not award XP for viewing the same term again")
            else:
                print("❌ Incorrectly awarded XP for viewing the same term again")
                return False
    
    return True

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
        test_user_xp_endpoint
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
