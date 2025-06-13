import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Header Component with Updated Navigation
const Header = () => {
  return (
    <header className="bg-navy-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-bold text-emerald-400">
              IRS Escape Plan
            </Link>
            <div className="hidden md:block text-sm text-gray-300">
              Your Path to Tax Freedom
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link
              to="/"
              className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              Courses
            </Link>
            <Link
              to="/pricing"
              className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              Pricing
            </Link>
            <Link
              to="/glossary"
              className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              Glossary
            </Link>
            <Link
              to="/tools"
              className="text-gray-300 hover:text-emerald-400 transition-colors duration-200"
            >
              Tools
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/courses"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

// New Homepage Component - Escape Blueprint Landing
const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <img
  src="/assets/hero-final.jpg"
  alt="Hero background"
  className="absolute inset-0 w-full h-full object-cover object-top"
  style={{
    mixBlendMode: 'multiply',
    backgroundColor: 'rgba(226, 54, 54, 0.5)',
  }}
/>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-6xl font-bold mb-6">
            Escape IRS Problems <span className="text-emerald-400">Forever</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            The IRS Escape Plan is your blueprint to tax-free income, bulletproof asset protection, 
            and a clean exit — without loopholes or CPA jargon.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/courses')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              Watch Free Primer
            </button>
            <button 
              onClick={() => navigate('/pricing')}
              className="border-2 border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-navy-900 px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200"
            >
              See Pricing
            </button>
          </div>
        </div>
      </section>

      {/* 3-Point Value Proposition Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Tax Reduction */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Tax Reduction</h3>
              <p className="text-gray-600 leading-relaxed">
                Legally reduce your tax burden by 20-50%+ using advanced strategies 
                that high-income earners and businesses use to keep more of what they earn.
              </p>
            </div>

            {/* Income Shifting */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Income Shifting</h3>
              <p className="text-gray-600 leading-relaxed">
                Transform high-tax W-2 income into lower-tax business and investment income 
                through strategic entity structures and timing optimization.
              </p>
            </div>

            {/* Exit Planning */}
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-navy-900 mb-4">Exit Planning</h3>
              <p className="text-gray-600 leading-relaxed">
                Plan your clean exit from tax problems with bulletproof asset protection 
                and wealth transfer strategies that preserve your legacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-gradient-to-r from-navy-900 to-emerald-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by founders, doctors, and high-income professionals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">$2.3M+</div>
              <div className="text-gray-300">Total Tax Savings for Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">10,000+</div>
              <div className="text-gray-300">Students Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">98%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Preview Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-navy-900 mb-6">
              See How the IRS Escape Plan Works
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Watch this exclusive preview to understand how our proven system helps 
              high-income earners escape tax problems and build lasting wealth.
            </p>
            
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-navy-900 to-emerald-900 flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b" 
                  alt="Video preview"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-emerald-500 hover:bg-emerald-600 rounded-full p-6 shadow-2xl hover:scale-110 transition-all duration-300">
                    <svg className="w-12 h-12 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
                  12:34
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy-900 mb-2">
                  "How I Eliminated $180K in Taxes Using the IRS Escape Plan"
                </h3>
                <p className="text-gray-600">
                  Real case study walkthrough with step-by-step implementation
                </p>
              </div>
            </div>

            <div className="mt-12">
              <button 
                onClick={() => navigate('/courses')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200 hover:shadow-lg mr-4"
              >
                Start Your Escape Plan
              </button>
              <button 
                onClick={() => navigate('/pricing')}
                className="border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white px-8 py-4 rounded-xl text-lg font-bold transition-all duration-200"
              >
                View Pricing Options
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Courses Page Component
const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      if (!response.ok) {
        throw new Error(`Failed to fetch courses: ${response.status}`);
      }
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
  };

  if (selectedCourse) {
    return <CourseViewer course={selectedCourse} onBack={handleBackToCourses} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Choose Your Learning Path</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Select the course that matches your situation and start building your tax escape strategy today
          </p>
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onCourseClick={handleCourseClick}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-lg text-gray-600">No courses available.</div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Pricing Page Component
const PricingPage = () => {
  const plans = [
    {
      name: "W-2 Escape Plan",
      accent: "teal",
      oneTimePrice: "$997",
      oneTimeDescription: "one-time course fee",
      monthlyPrice: "$49/mo",
      monthlyDescription: "platform subscription",
      description: "High-income W-2 earners unlock deduction stacking, REPS access, and repositioning strategies.",
      features: [
        "Lifetime access to W-2 course modules",
        "AI Strategy Assistant (TaxBot) for W-2 questions", 
        "W-2 Offset Planner & REPS Hour Tracker",
        "Document Analyzer for W-2 & 1040 optimization",
        "Gamification + XP tracking system",
        "Mobile dashboard with strategy reminders"
      ],
      ctaText: "Start W-2 Plan",
      gradient: "from-teal-500 to-teal-600",
      border: "border-teal-200",
      bg: "bg-teal-50"
    },
    {
      name: "Business Owner Plan", 
      accent: "yellow",
      oneTimePrice: "$1,497",
      oneTimeDescription: "one-time course fee",
      monthlyPrice: "$49/mo",
      monthlyDescription: "platform subscription",
      description: "Entity optimization, MSO design, QBI qualification, and asset-backed exit strategies.",
      features: [
        "Lifetime access to Business Owner course",
        "AI Strategy Assistant (TaxBot) for entity questions",
        "Cost Segregation ROI & Bonus Depreciation tools",
        "Playbook Generator for business structures",
        "Document Analyzer for K-1 & entity returns",
        "Weekly office hours + advisor chat support"
      ],
      ctaText: "Start Business Plan",
      gradient: "from-yellow-500 to-yellow-600", 
      border: "border-yellow-200",
      bg: "bg-yellow-50"
    },
    {
      name: "All Access + AI",
      accent: "pink", 
      oneTimePrice: "$1,994",
      oneTimeDescription: "one-time course bundle",
      monthlyPrice: "$69/mo",
      monthlyDescription: "premium subscription",
      description: "Complete access to both courses, all tools, XP tracking, and your personal AI tax strategist.",
      features: [
        "Lifetime access to ALL courses & content",
        "Full AI Strategy Assistant (TaxBot) - unlimited access", 
        "Complete strategy simulator suite (Roth, REPS, W-2)",
        "Advanced Playbook Generator with custom blueprints",
        "Premium Document Analyzer for all tax forms",
        "Mobile app + priority advisor chat + office hours"
      ],
      ctaText: "Get All Access",
      gradient: "from-pink-500 to-pink-600",
      border: "border-pink-200", 
      bg: "bg-pink-50",
      popular: true,
      savings: "Save $500"
    }
  ];

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

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-emerald-900/10 border border-emerald-400/30 rounded-lg p-4 max-w-2xl mx-auto mb-12">
            <p className="text-emerald-700 text-center">
              <strong>Full Platform Access Requires:</strong> One-time course fee + Active monthly subscription
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${plan.popular ? 'ring-4 ring-emerald-400' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-emerald-400 text-navy-900 px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                {plan.savings && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {plan.savings}
                    </span>
                  </div>
                )}
                
                <div className={`${plan.bg} px-6 py-8 border-b ${plan.border}`}>
                  <h3 className="text-2xl font-bold text-navy-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                  
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 border-2 border-gray-200">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-navy-900">{plan.oneTimePrice}</span>
                        <span className="text-gray-500 text-sm">{plan.oneTimeDescription}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Lifetime course access</p>
                    </div>
                    
                    <div className="text-center text-gray-500 font-bold">+</div>
                    
                    <div className={`bg-white rounded-lg p-3 border-2 ${plan.accent === 'pink' ? 'border-pink-200' : 'border-navy-200'}`}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-bold text-navy-900">{plan.monthlyPrice}</span>
                        <span className="text-gray-500 text-sm">{plan.monthlyDescription}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">
                        {plan.accent === 'pink' ? 'Premium AI tools & features' : 'AI tools & platform features'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="px-6 py-6">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full bg-gradient-to-r ${plan.gradient} text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200`}>
                    {plan.ctaText}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Cancel anytime • Keep course access forever
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Information Section */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-navy-900 border border-navy-600 rounded-xl p-6">
              <h3 className="text-white text-lg font-bold mb-4 text-center">What You Get With Your Investment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-navy-800 rounded-lg p-4">
                  <h4 className="text-emerald-400 font-bold mb-2">One-Time Course Fee Includes:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Lifetime access to course modules</li>
                    <li>• Downloadable resources & worksheets</li>
                    <li>• Case studies & implementation guides</li>
                    <li>• Static course content forever</li>
                  </ul>
                </div>
                <div className="bg-navy-800 rounded-lg p-4">
                  <h4 className="text-emerald-400 font-bold mb-2">Monthly Subscription Unlocks:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• AI Strategy Assistant (TaxBot) - personalized guidance</li>
                    <li>• Strategy simulators (Roth, REPS, W-2 offset, etc.)</li>
                    <li>• Playbook Generator with custom tax blueprints</li>
                    <li>• Document Analyzer for tax form optimization</li>
                    <li>• Weekly office hours + in-app advisor chat</li>
                    <li>• Mobile app with push alerts & progress tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm mb-4">
              30-day money-back guarantee on course fee • Cancel subscription anytime • Secure payment
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

// Placeholder components for other sections (keeping existing functionality)
const GlossaryPage = () => {
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGlossary();
  }, []);

  const fetchGlossary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/glossary`);
      if (response.ok) {
        const data = await response.json();
        setGlossaryTerms(data);
      }
    } catch (error) {
      console.error('Error fetching glossary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Tax Strategy Glossary</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive definitions and real-world examples of tax strategies and concepts
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
          </div>
        ) : (
          <GlossarySection glossaryTerms={glossaryTerms} />
        )}
      </div>
    </div>
  );
};

const ToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-navy-900 to-emerald-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Tax Strategy Tools</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Interactive calculators and tools to optimize your tax strategy
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-400"></div>
          </div>
        ) : (
          <ToolsSection tools={tools} />
        )}
      </div>
    </div>
  );
};

// Import and preserve all existing components from the original App.js
// This includes all the complex components like CourseViewer, GlossarySection, etc.
// I'll need to add all the original components here...

// [CONTINUING IN NEXT PART DUE TO LENGTH LIMIT]
