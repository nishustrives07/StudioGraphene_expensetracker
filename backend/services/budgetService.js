const storage = require('../utils/storage');
const { VALID_CATEGORIES } = require('./expenseService');

const BUDGETS_FILE = 'budgets.json';

const DEFAULT_BUDGETS = {
  Food: 0,
  Transport: 0,
  Bills: 0,
  Entertainment: 0,
  Other: 0
};

/**
 * Retrieves the current budgets object, merging with defaults to guarantee all categories exist.
 */
async function getBudgets() {
  const budgets = await storage.readData(BUDGETS_FILE, DEFAULT_BUDGETS);
  return { ...DEFAULT_BUDGETS, ...budgets };
}

/**
 * Updates the budget for a specific category.
 */
async function updateBudget(category, amount) {
  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category: ${category}`);
  }
  if (amount === undefined || amount === null || isNaN(amount) || parseFloat(amount) < 0) {
    throw new Error('Budget amount must be a non-negative number');
  }

  const budgets = await getBudgets();
  budgets[category] = parseFloat(amount);
  await storage.writeData(BUDGETS_FILE, budgets);
  return budgets;
}

module.exports = {
  getBudgets,
  updateBudget
};
