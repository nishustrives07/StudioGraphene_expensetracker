import React, { useState, useEffect } from 'react';

export default function ExpenseForm({ onSubmit, editingExpense, onCancelEdit }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  // Get current date in India/Local timezone as YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDate(editingExpense.date);
      setNote(editingExpense.note || '');
      setError('');
    } else {
      setAmount('');
      setCategory('');
      setDate(getTodayString());
      setNote('');
      setError('');
    }
  }, [editingExpense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Amount must be a positive number greater than 0.');
      return;
    }

    if (!category) {
      setError('Category is required.');
      return;
    }

    if (!date) {
      setError('Date is required.');
      return;
    }

    const todayStr = getTodayString();
    if (date > todayStr) {
      setError('Date cannot be in the future.');
      return;
    }

    onSubmit({
      amount: parsedAmount,
      category,
      date,
      note: note.trim()
    });

    // Reset fields if adding a new expense
    if (!editingExpense) {
      setAmount('');
      setCategory('');
      setDate(getTodayString());
      setNote('');
    }
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-xs text-red-600 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="amount" className="block text-xs font-bold text-gray-700 mb-1">
            Amount (INR) *
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. 250.00"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-xs font-bold text-gray-700 mb-1">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-xs font-bold text-gray-700 mb-1">
            Date *
          </label>
          <input
            type="date"
            id="date"
            max={getTodayString()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="note" className="block text-xs font-bold text-gray-700 mb-1">
            Note (Optional)
          </label>
          <textarea
            id="note"
            rows="2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g. Purchased monthly groceries"
          />
        </div>

        <div className="flex space-x-2 pt-2">
          <button
            type="submit"
            className="flex-1 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors shadow-sm"
          >
            {editingExpense ? 'Save Changes' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
