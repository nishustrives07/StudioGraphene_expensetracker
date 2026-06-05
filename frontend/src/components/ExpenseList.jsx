import React from 'react';
import { formatDate, formatCurrency } from '../utils/formatters';
import { Edit2, Trash2, Filter } from 'lucide-react';

export default function ExpenseList({
  filteredExpenses,
  filterCategory,
  setFilterCategory,
  filterDateRange,
  setFilterDateRange,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  onEditExpense,
  onDeleteExpense
}) {
  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
      {/* Filters Header Bar */}
      <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">All Expenses</h3>
        </div>
        
        {/* Filtering Fields */}
        <div className="flex flex-wrap gap-2.5 items-center">
          {/* Filter by Category */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-gray-500">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs border border-gray-300 rounded-md py-1.5 px-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filter by Date Preset */}
          <div className="flex items-center space-x-1.5">
            <span className="text-xs font-semibold text-gray-500">Date Range:</span>
            <select
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              className="text-xs border border-gray-300 rounded-md py-1.5 px-2 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="All">All Time</option>
              <option value="ThisMonth">This Month</option>
              <option value="LastMonth">Last Month</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Custom Date Picking Box */}
          {filterDateRange === 'Custom' && (
            <div className="flex items-center space-x-2 border border-gray-200 rounded-md p-1 bg-gray-50">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="text-xs border-0 bg-transparent focus:ring-0 p-0 text-gray-700"
              />
              <span className="text-xs text-gray-400 font-semibold">to</span>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="text-xs border-0 bg-transparent focus:ring-0 p-0 text-gray-700"
              />
            </div>
          )}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Note</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-10 text-center text-sm text-gray-400 font-semibold">
                  No matching expenses found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => {
                // Determine styling category pill colors
                let badgeStyle = 'bg-gray-100 text-gray-800';
                if (exp.category === 'Food') badgeStyle = 'bg-amber-100 text-amber-800';
                else if (exp.category === 'Transport') badgeStyle = 'bg-blue-100 text-blue-800';
                else if (exp.category === 'Bills') badgeStyle = 'bg-red-100 text-red-800';
                else if (exp.category === 'Entertainment') badgeStyle = 'bg-purple-100 text-purple-800';

                return (
                  <tr key={exp.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs font-medium text-gray-600 whitespace-nowrap">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${badgeStyle}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate" title={exp.note}>
                      {exp.note || <span className="text-gray-300 italic font-normal">No note</span>}
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-950 text-right whitespace-nowrap">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="px-4 py-3 text-xs text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this expense?')) {
                              onDeleteExpense(exp.id);
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
