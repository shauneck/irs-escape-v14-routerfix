import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import BuildEscapePlan from './components/BuildEscapePlan';
import EntityBuilder from './components/EntityBuilder';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// CourseCard Component
const CourseCard = ({ course, onCourseClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img 
          src={course.thumbnail_url || "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        {course.is_free && (
          <div className="absolute top-4 left-4">
            <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              FREE
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-navy-900 mb-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {course.total_lessons} lessons
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.estimated_hours}h
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => onCourseClick(course)}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {course.is_free ? 'Start Free Course' : 'View Course'}
        </button>
      </div>
    </div>
  );
};

// CourseViewer Component  
const CourseViewer = ({ course, onBack }) => {
  const [selectedModule, setSelectedModule] = useState(null);

  const handleModuleClick = (lesson) => {
    setSelectedModule(lesson);
  };

  if (selectedModule) {
    return <ModuleViewer 
      module={selectedModule} 
      course={course}
      onBack={() => setSelectedModule(null)} 
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6">
          <button 
            onClick={onBack}
            className="text-emerald-400 hover:text-emerald-300 mb-6 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl text-gray-300 mb-6">{course.description}</p>
              
              <div className="flex items-center space-x-6 text-emerald-400">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {course.total_lessons} Modules
                </span>
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {course.estimated_hours} Hours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {course.lessons?.map((lesson, index) => (
            <div 
              key={lesson.id || index}
              onClick={() => handleModuleClick(lesson)}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
                  Module {index + 1}
                </span>
                <span className="bg-navy-100 text-navy-600 px-3 py-1 rounded-full text-sm">
                  {lesson.duration_minutes}m
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-navy-900 mb-2">
                {lesson.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {lesson.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-emerald-600 text-sm font-medium">
                  +{lesson.xp_available} XP
                </span>
                <div className="text-emerald-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ModuleViewer Component (Enhanced with structured formatting)
const ModuleViewer = ({ module, course, onBack }) => {
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [userXP, setUserXP] = useState(0);
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState(null);

  useEffect(() => {
    fetchGlossaryTerms();
  }, []);

  const fetchGlossaryTerms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/glossary`);
      if (response.ok) {
        const terms = await response.json();
        setGlossaryTerms(terms);
      }
    } catch (error) {
      console.error('Failed to load glossary terms:', error);
    }
  };

  // Extract "What You'll Learn" section from content
  const extractWhatYoullLearn = (content) => {
    // First check for HTML formatted What You'll Learn sections
    const htmlMatch = content?.match(/## What You'll Learn\s*<ul>(.*?)<\/ul>/s);
    if (htmlMatch) {
      const listContent = htmlMatch[1];
      // Extract li items and convert to array
      const liMatches = listContent.match(/<li>(.*?)<\/li>/gs);
      if (liMatches) {
        return liMatches.map(li => {
          // Remove <li> tags and return content
          return li.replace(/<\/?li>/g, '').trim();
        });
      }
    }
    
    // Fallback to markdown-style bullet points
    const markdownMatch = content?.match(/## What You'll Learn\s*(.*?)(?=##|\n\n[A-Z]|\Z)/s);
    if (markdownMatch) {
      const section = markdownMatch[1].trim();
      // Extract bullet points
      const bulletPoints = section.match(/[•\-]\s*(.*?)(?=\n[•\-]|\n\n|\Z)/gs);
      return bulletPoints?.map(point => point.replace(/^[•\-]\s*/, '').trim()) || [];
    }
    
    return [];
  };

  // Extract case study information based on module content
  const getCaseStudyInfo = (moduleTitle, courseType) => {
    const caseStudies = {
      // Primer modules
      primer_1: { client: "Sarah, High-Income W-2", strategy: "Tax lever identification and strategic planning", result: "$45K annual tax reduction" },
      primer_2: { client: "Michael, Business Owner", strategy: "6-lever optimization framework", result: "$80K in combined savings" },
      primer_3: { client: "Helen, Tech Executive", strategy: "RSU timing + QOF investment", result: "$96K tax deferral" },
      primer_4: { client: "Dr. Ben, Medical Professional", strategy: "REPS qualification + STR portfolio", result: "$118K in depreciation offsets" },
      primer_5: { client: "Lisa, Consultant", strategy: "Entity restructuring + timing optimization", result: "$62K effective tax reduction" },
      primer_6: { client: "David, Entrepreneur", strategy: "Complete tax escape plan implementation", result: "$180K total annual savings" },

      // W-2 modules
      w2_1: { client: "Helen, Tech Executive", strategy: "W-2 income mapping and strategic planning", result: "$45K identified savings opportunity" },
      w2_2: { client: "Helen, Tech Executive", strategy: "QOF investment + material participation rules", result: "$102K capital gains deferral" },
      w2_3: { client: "Helen, Tech Executive", strategy: "AGI optimization and offset stacking", result: "$38K in active depreciation" },
      w2_4: { client: "Helen, Tech Executive", strategy: "Entity planning and income repositioning", result: "$67K annual tax reduction" },
      w2_5: { client: "Helen, Tech Executive", strategy: "Asset location and timing arbitrage", result: "$89K in tax optimization" },
      w2_6: { client: "Helen, Tech Executive", strategy: "RSU planning window optimization", result: "$102K offset against vested stock" },
      w2_7: { client: "Helen, Tech Executive", strategy: "Income repositioning and tax efficiency", result: "$0 tax on $300K income" },
      w2_8: { client: "Helen + Spouse", strategy: "750-hour test and REPS activation", result: "$38K depreciation unlock" },
      w2_9: { client: "Helen, Tech Executive", strategy: "Complete IRS escape plan execution", result: "$325K total transformation" },

      // Business Owner modules
      business_0: { client: "High-Income Business Owners", strategy: "Advanced infrastructure expectations setting", result: "$490K annual client savings example" },
      business_1: { client: "Dr. Ben, Medical Practice", strategy: "MSO structure implementation", result: "$320K annual tax savings" },
      business_2: { client: "David, Tech Startup", strategy: "QSBS qualification + F-Reorg", result: "$30M in gains excluded at exit" },
      business_3: { client: "Lauren, Real Estate", strategy: "Deduction stack + cost segregation", result: "$1.1M in accelerated deductions" },
      business_4: { client: "David, Business Owner", strategy: "Wealth multiplier loop implementation", result: "$300K recurring income, $0 tax" },
      business_5: { client: "Sarah, Consultant", strategy: "Zero-tax income stack", result: "$0 federal tax on $300K income" },
      business_6: { client: "Michael, Manufacturing", strategy: "Split-dollar life insurance strategy", result: "$2.5M estate tax protection" },
      business_7: { client: "Lisa, Tech Executive", strategy: "Co-investment MSO structure", result: "$450K depreciation capture" },
      business_8: { client: "Robert, Investment Firm", strategy: "Trust multiplication strategy", result: "$3.5M wealth transfer optimization" },
      business_9: { client: "David, Entrepreneur", strategy: "Strategic compounding + exit planning", result: "$5M+ tax-free wealth acceleration" }
    };

    const moduleIndex = module.order_index;
    let key = '';
    
    if (courseType === 'primer') key = `primer_${moduleIndex + 1}`;
    else if (courseType === 'w2') key = `w2_${moduleIndex + 1}`;
    else if (courseType === 'business') key = `business_${moduleIndex}`;

    return caseStudies[key] || { 
      client: "Strategic Client", 
      strategy: "Advanced tax optimization", 
      result: "Significant tax savings achieved" 
    };
  };

  // Get key glossary terms for this module
  const getModuleKeyTerms = (moduleIndex, courseType) => {
    const moduleTermMappings = {
      // Primer modules
      'primer_0': ['Tax Planning', 'CPA vs Strategist', 'W-2 Income'],
      'primer_1': ['Entity Type', 'Income Type', 'Timing', 'Asset Location', 'Deduction Strategy', 'Exit Planning'],
      'primer_2': ['QOF (Qualified Opportunity Fund)', 'REPS (Real Estate Professional Status)', 'Capital Gains'],
      'primer_3': ['REPS (Real Estate Professional Status)', 'Material Participation', 'STR'],
      'primer_4': ['Entity Planning', 'Income Shifting', 'Tax Planning'],
      'primer_5': ['Asset Location', 'Timing Arbitrage', 'Tax Strategy'],

      // W-2 modules
      'w2_0': ['W-2 Income', 'Tax Planning', 'CPA vs Strategist'],
      'w2_1': ['QOF (Qualified Opportunity Fund)', 'Bonus Depreciation', 'REPS (Real Estate Professional Status)'],
      'w2_2': ['AGI', 'Effective Tax Rate', 'Tax Planning'],
      'w2_3': ['Entity Planning', 'Income Shifting', 'Timing Arbitrage'],
      'w2_4': ['Asset Location', 'QOF (Qualified Opportunity Fund)', 'Tax Strategy'],
      'w2_5': ['Tax Timing Arbitrage', 'RSU Planning Window', 'High-Income Threshold'],
      'w2_6': ['Income Repositioning', 'Tax Efficiency', 'Dollar-Cost Averaging (DCA)'],
      'w2_7': ['Passive Loss Limitation', '750-Hour Test', 'Audit-Proofing'],
      'w2_8': ['REPS (Real Estate Professional Status)', 'STR', 'Cost Segregation (Cost Seg)'],

      // Business Owner modules
      'business_0': ['MSO (Management Services Organization)', 'Entity Planning', 'Tax Planning'],
      'business_1': ['QSBS (Qualified Small Business Stock)', 'F-Reorg (F Reorganization)', 'Trust Multiplication Strategy'],
      'business_2': ['Deduction Stack', 'Cost Segregation (Cost Seg)', 'IDC (Intangible Drilling Costs)'],
      'business_3': ['Wealth Multiplier Loop', 'Strategic Compounding', 'Asset Protection'],
      'business_4': ['Zero-Tax Income Stack', 'Income Repositioning', 'Tax Efficiency'],
      'business_5': ['Split-Dollar Life Insurance', 'Loan-Based Premium Funding', 'Estate Tax Exposure'],
      'business_6': ['Co-Investment (MSO or Trust)', 'Depreciation Recapture', 'Installment Sale'],
      'business_7': ['Trust Multiplication Strategy', 'Estate Tax Exposure', 'Asset Protection'],
      'business_8': ['Strategic Compounding', 'Wealth Multiplier Loop', 'Zero-Tax Income Stack']
    };

    let key = '';
    if (courseType === 'primer') key = `primer_${moduleIndex}`;
    else if (courseType === 'w2') key = `w2_${moduleIndex}`;
    else if (courseType === 'business') key = `business_${moduleIndex}`;

    const termNames = moduleTermMappings[key] || [];
    return termNames.map(termName => 
      glossaryTerms.find(term => term.term === termName)
    ).filter(Boolean);
  };

  const whatYoullLearn = extractWhatYoullLearn(module.content);
  const caseStudy = getCaseStudyInfo(module.title, course.type);
  const keyTerms = getModuleKeyTerms(module.order_index, course.type);

  const handleGlossaryTermClick = async (term) => {
    setSelectedGlossaryTerm(term);
    
    try {
      // Award XP for viewing glossary term
      await fetch(`${API_BASE_URL}/api/users/xp/glossary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'default_user',
          term_id: term.id || term.term
        })
      });
    } catch (error) {
      console.error('Failed to award XP:', error);
    }
  };

  // Extract summary from module content or generate from title
  const getSummaryFromContent = (content, title) => {
    // Try to extract existing summary from content
    const summaryMatch = content?.match(/<section class="module-summary">.*?<p>\s*(.*?)\s*<\/p>/s);
    if (summaryMatch) {
      return summaryMatch[1].trim();
    }
    
    // Generate a basic summary from the title if no existing summary found
    if (title.includes('Wealth Multiplier Loop')) {
      return 'This module introduces the systematic wealth-building framework that transforms annual tax savings into long-term passive income through strategic compounding and automated reinvestment systems.';
    } else if (title.includes('REPS') || title.includes('Real Estate Professional')) {
      return 'This module covers Real Estate Professional Status qualification and the strategies for eliminating passive loss limitations to unlock unlimited deduction potential against high-income earnings.';
    } else if (title.includes('Oil & Gas')) {
      return 'This module explores aggressive yet IRS-sanctioned oil & gas investment strategies, focusing on Intangible Drilling Costs (IDC) for immediate deductions and long-term wealth building.';
    } else if (title.includes('STR') || title.includes('Short-Term Rental')) {
      return 'This module demonstrates Short-Term Rental strategies for generating immediate depreciation benefits and active income treatment without requiring Real Estate Professional Status.';
    } else if (title.includes('Entity') || title.includes('MSO')) {
      return 'This module introduces advanced entity structuring using C-Corp MSO frameworks for optimal income capture, tax rate arbitrage, and systematic business optimization.';
    } else if (title.includes('Exit Plan')) {
      return 'This module presents the comprehensive integration of all tax strategies into a complete wealth-building and lifestyle design framework for long-term financial freedom.';
    } else {
      return `This module provides strategic insights and actionable frameworks for ${title.toLowerCase().replace(/module \d+:?\s*/i, '')}, helping you optimize your tax situation and build long-term wealth.`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Module Header */}
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-8">
        <div className="container mx-auto px-6">
          <button 
            onClick={onBack}
            className="text-emerald-400 hover:text-emerald-300 mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {course.title}
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{module.title}</h1>
              <p className="text-emerald-300">{module.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
                Module {module.order_index + 1}
              </span>
              <span className="bg-navy-100 text-navy-600 px-3 py-1 rounded-full text-sm">
                {module.duration_minutes}m
              </span>
              <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold">
                +{module.xp_available} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* What You'll Learn Section - Top of Page */}
        {whatYoullLearn.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-emerald-800 mb-4 flex items-center">
              <svg className="w-6 h-6 text-emerald-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              What You'll Learn
            </h2>
            <ul className="space-y-3">
              {whatYoullLearn.map((point, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-emerald-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: point }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Video and Summary */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="aspect-video bg-gradient-to-br from-navy-900 to-emerald-900 rounded-lg flex items-center justify-center">
                <div className="text-center text-white">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <p className="text-lg font-medium">Module Video Content</p>
                  <p className="text-emerald-300">{module.duration_minutes} minutes</p>
                </div>
              </div>
            </div>

            {/* Summary Section - Bottom of Main Content */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-navy-900 mb-4">Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                {getSummaryFromContent(module.content, module.title)}
              </p>
            </div>
          </div>

          {/* Sidebar - Case Study above Key Terms */}
          <div className="lg:col-span-1">
            {/* Case Study Block */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-xl font-bold text-navy-900 mb-4 flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Case Study
              </h3>
              
              <div className="space-y-4">
                <div>
                  <span className="inline-block bg-emerald-100 text-emerald-600 px-2 py-1 rounded text-sm font-medium mb-2">
                    CLIENT
                  </span>
                  <p className="font-semibold text-navy-900">{caseStudy.client}</p>
                </div>
                
                <div>
                  <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm font-medium mb-2">
                    STRATEGY
                  </span>
                  <p className="text-gray-700">{caseStudy.strategy}</p>
                </div>
                
                <div>
                  <span className="inline-block bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm font-medium mb-2">
                    RESULT
                  </span>
                  <p className="font-semibold text-navy-900">{caseStudy.result}</p>
                </div>
              </div>
            </div>

            {/* Key Terms Section - Below Case Study */}
            {keyTerms.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Key Terms
                </h3>
                
                <div className="space-y-2">
                  {keyTerms.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleGlossaryTermClick(term)}
                      className="w-full text-left bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="font-medium">{term.term}</span>
                      <span className="text-xs bg-emerald-200 text-emerald-600 px-2 py-1 rounded">
                        +10 XP
                      </span>
                    </button>
                  ))}
                </div>
                
                <p className="text-xs text-gray-500 mt-3">
                  Click any term to view definition and earn XP
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Module Content with Glossary Highlighting */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-6">Module Content</h2>
            <div className="prose prose-lg max-w-none">
              <GlossaryTermHighlighter 
                content={module.content}
                glossaryTerms={glossaryTerms}
                onTermClick={handleGlossaryTermClick}
              />
            </div>
          </div>
        </div>

        {/* Glossary Term Modal */}
        {selectedGlossaryTerm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-navy-900">{selectedGlossaryTerm.term}</h3>
                  <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                    {selectedGlossaryTerm.category}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedGlossaryTerm(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="px-6 py-4 space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Definition</h4>
                  <p className="text-gray-700">{selectedGlossaryTerm.definition}</p>
                </div>
                
                {selectedGlossaryTerm.plain_english && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Plain English</h4>
                    <p className="text-gray-700">{selectedGlossaryTerm.plain_english}</p>
                  </div>
                )}

                {selectedGlossaryTerm.key_benefit && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                    <h4 className="font-bold text-emerald-800 mb-2">💡 Key Benefit</h4>
                    <p className="text-emerald-700">{selectedGlossaryTerm.key_benefit}</p>
                  </div>
                )}
              </div>
              
              <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t">
                <button 
                  onClick={() => setSelectedGlossaryTerm(null)}
                  className="w-full bg-emerald-500 text-white py-2 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// GlossaryTermHighlighter Component for In-Course Term Linking
const GlossaryTermHighlighter = ({ content, glossaryTerms, onTermClick }) => {
  if (!content || !glossaryTerms || glossaryTerms.length === 0) {
    return <div>{content}</div>;
  }

  // Create a map of terms for quick lookup
  const termMap = glossaryTerms.reduce((acc, term) => {
    acc[term.term.toLowerCase()] = term;
    return acc;
  }, {});

  // Split content into words and highlight glossary terms
  const highlightTerms = (text) => {
    if (!text) return text;
    
    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = Object.keys(termMap).sort((a, b) => b.length - a.length);
    
    let highlightedText = text;
    const highlightedTermsInText = new Set();
    
    sortedTerms.forEach(term => {
      const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = text.match(regex);
      
      if (matches && !highlightedTermsInText.has(term.toLowerCase())) {
        // Only highlight the first occurrence of each term
        highlightedText = highlightedText.replace(regex, (match) => {
          highlightedTermsInText.add(term.toLowerCase());
          return `<span class="glossary-term" data-term="${term}">${match}</span>`;
        });
      }
    });
    
    return highlightedText;
  };

  const processedContent = highlightTerms(content);

  useEffect(() => {
    // Add click handlers to highlighted terms
    const handleTermClick = (e) => {
      if (e.target.classList.contains('glossary-term')) {
        const termName = e.target.getAttribute('data-term');
        const term = termMap[termName.toLowerCase()];
        if (term && onTermClick) {
          onTermClick(term);
        }
      }
    };

    document.addEventListener('click', handleTermClick);
    return () => document.removeEventListener('click', handleTermClick);
  }, [termMap, onTermClick]);

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: processedContent }}
      className="glossary-highlighted-content"
    />
  );
};

// GlossarySection Component
const GlossarySection = ({ glossaryTerms }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [viewedTerms, setViewedTerms] = useState(() => {
    const saved = localStorage.getItem('viewedGlossaryTerms');
    return saved ? JSON.parse(saved) : {};
  });
  const [userXP, setUserXP] = useState(() => {
    const saved = localStorage.getItem('userXP');
    return saved ? parseInt(saved) : 0;
  });

  // Course options for filtering
  const courses = [
    'all',
    'Primer',
    'W-2 Escape Plan',
    'Business Owner Escape Plan'
  ];

  // Category options for filtering
  const categories = [
    'all',
    'Tax Strategy',
    'Advanced Strategy',
    'Investment Strategy',
    'Real Estate Tax',
    'Business Tax'
  ];

  // Map glossary terms to their first course appearance
  const getTermCourse = (termName) => {
    const termCourseMappings = {
      // Primer Course Terms
      'Tax Planning': 'Primer',
      'CPA vs Strategist': 'Primer',
      'W-2 Income': 'Primer',
      'Entity Type': 'Primer',
      'Income Type': 'Primer',
      'Timing': 'Primer',
      'Asset Location': 'Primer',
      'Deduction Strategy': 'Primer',
      'Exit Planning': 'Primer',
      'Tax Strategy': 'Primer',
      'Wealth Multiplier Loop': 'Primer',
      'Strategic Compounding': 'Primer',
      'Tax Lever': 'Primer',
      'Income Optimization': 'Primer',
      'Tax Efficiency': 'Primer',

      // W-2 Escape Plan Terms
      'QOF (Qualified Opportunity Fund)': 'W-2 Escape Plan',
      'REPS (Real Estate Professional Status)': 'W-2 Escape Plan',
      'Capital Gains': 'W-2 Escape Plan',
      'Material Participation': 'W-2 Escape Plan',
      'STR': 'W-2 Escape Plan',
      'Bonus Depreciation': 'W-2 Escape Plan',
      'AGI': 'W-2 Escape Plan',
      'Effective Tax Rate': 'W-2 Escape Plan',
      'Entity Planning': 'W-2 Escape Plan',
      'Income Shifting': 'W-2 Escape Plan',
      'Timing Arbitrage': 'W-2 Escape Plan',
      'Tax Timing Arbitrage': 'W-2 Escape Plan',
      'RSU Planning Window': 'W-2 Escape Plan',
      'High-Income Threshold': 'W-2 Escape Plan',
      'Income Repositioning': 'W-2 Escape Plan',
      'Dollar-Cost Averaging (DCA)': 'W-2 Escape Plan',
      'Passive Loss Limitation': 'W-2 Escape Plan',
      '750-Hour Test': 'W-2 Escape Plan',
      'Audit-Proofing': 'W-2 Escape Plan',
      'Cost Segregation (Cost Seg)': 'W-2 Escape Plan',
      'Depreciation Recapture': 'W-2 Escape Plan',

      // Business Owner Escape Plan Terms
      'MSO (Management Services Organization)': 'Business Owner Escape Plan',
      'QSBS (Qualified Small Business Stock)': 'Business Owner Escape Plan',
      'F-Reorg (F Reorganization)': 'Business Owner Escape Plan',
      'Trust Multiplication Strategy': 'Business Owner Escape Plan',
      'Deduction Stack': 'Business Owner Escape Plan',
      'IDC (Intangible Drilling Costs)': 'Business Owner Escape Plan',
      'Asset Protection': 'Business Owner Escape Plan',
      'Zero-Tax Income Stack': 'Business Owner Escape Plan',
      'Split-Dollar Life Insurance': 'Business Owner Escape Plan',
      'Loan-Based Premium Funding': 'Business Owner Escape Plan',
      'Estate Tax Exposure': 'Business Owner Escape Plan',
      'Co-Investment (MSO or Trust)': 'Business Owner Escape Plan',
      'Installment Sale': 'Business Owner Escape Plan',
      'C-Corp': 'Business Owner Escape Plan',
      'S-Corp': 'Business Owner Escape Plan',
      'LLC': 'Business Owner Escape Plan',
      'Tax Election': 'Business Owner Escape Plan',
      'Corporate Tax': 'Business Owner Escape Plan',
      'Double Taxation': 'Business Owner Escape Plan',
      'Qualified Small Business Stock': 'Business Owner Escape Plan',
      'Payroll Tax': 'Business Owner Escape Plan',
      'Distributions': 'Business Owner Escape Plan',
      'Multi-Entity': 'Business Owner Escape Plan',
      'Management Service Organization': 'Business Owner Escape Plan',
      'Irrevocable Trust': 'Business Owner Escape Plan',
      'Business Deductions': 'Business Owner Escape Plan',
      'Ordinary & Necessary': 'Business Owner Escape Plan',
      'DB Plan': 'Business Owner Escape Plan',
      'Contribution Limits': 'Business Owner Escape Plan',
      'Actuarial': 'Business Owner Escape Plan',
      'RSU': 'Business Owner Escape Plan',
      'ISO': 'Business Owner Escape Plan',
      'ESPP': 'Business Owner Escape Plan',
      '83(b) Election': 'Business Owner Escape Plan',
      'Capital Gains Deferral': 'Business Owner Escape Plan',
      'Opportunity Zones': 'Business Owner Escape Plan',
      'Deferred Compensation': 'Business Owner Escape Plan',
      'Non-Qualified Plans': 'Business Owner Escape Plan',
      'Section 199A': 'Business Owner Escape Plan',
      'ITC': 'Business Owner Escape Plan',
      'PTC': 'Business Owner Escape Plan',
      'Energy Credits': 'Business Owner Escape Plan',
      'Syndications': 'Business Owner Escape Plan',
      'Section 1202': 'Business Owner Escape Plan',
      'Qualified Business': 'Business Owner Escape Plan',
      'Split Dollar': 'Business Owner Escape Plan',
      'Life Insurance': 'Business Owner Escape Plan',
      'Retained Earnings': 'Business Owner Escape Plan'
    };

    return termCourseMappings[termName] || 'Business Owner Escape Plan'; // Default fallback
  };
  
  const filteredTerms = glossaryTerms?.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.plain_english?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const termCourse = getTermCourse(term.term);
    const matchesCourse = selectedCourse === 'all' || termCourse === selectedCourse;
    
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
    
    return matchesSearch && matchesCourse && matchesCategory;
  }) || [];

  const resetFilters = () => {
    setSelectedCourse('all');
    setSelectedCategory('all');
    setSearchTerm('');
  };

  const handleTermClick = async (term) => {
    setSelectedTerm(term);
    
    // Award XP if this is the first time viewing this term
    if (!viewedTerms[term.id]) {
      const newViewedTerms = { ...viewedTerms, [term.id]: true };
      const newXP = userXP + 10;
      
      setViewedTerms(newViewedTerms);
      setUserXP(newXP);
      
      // Save to localStorage
      localStorage.setItem('viewedGlossaryTerms', JSON.stringify(newViewedTerms));
      localStorage.setItem('userXP', newXP.toString());

      // Send XP to backend if endpoint exists
      try {
        await fetch(`${API_BASE_URL}/api/users/xp/glossary`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            term_id: term.id,
            term_name: term.term,
            xp_earned: 10 
          })
        });
      } catch (error) {
        console.log('XP tracking not available:', error);
      }
    }
  };

  const getLinkedModules = (term) => {
    // Extract module information from case study or related content
    const modules = [];
    if (term.structure?.includes('Module')) {
      const moduleMatch = term.structure.match(/Module \d+[^,.]*/g);
      if (moduleMatch) modules.push(...moduleMatch);
    }
    if (term.implementation?.includes('Module')) {
      const moduleMatch = term.implementation.match(/Module \d+[^,.]*/g);
      if (moduleMatch) modules.push(...moduleMatch);
    }
    return [...new Set(modules)]; // Remove duplicates
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* XP Display */}
      <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-emerald-800">Your Learning Progress</h3>
            <p className="text-emerald-600">Earn 10 XP for each new term you explore</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-emerald-600">{userXP} XP</div>
            <div className="text-sm text-emerald-700">
              {Object.keys(viewedTerms).length} of {glossaryTerms?.length || 0} terms viewed
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar - Full Width */}
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search terms, definitions, or explanations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Course Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {courses.map(course => (
                  <option key={course} value={course}>
                    {course === 'all' ? 'All Courses' : course}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            {(selectedCourse !== 'all' || selectedCategory !== 'all' || searchTerm) && (
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap font-medium"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedCourse !== 'all' || selectedCategory !== 'all' || searchTerm) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')} className="ml-2 text-emerald-500 hover:text-emerald-700">
                ×
              </button>
            </span>
          )}
          {selectedCourse !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
              Course: {selectedCourse}
              <button onClick={() => setSelectedCourse('all')} className="ml-2 text-blue-500 hover:text-blue-700">
                ×
              </button>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="ml-2 text-purple-500 hover:text-purple-700">
                ×
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredTerms.length} of {glossaryTerms?.length || 0} terms
          {(selectedCourse !== 'all' || selectedCategory !== 'all' || searchTerm) && (
            <span className="ml-2 text-sm">
              ({glossaryTerms?.length - filteredTerms.length} filtered out)
            </span>
          )}
        </p>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerms.map((term, index) => {
          const termCourse = getTermCourse(term.term);
          return (
            <div 
              key={term.id || index}
              onClick={() => handleTermClick(term)}
              className={`relative bg-white border-2 rounded-xl p-6 hover:shadow-lg cursor-pointer transition-all duration-200 ${
                viewedTerms[term.id] ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              {/* XP Badge */}
              {viewedTerms[term.id] && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-500 text-white">
                    +10 XP
                  </span>
                </div>
              )}
              
              <h3 className="font-bold text-navy-900 mb-3 text-lg leading-tight">{term.term}</h3>
              
              {/* Course and Category Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  {termCourse}
                </span>
                <span className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
                  {term.category}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                {term.plain_english || term.definition}
              </p>
              
              {term.key_benefit && (
                <div className="border-t pt-3">
                  <p className="text-xs text-emerald-600 font-medium">
                    💡 Key Benefit: {term.key_benefit.substring(0, 80)}...
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.263-5.365-3.138m-.133-8.724C7.748 2.49 9.777 2 12 2s4.252.49 5.498 1.138" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No terms found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
          {(selectedCourse !== 'all' || selectedCategory !== 'all' || searchTerm) && (
            <button
              onClick={resetFilters}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Term Detail Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-8 py-6 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold text-navy-900 mb-2">{selectedTerm.term}</h2>
                <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                  {selectedTerm.category}
                </span>
                {viewedTerms[selectedTerm.id] && (
                  <span className="ml-3 inline-block bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ✓ 10 XP Earned
                  </span>
                )}
              </div>
              <button 
                onClick={() => setSelectedTerm(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="px-8 py-6 space-y-8">
              {/* Definition */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Definition</h3>
                <p className="text-gray-700 text-lg leading-relaxed">{selectedTerm.definition}</p>
              </div>
              
              {/* Plain English Explanation */}
              {selectedTerm.plain_english && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Plain English Explanation</h3>
                  <p className="text-gray-700 text-lg leading-relaxed">{selectedTerm.plain_english}</p>
                </div>
              )}
              
              {/* Key Benefit */}
              {selectedTerm.key_benefit && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-emerald-800 mb-4">💡 Key Benefit</h3>
                  <p className="text-emerald-700 text-lg leading-relaxed font-medium">
                    {selectedTerm.key_benefit}
                  </p>
                </div>
              )}
              
              {/* Real-World Case Study */}
              {(selectedTerm.client_name || selectedTerm.structure || selectedTerm.implementation || selectedTerm.results) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">📊 Real-World Case Study</h3>
                  
                  {selectedTerm.client_name && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-blue-700 mb-2">Client Profile:</h4>
                      <p className="text-blue-600">{selectedTerm.client_name}</p>
                    </div>
                  )}
                  
                  {selectedTerm.structure && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-blue-700 mb-2">Structure:</h4>
                      <p className="text-blue-600">{selectedTerm.structure}</p>
                    </div>
                  )}
                  
                  {selectedTerm.implementation && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-blue-700 mb-2">Implementation:</h4>
                      <p className="text-blue-600">{selectedTerm.implementation}</p>
                    </div>
                  )}
                  
                  {selectedTerm.results && (
                    <div>
                      <h4 className="font-semibold text-blue-700 mb-2">Results:</h4>
                      <p className="text-blue-600 font-medium">{selectedTerm.results}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Linked Modules */}
              {(() => {
                const linkedModules = getLinkedModules(selectedTerm);
                return linkedModules.length > 0 ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Related Learning Modules</h3>
                    <div className="space-y-2">
                      {linkedModules.map((module, index) => (
                        <div key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                          <span className="text-gray-700">{module}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
              
              {/* Related Terms */}
              {selectedTerm.related_terms && selectedTerm.related_terms.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🔗 Related Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.related_terms.map((relatedTerm, index) => (
                      <span key={index} className="inline-block bg-gray-100 text-gray-700 px-3 py-2 rounded-full text-sm">
                        {relatedTerm}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-8 py-4 border-t">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {viewedTerms[selectedTerm.id] ? 'You\'ve already earned XP for this term' : 'You earned 10 XP for viewing this term!'}
                </div>
                <button 
                  onClick={() => setSelectedTerm(null)}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AI Playbook Generator Component - FREE ACCESS FOR QA TESTING
const PlaybookGenerator = ({ onClose, userSubscription }) => {
  const [formData, setFormData] = useState({
    entityType: '',
    incomeRange: '',
    realEstate: '',
    assetProtection: '',
    estatePlanning: '',
    goals: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlaybook, setGeneratedPlaybook] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePlaybook = async () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const playbook = createCustomPlaybook(formData);
    setGeneratedPlaybook(playbook);
    setIsGenerating(false);
  };

  const createCustomPlaybook = (data) => {
    const strategies = {
      setup: [],
      deduct: [],
      protect: [],
      exit: []
    };

    // Setup strategies based on entity type and complexity
    if (data.entityType === 'Business Owner' || data.entityType === 'Mixed (e.g., K-1 + salary)') {
      if (data.incomeRange === '$500K–$1M' || data.incomeRange === '$1M+') {
        strategies.setup.push({
          title: 'C-Corp MSO Structure',
          summary: 'Implement Management Services Organization for optimal income capture at 21% corporate rate vs 37%+ personal rates.',
          complexity: 'Advanced',
          module: 'Business Module 1: Entity Structuring'
        });
      }
      
      strategies.setup.push({
        title: 'Entity Optimization',
        summary: 'Restructure business entities for tax efficiency and deduction maximization.',
        complexity: data.incomeRange === '$1M+' ? 'Advanced' : 'Intermediate',
        module: 'Business Owner Escape Plan'
      });
    }

    if (data.realEstate === 'Active investor with REPS') {
      strategies.setup.push({
        title: 'REPS Qualification Maintenance',
        summary: 'Systematic documentation and hour tracking for Real Estate Professional Status to unlock unlimited deductions.',
        complexity: 'Advanced',
        module: 'W-2 Module 4: Qualifying for REPS'
      });
    } else if (data.realEstate === 'Own rentals (LTR or STR)') {
      strategies.setup.push({
        title: 'REPS Qualification Strategy',
        summary: 'Path to qualifying for Real Estate Professional Status using the 750-hour test and material participation.',
        complexity: 'Intermediate',
        module: 'W-2 Module 4: Qualifying for REPS'
      });
    }

    // Deduction strategies
    if (data.realEstate !== 'No real estate investing') {
      strategies.deduct.push({
        title: 'Cost Segregation Analysis',
        summary: 'Accelerate depreciation through cost segregation studies for immediate tax benefits.',
        complexity: 'Intermediate',
        module: 'Business Module 2: Strategic Deductions'
      });

      if (data.realEstate === 'Own rentals (LTR or STR)') {
        strategies.deduct.push({
          title: 'STR Depreciation Strategy',
          summary: 'Leverage Short-Term Rental depreciation for immediate W-2 income offset without REPS qualification.',
          complexity: 'Beginner',
          module: 'W-2 Module 6: Short-Term Rentals'
        });
      }
    }

    if (data.incomeRange === '$500K–$1M' || data.incomeRange === '$1M+') {
      strategies.deduct.push({
        title: 'Oil & Gas IDC Strategy',
        summary: 'Intangible Drilling Costs for immediate 100% deduction plus ongoing depletion benefits.',
        complexity: 'Advanced',
        module: 'W-2 Module 7: Oil & Gas Deductions'
      });

      strategies.deduct.push({
        title: 'Bonus Depreciation Stacking',
        summary: 'Coordinate multiple depreciation strategies for maximum deduction acceleration.',
        complexity: 'Advanced',
        module: 'Business Module 2: Strategic Deductions'
      });
    }

    // Protection strategies
    if (data.assetProtection === 'Already have some trusts or structures' || 
        data.assetProtection === 'Interested in MSO/Trust setup') {
      
      strategies.protect.push({
        title: 'Advanced Trust Multiplication',
        summary: 'Multi-generational wealth transfer and estate tax optimization through sophisticated trust structures.',
        complexity: 'Advanced',
        module: 'Business Module 8: The Exit Plan'
      });

      if (data.incomeRange === '$1M+') {
        strategies.protect.push({
          title: 'Split-Dollar Life Insurance',
          summary: 'Tax-efficient wealth transfer and protection using loan-based premium funding.',
          complexity: 'Advanced',
          module: 'Business Module 6: Capital Gains Repositioning'
        });
      }
    }

    // Exit strategies
    if (data.estatePlanning === 'Need help soon (1–3 yrs)' || 
        data.estatePlanning === 'Already thinking about legacy/gifting') {
      
      if (data.entityType === 'Business Owner' || data.entityType === 'Mixed (e.g., K-1 + salary)') {
        strategies.exit.push({
          title: 'QSBS Qualification',
          summary: 'Qualify for $10M+ capital gains exclusion through Qualified Small Business Stock strategies.',
          complexity: 'Advanced',
          module: 'Business Module 3: Long-Term Wealth Creation'
        });
      }

      strategies.exit.push({
        title: 'QOF Strategy',
        summary: 'Defer capital gains through Qualified Opportunity Fund investments with long-term benefits.',
        complexity: 'Advanced',
        module: 'W-2 Module 2: Income & Timing'
      });

      strategies.exit.push({
        title: 'Charitable Remainder Trust',
        summary: 'Tax-efficient exit strategy combining philanthropy with income generation and tax benefits.',
        complexity: 'Advanced',
        module: 'Business Module 8: The Exit Plan'
      });
    }

    // Add Wealth Multiplier Loop for higher income brackets
    if (data.incomeRange === '$500K–$1M' || data.incomeRange === '$1M+') {
      strategies.exit.push({
        title: 'Wealth Multiplier Loop',
        summary: 'Systematic reinvestment of tax savings into compounding wealth-building assets.',
        complexity: 'Advanced',
        module: 'W-2 Module 8: The Wealth Multiplier Loop'
      });
    }

    return {
      profile: {
        entityType: data.entityType,
        incomeRange: data.incomeRange,
        complexity: determineComplexity(data)
      },
      strategies,
      totalStrategies: Object.values(strategies).flat().length
    };
  };

  const determineComplexity = (data) => {
    let complexityScore = 0;
    
    if (data.entityType === 'Business Owner' || data.entityType === 'Mixed (e.g., K-1 + salary)') complexityScore += 2;
    if (data.incomeRange === '$1M+') complexityScore += 3;
    else if (data.incomeRange === '$500K–$1M') complexityScore += 2;
    else if (data.incomeRange === '$200K–$500K') complexityScore += 1;
    
    if (data.realEstate === 'Active investor with REPS') complexityScore += 3;
    else if (data.realEstate === 'Own rentals (LTR or STR)') complexityScore += 1;
    
    if (data.assetProtection === 'Already have some trusts or structures') complexityScore += 2;
    else if (data.assetProtection === 'Interested in MSO/Trust setup') complexityScore += 1;
    
    if (data.estatePlanning === 'Already thinking about legacy/gifting') complexityScore += 2;
    else if (data.estatePlanning === 'Need help soon (1–3 yrs)') complexityScore += 1;

    if (complexityScore >= 8) return 'Advanced';
    if (complexityScore >= 4) return 'Intermediate';
    return 'Beginner';
  };

  const isFormValid = formData.entityType && formData.incomeRange && 
                     formData.realEstate && formData.assetProtection && 
                     formData.estatePlanning;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">AI Playbook Generator</h2>
              <p className="text-gray-600">Build your custom IRS Escape Plan in 60 seconds</p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {!generatedPlaybook ? (
            <div className="space-y-6">
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Entity Type */}
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-3">Entity Type *</label>
                  <div className="space-y-2">
                    {['W-2 Earner', 'Business Owner', 'Mixed (e.g., K-1 + salary)'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="entityType"
                          value={option}
                          checked={formData.entityType === option}
                          onChange={(e) => handleInputChange('entityType', e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Income Range */}
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-3">Income Range *</label>
                  <div className="space-y-2">
                    {['$50K–$100K', '$100K–$200K', '$200K–$500K', '$500K–$1M', '$1M+'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="incomeRange"
                          value={option}
                          checked={formData.incomeRange === option}
                          onChange={(e) => handleInputChange('incomeRange', e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Real Estate */}
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-3">Real Estate Status *</label>
                  <div className="space-y-2">
                    {['No real estate investing', 'Own rentals (LTR or STR)', 'Active investor with REPS'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="realEstate"
                          value={option}
                          checked={formData.realEstate === option}
                          onChange={(e) => handleInputChange('realEstate', e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Asset Protection */}
                <div>
                  <label className="block text-sm font-bold text-navy-900 mb-3">Asset Protection *</label>
                  <div className="space-y-2">
                    {['Basic (personal accounts only)', 'Interested in MSO/Trust setup', 'Already have some trusts or structures'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="assetProtection"
                          value={option}
                          checked={formData.assetProtection === option}
                          onChange={(e) => handleInputChange('assetProtection', e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Estate Planning */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-navy-900 mb-3">Estate Planning Timeline *</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {['Not thinking about it yet', 'Need help soon (1–3 yrs)', 'Already thinking about legacy/gifting'].map(option => (
                      <label key={option} className="flex items-center">
                        <input
                          type="radio"
                          name="estatePlanning"
                          value={option}
                          checked={formData.estatePlanning === option}
                          onChange={(e) => handleInputChange('estatePlanning', e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="text-center">
                <button
                  onClick={generatePlaybook}
                  disabled={!isFormValid || isGenerating}
                  className={`px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                    isFormValid && !isGenerating
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Your Playbook...
                    </span>
                  ) : (
                    'Generate My Custom Playbook'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // Generated Playbook Display
            <div className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                <h3 className="text-2xl font-bold text-emerald-800 mb-4">Your Custom Tax Strategy Playbook</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{generatedPlaybook.totalStrategies}</div>
                    <div className="text-sm text-gray-600">Strategies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{generatedPlaybook.profile.complexity}</div>
                    <div className="text-sm text-gray-600">Complexity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{generatedPlaybook.profile.entityType}</div>
                    <div className="text-sm text-gray-600">Profile</div>
                  </div>
                </div>
              </div>

              {/* Strategy Categories */}
              {Object.entries(generatedPlaybook.strategies).map(([category, strategies]) => (
                strategies.length > 0 && (
                  <div key={category} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-navy-900 mb-4 capitalize">
                      {category === 'setup' ? 'Setup & Structure' : 
                       category === 'deduct' ? 'Deduction Strategies' :
                       category === 'protect' ? 'Asset Protection' : 'Exit Planning'}
                    </h4>
                    <div className="space-y-3">
                      {strategies.map((strategy, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-navy-900">{strategy.title}</h5>
                            <span className={`text-xs px-2 py-1 rounded ${
                              strategy.complexity === 'Beginner' ? 'bg-green-100 text-green-600' :
                              strategy.complexity === 'Intermediate' ? 'bg-yellow-100 text-yellow-600' :
                              'bg-red-100 text-red-600'
                            }`}>
                              {strategy.complexity}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm mb-2">{strategy.summary}</p>
                          <div className="text-emerald-600 text-xs font-medium">
                            📚 {strategy.module}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              ))}

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setGeneratedPlaybook(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                >
                  Generate New Playbook
                </button>
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700">
                  Save to My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// TaxBotSection Component (Basic implementation)
const TaxBotSection = () => {
  const [message, setMessage] = useState('');
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">AI Tax Strategy Assistant</h2>
        <p className="text-gray-600">Get personalized tax strategy guidance</p>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 min-h-[200px]">
          <p className="text-gray-600 text-center mt-16">
            AI Assistant will appear here. Start a conversation to get tax strategy recommendations.
          </p>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about tax strategies..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button 
            onClick={() => setMessage('')}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Header Component
const Header = () => {
  const location = useLocation();
  
  return (
    <header className="bg-[#0B0E1A] shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-4">
          <span className="text-lg font-bold text-green-400">IRS Escape Plan</span>
          <span className="text-sm font-medium text-gray-400">Your Path to Tax Freedom</span>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <Link to="/" className={`hover:text-green-400 transition-colors duration-150 ${location.pathname === '/' ? 'text-green-400' : ''}`}>Home</Link>
          <Link to="/courses" className={`hover:text-green-400 transition-colors duration-150 ${location.pathname === '/courses' ? 'text-green-400' : ''}`}>Courses</Link>
          <Link to="/pricing" className={`hover:text-green-400 transition-colors duration-150 ${location.pathname === '/pricing' ? 'text-green-400' : ''}`}>Pricing</Link>
          <Link to="/glossary" className={`hover:text-green-400 transition-colors duration-150 ${location.pathname === '/glossary' ? 'text-green-400' : ''}`}>Glossary</Link>
          <Link to="/tools" className={`hover:text-green-400 transition-colors duration-150 ${location.pathname === '/tools' ? 'text-green-400' : ''}`}>Tools</Link>
        </div>
        <Link
          to="/courses"
          className="bg-green-400 text-black rounded-md px-4 py-2 font-semibold hover:bg-green-300 transition-colors duration-150"
        >
          Get Started Free
        </Link>
      </nav>
    </header>
  );
};

// HomePage Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative min-h-[300px] md:min-h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-[center_top_20%]"
          style={{
            backgroundImage: "url('/assets/hero-final.jpg')",
            backgroundBlendMode: 'multiply',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-transparent z-10"></div>

        <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white px-4 pt-12 md:pt-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            You're Not Taxed Like the Wealthy—<span className="text-green-400">Yet.</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl mb-6">
            Learn how the 1% reduce taxes, compound income, and build freedom using the Wealth Multiplier Loop — and how you can too.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/courses"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-semibold"
            >
              See How It Works
            </Link>
            <Link
              to="/pricing"
              className="border border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-6 py-3 rounded-md font-semibold"
            >
              Your Escape Route
            </Link>
          </div>
        </div>
      </div>

      {/* Value Props Section - 3 Pillars */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center p-8 rounded-xl bg-emerald-50 border border-emerald-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Income Shifting</h3>
              <p className="text-gray-700">
                Reposition income from high-tax to low-tax categories across both W-2 and business income — creating permanent savings through structural change.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-blue-50 border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Tax Reduction</h3>
              <p className="text-gray-700">
                Layer tax deductions onto your income structure to generate passive income streams and reduce taxable income without changing your lifestyle.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-purple-50 border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Exit Planning</h3>
              <p className="text-gray-700">
                Transition your wealth into a protected, tax-efficient structure — minimizing capital gains exposure while preserving control and legacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Banner */}
      <div className="py-16 bg-gradient-to-r from-navy-900 to-emerald-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">$2.3M+</div>
              <div className="text-xl text-gray-300">Total Tax Savings</div>
              <div className="text-sm text-gray-400 mt-1">Generated for our students</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">10,000+</div>
              <div className="text-xl text-gray-300">Students Enrolled</div>
              <div className="text-sm text-gray-400 mt-1">High-income professionals served</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400 mb-2">98%</div>
              <div className="text-xl text-gray-300">Success Rate</div>
              <div className="text-sm text-gray-400 mt-1">Report significant tax reduction</div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-navy-900 mb-6">See How the IRS Escape Plan Works</h2>
            <p className="text-xl text-gray-600 mb-12">
              Watch a real case study walkthrough with step-by-step implementation
            </p>
            
            <div className="relative mb-8">
              <div className="aspect-video bg-gradient-to-br from-navy-900 to-emerald-900 rounded-xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                <div className="text-center text-white z-10">
                  <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 hover:bg-emerald-400 transition-colors duration-200 cursor-pointer transform hover:scale-110">
                    <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <p className="text-lg font-medium">Watch Case Study Preview</p>
                  <p className="text-emerald-300">12 minutes • Free</p>
                </div>
                
                {/* Video overlay text */}
                <div className="absolute bottom-6 left-6 right-6 text-left">
                  <div className="bg-black bg-opacity-60 rounded-lg p-4">
                    <h3 className="text-xl font-bold text-white mb-2">
                      "How I Eliminated $180K in Taxes Using the IRS Escape Plan"
                    </h3>
                    <p className="text-emerald-300 text-sm">
                      Real case study walkthrough with step-by-step implementation
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg max-w-3xl mx-auto">
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Entity optimization strategies
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Depreciation acceleration
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Income repositioning
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-navy-900 mb-6">Ready to Start Your IRS Escape Plan?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of high-income earners who have transformed their tax strategy and achieved financial freedom
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/courses"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Start Your Escape Plan
            </Link>
            <Link 
              to="/pricing"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-10 py-4 rounded-lg font-bold text-lg transition-all duration-200"
            >
              View Pricing Options
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// CoursesPage Component
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  if (selectedCourse) {
    return <CourseViewer course={selectedCourse} onBack={() => setSelectedCourse(null)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">IRS Escape Plan Courses</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive tax strategy education for high-income earners and business owners
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <CourseCard key={course.id || index} course={course} onCourseClick={handleCourseClick} />
          ))}
        </div>
      </div>
    </div>
  );
};

// PricingPage Component
const PricingPage = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const plans = [
    {
      name: "W-2 Escape Plan",
      oneTimePrice: "$997",
      monthlyPrice: "$49/mo",
      ctaText: "Start W-2 Plan",
      gradient: "from-emerald-500 to-emerald-600",
      accent: "emerald"
    },
    {
      name: "Business Owner Plan",
      oneTimePrice: "$1,497", 
      monthlyPrice: "$49/mo",
      ctaText: "Start Business Plan",
      gradient: "from-yellow-500 to-yellow-600",
      accent: "yellow"
    },
    {
      name: "All Access + AI",
      oneTimePrice: "$1,994",
      monthlyPrice: "$69/mo", 
      ctaText: "Get All Access",
      gradient: "from-pink-500 to-pink-600",
      accent: "pink",
      popular: true,
      badge: "Best Value"
    }
  ];

  const features = [
    {
      category: "Course Access",
      items: [
        { name: "W-2 tax strategies + glossary access", w2: true, business: false, allAccess: true },
        { name: "Business entity structure + cost seg strategy", w2: false, business: true, allAccess: true },
        { name: "Lifetime access to ALL courses & content", w2: false, business: false, allAccess: true }
      ]
    },
    {
      category: "AI Tools & Support",
      items: [
        { name: "REPS & STR tools + TaxBot assistant", w2: true, business: false, allAccess: true },
        { name: "Playbook Generator for Business", w2: false, business: true, allAccess: true },
        { name: "Advanced Playbook Generator with custom blueprints", w2: false, business: false, allAccess: true },
        { name: "Full AI Strategy Assistant (TaxBot) - unlimited access", w2: false, business: false, allAccess: true },
        { name: "1040 analyzer + community Q&A", w2: true, business: false, allAccess: true },
        { name: "K-1 Analyzer + tax planning support", w2: false, business: true, allAccess: true },
        { name: "Complete strategy simulator suite (Roth, REPS, W-2)", w2: false, business: false, allAccess: true },
        { name: "Premium Document Analyzer for all tax forms", w2: false, business: false, allAccess: true },
        { name: "Mobile app + priority advisor chat + office hours", w2: false, business: false, allAccess: true }
      ]
    }
  ];

  const getFeatureValue = (feature, planIndex) => {
    if (planIndex === 0) return feature.w2;
    if (planIndex === 1) return feature.business;
    if (planIndex === 2) return feature.allAccess;
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Choose Your Tax Freedom Plan</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional tax strategies used by high-income earners to minimize tax burden and build wealth
          </p>
        </div>
      </div>

      {/* What Makes This More Than a Course Section - Above Pricing */}
      <section className="bg-white py-12 px-6 md:px-16 border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">These Aren't Just Courses — They Unlock a Full Tax Tech Stack</h2>
          <p className="text-gray-600 text-lg mb-10 max-w-3xl mx-auto">
            With every plan, you unlock access to premium tools built to automate your tax strategy, spot missed savings, and guide you through execution.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            {/* Tool 1: AI Playbook Generator */}
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-yellow-500 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">AI Playbook Generator</h3>
              <p className="text-gray-600">
                Build a personalized tax strategy in seconds based on your income, entity type, and investment goals.
              </p>
            </div>

            {/* Tool 2: AI-Powered Tools */}
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-blue-500 text-3xl mb-4">💡</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Tools</h3>
              <p className="text-gray-600">
                Generate personalized playbooks, analyze documents for savings, and simulate real IRS strategies using our full AI engine.
              </p>
            </div>

            {/* Tool 3: W-2 Offset Planner */}
            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="text-green-500 text-3xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold mb-2">W-2 Offset Planner</h3>
              <p className="text-gray-600">
                Model how real estate, energy, and depreciation can reduce your effective tax rate in real time.
              </p>
            </div>
          </div>

          {/* Testimonial Strip */}
          <div className="bg-gray-100 mt-12 py-6 px-6 text-center rounded-lg shadow-inner max-w-4xl mx-auto mb-4">
            <blockquote className="text-lg italic text-gray-700">
              "The tools alone saved me over $25K this year. This isn't just a course — it's a complete tax system."
            </blockquote>
            <p className="text-sm text-gray-500 mt-2">— Nina R., Physician & Real Estate Investor</p>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-6">
          {/* Comparison Grid */}
          <div className="max-w-5xl mx-auto pt-4">
            
            {/* Mobile: Accordion Layout */}
            <div className="md:hidden space-y-4">
              {plans.map((plan, planIndex) => (
                <div key={planIndex} className={`bg-white rounded-lg shadow-lg overflow-hidden pt-12 ${plan.popular ? 'ring-2 ring-pink-400' : ''}`}>
                  {plan.popular && (
                    <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-center py-2 relative top-[-3rem] mb-[-2rem]">
                      <span className="text-sm font-bold">{plan.badge}</span>
                    </div>
                  )}
                  
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-navy-900 mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-2xl font-bold text-navy-900">{plan.oneTimePrice}</div>
                        <div className="text-xs text-gray-500">one-time + {plan.monthlyPrice}</div>
                      </div>
                      <button className={`py-2 px-4 rounded-lg font-bold text-white bg-gradient-to-r ${plan.gradient} text-sm`}>
                        {plan.ctaText}
                      </button>
                    </div>
                  </div>

                  {features.map((category, catIndex) => (
                    <div key={catIndex}>
                      <button
                        onClick={() => setActiveAccordion(activeAccordion === `${planIndex}-${catIndex}` ? null : `${planIndex}-${catIndex}`)}
                        className="w-full p-3 text-left bg-gray-50 border-b border-gray-200 flex justify-between items-center"
                      >
                        <span className="font-medium text-navy-900 text-sm">{category.category}</span>
                        <svg className={`w-4 h-4 transition-transform ${activeAccordion === `${planIndex}-${catIndex}` ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {activeAccordion === `${planIndex}-${catIndex}` && (
                        <div className="p-3 space-y-2">
                          {category.items.map((feature, featIndex) => (
                            <div key={featIndex} className="flex items-center">
                              {getFeatureValue(feature, planIndex) ? (
                                <svg className="w-4 h-4 text-emerald-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className={`text-xs ${getFeatureValue(feature, planIndex) ? 'text-gray-700' : 'text-gray-400'}`}>
                                {feature.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Desktop: Compact Comparison Table */}
            <div className="hidden md:block bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
              {/* Sticky Header with Pricing */}
              <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
                <div className="grid grid-cols-3 pt-12">
                  {plans.map((plan, index) => (
                    <div key={index} className={`p-4 text-center relative pt-12 ${plan.popular ? 'bg-pink-50 border-l border-r border-pink-200' : 'bg-gray-50'}`}>
                      {plan.popular && (
                        <div className="absolute top-[-1.5rem] left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            {plan.badge}
                          </span>
                        </div>
                      )}
                      <h3 className="font-bold text-navy-900 mb-2">{plan.name}</h3>
                      <div className="mb-1">
                        <div className="text-xl font-bold text-navy-900">{plan.oneTimePrice}</div>
                        <div className="text-xs text-gray-500">one-time course fee</div>
                      </div>
                      <div className="text-xs font-bold text-gray-500 mb-1">+</div>
                      <div className="mb-3">
                        <div className="text-xl font-bold text-navy-900">{plan.monthlyPrice}</div>
                        <div className="text-xs text-gray-500">platform subscription</div>
                      </div>
                      <button className={`w-full py-2 px-3 rounded-lg font-bold text-white bg-gradient-to-r ${plan.gradient} hover:shadow-lg transition-all duration-200 text-sm`}>
                        {plan.popular && (
                          <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        )}
                        {plan.ctaText}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature comparison rows */}
              {features.map((category, catIndex) => (
                <div key={catIndex}>
                  {/* Category header */}
                  <div className="bg-gray-100 border-b border-gray-200 py-3 px-6">
                    <h4 className="font-bold text-navy-900 text-sm text-center">{category.category}</h4>
                  </div>
                  
                  {/* Feature rows */}
                  {category.items.map((feature, featIndex) => (
                    <div key={featIndex} className="grid grid-cols-3 border-b border-gray-100 hover:bg-gray-50">
                      {plans.map((plan, planIndex) => (
                        <div key={planIndex} className={`p-3 text-center flex flex-col items-center justify-center ${plan.popular ? 'bg-pink-25' : ''}`}>
                          {getFeatureValue(feature, planIndex) ? (
                            <svg className="w-5 h-5 text-emerald-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mb-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={`text-xs text-center ${getFeatureValue(feature, planIndex) ? 'text-gray-700' : 'text-gray-400'}`}>
                            {feature.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// GlossaryPage Component
const GlossaryPage = () => {
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlossaryTerms();
  }, []);

  const fetchGlossaryTerms = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/glossary`);
      if (response.ok) {
        const data = await response.json();
        setGlossaryTerms(data);
      }
    } catch (error) {
      console.error('Error fetching glossary terms:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading glossary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Tax Strategy Glossary</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Complete definitions of tax strategies, terms, and concepts used by professionals
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <GlossarySection glossaryTerms={glossaryTerms} />
      </div>
    </div>
  );
};

// ToolsPage Component
const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userSubscription, setUserSubscription] = useState('free'); // This would come from actual user data
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tools`);
      if (response.ok) {
        const data = await response.json();
        setTools(data);
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  // Define free and premium tools
  const freeTools = [
    {
      id: 'entity-builder',
      title: 'Entity Builder',
      description: 'Discover the optimal business structure for your income and ownership profile',
      secondLine: 'Free diagnostic tool with personalized entity recommendations',
      icon: 'office-building',
      status: 'free',
      route: '/tools/entity-builder'
    },
    {
      id: 'w2-offset-planner',
      title: 'W-2 Offset Planner',
      description: 'Calculate optimal deduction strategies for W-2 income',
      secondLine: 'Map your depreciation capacity and offset opportunities',
      icon: 'calculator',
      status: 'free'
    },
    {
      id: 'reps-hour-tracker',
      title: 'REPS Hour Tracker',
      description: 'Track and document your 750-hour qualification',
      secondLine: 'Automated logging with audit-proof documentation',
      icon: 'clock',
      status: 'free'
    },
    {
      id: '1040-diagnostic',
      title: '1040 Diagnostic',
      description: 'Analyze your tax return for optimization opportunities',
      secondLine: 'Identify missed deductions and planning gaps',
      icon: 'document-search',
      status: 'free'
    },
    {
      id: 'strategy-xp-tracker',
      title: 'Strategy XP Tracker',
      description: 'Track your learning progress and mastery levels',
      secondLine: 'Gamified progress with achievement milestones',
      icon: 'chart-bar',
      status: 'free'
    },
    {
      id: 'glossary-quiz-mode',
      title: 'Glossary Quiz Mode',
      description: 'Test your knowledge of tax strategy terms',
      secondLine: 'Interactive learning with XP rewards',
      icon: 'academic-cap',
      status: 'free'
    }
  ];

  const premiumTools = [
    {
      id: 'build-escape-plan',
      title: 'Build Your Escape Plan',
      description: 'Create your personalized tax plan with optimized strategies and lifetime projections',
      secondLine: 'AI-powered analysis with comprehensive implementation roadmap',
      icon: 'lightning-bolt',
      status: 'premium',
      route: '/tools/build-escape-plan'
    },
    {
      id: 'roth-optimizer',
      title: 'Roth Optimizer',
      description: 'Model Roth conversion timing and tax impact',
      secondLine: 'Multi-year projections with income scenarios',
      icon: 'trending-up',
      status: 'premium'
    },
    {
      id: 'cost-seg-roi-tool',
      title: 'Cost Seg ROI Tool',
      description: 'Calculate cost segregation returns and timing',
      secondLine: 'Property analysis with depreciation acceleration',
      icon: 'home',
      status: 'premium'
    },
    {
      id: 'premium-document-reader',
      title: 'Premium Document Reader',
      description: 'AI analysis of K-1s, 1099s, and entity returns',
      secondLine: 'Automated optimization suggestions and red flags',
      icon: 'document-text',
      status: 'premium'
    }
  ];

  const getIcon = (iconName) => {
    const iconMap = {
      'calculator': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      'clock': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'document-search': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.5-4.5M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      'chart-bar': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'academic-cap': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      'trending-up': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      'office-building': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      'home': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      'lightning-bolt': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      'document-text': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    };
    return iconMap[iconName] || null;
  };

  const handleToolClick = (tool) => {
    if (tool.route) {
      // Navigate to the tool's dedicated route
      window.location.href = tool.route;
    } else if (tool.status === 'premium' && userSubscription === 'free') {
      setShowUpgradeModal(true);
    } else {
      // Handle free tools or premium tools for premium users
      console.log(`Launching tool: ${tool.title}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tools...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Your AI Tax Toolbox</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Map, model, and manage your IRS Escape Plan with our comprehensive strategy tools
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Free Tools Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Free Tools</h2>
            <p className="text-xl text-gray-600">Essential tools available to all users</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {freeTools.map((tool) => (
              <div 
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    {getIcon(tool.icon)}
                  </div>
                  <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
                    FREE
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-navy-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
                <p className="text-gray-500 text-xs mb-4">{tool.secondLine}</p>
                
                <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 px-4 rounded-lg font-bold hover:shadow-lg transition-all duration-200">
                  Launch Tool
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Tools Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Premium Tools</h2>
            <p className="text-xl text-gray-600">Advanced tools for premium subscribers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumTools.map((tool) => (
              <div 
                key={tool.id}
                onClick={() => handleToolClick(tool)}
                className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                  userSubscription === 'free' ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    userSubscription === 'free' 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {userSubscription === 'free' && (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                    {userSubscription !== 'free' && getIcon(tool.icon)}
                  </div>
                  <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-sm font-bold">
                    PREMIUM
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-navy-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{tool.description}</p>
                <p className="text-gray-500 text-xs mb-4">{tool.secondLine}</p>
                
                <button className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 ${
                  userSubscription === 'free'
                    ? 'bg-gray-300 text-gray-600'
                    : 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg'
                }`}>
                  {userSubscription === 'free' ? 'Upgrade to Access' : 'Launch Tool'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA for Free Users */}
        {userSubscription === 'free' && (
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Unlock All Premium Tools</h3>
            <p className="text-xl text-emerald-100 mb-6">
              Get access to advanced calculators, AI analysis, and personalized strategy generation
            </p>
            <Link 
              to="/pricing"
              className="bg-white text-emerald-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors duration-200"
            >
              View Premium Plans
            </Link>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">Premium Tool Access Required</h3>
              <p className="text-gray-600 mb-6">
                This tool is available to premium subscribers. Upgrade to access advanced strategy tools.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <Link 
                  to="/pricing"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg"
                >
                  Upgrade Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Legacy page components for existing routes
const TaxBotPage = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-6 py-12">
      <TaxBotSection />
    </div>
  </div>
);

const PremiumToolsPage = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container mx-auto px-6 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-navy-900 mb-6">Premium Tools</h1>
        <p className="text-xl text-gray-600">Advanced tax strategy tools for premium subscribers</p>
      </div>
    </div>
  </div>
);

const MarketplacePage = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Marketplace</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Additional courses and professional services
        </p>
      </div>
    </div>
    <div className="container mx-auto px-6 py-12">
      <div className="text-center">
        <p className="text-gray-600">Marketplace content coming soon...</p>
      </div>
    </div>
  </div>
);

// Main App Component with Router
const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/glossary" element={<GlossaryPage />} />
          <Route path="/tools" element={<ToolsPage />} />
          <Route path="/tools/build-escape-plan" element={<BuildEscapePlan />} />
          <Route path="/tools/entity-builder" element={<EntityBuilder />} />
          {/* Legacy routes for existing functionality */}
          <Route path="/taxbot" element={<TaxBotPage />} />
          <Route path="/premium-tools" element={<PremiumToolsPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;