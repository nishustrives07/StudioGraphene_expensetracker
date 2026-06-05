import React, { useState, useEffect } from 'react';
import { Settings, Save } from 'lucide-react';

export default function BudgetSettings({ budgets, onUpdateBudget }) {
  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
  const [localBudgets, setLocalBudgets] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Sync with prop budgets
  useEffect(() => {
    if (budgets) {
      setLocalBudgets(budgets);
    }
  }, [budgets]);

  const handleChange = (category, value) => {
    setLocalBudgets(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      // Loop over and save budget for each category
      for (const cat of categories) {
        const val = parseFloat(localBudgets[cat]);
        const finalVal = isNaN(val) || val < 0 ? 0 : val;
        await onUpdateBudget(cat, finalVal);
      }
      setMessage('Budgets saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save budgets: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-2">
        <Settings className="h-5 w-5 text-gray-500" />
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Set Monthly Budgets</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div
            className={`p-2 text-xs font-semibold rounded-md ${
              message.includes('Failed') || message.includes('failed')
                ? 'bg-red-50 text-red-600 border border-red-100'
                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {categories.map(cat => (
            <div key={cat} className="space-y-1">
              <label htmlFor={`budget-${cat}`} className="block text-xs font-semibold text-gray-700">
                {cat} (₹)
              </label>
              <input
                type="number"
                id={`budget-${cat}`}
                min="0"
                step="1"
                value={localBudgets[cat] !== undefined ? localBudgets[cat] : ''}
                onChange={(e) => handleChange(cat, e.target.value)}
                placeholder="No budget"
                className="w-full text-sm border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full flex items-center justify-center space-x-2 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-2 px-4 rounded-md transition-colors shadow-sm"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving budgets...' : 'Save Budgets'}</span>
        </button>
      </form>
    </div>
  );
}
