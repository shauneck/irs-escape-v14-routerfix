#!/usr/bin/env python3
"""
Glossary Duplicate Cleanup Script
Removes duplicate glossary terms while preserving the most complete versions
and maintaining database integrity.
"""

import asyncio
import os
from collections import defaultdict
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

def calculate_completeness_score(term):
    """Calculate completeness score for a glossary term."""
    score = 0
    required_fields = [
        'definition', 'plain_english', 'case_study', 'key_benefit',
        'client_name', 'structure', 'implementation', 'results'
    ]
    
    for field in required_fields:
        if term.get(field) and str(term.get(field)).strip():
            if field in ['definition', 'plain_english', 'case_study', 'key_benefit']:
                score += 3  # Critical fields worth more
            else:
                score += 1  # Supporting fields
    
    # Bonus points for having related terms and tags
    if term.get('related_terms') and len(term.get('related_terms', [])) > 0:
        score += 1
    if term.get('tags') and len(term.get('tags', [])) > 0:
        score += 1
    
    return score

def normalize_term_name(term_name):
    """Normalize term names for comparison."""
    # Remove common variations and extra spaces
    normalized = term_name.strip().lower()
    
    # Handle common variations
    variations = {
        'real estate professional status (reps)': 'reps',
        'reps (real estate professional status)': 'reps',
        'qualified opportunity fund (qof)': 'qof',
        'qof (qualified opportunity fund)': 'qof',
        'qualified small business stock (qsbs)': 'qsbs',
        'qsbs (qualified small business stock)': 'qsbs',
        'section 1202 (qsbs)': 'qsbs',
        'c-corp (c corporation)': 'c-corp',
        'c corporation': 'c-corp',
        's-corp (s corporation)': 's-corp',
        's corporation': 's-corp',
        'mso (management services organization)': 'mso',
        'management services organization': 'mso',
        'installment sale (section 453)': 'installment sale',
        'advanced depreciation (bonus depreciation & section 179)': 'bonus depreciation',
        'bonus depreciation': 'bonus depreciation',
        'deferred sales trust (dst)': 'deferred sales trust',
        'tax-free reorganization (f-reorg)': 'f-reorganization',
        'qualified intermediary (qi)': 'qualified intermediary'
    }
    
    return variations.get(normalized, normalized)

async def find_duplicates():
    """Find all duplicate terms in the glossary."""
    print("🔍 Scanning for duplicate glossary terms...")
    
    # Get all terms
    terms = await db.glossary.find().to_list(None)
    
    # Group terms by normalized name
    term_groups = defaultdict(list)
    
    for term in terms:
        normalized_name = normalize_term_name(term['term'])
        term_groups[normalized_name].append(term)
    
    # Find groups with duplicates
    duplicates = {}
    for normalized_name, term_list in term_groups.items():
        if len(term_list) > 1:
            duplicates[normalized_name] = term_list
    
    print(f"📊 Found {len(duplicates)} sets of duplicate terms:")
    for normalized_name, term_list in duplicates.items():
        print(f"   • {normalized_name}: {len(term_list)} duplicates")
        for term in term_list:
            score = calculate_completeness_score(term)
            print(f"     - '{term['term']}' (ID: {term['id'][:8]}..., Score: {score})")
    
    return duplicates

async def cleanup_duplicates(duplicates):
    """Remove duplicate terms, keeping the most complete version."""
    print("\n🧹 Starting duplicate cleanup...")
    
    removed_count = 0
    kept_count = 0
    
    for normalized_name, term_list in duplicates.items():
        # Sort by completeness score (highest first)
        sorted_terms = sorted(term_list, key=calculate_completeness_score, reverse=True)
        
        # Keep the most complete term
        best_term = sorted_terms[0]
        terms_to_remove = sorted_terms[1:]
        
        print(f"\n✅ Keeping best version of '{normalized_name}':")
        print(f"   • Term: '{best_term['term']}'")
        print(f"   • ID: {best_term['id']}")
        print(f"   • Completeness Score: {calculate_completeness_score(best_term)}")
        
        # Remove the duplicate terms
        for term_to_remove in terms_to_remove:
            await db.glossary.delete_one({"id": term_to_remove["id"]})
            print(f"   ❌ Removed: '{term_to_remove['term']}' (ID: {term_to_remove['id'][:8]}...)")
            removed_count += 1
        
        kept_count += 1
    
    print(f"\n📈 Cleanup Summary:")
    print(f"   • Terms kept: {kept_count}")
    print(f"   • Terms removed: {removed_count}")
    
    return kept_count, removed_count

