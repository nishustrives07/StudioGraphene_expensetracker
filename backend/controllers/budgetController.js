const budgetService = require('../services/budgetService');

/**
 * Handles GET /api/budgets
 */
async function getBudgets(req, res) {
  try {
    const budgets = await budgetService.getBudgets();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * Handles POST /api/budgets
 */
async function updateBudget(req, res) {
  try {
    const { category, amount } = req.body;
    const updatedBudgets = await budgetService.updateBudget(category, amount);
    res.json(updatedBudgets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getBudgets,
  updateBudget
};
