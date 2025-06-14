#!/bin/bash

echo "🔧 FRONTEND RESTORATION DIAGNOSTIC SCRIPT"
echo "=============================================="

echo ""
echo "📊 1. BACKEND API VERIFICATION"
echo "--------------------------------"

echo "Courses endpoint:"
COURSES_COUNT=$(curl -s http://localhost:8001/api/courses | jq '. | length')
echo "✅ Local API returns $COURSES_COUNT courses"

echo ""
echo "Glossary endpoint:"
GLOSSARY_COUNT=$(curl -s http://localhost:8001/api/glossary | jq '. | length')
echo "✅ Local API returns $GLOSSARY_COUNT glossary terms"

echo ""
echo "Sample course data:"
curl -s http://localhost:8001/api/courses | jq '.[0] | {title: .title, modules: (.lessons | length)}'

echo ""
echo "Sample glossary data:"
curl -s http://localhost:8001/api/glossary | jq '.[0] | {term: .term, has_enhanced: (.plain_english != null and .case_study != null and .key_benefit != null)}'

echo ""
echo "📱 2. FRONTEND CONFIGURATION"
echo "------------------------------"

echo "Frontend .env configuration:"
cat /app/frontend/.env

echo ""
echo "🌐 3. CONNECTIVITY TEST"
echo "------------------------"

BACKEND_URL=$(cat /app/frontend/.env | grep REACT_APP_BACKEND_URL | cut -d'=' -f2)
echo "Testing frontend backend URL: $BACKEND_URL"

echo "External URL test (may fail in container):"
curl -s --max-time 5 "$BACKEND_URL/api/courses" | jq '. | length' 2>/dev/null || echo "❌ External URL not accessible from container"

echo ""
echo "🔄 4. SERVICES STATUS"
echo "---------------------"

echo "Backend service status:"
curl -s http://localhost:8001/health 2>/dev/null && echo "✅ Backend healthy" || echo "❌ Backend health check failed"

echo ""
echo "Frontend service status:"
curl -s http://localhost:3000 2>/dev/null | head -1 && echo "✅ Frontend responsive" || echo "❌ Frontend not responsive"

echo ""
echo "📋 5. RECOMMENDATIONS"
echo "----------------------"

if [ "$COURSES_COUNT" = "3" ] && [ "$GLOSSARY_COUNT" = "61" ]; then
    echo "✅ Backend data is correct (3 courses, 61 glossary terms)"
    echo "📝 Issue likely in frontend API connectivity or rendering"
    echo ""
    echo "🔧 FIXES TO TRY:"
    echo "1. Hard refresh frontend (Ctrl+Shift+R)"
    echo "2. Clear browser cache and localStorage"
    echo "3. Check browser developer console for errors"
    echo "4. Verify API calls in Network tab"
else
    echo "❌ Backend data is incorrect"
    echo "📝 Need to re-run data initialization"
fi

echo ""
echo "✅ Diagnostic complete!"