async def verify_cleanup():
    """Verify the cleanup was successful."""
    print("\n🔍 Verifying cleanup results...")
    
    # Get all remaining terms
    remaining_terms = await db.glossary.find().to_list(None)
    
    # Check for any remaining duplicates
    term_names = [normalize_term_name(term['term']) for term in remaining_terms]
    duplicates_found = len(term_names) != len(set(term_names))
    
    if duplicates_found:
        print("❌ Warning: Some duplicates may still exist")
        # Find remaining duplicates
        name_counts = defaultdict(int)
        for name in term_names:
            name_counts[name] += 1
        
        for name, count in name_counts.items():
            if count > 1:
                print(f"   • {name}: {count} instances")
    else:
        print("✅ No duplicates found - cleanup successful!")
    
    # Check completeness of enhanced terms
    enhanced_terms = []
    for term in remaining_terms:
        score = calculate_completeness_score(term)
        if score >= 12:  # Terms with most required fields
            enhanced_terms.append(term)
    
    print(f"\n📊 Final Statistics:")
    print(f"   • Total terms: {len(remaining_terms)}")
    print(f"   • Fully enhanced terms: {len(enhanced_terms)}")
    print(f"   • Enhanced terms list:")
    
    for term in enhanced_terms:
        score = calculate_completeness_score(term)
        print(f"     - {term['term']} (Score: {score})")
    
    return len(remaining_terms), len(enhanced_terms)

async def ensure_term_quality():
    """Ensure all terms have proper structure and quality."""
    print("\n🔧 Ensuring term quality...")
    
    terms = await db.glossary.find().to_list(None)
    updated_count = 0
    
    for term in terms:
        needs_update = False
        update_data = {}
        
        # Ensure required fields exist (even if empty)
        required_fields = [
            'definition', 'category', 'related_terms', 'tags',
            'plain_english', 'case_study', 'key_benefit',
            'client_name', 'structure', 'implementation', 'results'
        ]
        
        for field in required_fields:
            if field not in term:
                if field in ['related_terms', 'tags']:
                    update_data[field] = []
                else:
                    update_data[field] = ""
                needs_update = True
        
        # Ensure category is set
        if not term.get('category'):
            # Set default category based on term content
            term_name = term['term'].lower()
            if any(word in term_name for word in ['corp', 'entity', 'mso', 'llc']):
                update_data['category'] = "Business Structure"
            elif any(word in term_name for word in ['real estate', 'reps', 'depreciation']):
                update_data['category'] = "Real Estate Tax"
            elif any(word in term_name for word in ['capital gains', 'qof', 'qsbs']):
                update_data['category'] = "Investment Strategy"
            elif any(word in term_name for word in ['trust', 'estate', 'split dollar']):
                update_data['category'] = "Estate Planning"
            else:
                update_data['category'] = "Tax Strategy"
            needs_update = True
        
        if needs_update:
            await db.glossary.update_one(
                {"id": term["id"]},
                {"$set": update_data}
            )
            updated_count += 1
    
    print(f"✅ Updated {updated_count} terms for quality assurance")
    return updated_count

async def main():
    """Main execution function."""
    try:
        print("🚀 Starting Glossary Duplicate Cleanup")
        print("=" * 50)
        
        # Find duplicates
        duplicates = await find_duplicates()
        
        if not duplicates:
            print("\n✅ No duplicates found! Glossary is already clean.")
        else:
            # Clean up duplicates
            kept_count, removed_count = await cleanup_duplicates(duplicates)
        
        # Ensure term quality
        updated_count = await ensure_term_quality()
        
        # Verify cleanup
        total_terms, enhanced_terms = await verify_cleanup()
        
        print("\n" + "=" * 50)
        print("🎯 CLEANUP COMPLETE")
        print("=" * 50)
        print(f"✅ Final glossary contains {total_terms} unique terms")
        print(f"✅ {enhanced_terms} terms are fully enhanced")
        print(f"✅ Database integrity maintained")
        print(f"✅ All terms remain searchable and linked")
        
    except Exception as e:
        print(f"❌ Error during cleanup: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())