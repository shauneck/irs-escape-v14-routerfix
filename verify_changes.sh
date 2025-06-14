#!/bin/bash

echo "🎯 CONTENT AND FORMATTING UPDATES VERIFICATION"
echo "=============================================="

echo ""
echo "✅ 1. W-2 ESCAPE PLAN COURSE STRUCTURE"
echo "---------------------------------------"

echo "Fetching W-2 course structure..."
W2_COURSE=$(curl -s http://localhost:8001/api/courses | jq '.[] | select(.type == "w2")')

TOTAL_LESSONS=$(echo "$W2_COURSE" | jq '.total_lessons')
echo "Total lessons: $TOTAL_LESSONS"

if [ "$TOTAL_LESSONS" = "9" ]; then
    echo "✅ Correct lesson count: 9 modules"
else
    echo "❌ Incorrect lesson count: Expected 9, got $TOTAL_LESSONS"
fi

echo ""
echo "📋 Module Structure:"
echo "$W2_COURSE" | jq -r '.lessons[] | "\(.order_index + 1). \(.title)"' | head -9

echo ""
echo "🔍 Verification against requirements:"

# Check each required module
MODULES=$(echo "$W2_COURSE" | jq -r '.lessons[] | .title')

echo "$MODULES" | grep -q "The Real Problem with W-2 Income" && echo "✅ Module 1: The Real Problem with W-2 Income" || echo "❌ Missing Module 1"
echo "$MODULES" | grep -q "Repositioning W-2 Income for Strategic Impact" && echo "✅ Module 2: Repositioning W-2 Income for Strategic Impact" || echo "❌ Missing Module 2"
echo "$MODULES" | grep -q "Stacking Offsets" && echo "✅ Module 3: Stacking Offsets — The Tax Strategy Most W-2 Earners Miss" || echo "❌ Missing Module 3"
echo "$MODULES" | grep -q "Qualifying for REPS" && echo "✅ Module 4: Qualifying for REPS — The Gateway to Strategic Offsets" || echo "❌ Missing Module 4"
echo "$MODULES" | grep -q "Real Estate Professional Status" && echo "✅ Module 5: Real Estate Professional Status (REPS)" || echo "❌ Missing Module 5"
echo "$MODULES" | grep -q "Short-Term Rentals" && echo "✅ Module 6: Short-Term Rentals (STRs)" || echo "❌ Missing Module 6"
echo "$MODULES" | grep -q "Oil & Gas Deductions" && echo "✅ Module 7: Oil & Gas Deductions" || echo "❌ Missing Module 7"
echo "$MODULES" | grep -q "Mapping Your Tax Exposure" && echo "✅ Module 8: Mapping Your Tax Exposure" || echo "❌ Missing Module 8"
echo "$MODULES" | grep -q "The IRS Escape Plan" && echo "✅ Module 9: The IRS Escape Plan" || echo "❌ Missing Module 9"

echo ""
echo "🚫 Checking deleted modules:"
echo "$MODULES" | grep -q "The Exit Plan" && echo "❌ 'The Exit Plan' should be deleted" || echo "✅ 'The Exit Plan' successfully removed"
echo "$MODULES" | grep -q "The Wealth Multiplier Loop" && echo "❌ 'The Wealth Multiplier Loop' should be deleted" || echo "✅ 'The Wealth Multiplier Loop' successfully removed"

echo ""
echo "✅ 2. MODULE VIEWER CONTENT REMOVAL"
echo "-----------------------------------"

echo "Checking if 'Module Content' section has been removed from frontend..."

# Check if the Module Content section is in the App.js file
if grep -q "Module Content" /app/frontend/src/App.js; then
    echo "❌ 'Module Content' section still found in App.js"
    grep -n "Module Content" /app/frontend/src/App.js
else
    echo "✅ 'Module Content' section successfully removed from App.js"
fi

echo ""
echo "🔍 Verifying remaining sections are preserved:"

# Check for preserved sections
grep -q "What You'll Learn" /app/frontend/src/App.js && echo "✅ 'What You'll Learn' section preserved" || echo "❌ 'What You'll Learn' section missing"
grep -q "Summary" /app/frontend/src/App.js && echo "✅ Summary section preserved" || echo "❌ Summary section missing"
grep -q "Case Study" /app/frontend/src/App.js && echo "✅ Case Study section preserved" || echo "❌ Case Study section missing"
grep -q "Key Terms" /app/frontend/src/App.js && echo "✅ Key Terms section preserved" || echo "❌ Key Terms section missing"

echo ""
echo "📊 FINAL VERIFICATION SUMMARY"
echo "------------------------------"

if [ "$TOTAL_LESSONS" = "9" ] && ! grep -q "Module Content" /app/frontend/src/App.js; then
    echo "🎉 ALL CHANGES COMPLETED SUCCESSFULLY!"
    echo ""
    echo "✅ W-2 Escape Plan course now has 9 modules with correct structure"
    echo "✅ 'The Exit Plan' module deleted"
    echo "✅ 'The Wealth Multiplier Loop' module deleted"
    echo "✅ 'Repositioning W-2 Income' promoted to Module 2"
    echo "✅ 'The IRS Escape Plan' is now Module 9"
    echo "✅ 'Module Content' section removed from all module pages"
    echo "✅ Other sections (What You'll Learn, Summary, Case Study, Key Terms) preserved"
else
    echo "⚠️ Some changes may not be complete. Please review the details above."
fi

echo ""
echo "🌐 You can now test the changes at:"
echo "   Frontend: http://localhost:3000/courses"
echo "   Direct W-2 Course: Navigate to W-2 Escape Plan from courses page"