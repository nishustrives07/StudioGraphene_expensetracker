const { v4: uuidv4 } = require('uuid');
const storage = require('../utils/storage');

const EXPENSES_FILE = 'expenses.json';
const VALID_CATEGORIES = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];

/**
 * Retrieves all expenses, sorted by date (newest first).
 */
async function getAllExpenses() {
  const expenses = await storage.readData(EXPENSES_FILE, []);
  return expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
}

/**
 * Adds a new expense after validating its fields.
 */
async function addExpense(data) {
  const { amount, category, date, note } = data;
  
  validateExpenseData({ amount, category, date });

  const expenses = await storage.readData(EXPENSES_FILE, []);
  const newExpense = {
    id: uuidv4(),
    amount: parseFloat(amount),
    category,
    date,
    note: note ? note.trim() : ''
  };

  expenses.push(newExpense);
  await storage.writeData(EXPENSES_FILE, expenses);
  return newExpense;
}

/**
 * Updates an existing expense by ID.
 */
async function updateExpense(id, data) {
  const { amount, category, date, note } = data;

  validateExpenseData({ amount, category, date });

  const expenses = await storage.readData(EXPENSES_FILE, []);
  const index = expenses.findIndex(exp => exp.id === id);
  if (index === -1) {
    throw new Error('Expense not found');
  }

  const updatedExpense = {
    ...expenses[index],
    amount: parseFloat(amount),
    category,
    date,
    note: note ? note.trim() : ''
  };

  expenses[index] = updatedExpense;
  await storage.writeData(EXPENSES_FILE, expenses);
  return updatedExpense;
}

/**
 * Deletes an expense by ID.
 */
async function deleteExpense(id) {
  const expenses = await storage.readData(EXPENSES_FILE, []);
  const filtered = expenses.filter(exp => exp.id !== id);
  if (filtered.length === expenses.length) {
    throw new Error('Expense not found');
  }
  await storage.writeData(EXPENSES_FILE, filtered);
  return { success: true };
}

/**
 * Validates expense details. Throws an error if validation fails.
 */
function validateExpenseData({ amount, category, date }) {
  if (amount === undefined || amount === null || isNaN(amount)) {
    throw new Error('Amount must be a number');
  }
  if (parseFloat(amount) <= 0) {
    throw new Error('Amount must be a positive number');
  }
  if (!category || !VALID_CATEGORIES.includes(category)) {
    throw new Error(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }
  if (!date) {
    throw new Error('Date is required');
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date format');
  }

  // Ensure dates are not in the future.
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of day to avoid timezone mismatches
  if (parsedDate > today) {
    throw new Error('Date cannot be in the future');
  }
}

module.exports = {
  getAllExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  VALID_CATEGORIES
};
