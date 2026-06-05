const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');
const budgetRoutes = require('./routes/budgets');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable Cross-Origin Resource Sharing (CORS) for local frontend communication
app.use(cors());

// Parse incoming request body as JSON
app.use(express.json());

// Set up routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);

// Catch-all Route for unhandled requests
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Global Exception Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
});

// Start listening for requests
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
