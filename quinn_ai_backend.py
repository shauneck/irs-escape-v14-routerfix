#!/usr/bin/env python3
"""
Quinn AI Assistant Implementation for IRS Escape Plan
Implements a comprehensive AI assistant with multiple specialized modules
"""

import asyncio
import os
import uuid
import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path
from pydantic import BaseModel, Field

# Load environment variables
ROOT_DIR = Path(__file__).parent / 'backend'
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Quinn AI Models
class QuinnRequest(BaseModel):
    user_id: str = "default_user"
    message: str
    context: Dict[str, Any] = {}
    module_type: Optional[str] = None  # strategy, glossary, course, tool, progress
    current_page: Optional[str] = None
    session_id: str = Field(default_factory=lambda: str(uuid.uuid4()))

class QuinnResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    response: str
    module_used: str
    related_terms: List[str] = []
    suggested_actions: List[Dict[str, str]] = []
    course_links: List[Dict[str, str]] = []
    confidence: float = 1.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class QuinnConversation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    messages: List[Dict[str, Any]] = []
    context: Dict[str, Any] = {}
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class QuinnAIProcessor:
    """Main AI processing engine for Quinn"""
    
    def __init__(self):
        self.strategy_keywords = [
            'tax strategy', 'reduce taxes', 'save money', 'business structure',
            'reps', 'depreciation', 'real estate', 'c-corp', 's-corp', 'mso',
            'qsbs', 'capital gains', 'deductions', 'entity planning'
        ]
        
        self.glossary_keywords = [
            'what is', 'define', 'explain', 'meaning', 'definition',
            'how does', 'what does', 'tell me about'
        ]
        
        self.course_keywords = [
            'course', 'module', 'lesson', 'learn', 'study', 'next step',
            'where do i start', 'what should i read', 'recommend'
        ]
        
        self.tool_keywords = [
            'calculator', 'tool', 'entity builder', 'escape plan',
            'how to use', 'build', 'calculate', 'plan'
        ]

    async def process_request(self, request: QuinnRequest) -> QuinnResponse:
        """Main request processing logic"""
        
        # Determine module type if not specified
        if not request.module_type:
            request.module_type = await self._detect_module_type(request)
        
        # Route to appropriate module
        if request.module_type == "strategy":
            return await self._handle_strategy_request(request)
        elif request.module_type == "glossary":
            return await self._handle_glossary_request(request)
        elif request.module_type == "course":
            return await self._handle_course_request(request)
        elif request.module_type == "tool":
            return await self._handle_tool_request(request)
        elif request.module_type == "progress":
            return await self._handle_progress_request(request)
        else:
            return await self._handle_general_request(request)

    async def _detect_module_type(self, request: QuinnRequest) -> str:
        """Detect which module should handle the request"""
        message_lower = request.message.lower()
        
        # Check current page context first
        if request.current_page:
            if 'glossary' in request.current_page:
                return "glossary"
            elif 'course' in request.current_page or 'module' in request.current_page:
                return "course"
            elif 'tool' in request.current_page or 'calculator' in request.current_page:
                return "tool"
        
        # Check message content
        if any(keyword in message_lower for keyword in self.glossary_keywords):
            return "glossary"
        elif any(keyword in message_lower for keyword in self.course_keywords):
            return "course"
        elif any(keyword in message_lower for keyword in self.tool_keywords):
            return "tool"
        elif any(keyword in message_lower for keyword in self.strategy_keywords):
            return "strategy"
        else:
            return "general"

    async def _handle_strategy_request(self, request: QuinnRequest) -> QuinnResponse:
        """Handle strategy-related questions"""
        
        message_lower = request.message.lower()
        
        # Get user context if available
        user_context = request.context.get('user_profile', {})
        income_type = user_context.get('income_type', 'unknown')
        
        # Strategy recommendations based on keywords and context
        if 'w-2' in message_lower or 'salary' in message_lower or income_type == 'w2':
            response = await self._generate_w2_strategy_response(request)
        elif 'business' in message_lower or 'owner' in message_lower or income_type == 'business':
            response = await self._generate_business_strategy_response(request)
        elif 'real estate' in message_lower or 'reps' in message_lower:
            response = await self._generate_real_estate_strategy_response(request)
        elif 'entity' in message_lower or 'structure' in message_lower:
            response = await self._generate_entity_strategy_response(request)
        else:
            response = await self._generate_general_strategy_response(request)
        
        return QuinnResponse(
            response=response['text'],
            module_used="strategy",
            related_terms=response['terms'],
            suggested_actions=response['actions'],
            course_links=response['courses']
        )

    async def _handle_glossary_request(self, request: QuinnRequest) -> QuinnResponse:
        """Handle glossary-related questions"""
        
        message_lower = request.message.lower()
        
        # Extract potential term from message
        search_term = await self._extract_term_from_message(message_lower)
        
        if search_term:
            # Search for the term in glossary
            terms = await db.glossary.find({
                "$or": [
                    {"term": {"$regex": search_term, "$options": "i"}},
                    {"definition": {"$regex": search_term, "$options": "i"}},
                    {"tags": {"$in": [search_term.lower()]}}
                ]
            }).to_list(5)
            
            if terms:
                best_term = terms[0]  # Take the best match
                
                response_text = f"**{best_term['term']}**\n\n"
                response_text += f"**Definition:** {best_term['definition']}\n\n"
                
                if best_term.get('plain_english'):
                    response_text += f"**In Plain English:** {best_term['plain_english']}\n\n"
                
                if best_term.get('case_study'):
                    response_text += f"**Real-World Example:** {best_term['case_study']}\n\n"
                
                if best_term.get('key_benefit'):
                    response_text += f"**Key Benefit:** {best_term['key_benefit']}\n\n"
                
                # Add related terms
                related_terms = best_term.get('related_terms', [])
                if related_terms:
                    response_text += f"**Related Terms:** {', '.join(related_terms[:3])}"
                
                # Find course modules that mention this term
                course_links = await self._find_courses_mentioning_term(best_term['term'])
                
                return QuinnResponse(
                    response=response_text,
                    module_used="glossary",
                    related_terms=related_terms[:5],
                    course_links=course_links,
                    suggested_actions=[
                        {"type": "learn_more", "text": f"Learn more about {best_term['term']}", "action": f"glossary/{best_term['id']}"},
                        {"type": "award_xp", "text": "View term for XP", "action": f"xp/glossary/{best_term['id']}"}
                    ]
                )
            else:
                # No exact match found
                response_text = f"I couldn't find a specific definition for '{search_term}', but let me suggest some related terms that might help:\n\n"
                
                # Find similar terms
                similar_terms = await db.glossary.find({
                    "$or": [
                        {"term": {"$regex": ".*" + search_term + ".*", "$options": "i"}},
                        {"definition": {"$regex": ".*" + search_term + ".*", "$options": "i"}}
                    ]
                }).to_list(3)
                
                if similar_terms:
                    for term in similar_terms:
                        response_text += f"• **{term['term']}**: {term['definition'][:100]}...\n"
                else:
                    response_text += "Try asking about terms like REPS, QSBS, QOF, C-Corp, or MSO for comprehensive explanations."
                
                return QuinnResponse(
                    response=response_text,
                    module_used="glossary",
                    suggested_actions=[
                        {"type": "browse_glossary", "text": "Browse all glossary terms", "action": "glossary"}
                    ]
                )
        else:
            return QuinnResponse(
                response="I can help explain any tax or business term! Try asking something like 'What is REPS?' or 'Explain QSBS' and I'll provide the definition, plain English explanation, and real-world examples.",
                module_used="glossary",
                suggested_actions=[
                    {"type": "browse_glossary", "text": "Browse all terms", "action": "glossary"}
                ]
            )

    async def _handle_course_request(self, request: QuinnRequest) -> QuinnResponse:
        """Handle course navigation requests"""
        
        message_lower = request.message.lower()
        
        # Get user progress
        user_progress = await db.user_progress.find({"user_id": request.user_id}).to_list(100)
        completed_courses = {p['course_id'] for p in user_progress if p.get('completed', False)}
        
        # Get all courses
        courses = await db.courses.find().to_list(10)
        
        if 'start' in message_lower or 'begin' in message_lower or 'first' in message_lower:
            # Recommend starting point
            primer_course = next((c for c in courses if c['type'] == 'primer'), None)
            if primer_course:
                response_text = f"🚀 **Perfect place to start!**\n\n"
                response_text += f"I recommend beginning with **{primer_course['title']}** - it covers the essential fundamentals you need to understand your tax situation.\n\n"
                response_text += f"This course has {primer_course['total_lessons']} lessons and takes about {primer_course['estimated_hours']} hours to complete. It's free and will give you the foundation for everything else!\n\n"
                response_text += "After completing the Primer, we can discuss whether the W-2 or Business Owner track is better for your situation."
                
                return QuinnResponse(
                    response=response_text,
                    module_used="course",
                    course_links=[{
                        "title": primer_course['title'],
                        "id": primer_course['id'],
                        "type": "course"
                    }],
                    suggested_actions=[
                        {"type": "start_course", "text": "Start the Primer", "action": f"course/{primer_course['id']}"}
                    ]
                )
        
        elif 'w-2' in message_lower or 'employee' in message_lower or 'salary' in message_lower:
            # Recommend W-2 course
            w2_course = next((c for c in courses if c['type'] == 'w2'), None)
            if w2_course:
                response_text = f"📊 **W-2 Escape Plan Course**\n\n"
                response_text += f"The **{w2_course['title']}** is perfect for high-income employees who want to minimize taxes while keeping their job.\n\n"
                response_text += f"This course covers {w2_course['total_lessons']} advanced modules including:\n"
                response_text += "• Real Estate Professional Status (REPS)\n"
                response_text += "• Strategic depreciation and offset stacking\n"
                response_text += "• Entity planning for W-2 earners\n"
                response_text += "• Capital gains repositioning strategies\n\n"
                response_text += "💡 **Pro tip:** Complete the Primer first if you haven't already!"
                
                return QuinnResponse(
                    response=response_text,
                    module_used="course",
                    course_links=[{
                        "title": w2_course['title'],
                        "id": w2_course['id'],
                        "type": "course"
                    }],
                    related_terms=["REPS", "Depreciation Offset", "QOF", "W-2 Income"]
                )
        
        elif 'business' in message_lower or 'owner' in message_lower or 'entrepreneur' in message_lower:
            # Recommend Business course
            business_course = next((c for c in courses if c['type'] == 'business'), None)
            if business_course:
                response_text = f"🏢 **Business Owner Escape Plan**\n\n"
                response_text += f"The **{business_course['title']}** is designed for business owners who want to optimize their entity structure and build wealth.\n\n"
                response_text += f"This comprehensive course covers:\n"
                response_text += "• C-Corp vs S-Corp optimization\n"
                response_text += "• MSO (Management Services Organization) strategies\n"
                response_text += "• QSBS qualification for tax-free exits\n"
                response_text += "• Advanced deduction stacking\n"
                response_text += "• Estate planning and wealth protection\n\n"
                response_text += "🎯 Perfect for scaling businesses and exit planning!"
                
                return QuinnResponse(
                    response=response_text,
                    module_used="course",
                    course_links=[{
                        "title": business_course['title'],
                        "id": business_course['id'],
                        "type": "course"
                    }],
                    related_terms=["C-Corp", "MSO", "QSBS", "Entity Planning"]
                )
        
        else:
            # General course recommendation
            response_text = "📚 **Course Recommendations**\n\n"
            response_text += "I can help you find the perfect course! Here are your options:\n\n"
            
            for course in courses:
                status = "✅ Completed" if course['id'] in completed_courses else "📖 Available"
                response_text += f"**{course['title']}** ({status})\n"
                response_text += f"{course['description']}\n"
                response_text += f"• {course['total_lessons']} lessons • {course['estimated_hours']} hours\n\n"
            
            response_text += "Ask me 'Where should I start?' or tell me about your situation (W-2 employee vs business owner) for personalized recommendations!"
            
            return QuinnResponse(
                response=response_text,
                module_used="course",
                course_links=[{"title": c['title'], "id": c['id'], "type": "course"} for c in courses],
                suggested_actions=[
                    {"type": "recommendation", "text": "Where should I start?", "action": "recommend_course"}
                ]
            )

    async def _handle_tool_request(self, request: QuinnRequest) -> QuinnResponse:
        """Handle tool-related questions"""
        
        message_lower = request.message.lower()
        
        # Get available tools
        tools = await db.tools.find().to_list(10)
        
        if 'escape plan' in message_lower or 'build' in message_lower:
            escape_tool = next((t for t in tools if 'escape plan' in t['name'].lower()), None)
            if escape_tool:
                response_text = f"🎯 **Build Your Escape Plan Tool**\n\n"
                response_text += f"This is our signature 9-step planning tool that creates a personalized tax strategy based on your specific situation.\n\n"
                response_text += f"**How it works:**\n"
                response_text += f"1. Input your income details (W-2, business, investments)\n"
                response_text += f"2. Answer questions about your goals and risk tolerance\n"
                response_text += f"3. Get a customized strategy stack with projected savings\n"
                response_text += f"4. See specific implementation steps and timelines\n\n"
                response_text += f"**What you'll get:**\n"
                response_text += f"• Personalized deduction opportunities\n"
                response_text += f"• Entity structure recommendations\n"
                response_text += f"• Tax savings projections\n"
                response_text += f"• Implementation roadmap\n\n"
                response_text += f"💡 **Tip:** Have your tax return handy for the most accurate results!"
                
                return QuinnResponse(
                    response=response_text,
                    module_used="tool",
                    suggested_actions=[
                        {"type": "use_tool", "text": "Start Building Your Plan", "action": f"tool/{escape_tool['id']}"}
                    ],
                    related_terms=["Tax Planning", "Strategic Deductions", "Entity Planning"]
                )
        
        elif 'entity' in message_lower or 'builder' in message_lower or 'structure' in message_lower:
            entity_tool = next((t for t in tools if 'entity' in t['name'].lower()), None)
            if entity_tool:
                response_text = f"🏗️ **Entity Builder Tool**\n\n"
                response_text += f"This tool helps you determine the optimal business structure for your situation and goals.\n\n"
                response_text += f"**Entity options analyzed:**\n"
                response_text += f"• Sole Proprietorship vs LLC\n"
                response_text += f"• S-Corp vs C-Corp election\n"
                response_text += f"• MSO (Management Services Organization)\n"
                response_text += f"• Multi-entity structures\n\n"
                response_text += f"**Based on your inputs:**\n"
                response_text += f"• Current and projected income\n"
                response_text += f"• Business type and activities\n"
                response_text += f"• Growth and exit plans\n"
                response_text += f"• Tax optimization goals\n\n"
                response_text += f"**Results include:** Tax comparisons, implementation steps, and timeline for restructuring."
                
                return QuinnResponse(
                    response=response_text,
                    module_used="tool",
                    suggested_actions=[
                        {"type": "use_tool", "text": "Analyze Entity Options", "action": f"tool/{entity_tool['id']}"}
                    ],
                    related_terms=["Entity Planning", "C-Corp", "S-Corp", "MSO"]
                )
        
        elif 'calculator' in message_lower or 'tax' in message_lower:
            calc_tool = next((t for t in tools if 'calculator' in t['name'].lower()), None)
            if calc_tool:
                response_text = f"🧮 **Tax Liability Calculator**\n\n"
                response_text += f"Calculate your current tax burden and see how different strategies would impact your bottom line.\n\n"
                response_text += f"**Features:**\n"
                response_text += f"• Current year tax calculation\n"
                response_text += f"• Strategy impact modeling\n"
                response_text += f"• Side-by-side comparisons\n"
                response_text += f"• Federal and state tax breakdown\n\n"
                response_text += f"**Great for:** Understanding your baseline before implementing strategies from the courses."
                
                return QuinnResponse(
                    response=response_text,
                    module_used="tool",
                    suggested_actions=[
                        {"type": "use_tool", "text": "Calculate Tax Liability", "action": f"tool/{calc_tool['id']}"}
                    ]
                )
        
        else:
            response_text = f"🛠️ **Available Tools**\n\n"
            response_text += f"I can help you with any of our planning tools:\n\n"
            
            for tool in tools:
                response_text += f"**{tool['name']}**\n"
                response_text += f"{tool['description']}\n\n"
            
            response_text += f"Which tool would you like help with? I can explain how to use it and interpret the results!"
            
            return QuinnResponse(
                response=response_text,
                module_used="tool",
                suggested_actions=[
                    {"type": "tool_help", "text": f"Help with {tool['name']}", "action": f"tool/{tool['id']}"} 
                    for tool in tools
                ]
            )

    async def _handle_progress_request(self, request: QuinnRequest) -> QuinnResponse:
        """Handle progress and tracking requests"""
        
        # Get user progress and XP
        user_progress = await db.user_progress.find({"user_id": request.user_id}).to_list(100)
        user_xp = await db.user_xp.find_one({"user_id": request.user_id})
        
        if not user_xp:
            user_xp = {"total_xp": 0, "glossary_xp": 0, "quiz_xp": 0, "viewed_glossary_terms": []}
        
        # Get course completion stats
        courses = await db.courses.find().to_list(10)
        completed_courses = []
        in_progress_courses = []
        
        for course in courses:
            course_progress = [p for p in user_progress if p['course_id'] == course['id']]
            if course_progress:
                completed_lessons = len([p for p in course_progress if p.get('completed', False)])
                total_lessons = course['total_lessons']
                
                if completed_lessons == total_lessons:
                    completed_courses.append(course)
                elif completed_lessons > 0:
                    in_progress_courses.append({
                        'course': course,
                        'completed': completed_lessons,
                        'total': total_lessons
                    })
        
        response_text = f"📈 **Your Progress Summary**\n\n"
        response_text += f"**XP Earned:** {user_xp['total_xp']} total points\n"
        response_text += f"• Course/Quiz XP: {user_xp.get('quiz_xp', 0)}\n"
        response_text += f"• Glossary XP: {user_xp.get('glossary_xp', 0)}\n"
        response_text += f"• Unique terms viewed: {len(user_xp.get('viewed_glossary_terms', []))}\n\n"
        
        if completed_courses:
            response_text += f"**✅ Completed Courses ({len(completed_courses)}):**\n"
            for course in completed_courses:
                response_text += f"• {course['title']}\n"
            response_text += "\n"
        
        if in_progress_courses:
            response_text += f"**📖 In Progress:**\n"
            for item in in_progress_courses:
                course = item['course']
                progress = (item['completed'] / item['total']) * 100
                response_text += f"• {course['title']}: {item['completed']}/{item['total']} lessons ({progress:.0f}%)\n"
            response_text += "\n"
        
        # Suggest next steps
        if not completed_courses and not in_progress_courses:
            response_text += f"🚀 **Ready to start your journey?**\n"
            response_text += f"I recommend beginning with 'The Escape Blueprint' primer course to build your foundation!"
        elif not completed_courses:
            response_text += f"🎯 **Keep going!** You're making great progress. Complete your current courses to unlock advanced strategies."
        else:
            response_text += f"🏆 **Excellent work!** You've completed courses and earned valuable XP. Ready for advanced planning tools?"
        
        return QuinnResponse(
            response=response_text,
            module_used="progress",
            suggested_actions=[
                {"type": "continue_course", "text": "Continue learning", "action": "courses"},
                {"type": "use_tools", "text": "Try planning tools", "action": "tools"}
            ]
        )

    async def _handle_general_request(self, request: QuinnRequest) -> QuinnResponse:
        """Handle general questions and greetings"""
        
        message_lower = request.message.lower()
        
        if any(greeting in message_lower for greeting in ['hello', 'hi', 'hey', 'start']):
            response_text = f"👋 **Hi there! I'm Quinn, your IRS Escape Plan assistant!**\n\n"
            response_text += f"I'm here to help you navigate the platform and maximize your tax savings. Here's what I can do:\n\n"
            response_text += f"🧠 **Strategy Advice:** Get personalized recommendations based on your income and goals\n"
            response_text += f"📚 **Glossary Help:** Explain any tax term with real-world examples\n"
            response_text += f"🎓 **Course Guidance:** Find the right modules for your situation\n"
            response_text += f"🛠️ **Tool Support:** Help you use our planning calculators and builders\n"
            response_text += f"📈 **Progress Tracking:** Monitor your learning and implementation\n\n"
            response_text += f"**Try asking me:**\n"
            response_text += f"• 'What is REPS?' (glossary lookup)\n"
            response_text += f"• 'Where should I start?' (course recommendations)\n"
            response_text += f"• 'How do I reduce W-2 taxes?' (strategy advice)\n"
            response_text += f"• 'Help me use the Entity Builder' (tool assistance)\n\n"
            response_text += f"What would you like to explore first?"
            
            return QuinnResponse(
                response=response_text,
                module_used="general",
                suggested_actions=[
                    {"type": "strategy", "text": "Get strategy advice", "action": "strategy_help"},
                    {"type": "courses", "text": "Find courses", "action": "course_recommendations"},
                    {"type": "glossary", "text": "Learn terms", "action": "glossary"},
                    {"type": "tools", "text": "Use tools", "action": "tools"}
                ]
            )
        
        elif 'help' in message_lower or 'what can you do' in message_lower:
            response_text = f"🤖 **I'm Quinn - here's how I can help:**\n\n"
            response_text += f"**🎯 Strategy Assistant**\n"
            response_text += f"Ask about tax strategies and I'll recommend approaches based on your income type and goals.\n\n"
            response_text += f"**📖 Glossary Explainer**\n"
            response_text += f"Get clear definitions, plain English explanations, and real-world examples for any tax term.\n\n"
            response_text += f"**🎓 Course Navigator**\n"
            response_text += f"Find the right courses and modules for your learning path and track your progress.\n\n"
            response_text += f"**🛠️ Tool Advisor**\n"
            response_text += f"Learn how to use our planning tools and interpret the results.\n\n"
            response_text += f"**📈 Progress Support**\n"
            response_text += f"Track your learning, XP, and implementation progress.\n\n"
            response_text += f"Just ask me anything! I understand context and can provide layered responses from simple to detailed."
            
            return QuinnResponse(
                response=response_text,
                module_used="general",
                suggested_actions=[
                    {"type": "example", "text": "Try: 'What is QSBS?'", "action": "glossary_example"},
                    {"type": "example", "text": "Try: 'How do I start?'", "action": "course_example"}
                ]
            )
        
        else:
            response_text = f"🤔 I'm not sure how to help with that specific question, but I can assist you with:\n\n"
            response_text += f"• **Tax strategies** and planning advice\n"
            response_text += f"• **Glossary terms** and definitions\n"
            response_text += f"• **Course recommendations** and navigation\n"
            response_text += f"• **Tool guidance** and support\n"
            response_text += f"• **Progress tracking** and next steps\n\n"
            response_text += f"Try asking something like 'What is REPS?' or 'Where should I start learning?' and I'll provide detailed, helpful guidance!"
            
            return QuinnResponse(
                response=response_text,
                module_used="general",
                suggested_actions=[
                    {"type": "help", "text": "See what I can do", "action": "help"},
                    {"type": "start", "text": "Get started", "action": "getting_started"}
                ]
            )

    # Helper methods
    async def _extract_term_from_message(self, message: str) -> str:
        """Extract potential glossary term from user message"""
        # Remove common question words
        question_words = ['what', 'is', 'define', 'explain', 'tell', 'me', 'about', 'the', 'a', 'an']
        words = message.split()
        filtered_words = [w for w in words if w.lower() not in question_words]
        
        # Join remaining words
        potential_term = ' '.join(filtered_words).strip()
        
        # Clean up common variations
        potential_term = potential_term.replace('?', '').replace('.', '').strip()
        
        return potential_term if len(potential_term) > 1 else ""

    async def _find_courses_mentioning_term(self, term: str) -> List[Dict[str, str]]:
        """Find courses that mention a specific term"""
        courses = await db.courses.find({
            "$or": [
                {"lessons.content": {"$regex": term, "$options": "i"}},
                {"description": {"$regex": term, "$options": "i"}}
            ]
        }).to_list(5)
        
        return [{"title": c['title'], "id": c['id'], "type": "course"} for c in courses]

    async def _generate_w2_strategy_response(self, request: QuinnRequest) -> Dict[str, Any]:
        """Generate W-2 specific strategy advice"""
        response = {
            "text": "🏢 **W-2 Tax Reduction Strategies**\n\n"
                   "As a W-2 employee, you have several powerful options:\n\n"
                   "**🏠 Real Estate Professional Status (REPS)**\n"
                   "Qualify for REPS to use rental property depreciation against your W-2 income\n\n"
                   "**🔄 Capital Gains Repositioning**\n"
                   "Use QOF investments to defer RSU and stock option gains\n\n"
                   "**🏗️ Entity Planning**\n"
                   "Create side entities for consulting or business activities\n\n"
                   "**📊 Strategic Deductions**\n"
                   "Maximize retirement contributions and HSA planning\n\n"
                   "Which area interests you most? I can provide detailed guidance on any of these strategies!",
            "terms": ["REPS", "QOF", "W-2 Income", "Capital Gains"],
            "actions": [
                {"type": "learn_reps", "text": "Learn about REPS", "action": "glossary/reps"},
                {"type": "w2_course", "text": "Take W-2 course", "action": "course/w2"}
            ],
            "courses": [{"title": "W-2 Escape Plan", "id": "w2_course", "type": "course"}]
        }
        return response

    async def _generate_business_strategy_response(self, request: QuinnRequest) -> Dict[str, Any]:
        """Generate business owner specific strategy advice"""
        response = {
            "text": "🏢 **Business Owner Tax Strategies**\n\n"
                   "As a business owner, you have the most powerful tax optimization tools:\n\n"
                   "**🏗️ Entity Optimization**\n"
                   "C-Corp vs S-Corp election and MSO structures for income shifting\n\n"
                   "**🎯 QSBS Planning**\n"
                   "Structure for up to $10M in tax-free business exit gains\n\n"
                   "**📈 Strategic Deductions**\n"
                   "Bonus depreciation, cost segregation, and equipment purchases\n\n"
                   "**🛡️ Asset Protection**\n"
                   "Trusts, split-dollar insurance, and wealth transfer strategies\n\n"
                   "**🚪 Exit Planning**\n"
                   "Installment sales, F-Reorgs, and succession planning\n\n"
                   "What's your current business structure and primary goal?",
            "terms": ["C-Corp", "QSBS", "MSO", "Entity Planning"],
            "actions": [
                {"type": "entity_builder", "text": "Use Entity Builder", "action": "tool/entity_builder"},
                {"type": "business_course", "text": "Take Business course", "action": "course/business"}
            ],
            "courses": [{"title": "Business Owner Escape Plan", "id": "business_course", "type": "course"}]
        }
        return response

    async def _generate_real_estate_strategy_response(self, request: QuinnRequest) -> Dict[str, Any]:
        """Generate real estate specific strategy advice"""
        response = {
            "text": "🏠 **Real Estate Tax Strategies**\n\n"
                   "Real estate offers some of the most powerful tax benefits:\n\n"
                   "**⭐ REPS Qualification**\n"
                   "Meet the 750-hour test to unlock unlimited depreciation offsets\n\n"
                   "**📊 Cost Segregation**\n"
                   "Accelerate depreciation on commercial and high-value properties\n\n"
                   "**🔄 1031 Exchanges**\n"
                   "Defer capital gains by swapping like-kind properties\n\n"
                   "**🏨 Short-Term Rentals**\n"
                   "Enhanced depreciation benefits and material participation opportunities\n\n"
                   "**🎯 QOF Integration**\n"
                   "Combine real estate with Opportunity Zone investments\n\n"
                   "Are you currently a real estate investor or considering getting started?",
            "terms": ["REPS", "Cost Segregation", "1031 Exchange", "STR"],
            "actions": [
                {"type": "learn_reps", "text": "Learn REPS qualification", "action": "glossary/reps"},
                {"type": "real_estate_module", "text": "Real estate modules", "action": "course/real_estate"}
            ],
            "courses": [{"title": "Real Estate Strategies", "id": "real_estate", "type": "course"}]
        }
        return response

    async def _generate_entity_strategy_response(self, request: QuinnRequest) -> Dict[str, Any]:
        """Generate entity planning specific advice"""
        response = {
            "text": "🏗️ **Entity Structure Planning**\n\n"
                   "Choosing the right business structure is crucial for tax optimization:\n\n"
                   "**🏢 C-Corporation**\n"
                   "21% corporate tax rate, QSBS qualification, retained earnings flexibility\n\n"
                   "**📋 S-Corporation**\n"
                   "Pass-through taxation, payroll tax savings on distributions\n\n"
                   "**🔄 MSO Structures**\n"
                   "Management Services Organizations for income shifting\n\n"
                   "**🏛️ LLC Options**\n"
                   "Flexibility with tax elections and operational simplicity\n\n"
                   "**🎯 Multi-Entity Strategies**\n"
                   "Coordinated structures for maximum optimization\n\n"
                   "What's your current annual income and business type? This helps determine the optimal structure.",
            "terms": ["C-Corp", "S-Corp", "MSO", "Entity Planning"],
            "actions": [
                {"type": "entity_builder", "text": "Use Entity Builder tool", "action": "tool/entity_builder"},
                {"type": "entity_course", "text": "Learn entity planning", "action": "course/entity"}
            ],
            "courses": [{"title": "Entity Planning Course", "id": "entity", "type": "course"}]
        }
        return response

    async def _generate_general_strategy_response(self, request: QuinnRequest) -> Dict[str, Any]:
        """Generate general strategy advice"""
        response = {
            "text": "🎯 **Tax Strategy Overview**\n\n"
                   "Effective tax planning uses the 6 core levers:\n\n"
                   "**1. Entity Type** - Optimize your business structure\n"
                   "**2. Income Type** - Convert high-tax to low-tax income\n"
                   "**3. Timing** - Control when income and deductions hit\n"
                   "**4. Asset Location** - Strategic account placement\n"
                   "**5. Deduction Strategy** - Maximize legitimate write-offs\n"
                   "**6. Exit Planning** - Plan for wealth transfer and sales\n\n"
                   "To give you specific recommendations, I'd love to know:\n"
                   "• Are you primarily a W-2 employee or business owner?\n"
                   "• What's your approximate annual income?\n"
                   "• Do you have real estate investments?\n"
                   "• What are your main tax planning goals?\n\n"
                   "This helps me suggest the most impactful strategies for your situation!",
            "terms": ["Tax Planning", "Entity Planning", "Strategic Deductions"],
            "actions": [
                {"type": "assessment", "text": "Take planning assessment", "action": "tool/assessment"},
                {"type": "courses", "text": "Browse courses", "action": "courses"}
            ],
            "courses": [{"title": "The Escape Blueprint", "id": "primer", "type": "course"}]
        }
        return response

# Initialize Quinn processor
quinn_processor = QuinnAIProcessor()

async def initialize_quinn_data():
    """Initialize Quinn conversation collection and indexes"""
    print("🤖 Initializing Quinn AI Assistant...")
    
    # Create indexes for efficient querying
    await db.quinn_conversations.create_index("user_id")
    await db.quinn_conversations.create_index("session_id")
    await db.quinn_conversations.create_index([("user_id", 1), ("last_updated", -1)])
    
    print("✅ Quinn AI Assistant initialized successfully!")

async def main():
    """Main execution function"""
    try:
        await initialize_quinn_data()
        print("\n🚀 Quinn AI Assistant backend implementation complete!")
        print("Ready for frontend integration and testing.")
        
    except Exception as e:
        print(f"❌ Error during Quinn initialization: {e}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())