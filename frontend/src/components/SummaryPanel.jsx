import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { TrendingUp, Award, DollarSign, AlertTriangle } from 'lucide-react';

export default function SummaryPanel({ expenses, budgets }) {
  // 1. Calculate current month expenses
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed: 0 = Jan, 5 = Jun

  const currentMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getFullYear() === currentYear && expDate.getMonth() === currentMonth;
  });

  const totalSpentThisMonth = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // 2. Highest single expense (All Time)
  const highestExpense = expenses.reduce((max, exp) => (exp.amount > max ? exp.amount : max), 0);

  // 3. Total per category (Current Month vs Budget)
  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
  const categoryTotals = categories.reduce((acc, cat) => {
    acc[cat] = currentMonthExpenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return acc;
  }, {});

  // Check if any category has exceeded its budget
  const budgetAlerts = [];
  categories.forEach(cat => {
    const budget = budgets[cat] || 0;
    const spent = categoryTotals[cat];
    if (budget > 0 && spent > budget) {
      budgetAlerts.push({
        category: cat,
        spent,
        budget
      });
    }
  });

  return (
    <div className="space-y-6">
      {/* Budget Alerts Banner */}
      {budgetAlerts.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-semibold text-red-800">Budget Exceeded Alerts!</h3>
              <div className="mt-1 text-xs text-red-700 space-y-1">
                {budgetAlerts.map(alert => (
                  <p key={alert.category}>
                    You have exceeded your monthly budget for <strong className="font-semibold">{alert.category}</strong>: Spent{' '}
                    <strong>{formatCurrency(alert.spent)}</strong> of your <strong>{formatCurrency(alert.budget)}</strong> budget.
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Spent This Month */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Spent This Month</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalSpentThisMonth)}</h3>
          </div>
          <div className="bg-indigo-50 p-3 rounded-full text-indigo-600">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Highest Single Expense */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Highest Expense (All Time)</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(highestExpense)}</h3>
          </div>
          <div className="bg-emerald-50 p-3 rounded-full text-emerald-600">
            <Award className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Total Budget Target (Sum of all budgets) */}
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Monthly Budget</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {formatCurrency(Object.values(budgets).reduce((sum, b) => sum + b, 0))}
            </h3>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-blue-600">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Category Progress Bars (Budgets) */}
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">Category Spending vs Budget (Current Month)</h3>
        <div className="space-y-4">
          {categories.map(cat => {
            const spent = categoryTotals[cat];
            const budget = budgets[cat] || 0;
            const percent = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
            const isExceeded = budget > 0 && spent > budget;

            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-gray-700 font-semibold">{cat}</span>
                  <span className="text-gray-500">
                    {formatCurrency(spent)} {budget > 0 ? `/ ${formatCurrency(budget)}` : '(No Budget set)'}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    style={{
                      width: `${budget > 0 ? percent : spent > 0 ? 100 : 0}%`
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isExceeded
                        ? 'bg-red-500'
                        : budget > 0
                        ? 'bg-emerald-500'
                        : spent > 0
                        ? 'bg-indigo-400'
                        : 'bg-gray-200'
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
