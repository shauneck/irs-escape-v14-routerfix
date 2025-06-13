import React, { useState } from 'react';

const EntityBuilder = () => {
  const [formData, setFormData] = useState({
    businessType: '',
    annualRevenue: '',
    numberOfOwners: '1',
    currentStructure: '',
    primaryGoals: [],
    state: '',
    hasEmployees: false,
    planningHorizon: 'short-term'
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleGoalChange = (goal) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal) 
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };

  const generateRecommendation = () => {
    setLoading(true);
    
    // Simulate analysis - this would integrate with a real entity analysis service
    setTimeout(() => {
      const revenue = parseFloat(formData.annualRevenue) || 0;
      let recommendedEntity = 'LLC';
      let taxSavings = 0;
      let reasoning = [];

      // Simple logic for demo - real implementation would be much more sophisticated
      if (revenue > 500000) {
        recommendedEntity = 'C-Corp with MSO Structure';
        taxSavings = Math.floor(revenue * 0.08);
        reasoning = [
          'High revenue qualifies for C-Corp tax benefits',
          'MSO structure enables income shifting strategies',
          'Better tax treatment for retained earnings',
          'Enhanced deduction opportunities'
        ];
      } else if (revenue > 150000) {
        recommendedEntity = 'S-Corp Election';
        taxSavings = Math.floor(revenue * 0.05);
        reasoning = [
          'Self-employment tax savings on distributions',
          'Pass-through taxation benefits',
          'Reasonable salary requirements manageable',
          'Simplified compliance compared to C-Corp'
        ];
      } else if (revenue > 50000) {
        recommendedEntity = 'LLC with Tax Elections';
        taxSavings = Math.floor(revenue * 0.03);
        reasoning = [
          'Operational flexibility with tax optimization',
          'Potential S-Corp election benefits',
          'Lower compliance costs',
          'Asset protection advantages'
        ];
      } else {
        recommendedEntity = 'Sole Proprietorship or Single-Member LLC';
        taxSavings = Math.floor(revenue * 0.02);
        reasoning = [
          'Simplest structure for current revenue level',
          'Minimal compliance requirements',
          'Easy transition to more complex structures later',
          'Tax deduction opportunities available'
        ];
      }

      setRecommendation({
        entity: recommendedEntity,
        estimatedSavings: taxSavings,
        reasoning: reasoning,
        nextSteps: [
          'Consult with tax professional for implementation',
          'Review state-specific requirements',
          'Prepare necessary formation documents',
          'Set up accounting systems for new structure'
        ],
        timeToImplement: '2-4 weeks'
      });
      setLoading(false);
    }, 2000);
  };

  const businessTypes = [
    'Professional Services',
    'E-commerce/Retail',
    'Real Estate',
    'Technology/Software',
    'Healthcare',
    'Manufacturing',
    'Construction',
    'Consulting',
    'Food & Beverage',
    'Other'
  ];

  const currentStructures = [
    'Sole Proprietorship',
    'Single-Member LLC',
    'Multi-Member LLC',
    'S-Corporation',
    'C-Corporation',
    'Partnership',
    'Not Sure',
    'Not Formed Yet'
  ];

  const goals = [
    'Minimize self-employment taxes',
    'Reduce overall tax burden',
    'Asset protection',
    'Attract investors',
    'Simplified operations',
    'Estate planning benefits',
    'Employee benefits optimization',
    'International expansion'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Entity Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the optimal business structure for your income and ownership profile.
              Get personalized recommendations based on your specific situation and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select business type</option>
                    {businessTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Annual Revenue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue
                  </label>
                  <input
                    type="number"
                    name="annualRevenue"
                    value={formData.annualRevenue}
                    onChange={handleInputChange}
                    placeholder="Enter annual revenue"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Number of Owners */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Owners
                  </label>
                  <select
                    name="numberOfOwners"
                    value={formData.numberOfOwners}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="1">1 (Just me)</option>
                    <option value="2">2</option>
                    <option value="3-5">3-5</option>
                    <option value="6+">6 or more</option>
                  </select>
                </div>

                {/* Current Structure */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Structure
                  </label>
                  <select
                    name="currentStructure"
                    value={formData.currentStructure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select current structure</option>
                    {currentStructures.map(structure => (
                      <option key={structure} value={structure}>{structure}</option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary State of Operation
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g., California, Texas"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Has Employees */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasEmployees"
                    checked={formData.hasEmployees}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Business has employees (or plans to hire)
                  </label>
                </div>
              </div>

              {/* Primary Goals */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Primary Goals (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {goals.map(goal => (
                    <label key={goal} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.primaryGoals.includes(goal)}
                        onChange={() => handleGoalChange(goal)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Planning Horizon */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Planning Horizon
                </label>
                <select
                  name="planningHorizon"
                  value={formData.planningHorizon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="short-term">Short-term (1-2 years)</option>
                  <option value="medium-term">Medium-term (3-5 years)</option>
                  <option value="long-term">Long-term (5+ years)</option>
                </select>
              </div>

              {/* Generate Button */}
              <div className="mt-8">
                <button
                  onClick={generateRecommendation}
                  disabled={!formData.businessType || !formData.annualRevenue || loading}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Analyzing...' : 'Get My Recommendation'}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendation</h2>
              
              {!recommendation && !loading && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m5-13a2 2 0 114 0m-4 8a3 3 0 106 0" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Complete the analysis to get your entity recommendation</p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 text-sm">Analyzing your business structure options...</p>
                </div>
              )}

              {recommendation && (
                <div className="space-y-6">
                  {/* Recommended Entity */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Recommended Structure</h3>
                    <p className="text-xl font-bold text-green-600 mb-2">{recommendation.entity}</p>
                    <div className="text-sm text-green-700">
                      <p>Estimated Annual Savings: <span className="font-semibold">${recommendation.estimatedSavings?.toLocaleString()}</span></p>
                      <p>Implementation Time: <span className="font-semibold">{recommendation.timeToImplement}</span></p>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Why This Structure?</h3>
                    <ul className="space-y-2">
                      {recommendation.reasoning?.map((reason, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next Steps */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
                    <ol className="space-y-2">
                      {recommendation.nextSteps?.map((step, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-6 w-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                            {index + 1}
                          </span>
                          <span className="text-gray-700 text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Professional Help?</h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      Our experts can help you implement this structure and ensure optimal tax benefits.
                    </p>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors text-sm">
                      Consult with Expert
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Common Business Structures Explained
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sole Proprietorship</h3>
                <p className="text-gray-600 text-sm mb-3">Simplest structure, owner and business are legally the same entity.</p>
                <div className="text-sm">
                  <p className="text-green-600 font-medium">✓ Simple setup</p>
                  <p className="text-green-600 font-medium">✓ Full control</p>
                  <p className="text-red-600 font-medium">✗ Personal liability</p>
                  <p className="text-red-600 font-medium">✗ Self-employment tax</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">LLC</h3>
                <p className="text-gray-600 text-sm mb-3">Limited liability protection with operational flexibility.</p>
                <div className="text-sm">
                  <p className="text-green-600 font-medium">✓ Liability protection</p>
                  <p className="text-green-600 font-medium">✓ Tax flexibility</p>
                  <p className="text-green-600 font-medium">✓ Easy management</p>
                  <p className="text-red-600 font-medium">✗ Self-employment tax</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">S-Corporation</h3>
                <p className="text-gray-600 text-sm mb-3">Pass-through taxation with potential payroll tax savings.</p>
                <div className="text-sm">
                  <p className="text-green-600 font-medium">✓ Pass-through taxation</p>
                  <p className="text-green-600 font-medium">✓ Payroll tax savings</p>
                  <p className="text-red-600 font-medium">✗ Reasonable salary req.</p>
                  <p className="text-red-600 font-medium">✗ More compliance</p>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">C-Corporation</h3>
                <p className="text-gray-600 text-sm mb-3">Separate tax entity with potential for income shifting strategies.</p>
                <div className="text-sm">
                  <p className="text-green-600 font-medium">✓ Lower corp tax rates</p>
                  <p className="text-green-600 font-medium">✓ Retained earnings</p>
                  <p className="text-red-600 font-medium">✗ Double taxation</p>
                  <p className="text-red-600 font-medium">✗ Complex compliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityBuilder;