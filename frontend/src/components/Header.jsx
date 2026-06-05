import React from 'react';
import { Download, Wallet } from 'lucide-react';

export default function Header({ filteredExpenses }) {
  const handleExportCSV = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      alert('No expenses to export.');
      return;
    }

    // CSV Header row
    const headers = ['ID', 'Date', 'Category', 'Amount (INR)', 'Note'];
    
    // Process and escape expense rows
    const rows = filteredExpenses.map(exp => [
      exp.id,
      exp.date,
      exp.category,
      exp.amount,
      // Wrap note in quotes and escape any inner quotes to prevent CSV parsing breaking
      `"${(exp.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create a client-side Blob and trigger a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <Wallet className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Mini Expense Tracker</h1>
          <p className="text-xs text-gray-500 font-medium">Log, track, and budget your daily spending</p>
        </div>
      </div>
      <button
        onClick={handleExportCSV}
        disabled={!filteredExpenses || filteredExpenses.length === 0}
        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium py-2 px-4 rounded-md transition-colors shadow-sm"
      >
        <Download className="h-4 w-4" />
        <span>Export CSV</span>
      </button>
    </header>
  );
}
