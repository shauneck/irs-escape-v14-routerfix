import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-emerald-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.pexels.com/photos/247851/pexels-photo-247851.jpeg" 
            alt="Freedom from constraints"
            className="w-full h-full object-cover"
          />
        </div>
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

export default HomePage;