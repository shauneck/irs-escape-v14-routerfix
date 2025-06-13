import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import html2pdf from 'html2pdf.js';

// Enhanced Tooltip component for assumptions - Fixed hover flicker
const AssumptionsTooltip = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClickMode, setIsClickMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isVisible && isClickMode && !event.target.closest('.assumptions-tooltip')) {
        setIsVisible(false);
        setIsClickMode(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible, isClickMode]);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsClickMode(true);
    setIsVisible(!isVisible);
  };

  const handleMouseEnter = () => {
    if (!isMobile && !isClickMode) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isClickMode) {
      setIsVisible(false);
    }
  };

  return (
    <div
      className="relative inline-block assumptions-tooltip group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center w-6 h-6 ml-2 text-xl text-emerald-500 hover:opacity-80 transition-opacity duration-150 rounded-full hover:bg-emerald-50"
        aria-label="Show assumptions"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>
      {isVisible && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={() => setIsVisible(false)} />
          )}
          {/* Tooltip */}
          <div className={`absolute z-50 w-80 max-w-sm p-4 bg-white border border-gray-200 rounded-md shadow-lg transition-opacity duration-200 ease-in-out ${
            isMobile
              ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
              : '-top-2 -left-32'
          }`}>
            {/* Arrow indicator for desktop */}
            {!isMobile && (
              <div className="absolute top-4 right-4 transform rotate-45 w-2 h-2 bg-white border-l border-b border-gray-200"></div>
            )}
            {/* Close button for mobile or click mode */}
            {(isMobile || isClickMode) && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  setIsClickMode(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="text-sm font-semibold text-gray-900 mb-3">Wealth Multiplier Assumptions</div>
            <div className="text-sm text-gray-600 space-y-2">
              <div>• Tax savings remain consistent over time</div>
              <div>• 100% of savings are reinvested annually</div>
              <div>• Reinvested savings compound at your selected return rate</div>
              <div>• Real estate income is offset by depreciation to remain tax efficient</div>
              <div>• All recommended strategies are implemented starting in Year 1</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Simple tooltip component for lifetime wealth impact
const WealthImpactTooltip = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClickMode, setIsClickMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isVisible && isClickMode && !event.target.closest('.wealth-impact-tooltip')) {
        setIsVisible(false);
        setIsClickMode(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isVisible, isClickMode]);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsClickMode(true);
    setIsVisible(!isVisible);
  };

  const handleMouseEnter = () => {
    if (!isMobile && !isClickMode) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile && !isClickMode) {
      setIsVisible(false);
    }
  };

  return (
    <div
      className="relative inline-block wealth-impact-tooltip"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={handleClick}
        className="inline-flex items-center justify-center w-6 h-6 ml-2 text-emerald-500 hover:opacity-80 transition-opacity duration-150 rounded-full hover:bg-emerald-50"
        aria-label="What this number means"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>
      {isVisible && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <div className="fixed inset-0 bg-black bg-opacity-25 z-40" onClick={() => setIsVisible(false)} />
          )}
          {/* Tooltip */}
          <div className={`absolute z-50 w-80 max-w-sm p-4 bg-white border border-gray-200 rounded-md shadow-lg transition-opacity duration-200 ease-in-out ${
            isMobile
              ? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
              : '-top-2 -left-32'
          }`}>
            {/* Arrow indicator for desktop */}
            {!isMobile && (
              <div className="absolute top-4 right-4 transform rotate-45 w-2 h-2 bg-white border-l border-b border-gray-200"></div>
            )}
            {/* Close button for mobile or click mode */}
            {(isMobile || isClickMode) && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  setIsClickMode(false);
                }}
                className="absolute top-2 right-2 w-6 h-6 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className="text-sm font-semibold text-gray-900 mb-3">What this number means:</div>
            <div className="text-sm text-gray-600">
              This value shows the projected benefit of implementing your tax strategy, including tax savings and potential compounding returns based on your selected assumptions.
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// 2025 Federal Tax Brackets for calculation
const TAX_BRACKETS = {
  single: [
    { min: 0, max: 11600, rate: 0.10 },
    { min: 11600, max: 47150, rate: 0.12 },
    { min: 47150, max: 100525, rate: 0.22 },
    { min: 100525, max: 191950, rate: 0.24 },
    { min: 191950, max: 243725, rate: 0.32 },
    { min: 243725, max: 609350, rate: 0.35 },
    { min: 609350, max: Infinity, rate: 0.37 }
  ]
};

// Income mappings for tax calculations
const INCOME_BRACKETS = {
  '<$200K': { default: 150000 },
  '$200K–$500K': { default: 350000 },
  '$500K–$1M': { default: 750000 },
  '$1M–$5M': { default: 2500000 },
  '$5M+': { default: 7500000 }
};

// Strategy implementation status options
const STRATEGY_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  IMPLEMENTED: 'implemented',
  NOT_APPLICABLE: 'not_applicable'
};

// Version for cache invalidation
const STRATEGY_LOGIC_VERSION = '2.0'; // Updated to clear old Conservation Easement data

// Educational content mapping
const EDUCATIONAL_CONTENT = {
  'Business Entity Formation': {
    module: 'Module 2: Entity Optimization',
    glossary: ['LLC', 'S-Corp', 'Tax Election'],
    caseStudy: 'Small Business Structure Case Study'
  },
  'C-Corporation Election Strategy': {
    module: 'Module 2: Entity Optimization',
    glossary: ['C-Corp', 'Corporate Tax', 'Double Taxation', 'Qualified Small Business Stock'],
    caseStudy: 'High-Income Solo Business Owner C-Corp Election'
  },
  'S-Corp Election Strategy': {
    module: 'Module 2: Entity Optimization',
    glossary: ['S-Corp', 'Payroll Tax', 'Distributions'],
    caseStudy: '$500K Business Owner S-Corp Election'
  },
  'Split operations into an MSO + operating entity': {
    module: 'Business Module 3',
    glossary: ['MSO', 'Management Service Organization', 'Multi-Entity'],
    caseStudy: 'High-Income Business MSO Structure'
  },
  'Asset Protection Trust': {
    module: 'Module 4: Advanced Planning',
    glossary: ['Irrevocable Trust', 'Asset Protection', 'Estate Planning'],
    caseStudy: 'High Net Worth Asset Protection Plan'
  },
  'Business Expense Maximization': {
    module: 'Module 1: Foundation',
    glossary: ['Business Deductions', 'Ordinary & Necessary'],
    caseStudy: 'Entrepreneur Expense Optimization'
  },
  'Defined Benefit Pension Plan': {
    module: 'Module 3: Retirement Planning',
    glossary: ['DB Plan', 'Contribution Limits', 'Actuarial'],
    caseStudy: 'Professional Practice DB Plan'
  },
  'Stock Compensation Optimization': {
    module: 'Module 3: Investment Strategies',
    glossary: ['RSU', 'ISO', 'ESPP', '83(b) Election'],
    caseStudy: 'Tech Executive Stock Comp Strategy'
  },
  'Qualified Opportunity Fund (QOF)': {
    module: 'Module 3: Investment Strategies',
    glossary: ['QOF', 'Capital Gains Deferral', 'Opportunity Zones'],
    caseStudy: 'Tech Executive QOF Strategy'
  },
  'Income Deferral Strategies': {
    module: 'Module 3: Investment Strategies',
    glossary: ['Deferred Compensation', 'Non-Qualified Plans'],
    caseStudy: 'Executive Compensation Deferral'
  },
  'Real Estate Investment Strategies': {
    module: 'Module 3: Investment Strategies',
    glossary: ['Cost Segregation', 'Bonus Depreciation', 'Section 199A'],
    caseStudy: 'Real Estate Investor Tax Strategy'
  },
  'Energy Tax Credit Investments': {
    module: 'Module 3: Investment Strategies',
    glossary: ['ITC', 'PTC', 'Energy Credits', 'Syndications'],
    caseStudy: 'Solar Investment Tax Strategy'
  },
  'Qualified Small Business Stock (QSBS)': {
    module: 'Module 4: Advanced Planning',
    glossary: ['QSBS', 'Section 1202', 'Qualified Business'],
    caseStudy: 'Startup Exit Planning with QSBS'
  },
  'Installment Sale Strategy': {
    module: 'Module 4: Advanced Planning',
    glossary: ['Installment Sale', 'Capital Gains Deferral'],
    caseStudy: 'Business Sale Installment Strategy'
  },
  'Loan-Based Split Dollar Life Insurance': {
    module: 'Module 2: Entity Optimization',
    glossary: ['Split Dollar', 'Life Insurance', 'C-Corp', 'Retained Earnings'],
    caseStudy: 'C-Corp Split Dollar Strategy'
  }
};

function calculateFederalTax(income) {
  let tax = 0;
  let remainingIncome = income;
  
  for (const bracket of TAX_BRACKETS.single) {
    if (remainingIncome <= 0) break;
    
    const taxableInThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    tax += taxableInThisBracket * bracket.rate;
    remainingIncome -= taxableInThisBracket;
  }
  
  return tax;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatLargeNumber(amount) {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return formatCurrency(amount);
}

// Format number with commas as user types
function formatNumberInput(value) {
  if (!value) return '';
  // Remove any non-digit characters
  const digitsOnly = value.toString().replace(/\D/g, '');
  // Add commas
  return digitsOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Parse formatted number back to plain number
function parseFormattedNumber(value) {
  if (!value) return '';
  return value.toString().replace(/,/g, '');
}

function PlaybookGenerator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    incomeType: '',
    incomeRange: '',
    entityStructure: '',
    strategyGoals: [],
    hasBusinessPartners: null, // New field for business partners
    receivesStockComp: false,
    rsuIncomePercent: ''
  });

  // Enhanced forecasting inputs
  const [forecastingData, setForecastingData] = useState({
    businessProfit: '',
    capitalAvailable: '',
    restructurePercent: '',
    forecastYears: 15,
    reinvestSavings: true,
    enableWealthLoop: true,
    returnRate: 6 // New field for adjustable return rate
  });

  const [results, setResults] = useState({
    strategyStack: {
      setupStructure: [],
      deductionStrategies: [],
      exitPlanning: []
    },
    estimatedSavingsPercent: { min: 0, max: 0 },
    estimatedSavingsDollar: { min: 0, max: 0 },
    forecastData: null,
    lastUpdated: null
  });

  // Dashboard state
  const [strategyStatuses, setStrategyStatuses] = useState({});
  const [dashboardMode, setDashboardMode] = useState('input'); // 'input', 'dashboard'
  const [isGenerating, setIsGenerating] = useState(false);
  const [showQuarterlyReview, setShowQuarterlyReview] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  // Update forecast data whenever forecasting parameters change
  useEffect(() => {
    if (hasExistingData && results.forecastData) {
      const newForecastData = calculateForecastData();
      setResults(prev => ({ ...prev, forecastData: newForecastData }));
    }
  }, [forecastingData.forecastYears, forecastingData.returnRate, forecastingData.enableWealthLoop, forecastingData.reinvestSavings]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('taxOptimizationData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // Check version and clear cache if outdated
        if (parsed.version !== STRATEGY_LOGIC_VERSION) {
          console.log('Cache version mismatch, clearing outdated data');
          localStorage.removeItem('taxOptimizationData');
          return;
        }
        
        if (parsed.results && parsed.results.strategyStack && parsed.results.strategyStack.setupStructure.length > 0) {
          setFormData(parsed.formData || formData);
          setForecastingData(parsed.forecastingData || forecastingData);
          setResults(parsed.results || results);
          setStrategyStatuses(parsed.strategyStatuses || {});
          setHasExistingData(true);
          setDashboardMode('dashboard');
        }
      } catch (error) {
        console.log('Error parsing saved data, clearing cache', error);
        localStorage.removeItem('taxOptimizationData');
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    const dataToSave = {
      version: STRATEGY_LOGIC_VERSION,
      formData,
      forecastingData,
      results,
      strategyStatuses
    };
    localStorage.setItem('taxOptimizationData', JSON.stringify(dataToSave));
  }, [formData, forecastingData, results, strategyStatuses]);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleMultiSelect = (field, value) => {
    const current = formData[field];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    setFormData({ ...formData, [field]: updated });
  };

  const handleForecastingChange = (field, value) => {
    // Handle formatted number inputs for specific fields
    if (field === 'businessProfit' || field === 'capitalAvailable') {
      const plainValue = parseFormattedNumber(value);
      setForecastingData(prevData => ({ ...prevData, [field]: plainValue }));
    } else {
      setForecastingData(prevData => ({ ...prevData, [field]: value }));
    }
  };

  const generateStrategyStack = (data, forecastData) => {
    const setupStructure = [];
    const deductionStrategies = [];
    const exitPlanning = [];

    // Setup & Structure Strategies - Only for business owners or mixed income
    if ((data.incomeType === 'business-owner' || data.incomeType === 'blended') && 
        (data.entityStructure === 'None' || data.entityStructure === 'Not sure')) {
      setupStructure.push({
        id: 'entity-formation',
        title: 'Business Entity Formation',
        complexity: 'Intermediate',
        module: 'Module 2: Entity Optimization',
        description: 'Establish optimal business structure for tax efficiency'
      });
    }

    // C-corp recommendation for high-income solo business owners
    if ((data.incomeType === 'business-owner' || data.incomeType === 'blended') &&
        (data.incomeRange === '$1M–$5M' || data.incomeRange === '$5M+') &&
        data.hasBusinessPartners === false) {
      setupStructure.push({
        id: 'c-corp-election',
        title: 'C-Corporation Election Strategy',
        complexity: 'Advanced',
        module: 'Module 2: Entity Optimization',
        description: 'Optimal structure for solo high-income business owners to minimize taxes and enable strategic planning'
      });

      // Add Split Dollar strategy for C-corp users
      setupStructure.push({
        id: 'split-dollar-insurance',
        title: 'Loan-Based Split Dollar Life Insurance',
        complexity: 'Advanced',
        module: 'Module 2: Entity Optimization',
        description: 'Use a loan-based split dollar structure to move retained earnings out of your C-corp and into a tax-advantaged life insurance policy — avoiding dividend taxation while maintaining access to capital.'
      });
    }

    if (data.incomeType === 'business-owner' || data.incomeType === 'blended') {
      setupStructure.push({
        id: 's-corp-election',
        title: 'S-Corp Election Strategy',
        complexity: 'Intermediate',
        module: 'Module 2: Entity Optimization',
        description: 'Optimize payroll vs distribution split for tax savings'
      });
    }

    // MSO Strategy for high-income business owners WITH partners
    if ((data.incomeType === 'business-owner' || data.incomeType === 'blended') &&
        (data.incomeRange === '$1M–$5M' || data.incomeRange === '$5M+') &&
        data.hasBusinessPartners === true) {
      setupStructure.push({
        id: 'mso-strategy',
        title: 'Split operations into an MSO + operating entity',
        complexity: 'Advanced',
        module: 'Business Module 3',
        description: 'An MSO allows you to separate operational income from management and intellectual property. This creates opportunities for income reclassification, asset protection, and multi-entity exit planning.'
      });

      // Add Split Dollar strategy for MSO users (involves C-corp structure)
      setupStructure.push({
        id: 'split-dollar-insurance',
        title: 'Loan-Based Split Dollar Life Insurance',
        complexity: 'Advanced',
        module: 'Module 2: Entity Optimization',
        description: 'Use a loan-based split dollar structure to move retained earnings out of your C-corp and into a tax-advantaged life insurance policy — avoiding dividend taxation while maintaining access to capital.'
      });
    }

    if (data.strategyGoals.includes('Asset protection')) {
      setupStructure.push({
        id: 'asset-protection-trust',
        title: 'Asset Protection Trust',
        complexity: 'Advanced',
        module: 'Module 4: Advanced Planning',
        description: 'Protect wealth from legal and financial risks'
      });
    }

    // Deduction Strategies
    if (data.incomeType === 'business-owner' || data.incomeType === 'blended') {
      deductionStrategies.push({
        id: 'business-expense-max',
        title: 'Business Expense Maximization',
        complexity: 'Beginner',
        module: 'Module 1: Foundation',
        description: 'Optimize all legitimate business deductions'
      });

      deductionStrategies.push({
        id: 'defined-benefit-plan',
        title: 'Defined Benefit Pension Plan',
        complexity: 'Advanced',
        module: 'Module 3: Retirement Planning',
        description: 'High-contribution retirement strategy for business owners'
      });
    }

    if (data.receivesStockComp) {
      deductionStrategies.push({
        id: 'stock-comp-optimization',
        title: 'Stock Compensation Optimization',
        complexity: 'Intermediate',
        module: 'Module 3: Investment Strategies',
        description: 'Timing strategies for RSUs, options, and ESPP'
      });

      // Add QOF and Income Deferral for high RSU income
      const rsuPercent = parseInt(data.rsuIncomePercent) || 0;
      if (rsuPercent >= 30) {
        deductionStrategies.push({
          id: 'qof-strategy',
          title: 'Qualified Opportunity Fund (QOF)',
          complexity: 'Advanced',
          module: 'Module 3: Investment Strategies',
          description: 'Defer and potentially eliminate capital gains from stock sales'
        });
      }

      if (rsuPercent >= 50) {
        deductionStrategies.push({
          id: 'income-deferral',
          title: 'Income Deferral Strategies',
          complexity: 'Intermediate',
          module: 'Module 3: Investment Strategies',
          description: 'Defer compensation to optimize tax brackets'
        });
      }
    }

    const capitalAvailable = parseInt(forecastData.capitalAvailable) || 0;
    if (capitalAvailable > 50000) {
      deductionStrategies.push({
        id: 'real-estate-strategies',
        title: 'Real Estate Investment Strategies',
        complexity: 'Intermediate',
        module: 'Module 3: Investment Strategies',
        description: 'Cost segregation and bonus depreciation benefits'
      });
    }

    if (capitalAvailable > 100000) {
      deductionStrategies.push({
        id: 'energy-tax-credits',
        title: 'Energy Tax Credit Investments',
        complexity: 'Advanced',
        module: 'Module 3: Investment Strategies',
        description: 'Solar, oil & gas, and renewable energy credits'
      });
    }

    // Exit Planning
    if (data.strategyGoals.includes('Exit planning')) {
      // QSBS only applies to C-corp entities
      if (data.entityStructure === 'C-corp') {
        exitPlanning.push({
          id: 'qsbs-strategy',
          title: 'Qualified Small Business Stock (QSBS)',
          complexity: 'Advanced',
          module: 'Module 4: Advanced Planning',
          description: 'Up to $10M in tax-free business sale proceeds'
        });
      }

      exitPlanning.push({
        id: 'installment-sale',
        title: 'Installment Sale Strategy',
        complexity: 'Intermediate',
        module: 'Module 4: Advanced Planning',
        description: 'Defer capital gains through structured payments'
      });
    }

    return { setupStructure, deductionStrategies, exitPlanning };
  };

  const calculateEstimatedSavings = () => {
    const income = INCOME_BRACKETS[formData.incomeRange]?.default || 350000;
    const taxLiability = calculateFederalTax(income);

    let baseSavingsMin = 12;
    let baseSavingsMax = 18;

    // Adjust based on income type
    if (formData.incomeType === 'business-owner') {
      baseSavingsMin += 8;
      baseSavingsMax += 15;
    } else if (formData.incomeType === 'blended') {
      baseSavingsMin += 6;
      baseSavingsMax += 12;
    }

    // Adjust based on entity structure
    if (formData.entityStructure === 'None' || formData.entityStructure === 'Not sure') {
      baseSavingsMin += 4;
      baseSavingsMax += 8;
    }

    // Adjust based on RSU income percentage
    const rsuPercent = parseInt(formData.rsuIncomePercent) || 0;
    if (rsuPercent >= 30) {
      baseSavingsMin += 3;
      baseSavingsMax += 6;
    }

    // Adjust based on forecasting inputs
    const businessProfit = parseInt(forecastingData.businessProfit) || 0;
    const capitalAvailable = parseInt(forecastingData.capitalAvailable) || 0;
    const lifestylePercent = parseInt(forecastingData.restructurePercent) || 0;
    const optimizationPercent = 100 - lifestylePercent; // Invert the percentage

    if (businessProfit > 500000) {
      baseSavingsMin += 3;
      baseSavingsMax += 6;
    }

    if (capitalAvailable > 100000) {
      baseSavingsMin += 2;
      baseSavingsMax += 5;
    }

    if (optimizationPercent > 50) { // Use optimization percentage instead of restructure
      baseSavingsMin += 3;
      baseSavingsMax += 7;
    }

    // Cap at reasonable maximums
    baseSavingsMin = Math.min(baseSavingsMin, 35);
    baseSavingsMax = Math.min(baseSavingsMax, 45);

    const savingsMinDollar = taxLiability * (baseSavingsMin / 100);
    const savingsMaxDollar = taxLiability * (baseSavingsMax / 100);

    return {
      percent: { min: baseSavingsMin, max: baseSavingsMax },
      dollar: { min: savingsMinDollar, max: savingsMaxDollar }
    };
  };

  const calculateForecastData = () => {
    const income = INCOME_BRACKETS[formData.incomeRange]?.default || 350000;
    const taxLiability = calculateFederalTax(income);
    const savings = calculateEstimatedSavings();
    const avgSavingsPercent = (savings.percent.min + savings.percent.max) / 2;
    const annualTaxSavings = taxLiability * (avgSavingsPercent / 100);

    const totalTaxWithoutStrategy = taxLiability * forecastingData.forecastYears;
    const totalTaxSavings = annualTaxSavings * forecastingData.forecastYears;

    let compoundedSavings = 0;
    let passiveIncomeProjections = [];

    if (forecastingData.reinvestSavings && forecastingData.enableWealthLoop) {
      const annualReturn = forecastingData.returnRate / 100; // Use adjustable return rate
      let cumulativeInvestment = 0;

      for (let year = 1; year <= forecastingData.forecastYears; year++) {
        cumulativeInvestment += annualTaxSavings;
        const yearEndValue = cumulativeInvestment * Math.pow(1 + annualReturn, year - 1);
        compoundedSavings = yearEndValue;

        // Calculate passive income (using the adjustable return rate)
        const passiveIncome = yearEndValue * annualReturn;

        if ([10, 15, 20].includes(year) && year <= forecastingData.forecastYears) {
          passiveIncomeProjections.push({
            year,
            passiveIncome,
            totalWealth: yearEndValue
          });
        }
      }
    } else if (forecastingData.reinvestSavings) {
      const annualReturn = forecastingData.returnRate / 100; // Use adjustable return rate
      for (let year = 1; year <= forecastingData.forecastYears; year++) {
        compoundedSavings += annualTaxSavings * Math.pow(1 + annualReturn, forecastingData.forecastYears - year);
      }
    }

    const totalValue = forecastingData.reinvestSavings ? compoundedSavings : totalTaxSavings;

    // Create chart data
    const chartData = [];
    for (let year = 1; year <= Math.min(forecastingData.forecastYears, 20); year += Math.max(1, Math.floor(forecastingData.forecastYears / 8))) {
      const cumulativeTaxPaid = taxLiability * year;
      let cumulativeValue = annualTaxSavings * year;
      let cumulativePassiveIncome = 0;

      if (forecastingData.reinvestSavings) {
        cumulativeValue = 0;
        const annualReturn = forecastingData.returnRate / 100; // Use adjustable return rate

        for (let y = 1; y <= year; y++) {
          cumulativeValue += annualTaxSavings * Math.pow(1 + annualReturn, year - y);
        }

        // Calculate cumulative passive income generated
        if (forecastingData.enableWealthLoop) {
          cumulativePassiveIncome = cumulativeValue * annualReturn;
        }
      }

      chartData.push({
        year: `Year ${year}`,
        doNothing: cumulativeTaxPaid,
        implementStrategy: cumulativeValue,
        passiveIncome: cumulativePassiveIncome
      });
    }

    return {
      income,
      taxLiability,
      annualTaxSavings,
      totalTaxWithoutStrategy,
      totalTaxSavings,
      compoundedSavings,
      totalValue,
      chartData,
      passiveIncomeProjections
    };
  };

  const generatePlaybook = async () => {
    setIsGenerating(true);

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate comprehensive strategy stack
    const strategyStack = generateStrategyStack(formData, forecastingData);
    const estimatedSavings = calculateEstimatedSavings();
    const forecastData = calculateForecastData();

    const newResults = {
      strategyStack,
      estimatedSavingsPercent: estimatedSavings.percent,
      estimatedSavingsDollar: estimatedSavings.dollar,
      forecastData,
      lastUpdated: new Date().toISOString()
    };

    setResults(newResults);

    // Initialize strategy statuses
    const newStatuses = {};
    [...strategyStack.setupStructure, ...strategyStack.deductionStrategies, ...strategyStack.exitPlanning].forEach(strategy => {
      newStatuses[strategy.id] = STRATEGY_STATUS.NOT_STARTED;
    });
    setStrategyStatuses(newStatuses);

    setIsGenerating(false);
    setHasExistingData(true);
    setDashboardMode('dashboard');
  };

  const nextStep = () => {
    // Handle conditional step flow
    if (currentStep === 3) {
      // After entity structure, check if we should skip Step 4 (business partners)
      if (formData.incomeType === 'w2-employee' || formData.incomeType === '1099-contractor') {
        setCurrentStep(5); // Skip Step 4 for W-2 and 1099 only users
      } else {
        setCurrentStep(4); // Show Step 4 for business owners and mixed income
      }
    } else if (currentStep === 4) {
      // Business partners question completed, go to strategy goals
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Strategy goals completed, go to stock compensation or skip
      if (formData.incomeType === 'business-owner') {
        setCurrentStep(8); // Skip stock compensation steps for business owners
      } else {
        setCurrentStep(6); // W-2 and blended go to stock compensation
      }
    } else if (currentStep === 6 && !formData.receivesStockComp) {
      setCurrentStep(8); // Skip RSU percentage if no stock comp
    } else if (currentStep === 7) {
      // After RSU percentage, go to financial details
      setCurrentStep(8);
    } else if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 9) {
      generatePlaybook();
    }
  };

  const prevStep = () => {
    // Handle reverse navigation with conditional steps
    if (currentStep === 5) {
      // Going back from strategy goals
      if (formData.incomeType === 'w2-employee' || formData.incomeType === '1099-contractor') {
        setCurrentStep(3); // Skip Step 4 for W-2 and 1099 only users
      } else {
        setCurrentStep(4); // Go back to business partners for business owners and mixed
      }
    } else if (currentStep === 8) {
      if (formData.incomeType === 'business-owner') {
        setCurrentStep(5); // Skip stock comp steps for business owners
      } else if (!formData.receivesStockComp) {
        setCurrentStep(6); // Go back to stock comp question
      } else {
        setCurrentStep(7); // Go back to RSU percentage
      }
    } else if (currentStep === 7) {
      setCurrentStep(6); // Go back to stock comp question
    } else if (currentStep === 6) {
      setCurrentStep(5); // Go back to strategy goals
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1: return formData.incomeType !== '';
      case 2: return formData.incomeRange !== '';
      case 3: return formData.entityStructure !== '';
      case 4:
        // Business partners question only required for business owners and mixed income
        if (formData.incomeType === 'business-owner' || formData.incomeType === 'blended') {
          return formData.hasBusinessPartners !== null;
        }
        return true; // Skip this step for W-2 and 1099 only users
      case 5: return formData.strategyGoals.length > 0;
      case 6:
        // Stock compensation question only for W-2 and blended
        if (formData.incomeType === 'w2-employee' || formData.incomeType === 'blended') {
          return formData.receivesStockComp !== null;
        }
        return true; // Skip for business owners
      case 7:
        return formData.rsuIncomePercent !== '' &&
               parseInt(formData.rsuIncomePercent) >= 0 &&
               parseInt(formData.rsuIncomePercent) <= 100;
      case 8:
        return forecastingData.businessProfit !== '' &&
               forecastingData.capitalAvailable !== '' &&
               forecastingData.restructurePercent !== '';
      case 9: return forecastingData.forecastYears > 0;
      default: return false;
    }
  };

  const startNewAnalysis = () => {
    // Clear all data
    localStorage.removeItem('taxOptimizationData');
    setCurrentStep(1);
    setFormData({
      incomeType: '',
      incomeRange: '',
      entityStructure: '',
      strategyGoals: [],
      hasBusinessPartners: null,
      receivesStockComp: false,
      rsuIncomePercent: ''
    });
    setForecastingData({
      businessProfit: '',
      capitalAvailable: '',
      restructurePercent: '',
      forecastYears: 15,
      reinvestSavings: true,
      enableWealthLoop: true,
      returnRate: 6
    });
    setResults({
      strategyStack: {
        setupStructure: [],
        deductionStrategies: [],
        exitPlanning: []
      },
      estimatedSavingsPercent: { min: 0, max: 0 },
      estimatedSavingsDollar: { min: 0, max: 0 },
      forecastData: null,
      lastUpdated: null
    });
    setStrategyStatuses({});
    setHasExistingData(false);
    setDashboardMode('input');
  };

  const recalculatePlaybook = () => {
    setCurrentStep(1);
    setDashboardMode('input');
  };

  const updateStrategyStatus = (strategyId, status) => {
    setStrategyStatuses(prev => ({
      ...prev,
      [strategyId]: status
    }));
  };

  const getStrategyProgress = () => {
    const allStrategies = [...results.strategyStack.setupStructure, ...results.strategyStack.deductionStrategies, ...results.strategyStack.exitPlanning];
    const implementedCount = allStrategies.filter(strategy => strategyStatuses[strategy.id] === STRATEGY_STATUS.IMPLEMENTED).length;
    return {
      implemented: implementedCount,
      total: allStrategies.length,
      percentage: allStrategies.length > 0 ? Math.round((implementedCount / allStrategies.length) * 100) : 0
    };
  };

  const generateQuarterlyReview = () => {
    const allStrategies = [...results.strategyStack.setupStructure, ...results.strategyStack.deductionStrategies, ...results.strategyStack.exitPlanning];
    const notStartedStrategies = allStrategies.filter(strategy => strategyStatuses[strategy.id] === STRATEGY_STATUS.NOT_STARTED);
    const inProgressStrategies = allStrategies.filter(strategy => strategyStatuses[strategy.id] === STRATEGY_STATUS.IN_PROGRESS);
    const estimatedMissedSavings = results.estimatedSavingsDollar.min * (notStartedStrategies.length / allStrategies.length);

    return {
      notStartedStrategies,
      inProgressStrategies,
      estimatedMissedSavings
    };
  };

  const exportToPDF = () => {
    const element = document.getElementById('dashboard-content');
    const opt = {
      margin: 1,
      filename: 'tax-strategy-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const getIncomeFieldConfig = () => {
    switch (formData.incomeType) {
      case 'w2-employee':
        return {
          label: 'What is your annual W-2 income before taxes?',
          placeholder: 'e.g., 275,000'
        };
      case 'business-owner':
        return {
          label: 'What is your annual business profit before taxes?',
          placeholder: 'e.g., 500,000'
        };
      case 'blended':
        return {
          label: 'What is your combined income (W-2 + business profit) before taxes?',
          placeholder: 'e.g., 800,000'
        };
      default:
        return {
          label: 'What is your annual income before taxes?',
          placeholder: 'e.g., 350,000'
        };
    }
  };

  const renderStrategyCard = (strategy) => {
    const status = strategyStatuses[strategy.id] || STRATEGY_STATUS.NOT_STARTED;
    const content = EDUCATIONAL_CONTENT[strategy.title] || {};

    const getStatusIcon = () => {
      switch (status) {
        case STRATEGY_STATUS.IMPLEMENTED: return '✅';
        case STRATEGY_STATUS.IN_PROGRESS: return '⏳';
        case STRATEGY_STATUS.NOT_APPLICABLE: return '🚫';
        default: return '○';
      }
    };

    const getComplexityColor = () => {
      switch (strategy.complexity) {
        case 'Beginner': return 'bg-emerald-100 text-emerald-700';
        case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
        case 'Advanced': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
      }
    };

    return (
      <div key={strategy.id} className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-2 pr-2">{strategy.title}</h4>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor()}`}>
                {strategy.complexity}
              </span>
              {content.module && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 truncate">
                  {content.module}
                </span>
              )}
            </div>
          </div>
          <div className="text-lg ml-2 flex-shrink-0">{getStatusIcon()}</div>
        </div>
        <p className="text-sm text-gray-600 mb-3 leading-snug line-clamp-2">{strategy.description}</p>
        <div className="mt-auto">
          <select
            value={status}
            onChange={(e) => updateStrategyStatus(strategy.id, e.target.value)}
            className="w-full px-2 py-1 border rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value={STRATEGY_STATUS.NOT_STARTED}>Not Started</option>
            <option value={STRATEGY_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={STRATEGY_STATUS.IMPLEMENTED}>Implemented</option>
            <option value={STRATEGY_STATUS.NOT_APPLICABLE}>Not Applicable</option>
          </select>
        </div>
      </div>
    );
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">Generating Your Tax Plan</h2>
            <p className="text-base text-muted-foreground">
              Creating personalized strategies and calculating your lifetime savings...
            </p>
          </div>
          <div className="space-y-2 text-left text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              Analyzing your financial profile
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
              Matching optimal tax strategies
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
              Calculating lifetime value projections
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dark Nav Bar with Emerald Gradient Header */}
      <div className="bg-gray-900">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-white hover:text-emerald-100 font-medium transition-colors">
                ← Back to Platform
              </Link>
              <h1 className="text-3xl font-semibold text-white">
                Build Your Escape Plan
              </h1>
              <div className="w-32"></div>{/* Spacer for centering */}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          height: 20px;
        }

        input[type="range"]::-webkit-slider-track {
          background: transparent;
          height: 6px;
          border-radius: 3px;
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          margin-top: -7px;
        }

        input[type="range"]::-webkit-slider-thumb:hover {
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        input[type="range"]::-moz-range-track {
          background: transparent;
          height: 6px;
          border-radius: 3px;
          border: none;
        }

        input[type="range"]::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        input[type="range"]:hover {
          opacity: 0.8;
        }

        .slider-container {
          position: relative;
          height: 20px;
          display: flex;
          align-items: center;
        }

        .slider-track {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 6px;
          transform: translateY(-50%);
          border-radius: 3px;
          z-index: 1;
        }

        .slider-input {
          position: relative;
          z-index: 2;
          width: 100%;
          margin: 0;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {dashboardMode === 'input' ? (
          /* Input Mode */
          <div className="max-w-4xl mx-auto">
            {/* Tool Description */}
            <div className="text-center mb-8">
              <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
                Get personalized strategies, track implementation progress, and forecast your financial future.
              </p>

              {/* How It Works Section */}
              <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                <div className="text-sm uppercase text-muted-foreground tracking-wide mb-4 text-center">How It Works</div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-emerald-600 font-semibold text-sm">1</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">Profile Analysis</h3>
                    <p className="text-xs text-muted-foreground">AI analyzes your income type and structure</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-emerald-600 font-semibold text-sm">2</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">Strategy Generation</h3>
                    <p className="text-xs text-muted-foreground">Personalized recommendations and savings estimates</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-emerald-600 font-semibold text-sm">3</span>
                    </div>
                    <h3 className="font-semibold mb-2 text-sm">Lifetime Forecast</h3>
                    <p className="text-xs text-muted-foreground">See compound wealth creation over decades</p>
                  </div>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => setCurrentStep(1)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-md font-semibold transition-colors"
              >
                Plan Your Escape
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span className="font-medium">Step {currentStep} of 9</span>
                <span className="font-medium">{Math.round((currentStep / 9) * 100)}% Complete</span>
              </div>
              <div className="flex space-x-2">
                {Array.from({ length: 9 }, (_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              {/* STEP 1: Income Type */}
              {currentStep === 1 && (
                <div>
                  <div className="text-sm uppercase text-muted-foreground tracking-wide mb-2">Step 1 of 8</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Income Type</h2>
                  <p className="text-base text-muted-foreground mb-8">What type of income do you currently earn?</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { value: 'w2-employee', label: 'W-2 Employee', desc: 'Traditional employee with W-2 income' },
                      { value: '1099-contractor', label: '1099 Contractor', desc: 'Independent contractor or freelancer' },
                      { value: 'business-owner', label: 'Business Owner', desc: 'Own a business or multiple revenue streams' },
                      { value: 'blended', label: 'Blended', desc: 'Mix of W-2, 1099, and/or business income' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('incomeType', option.value)}
                        className={`text-left p-6 rounded-2xl border transition-all ${
                          formData.incomeType === option.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-2">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Income Range */}
              {currentStep === 2 && (
                <div>
                  <div className="text-sm uppercase text-muted-foreground tracking-wide mb-2">Step 2 of 8</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Income Range</h2>
                  <p className="text-base text-muted-foreground mb-8">What is your approximate annual income?</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { value: '<$200K', label: 'Under $200K' },
                      { value: '$200K–$500K', label: '$200K – $500K' },
                      { value: '$500K–$1M', label: '$500K – $1M' },
                      { value: '$1M–$5M', label: '$1M – $5M' },
                      { value: '$5M+', label: '$5M+' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('incomeRange', option.value)}
                        className={`text-left p-6 rounded-2xl border transition-all ${
                          formData.incomeRange === option.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <div className="font-semibold text-lg">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Entity Structure */}
              {currentStep === 3 && (
                <div>
                  <div className="text-sm uppercase text-muted-foreground tracking-wide mb-2">Step 3 of 8</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Entity Structure</h2>
                  <p className="text-base text-muted-foreground mb-8">What is your current entity structure?</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { value: 'None', label: 'None', desc: 'Filing as individual or sole proprietor' },
                      { value: 'LLC', label: 'LLC', desc: 'Limited Liability Company' },
                      { value: 'S-corp', label: 'S-Corporation', desc: 'S-Corp election for tax savings' },
                      { value: 'C-corp', label: 'C-Corporation', desc: 'Traditional corporate structure' },
                      { value: 'Trust', label: 'Trust', desc: 'Trust structure for asset protection' },
                      { value: 'Not sure', label: 'Not sure', desc: 'Need help determining optimal structure' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleInputChange('entityStructure', option.value)}
                        className={`text-left p-6 rounded-2xl border transition-all ${
                          formData.entityStructure === option.value
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <div className="font-semibold text-lg mb-2">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Business Partners (only for business owners and mixed income) */}
              {currentStep === 4 && (formData.incomeType === 'business-owner' || formData.incomeType === 'blended') && (
                <div>
                  <div className="text-sm uppercase text-gray-600 tracking-wide mb-2">Step 4 of 9</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Business Partnership</h2>
                  <p className="text-base text-gray-600 mb-8">Do you have any partners in your business?</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleInputChange('hasBusinessPartners', false)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                        formData.hasBusinessPartners === false
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-300 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-semibold text-lg mb-2">No</div>
                      <div className="text-sm text-gray-600">I am the sole owner of my business</div>
                    </button>

                    <button
                      onClick={() => handleInputChange('hasBusinessPartners', true)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                        formData.hasBusinessPartners === true
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-300 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-semibold text-lg mb-2">Yes</div>
                      <div className="text-sm text-gray-600">I have one or more business partners</div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Strategy Goals */}
              {currentStep === 5 && (
                <div>
                  <div className="text-sm uppercase text-gray-600 tracking-wide mb-2">Step 5 of 9</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Strategy Goals</h2>
                  <p className="text-base text-gray-600 mb-8">What are your main tax optimization goals? (Select all that apply)</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { value: 'Reduce current tax liability', label: 'Reduce current tax liability', desc: 'Lower taxes owed this year' },
                      { value: 'Asset protection', label: 'Asset protection', desc: 'Protect wealth from legal risks' },
                      { value: 'Estate planning', label: 'Estate planning', desc: 'Transfer wealth efficiently to heirs' },
                      { value: 'Business optimization', label: 'Business optimization', desc: 'Optimize business structure for tax efficiency' },
                      { value: 'Exit planning', label: 'Exit planning', desc: 'Plan for business sale or exit' },
                      { value: 'Build long-term passive income', label: 'Build long-term passive income', desc: 'Create streams of passive income' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleMultiSelect('strategyGoals', option.value)}
                        className={`text-left p-6 rounded-2xl border transition-all ${
                          formData.strategyGoals.includes(option.value)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-300 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`w-5 h-5 rounded border-2 mr-3 mt-0.5 flex items-center justify-center ${
                            formData.strategyGoals.includes(option.value)
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.strategyGoals.includes(option.value) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-lg mb-1">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Stock Compensation (Only for W-2 and blended) */}
              {currentStep === 6 && (formData.incomeType === 'w2-employee' || formData.incomeType === 'blended') && (
                <div>
                  <div className="text-sm uppercase text-gray-600 tracking-wide mb-2">Step 6 of 9</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Stock Compensation</h2>
                  <p className="text-base text-gray-600 mb-8">Do you receive stock compensation (RSUs, options, ESPP)?</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => handleInputChange('receivesStockComp', true)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                        formData.receivesStockComp === true
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-300 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-semibold text-lg mb-2">Yes</div>
                      <div className="text-sm text-muted-foreground">I receive RSUs, stock options, or ESPP benefits</div>
                    </button>

                    <button
                      onClick={() => handleInputChange('receivesStockComp', false)}
                      className={`text-left p-6 rounded-2xl border transition-all ${
                        formData.receivesStockComp === false
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-300 hover:border-emerald-300'
                      }`}
                    >
                      <div className="font-semibold text-lg mb-2">No</div>
                      <div className="text-sm text-muted-foreground">My compensation is cash only</div>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: RSU Percentage (Only if receives stock comp) */}
              {currentStep === 7 && formData.receivesStockComp && (
                <div>
                  <div className="text-sm uppercase text-muted-foreground tracking-wide mb-2">Step 7 of 9</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Stock Compensation Details</h2>
                  <p className="text-base text-muted-foreground mb-8">What percentage of your income comes from stock compensation?</p>

                  <div className="max-w-md mx-auto text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Compensation Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.rsuIncomePercent}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Validate between 0 and 100
                          if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
                            handleInputChange('rsuIncomePercent', value);
                          }
                        }}
                        placeholder="e.g., 30"
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border rounded-md text-lg text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-600">%</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Enter a value between 0 and 100</p>
                  </div>
                </div>
              )}

              {/* STEP 8: Enhanced Forecasting Inputs */}
              {currentStep === 8 && (
                <div>
                  <div className="text-sm uppercase text-gray-600 tracking-wide mb-2">Step 8 of 9</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Financial Details</h2>
                  <p className="text-base text-gray-600 mb-8">Help us calculate more precise forecasting for your situation</p>

                  <div className="max-w-lg mx-auto space-y-8">
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        {getIncomeFieldConfig().label}
                      </label>
                      <div className="flex justify-center">
                        <input
                          type="text"
                          value={formatNumberInput(forecastingData.businessProfit)}
                          onChange={(e) => handleForecastingChange('businessProfit', e.target.value)}
                          placeholder={getIncomeFieldConfig().placeholder}
                          className="w-64 h-12 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center"
                        />
                      </div>
                    </div>

                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Capital available for tax-advantaged investments
                      </label>
                      <div className="flex justify-center">
                        <input
                          type="text"
                          value={formatNumberInput(forecastingData.capitalAvailable)}
                          onChange={(e) => handleForecastingChange('capitalAvailable', e.target.value)}
                          placeholder="e.g., 250,000"
                          className="w-64 h-12 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-center"
                        />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Capital you could invest in real estate, energy credits, etc.</p>
                    </div>

                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        What percentage of your income do you need for lifestyle expenses?
                      </label>
                      <p className="text-xs text-gray-600 mb-4">(We'll use the rest to explore tax-saving strategies.)</p>
                      <div className="flex justify-center">
                        <div className="relative w-32">
                          <input
                            type="number"
                            value={forecastingData.restructurePercent}
                            onChange={(e) => handleForecastingChange('restructurePercent', e.target.value)}
                            placeholder="70"
                            min="0"
                            max="100"
                            className="w-full h-12 px-4 py-3 border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-8 text-center"
                          />
                          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-600">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 9: Forecast Parameters */}
              {currentStep === 9 && (
                <div>
                  <div className="text-sm uppercase text-gray-600 tracking-wide mb-2">Step 9 of 9</div>
                  <h2 className="text-3xl font-semibold text-gray-900 mb-2">Forecast Settings</h2>
                  <p className="text-base text-gray-600 mb-8">Choose your forecasting parameters for lifetime projections</p>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Forecast timeframe: {forecastingData.forecastYears} years
                      </label>
                      <div className="slider-container mb-2">
                        <div
                          className="slider-track"
                          style={{
                            background: `linear-gradient(to right, #10b981 0%, #10b981 ${((forecastingData.forecastYears - 5) / 15) * 100}%, #e5e7eb ${((forecastingData.forecastYears - 5) / 15) * 100}%, #e5e7eb 100%)`
                          }}
                        ></div>
                        <input
                          type="range"
                          min="5"
                          max="20"
                          value={forecastingData.forecastYears}
                          onChange={(e) => handleForecastingChange('forecastYears', parseInt(e.target.value))}
                          className="slider-input"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>5 years</span>
                        <span>20 years</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-6">Investment strategy</label>
                      <div className="space-y-4 max-w-md mx-auto">
                        <label className="flex items-center justify-center p-4 rounded-xl border cursor-pointer hover:border-emerald-300">
                          <input
                            type="radio"
                            name="reinvest"
                            checked={forecastingData.reinvestSavings}
                            onChange={() => handleForecastingChange('reinvestSavings', true)}
                            className="mr-3 text-emerald-500 focus:ring-emerald-500 flex-shrink-0"
                          />
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">Reinvest tax savings</div>
                            <div className="text-sm text-muted-foreground">6% annual return for compound growth</div>
                          </div>
                        </label>

                        <label className="flex items-center justify-center p-4 rounded-xl border cursor-pointer hover:border-emerald-300">
                          <input
                            type="radio"
                            name="reinvest"
                            checked={!forecastingData.reinvestSavings}
                            onChange={() => handleForecastingChange('reinvestSavings', false)}
                            className="mr-3 text-emerald-500 focus:ring-emerald-500 flex-shrink-0"
                          />
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">Save tax reduction only</div>
                            <div className="text-sm text-muted-foreground">Keep savings without additional investment</div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="px-6 py-3 border border-gray-300 text-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-all"
                >
                  Previous
                </button>

                <button
                  onClick={nextStep}
                  disabled={!isStepComplete()}
                  className={`px-6 py-3 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all ${
                    currentStep === 8
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : 'bg-emerald-500 hover:bg-emerald-600'
                  }`}
                >
                  {currentStep === 9 ? 'Generate My Tax Plan' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Mode */
          <div className="max-w-6xl mx-auto" id="dashboard-content">
            {/* Entry Point Section */}
            <div className="mb-12">
              {!hasExistingData ? (
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                  <h2 className="text-3xl font-semibold tracking-tight text-gray-900 mb-4">Build Your Personalized Tax Plan</h2>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Start from scratch and uncover the strategies that could save you 20–40% in taxes.
                  </p>
                  <button
                    onClick={startNewAnalysis}
                    className="px-8 py-3 bg-emerald-500 text-white font-medium rounded-md hover:bg-emerald-600 transition-all"
                  >
                    Start Your Escape Plan
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  <button
                    onClick={startNewAnalysis}
                    className="bg-emerald-500 text-white p-6 rounded-2xl text-center hover:bg-emerald-600 transition-all shadow-sm"
                  >
                    <div className="text-xl font-semibold mb-2">New Analysis</div>
                    <div className="text-sm opacity-90">Start fresh analysis</div>
                  </button>

                  <button
                    onClick={recalculatePlaybook}
                    className="bg-white border border-emerald-500 text-emerald-700 p-6 rounded-2xl text-center hover:bg-emerald-50 transition-all"
                  >
                    <div className="text-xl font-semibold mb-2">Recalculate</div>
                    <div className="text-sm">Update existing plan</div>
                  </button>

                  <button
                    onClick={() => setShowQuarterlyReview(!showQuarterlyReview)}
                    className="bg-white border border-gray-300 text-gray-600 p-6 rounded-2xl text-center hover:bg-gray-50 transition-all"
                  >
                    <div className="text-xl font-semibold mb-2">Quarterly Review</div>
                    <div className="text-sm">Progress check-in</div>
                  </button>
                </div>
              )}
            </div>

            {hasExistingData && (
              <>
                {/* Profile Summary */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                  <div className="text-sm uppercase text-gray-600 tracking-wide mb-4">Profile</div>
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm text-gray-600">Income Type:</span>
                      <span className="font-semibold text-gray-900">{formData.incomeType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm text-gray-600">Income Range:</span>
                      <span className="font-semibold text-gray-900">{formData.incomeRange}</span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="text-sm text-gray-600">Entity Structure:</span>
                      <span className="font-semibold text-gray-900">{formData.entityStructure}</span>
                    </div>
                    {/* Only show stock compensation for W-2 and blended income types */}
                    {(formData.incomeType === 'w2-employee' || formData.incomeType === 'blended') && (
                      <div className="flex items-center gap-x-2">
                        <span className="text-sm text-gray-600">Stock Compensation:</span>
                        <span className="font-semibold text-gray-900">
                          {formData.receivesStockComp ? `Yes (${formData.rsuIncomePercent}%)` : 'No'}
                        </span>
                      </div>
                    )}
                    {/* Show business partners for business owners */}
                    {(formData.incomeType === 'business-owner' || formData.incomeType === 'blended') && (
                      <div className="flex items-center gap-x-2">
                        <span className="text-sm text-gray-600">Business Partners:</span>
                        <span className="font-semibold text-gray-900">
                          {formData.hasBusinessPartners === true ? 'Yes' : formData.hasBusinessPartners === false ? 'No' : 'Not specified'}
                        </span>
                      </div>
                    )}
                  </div>

                  {results.lastUpdated && (
                    <div className="mt-6 pt-6 border-t">
                      <p className="text-sm text-gray-600">
                        Last updated: {new Date(results.lastUpdated).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {/* Quarterly Review Panel */}
                {showQuarterlyReview && (() => {
                  const review = generateQuarterlyReview();
                  return (
                    <div className="bg-orange-50 border-l-4 border-orange-400 rounded-2xl p-6 mb-8">
                      <h3 className="text-xl font-semibold tracking-tight text-orange-900 mb-4">Quarterly Strategy Review</h3>
                      <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-3">Priority Actions</h4>
                          <ul className="space-y-2">
                            {review.notStartedStrategies.map(strategy => (
                              <li key={strategy.id} className="text-orange-700 text-sm">
                                • {strategy.title} ({strategy.complexity})
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-orange-800 mb-3">Potential Impact</h4>
                          <p className="text-orange-700 text-sm">
                            Unimplemented strategies may be costing you{' '}
                            <span className="font-bold">{formatCurrency(review.estimatedMissedSavings)}</span> annually.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* 1. Strategy Recommendations */}
                <div className="mb-12">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">Your Strategy Recommendations</h2>
                    <p className="text-base text-gray-600 max-w-3xl mx-auto">
                      Based on your profile, here are the personalized strategies that will drive your tax optimization.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Setup & Structure */}
                    {results.strategyStack.setupStructure.length > 0 && (
                      <div>
                        <div className="text-sm uppercase text-gray-600 tracking-wide mb-3">Setup & Structure</div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {results.strategyStack.setupStructure.map(renderStrategyCard)}
                        </div>
                      </div>
                    )}

                    {/* Deduction Strategies */}
                    {results.strategyStack.deductionStrategies.length > 0 && (
                      <div>
                        <div className="text-sm uppercase text-gray-600 tracking-wide mb-3">Deduction Strategies</div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {results.strategyStack.deductionStrategies.map(renderStrategyCard)}
                        </div>
                      </div>
                    )}

                    {/* Exit Planning */}
                    {results.strategyStack.exitPlanning.length > 0 && (
                      <div>
                        <div className="text-sm uppercase text-gray-600 tracking-wide mb-3">Exit Planning</div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {results.strategyStack.exitPlanning.map(renderStrategyCard)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Implementation Status Tracker */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-1">Implementation Progress</h2>
                      <p className="text-sm text-gray-600">Track your progress on each recommended strategy</p>
                    </div>
                    <div className="flex flex-col items-end text-right">
                      <div className="text-2xl font-bold text-emerald-600 mb-1">
                        {getStrategyProgress().implemented}/{getStrategyProgress().total}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        Strategies Implemented
                      </div>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getStrategyProgress().percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Estimated Annual Tax Savings */}
                <div className="bg-white rounded-2xl shadow-sm p-8 mb-12">
                  <div className="text-center">
                    <div className="text-sm uppercase text-gray-600 tracking-wide mb-4">Estimated Annual Tax Savings</div>
                    <div className="mb-6">
                      <div className="text-5xl font-bold text-emerald-600 mb-3">
                        {results.estimatedSavingsPercent.min}% – {results.estimatedSavingsPercent.max}%
                      </div>
                      <div className="text-2xl font-semibold text-gray-800 mb-4">
                        {formatCurrency(results.estimatedSavingsDollar.min)} – {formatCurrency(results.estimatedSavingsDollar.max)} annually
                      </div>
                      <p className="text-base text-gray-600 max-w-2xl mx-auto">
                        These savings are the foundation for building long-term wealth through strategic reinvestment.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Lifetime Forecast + Wealth Multiplier Loop */}
                {results.forecastData && (
                  <div className="space-y-8 mb-12">
                    {/* Wealth Multiplier Loop Explanation */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-200">
                      <div className="flex items-center justify-center mb-4">
                        <h2 className="text-3xl font-semibold text-gray-900">The Wealth Multiplier Loop</h2>
                        <AssumptionsTooltip />
                      </div>
                      <p className="text-base text-gray-600 mb-8 text-center max-w-3xl mx-auto">
                        Your tax strategy isn't just about savings — it's the fuel for wealth compounding and long-term financial escape.
                      </p>

                      <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">1. Save Tax</h3>
                          <p className="text-sm text-gray-600">Through entity structure + strategic deductions</p>
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">2. Reinvest</h3>
                          <p className="text-sm text-gray-600">Tax savings into tax-favored assets</p>
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">3. Generate</h3>
                          <p className="text-sm text-gray-600">Passive income and appreciation</p>
                        </div>

                        <div className="text-center">
                          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">4. Repeat</h3>
                          <p className="text-sm text-gray-600">Compound exponentially year over year</p>
                        </div>
                      </div>
                    </div>

                    {/* Lifetime Forecast Section */}
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                      <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                          <h3 className="text-3xl font-semibold text-gray-900">Your Lifetime Wealth Impact</h3>
                          <WealthImpactTooltip />
                        </div>
                        <div className="text-center mb-6">
                          <div className="text-5xl font-bold text-emerald-600 mb-3">
                            {formatCurrency(results.forecastData?.totalValue || 0)}
                          </div>
                          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Total lifetime value created through your personalized tax optimization strategy.
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                          <button
                            onClick={exportToPDF}
                            className="px-6 py-3 border border-emerald-500 text-emerald-700 rounded-md hover:bg-emerald-50 font-medium transition-all"
                          >
                            Download Strategy Report
                          </button>
                          <button className="px-6 py-3 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 font-medium transition-all">
                            Start My Escape Plan
                          </button>
                        </div>
                      </div>

                      {/* Enhanced Forecast Controls */}
                      <div className="space-y-6 mb-8">
                        {/* Investment Strategy (Full Width) */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <div className="text-sm uppercase text-gray-600 tracking-wide mb-3">Investment Strategy</div>
                          <div className="text-2xl font-bold text-gray-900 mb-3">
                            {forecastingData.reinvestSavings ? 'Reinvest Savings' : 'Save Only'}
                          </div>
                          <div className="text-xs text-gray-600">
                            {forecastingData.reinvestSavings ? `${forecastingData.returnRate}% annual return compound growth` : 'Cash savings without additional investment'}
                          </div>
                        </div>

                        {/* Control Cards Grid - Compact and Aligned */}
                        <div className="grid md:grid-cols-3 gap-4">
                          {/* Time Horizon with Green Slider */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-xs uppercase text-gray-600 tracking-wide mb-2 text-center">Time Horizon</div>
                            <div className="text-xl font-bold text-gray-900 mb-3 text-center">{forecastingData.forecastYears} years</div>
                            <div className="slider-container mb-2">
                              <div
                                className="slider-track"
                                style={{
                                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((forecastingData.forecastYears - 5) / 15) * 100}%, #e5e7eb ${((forecastingData.forecastYears - 5) / 15) * 100}%, #e5e7eb 100%)`
                                }}
                              ></div>
                              <input
                                type="range"
                                min="5"
                                max="20"
                                value={forecastingData.forecastYears}
                                onChange={(e) => {
                                  const newYears = parseInt(e.target.value);
                                  setForecastingData(prev => ({ ...prev, forecastYears: newYears }));
                                }}
                                className="slider-input"
                              />
                            </div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>5</span>
                              <span>20</span>
                            </div>
                          </div>

                          {/* Return Rate Slider - Center Aligned */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-xs uppercase text-gray-600 tracking-wide mb-2 text-center">Return Rate</div>
                            <div className="text-xl font-bold text-gray-900 mb-3 text-center">{forecastingData.returnRate}%</div>
                            <div className="slider-container mb-2">
                              <div
                                className="slider-track"
                                style={{
                                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${((forecastingData.returnRate - 3) / 9) * 100}%, #e5e7eb ${((forecastingData.returnRate - 3) / 9) * 100}%, #e5e7eb 100%)`
                                }}
                              ></div>
                              <input
                                type="range"
                                min="3"
                                max="12"
                                value={forecastingData.returnRate}
                                onChange={(e) => {
                                  const newRate = parseInt(e.target.value);
                                  setForecastingData(prev => ({ ...prev, returnRate: newRate }));
                                }}
                                className="slider-input"
                              />
                            </div>
                            <div className="text-xs text-gray-600 mb-1 text-center">Compounding at: {forecastingData.returnRate}% annually</div>
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>3%</span>
                              <span>12%</span>
                            </div>
                          </div>

                          {/* Wealth Multiplier Loop - Inline and Compact */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="text-xs uppercase text-gray-600 tracking-wide mb-2 text-center">Wealth Loop</div>
                            <div className="text-center mb-3">
                              <label className="flex items-center justify-center">
                                <input
                                  type="checkbox"
                                  checked={forecastingData.enableWealthLoop}
                                  onChange={(e) => {
                                    setForecastingData(prev => ({ ...prev, enableWealthLoop: e.target.checked }));
                                  }}
                                  className="mr-2 text-emerald-500 focus:ring-emerald-500"
                                />
                                <span className="text-sm font-semibold text-gray-900">
                                  {forecastingData.enableWealthLoop ? 'Enabled' : 'Disabled'}
                                </span>
                              </label>
                            </div>
                            {forecastingData.enableWealthLoop && (
                              <div className="bg-purple-50 border border-purple-200 rounded-lg p-2">
                                <div className="text-xs text-purple-700 font-medium mb-1">Active Multiplier</div>
                                <div className="text-xs text-purple-600">Compounding passive income</div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Investment Strategy Options - Center Aligned with Reduced Width */}
                        <div className="max-w-2xl mx-auto">
                          <div className="text-xs uppercase text-gray-600 tracking-wide mb-3 text-center">Investment Approach</div>
                          <div className="flex justify-center gap-3">
                            <label className="flex items-center p-3 rounded-xl border cursor-pointer hover:border-emerald-300 w-56">
                              <input
                                type="radio"
                                name="reinvest"
                                checked={forecastingData.reinvestSavings}
                                onChange={() => setForecastingData(prev => ({ ...prev, reinvestSavings: true }))}
                                className="mr-3 text-emerald-500 focus:ring-emerald-500"
                              />
                              <div className="text-center">
                                <div className="font-semibold text-gray-900 text-sm">Reinvest tax savings</div>
                                <div className="text-xs text-gray-600">{forecastingData.returnRate}% annual compound growth</div>
                              </div>
                            </label>

                            <label className="flex items-center p-3 rounded-xl border cursor-pointer hover:border-emerald-300 w-56">
                              <input
                                type="radio"
                                name="reinvest"
                                checked={!forecastingData.reinvestSavings}
                                onChange={() => setForecastingData(prev => ({ ...prev, reinvestSavings: false }))}
                                className="mr-3 text-emerald-500 focus:ring-emerald-500"
                              />
                              <div className="text-center">
                                <div className="font-semibold text-gray-900 text-sm">Save tax reduction only</div>
                                <div className="text-xs text-gray-600">Keep savings without investment</div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Chart */}
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={results.forecastData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis tickFormatter={formatLargeNumber} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="doNothing" fill="#ef4444" name="Do Nothing" />
                            <Bar dataKey="implementStrategy" fill="#22c55e" name="Your Strategy" />
                            {forecastingData.enableWealthLoop && (
                              <Bar dataKey="passiveIncome" fill="#a855f7" name="Passive Income" />
                            )}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaybookGenerator;