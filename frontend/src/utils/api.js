const BASE_URL = 'https://studiographene-expensetracker.onrender.com/api';
/**
 * Standard utility wrapper for calling fetch.
 */
async function request(url, options = {}) {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  /**
   * Fetch all expenses.
   */
  getExpenses: () => request('/expenses'),

  /**
   * Add a new expense.
   */
  createExpense: (data) => request('/expenses', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  /**
   * Edit an existing expense.
   */
  updateExpense: (id, data) => request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  /**
   * Delete an expense.
   */
  deleteExpense: (id) => request(`/expenses/${id}`, {
    method: 'DELETE',
  }),

  /**
   * Retrieve all category budgets.
   */
  getBudgets: () => request('/budgets'),

  /**
   * Update category budget limit.
   */
  updateBudget: (category, amount) => request('/budgets', {
    method: 'POST',
    body: JSON.stringify({ category, amount }),
  }),
};
