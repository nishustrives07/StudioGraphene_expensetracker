import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SummaryPanel from './components/SummaryPanel';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import BudgetSettings from './components/BudgetSettings';
import ChartsPanel from './components/ChartsPanel';
import { api } from './utils/api';
import { RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  // Global App States
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Editing State
  const [editingExpense, setEditingExpense] = useState(null);

  // Filters State
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterDateRange, setFilterDateRange] = useState('All');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Fetch initial expenses and budgets
  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [expensesData, budgetsData] = await Promise.all([
        api.getExpenses(),
        api.getBudgets()
      ]);
      setExpenses(expensesData);
      setBudgets(budgetsData);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the backend server. Make sure it is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Add or Edit submissions
  const handleSubmitExpense = async (data) => {
    setError('');
    try {
      if (editingExpense) {
        // Edit flow
        const updated = await api.updateExpense(editingExpense.id, data);
        setExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? updated : exp));
        setEditingExpense(null);
      } else {
        // Add flow
        const created = await api.createExpense(data);
        // Prepend to array to keep newest first sorted display
        setExpenses(prev => [created, ...prev]);
      }
    } catch (err) {
      setError(err.message || 'Failed to save expense');
    }
  };

  // Handle deletion
  const handleDeleteExpense = async (id) => {
    setError('');
    try {
      await api.deleteExpense(id);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      // Reset editing if we deleted the item we were editing
      if (editingExpense && editingExpense.id === id) {
        setEditingExpense(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to delete expense');
    }
  };

  // Handle budget limit updates
  const handleUpdateBudget = async (category, amount) => {
    try {
      const updatedBudgets = await api.updateBudget(category, amount);
      setBudgets(updatedBudgets);
    } catch (err) {
      setError(err.message || 'Failed to update budget');
      throw err;
    }
  };

  // Filter Computation
  const filteredExpenses = expenses.filter(exp => {
    // 1. Category Filter
    if (filterCategory !== 'All' && exp.category !== filterCategory) {
      return false;
    }

    // 2. Date Range Filter
    if (filterDateRange === 'All') return true;

    const expDate = new Date(exp.date);
    const expYear = expDate.getFullYear();
    const expMonth = expDate.getMonth();

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    if (filterDateRange === 'ThisMonth') {
      return expYear === currentYear && expMonth === currentMonth;
    }

    if (filterDateRange === 'LastMonth') {
      let targetYear = currentYear;
      let targetMonth = currentMonth - 1;
      if (targetMonth < 0) {
        targetMonth = 11;
        targetYear -= 1;
      }
      return expYear === targetYear && expMonth === targetMonth;
    }

    if (filterDateRange === 'Custom') {
      if (customStartDate && exp.date < customStartDate) {
        return false;
      }
      if (customEndDate && exp.date > customEndDate) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-800">
      {/* Header component */}
      <Header filteredExpenses={filteredExpenses} />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Error Alert Display */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm font-semibold text-red-800">{error}</p>
              <button
                onClick={loadData}
                className="flex items-center space-x-1.5 text-xs font-bold text-red-600 hover:text-red-800 transition-colors uppercase"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-gray-500">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Top Row: Metrics Panel */}
            <SummaryPanel expenses={expenses} budgets={budgets} />

            {/* Bottom Section Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Form & Budget Settings */}
              <div className="space-y-6 lg:col-span-1">
                <ExpenseForm
                  onSubmit={handleSubmitExpense}
                  editingExpense={editingExpense}
                  onCancelEdit={() => setEditingExpense(null)}
                />
                
                <BudgetSettings
                  budgets={budgets}
                  onUpdateBudget={handleUpdateBudget}
                />
              </div>

              {/* Right Column: Chart & Table */}
              <div className="space-y-6 lg:col-span-2">
                <ChartsPanel filteredExpenses={filteredExpenses} />

                <ExpenseList
                  filteredExpenses={filteredExpenses}
                  filterCategory={filterCategory}
                  setFilterCategory={setFilterCategory}
                  filterDateRange={filterDateRange}
                  setFilterDateRange={setFilterDateRange}
                  customStartDate={customStartDate}
                  setCustomStartDate={setCustomStartDate}
                  customEndDate={customEndDate}
                  setCustomEndDate={setCustomEndDate}
                  onEditExpense={(exp) => setEditingExpense(exp)}
                  onDeleteExpense={handleDeleteExpense}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
