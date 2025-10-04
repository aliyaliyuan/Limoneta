import { Check, ChevronRight, DollarSign, Info, PieChart, Target, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function LimonetaOnboarding() {
  const [screen, setScreen] = useState('splash');
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    purpose: '',
    income: '',
    fixedExpenses: ''
  });
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => {
        setScreen('landing');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [screen, step]);

  const purposes = [
    { 
      id: 'save', 
      label: 'Save more money', 
      icon: <TrendingUp className="w-6 h-6" />,
      tooltip: "We'll optimize your spending habits to increase monthly savings"
    },
    { 
      id: 'track', 
      label: 'Track my spending', 
      icon: <PieChart className="w-6 h-6" />,
      tooltip: "Get detailed insights into where every dollar goes"
    },
    { 
      id: 'understand', 
      label: 'Understand my money', 
      icon: <DollarSign className="w-6 h-6" />,
      tooltip: "Visualize your financial patterns and make smarter decisions"
    },
    { 
      id: 'goals', 
      label: 'Plan for future goals', 
      icon: <Target className="w-6 h-6" />,
      tooltip: "Set and achieve your financial milestones with guided planning"
    }
  ];

  const calculate503020 = () => {
    const income = parseFloat(formData.income) || 0;
    return {
      needs: (income * 0.5).toFixed(0),
      wants: (income * 0.3).toFixed(0),
      savings: (income * 0.2).toFixed(0)
    };
  };

  const budget = calculate503020();

  // Splash Screen
  if (screen === 'splash') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 flex items-center justify-center overflow-hidden">
        <div className="text-center animate-pulse">
          <div className="mb-6 transform transition-all duration-1000 scale-110">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
              <div className="text-6xl">🍋</div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
            Limoneta
          </h1>
        </div>
      </div>
    );
  }

  // Landing Page
  if (screen === 'landing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 flex items-center justify-center p-6">
        <div className={`text-center max-w-md w-full transition-all duration-700 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl mb-6 hover:scale-105 transition-transform">
              <div className="text-5xl">🍋</div>
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-yellow-600 to-green-600 bg-clip-text text-transparent">
              Limoneta
            </h1>
            <p className="text-gray-600 text-lg">Your smart path to financial confidence</p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setScreen('onboarding')}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              First Time Here
              <ChevronRight className="w-5 h-5" />
            </button>
            
            <button className="w-full bg-white text-gray-700 py-4 px-8 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-gray-200">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Onboarding Flow
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-green-50 p-6">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-3">
            {[0, 1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`w-1/4 h-2 rounded-full mx-1 transition-all duration-500 ${
                  s <= step ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 text-center">Step {step + 1} of 4</p>
        </div>

        <div className={`transition-all duration-500 ${fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg mb-6">
                <div className="text-4xl">👋</div>
              </div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Limoneta!</h2>
              <p className="text-gray-600 text-lg mb-8">Let's set up your financial journey in just a few steps</p>
              <button 
                onClick={() => setStep(1)}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 px-12 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
              >
                Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 1: Purpose */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold mb-3 text-gray-800">What's your main goal?</h2>
              <p className="text-gray-600 mb-8">Choose what matters most to you</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {purposes.map((purpose) => (
                  <div 
                    key={purpose.id}
                    onClick={() => setFormData({...formData, purpose: purpose.id})}
                    className={`relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      formData.purpose === purpose.id 
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
                        : 'border-gray-200 bg-white hover:border-yellow-300 shadow-md'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${formData.purpose === purpose.id ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {purpose.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{purpose.label}</h3>
                        <button
                          onMouseEnter={() => setShowTooltip(purpose.id)}
                          onMouseLeave={() => setShowTooltip(null)}
                          className="text-gray-400 hover:text-yellow-500 transition-colors relative"
                        >
                          <Info className="w-4 h-4" />
                          {showTooltip === purpose.id && (
                            <div className="absolute left-0 top-6 w-64 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-10">
                              {purpose.tooltip}
                            </div>
                          )}
                        </button>
                      </div>
                      {formData.purpose === purpose.id && (
                        <Check className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.purpose}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Step 2: Income */}
          {step === 2 && (
            <div>
              <h2 className="text-3xl font-bold mb-3 text-gray-800">What's your monthly income?</h2>
              <p className="text-gray-600 mb-8 flex items-center gap-2">
                Enter your total take-home pay after taxes
                <button
                  onMouseEnter={() => setShowTooltip('income')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="text-gray-400 hover:text-yellow-500 transition-colors relative"
                >
                  <Info className="w-4 h-4" />
                  {showTooltip === 'income' && (
                    <div className="absolute left-0 top-6 w-72 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-10">
                      This is your net income - the amount you actually receive after taxes and deductions
                    </div>
                  )}
                </button>
              </p>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.income}
                    onChange={(e) => setFormData({...formData, income: e.target.value})}
                    placeholder="3000"
                    className="w-full pl-16 pr-6 py-6 text-3xl font-semibold border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white text-gray-700 py-4 px-8 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200"
                >
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)}
                  disabled={!formData.income}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Fixed Expenses */}
          {step === 3 && (
            <div>
              <h2 className="text-3xl font-bold mb-3 text-gray-800">Monthly fixed expenses?</h2>
              <p className="text-gray-600 mb-8 flex items-center gap-2">
                Rent, utilities, subscriptions, etc.
                <button
                  onMouseEnter={() => setShowTooltip('fixed')}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="text-gray-400 hover:text-yellow-500 transition-colors relative"
                >
                  <Info className="w-4 h-4" />
                  {showTooltip === 'fixed' && (
                    <div className="absolute left-0 top-6 w-72 bg-gray-800 text-white text-xs p-3 rounded-lg shadow-xl z-10">
                      These are regular expenses like rent, insurance, phone bills - things you pay every month
                    </div>
                  )}
                </button>
              </p>
              
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.fixedExpenses}
                    onChange={(e) => setFormData({...formData, fixedExpenses: e.target.value})}
                    placeholder="1200"
                    className="w-full pl-16 pr-6 py-6 text-3xl font-semibold border-2 border-gray-200 rounded-2xl focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(2)}
                  className="flex-1 bg-white text-gray-700 py-4 px-8 rounded-2xl font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 border-gray-200"
                >
                  Back
                </button>
                <button 
                  onClick={() => setScreen('complete')}
                  disabled={!formData.fixedExpenses}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Complete Setup
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Screen */}
      {screen === 'complete' && (
        <div className="fixed inset-0 bg-gradient-to-br from-yellow-50 via-white to-green-50 flex items-center justify-center p-6 z-50">
          <div className={`text-center max-w-lg transition-all duration-700 ${fadeIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-xl mb-6 animate-bounce">
              <Check className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 text-gray-800">You're all set! 🎉</h2>
            <p className="text-gray-600 text-lg mb-8">Here's your recommended budget breakdown</p>
            
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center mb-3">
                    <span className="text-2xl">🏠</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Needs (50%)</p>
                  <p className="text-2xl font-bold text-gray-800">${budget.needs}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-purple-100 rounded-2xl flex items-center justify-center mb-3">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Wants (30%)</p>
                  <p className="text-2xl font-bold text-gray-800">${budget.wants}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-2xl flex items-center justify-center mb-3">
                    <span className="text-2xl">💰</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Savings (20%)</p>
                  <p className="text-2xl font-bold text-gray-800">${budget.savings}</p>
                </div>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white py-4 px-8 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}