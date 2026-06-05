import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '../utils/formatters';

export default function ChartsPanel({ filteredExpenses }) {
  const categories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
  
  // Custom theme colors for categories matching UI badges
  const COLORS = {
    Food: '#F59E0B',         // Amber
    Transport: '#3B82F6',    // Blue
    Bills: '#EF4444',        // Red
    Entertainment: '#8B5CF6',// Purple
    Other: '#6B7280'         // Gray
  };

  // Group active filtered expenses by category, filter out empty categories
  const data = categories.map(cat => {
    const total = filteredExpenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: cat,
      value: parseFloat(total.toFixed(2))
    };
  }).filter(item => item.value > 0);

  const totalSpent = data.reduce((sum, item) => sum + item.value, 0);

  // Custom Tooltip component for better formatting inside Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      const percentage = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-2.5 border border-gray-200 rounded-md shadow-sm text-xs">
          <p className="font-bold text-gray-800">{name}</p>
          <p className="text-indigo-600 font-semibold mt-0.5">{formatCurrency(value)}</p>
          <p className="text-gray-500 font-medium mt-0.5">{percentage}% of filtered</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
      <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Spending Breakdown (Filtered)</h3>
      
      {data.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center py-12 text-gray-400">
          <p className="text-sm font-semibold">No spending data in this range</p>
          <p className="text-xs mt-1">Adjust filters or add a new expense</p>
        </div>
      ) : (
        <div className="flex-grow min-h-[250px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#9CA3AF'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle" 
                iconSize={8} 
                wrapperStyle={{ fontSize: '11px', fontWeight: '600' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
