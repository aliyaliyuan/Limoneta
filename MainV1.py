import React, { useState } from 'react';
import { DollarSign, Upload, TrendingUp, PieChart, LogOut, Copy } from 'lucide-react';

export default function BudgetTracker() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState({
    needs: [],
    wants: [],
    savings: []
  });
  const [pasteData, setPasteData] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);

  const handleLogin = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (username === 'joeyang' && password === '1234') {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setIncome('');
    setExpenses({ needs: [], wants: [], savings: [] });
  };

  const monthlyIncome = parseFloat(income) || 0;
  const needsBudget = monthlyIncome * 0.5;
  const wantsBudget = monthlyIncome * 0.3;
  const savingsBudget = monthlyIncome * 0.2;

  const needsTotal = expenses.needs.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const wantsTotal = expenses.wants.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const savingsTotal = expenses.savings.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  const needsRemaining = needsBudget - needsTotal;
  const wantsRemaining = wantsBudget - wantsTotal;
  const savingsRemaining = savingsBudget - savingsTotal;

  const addExpense = (category, name, amount) => {
    if (name && amount) {
      setExpenses(prev => ({
        ...prev,
        [category]: [...prev[category], { name, amount: parseFloat(amount) }]
      }));
    }
  };

  const removeExpense = (category, index) => {
    setExpenses(prev => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };

  const processPastedData = () => {
    const lines = pasteData.trim().split('\n');
    const newExpenses = { needs: [], wants: [], savings: [] };
    
    lines.forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 3) {
        const category = parts[0].toLowerCase().trim();
        const name = parts[1].trim();
        const amount = parseFloat(parts[2].replace(/[^0-9.-]+/g, ''));
        
        if (!isNaN(amount)) {
          if (category === 'needs' || category === 'need') {
            newExpenses.needs.push({ name, amount });
          } else if (category === 'wants' || category === 'want') {
            newExpenses.wants.push({ name, amount });
          } else if (category === 'savings' || category === 'saving') {
            newExpenses.savings.push({ name, amount });
          }
        }
      }
    });

    setExpenses(prev => ({
      needs: [...prev.needs, ...newExpenses.needs],
      wants: [...prev.wants, ...newExpenses.wants],
      savings: [...prev.savings, ...newExpenses.savings]
    }));
    
    setPasteData('');
    setShowPasteModal(false);
  };

  const getProgressColor = (remaining) => {
    if (remaining >= 0) return 'bg-emerald-500';
    return 'bg-red-500';
  };

  const getProgressPercentage = (spent, budget) => {
    if (budget === 0) return 0;
    return Math.min((spent / budget) * 100, 100);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-full">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Budget Tracker</h1>
          <p className="text-center text-gray-600 mb-8">Master your 50/30/20 rule</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter password"
              />
            </div>
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition transform hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
                <PieChart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Budget Tracker</h1>
                <p className="text-sm text-gray-600">50/30/20 Rule Manager</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Income Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Monthly Income</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Enter your monthly income"
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <button
              onClick={() => setShowPasteModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition transform hover:scale-105"
            >
              <Upload className="w-5 h-5" />
              <span className="font-medium">Import Excel</span>
            </button>
          </div>
        </div>

        {/* Budget Overview */}
        {monthlyIncome > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Needs - 50% */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Needs (50%)</h3>
              <p className="text-3xl font-bold mb-4">${needsBudget.toFixed(2)}</p>
              <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(needsRemaining)}`}
                  style={{ width: `${getProgressPercentage(needsTotal, needsBudget)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Spent: ${needsTotal.toFixed(2)}</span>
                <span className={needsRemaining >= 0 ? '' : 'font-bold'}>
                  {needsRemaining >= 0 ? `Left: $${needsRemaining.toFixed(2)}` : `Over: $${Math.abs(needsRemaining).toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Wants - 30% */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Wants (30%)</h3>
              <p className="text-3xl font-bold mb-4">${wantsBudget.toFixed(2)}</p>
              <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(wantsRemaining)}`}
                  style={{ width: `${getProgressPercentage(wantsTotal, wantsBudget)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Spent: ${wantsTotal.toFixed(2)}</span>
                <span className={wantsRemaining >= 0 ? '' : 'font-bold'}>
                  {wantsRemaining >= 0 ? `Left: $${wantsRemaining.toFixed(2)}` : `Over: $${Math.abs(wantsRemaining).toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Savings - 20% */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Savings (20%)</h3>
              <p className="text-3xl font-bold mb-4">${savingsBudget.toFixed(2)}</p>
              <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${getProgressColor(savingsRemaining)}`}
                  style={{ width: `${getProgressPercentage(savingsTotal, savingsBudget)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span>Saved: ${savingsTotal.toFixed(2)}</span>
                <span className={savingsRemaining >= 0 ? '' : 'font-bold'}>
                  {savingsRemaining >= 0 ? `Left: $${savingsRemaining.toFixed(2)}` : `Over: $${Math.abs(savingsRemaining).toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Expense Categories */}
        {monthlyIncome > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ExpenseCategory
              title="Needs"
              color="blue"
              expenses={expenses.needs}
              onAdd={(name, amount) => addExpense('needs', name, amount)}
              onRemove={(index) => removeExpense('needs', index)}
            />
            <ExpenseCategory
              title="Wants"
              color="purple"
              expenses={expenses.wants}
              onAdd={(name, amount) => addExpense('wants', name, amount)}
              onRemove={(index) => removeExpense('wants', index)}
            />
            <ExpenseCategory
              title="Savings"
              color="emerald"
              expenses={expenses.savings}
              onAdd={(name, amount) => addExpense('savings', name, amount)}
              onRemove={(index) => removeExpense('savings', index)}
            />
          </div>
        )}
      </main>

      {/* Paste Modal */}
      {showPasteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Import from Excel</h3>
              <button
                onClick={() => setShowPasteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Copy data from Excel (Category, Name, Amount) and paste below. Format: Category [Tab] Name [Tab] Amount
            </p>
            <textarea
              value={pasteData}
              onChange={(e) => setPasteData(e.target.value)}
              placeholder="needs	Rent	1200&#10;wants	Dining Out	150&#10;savings	Emergency Fund	400"
              className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={processPastedData}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Import Data
              </button>
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ExpenseCategory({ title, color, expenses, onAdd, onRemove }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const colorClasses = {
    blue: 'border-blue-200 focus:ring-blue-500',
    purple: 'border-purple-200 focus:ring-purple-500',
    emerald: 'border-emerald-200 focus:ring-emerald-500'
  };

  const handleAdd = () => {
    if (name && amount) {
      onAdd(name, amount);
      setName('');
      setAmount('');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      
      <div className="space-y-3 mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Expense name"
          className={`w-full px-3 py-2 border ${colorClasses[color]} rounded-lg focus:ring-2 focus:border-transparent transition text-sm`}
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className={`w-full px-3 py-2 border ${colorClasses[color]} rounded-lg focus:ring-2 focus:border-transparent transition text-sm`}
        />
        <button
          onClick={handleAdd}
          className={`w-full bg-${color}-600 text-white py-2 rounded-lg font-medium hover:bg-${color}-700 transition text-sm`}
          style={{
            backgroundColor: color === 'blue' ? '#2563eb' : color === 'purple' ? '#9333ea' : '#10b981',
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = color === 'blue' ? '#1d4ed8' : color === 'purple' ? '#7e22ce' : '#059669';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = color === 'blue' ? '#2563eb' : color === 'purple' ? '#9333ea' : '#10b981';
          }}
        >
          Add Expense
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {expenses.map((exp, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">{exp.name}</p>
              <p className="text-gray-600 text-sm">${exp.amount.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onRemove(index)}
              className="text-red-500 hover:text-red-700 font-bold text-lg"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}