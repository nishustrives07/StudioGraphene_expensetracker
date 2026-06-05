const expenseService = require('../services/expenseService');

/**
 * Handles GET /api/expenses
 */
async function getExpenses(req, res) {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Handles POST /api/expenses
 */
async function createExpense(req, res) {
  try {
    const newExpense = await expenseService.addExpense(req.body);
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * Handles PUT /api/expenses/:id
 */
async function editExpense(req, res) {
  try {
    const { id } = req.params;
    const updatedExpense = await expenseService.updateExpense(id, req.body);
    res.json(updatedExpense);
  } catch (err) {
    const isNotFound = err.message === 'Expense not found';
    res.status(isNotFound ? 404 : 400).json({ error: err.message });
  }
}

/**
 * Handles DELETE /api/expenses/:id
 */
async function deleteExpense(req, res) {
  try {
    const { id } = req.params;
    const result = await expenseService.deleteExpense(id);
    res.json(result);
  } catch (err) {
    const isNotFound = err.message === 'Expense not found';
    res.status(isNotFound ? 404 : 500).json({ error: err.message });
  }
}

module.exports = {
  getExpenses,
  createExpense,
  editExpense,
  deleteExpense
};
