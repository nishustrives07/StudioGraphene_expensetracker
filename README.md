# Mini Expense Tracker

## Project Overview

This project is my submission for **Exercise 2 – Mini Expense Tracker** from the Studio Graphene Full Stack Developer Assessment.

I chose this exercise because it gave me the opportunity to work on both frontend and backend development while also implementing filtering, analytics, charts, data persistence, and API development. I wanted to build something that feels like a real-world application instead of only basic CRUD operations.

The application allows users to add, edit, delete, and filter expenses across different categories. Users can also set category-wise budgets, view spending summaries, visualize expenses through charts, and export expense data as CSV. The data is stored using JSON files so that expenses and budgets persist even after restarting the server.

---

# Live Demo Links

### Frontend

https://studio-graphene-expensetracker.vercel.app

### Backend API

https://studiographene-expensetracker.onrender.com

### GitHub Repository

https://github.com/nishustrives07/StudioGraphene_expensetracker

---

# Tech Stack

## Frontend

* React (Vite)
* Recharts
* Lucide React
* Tailwind CSS

I used React because it makes UI development easier through reusable components. Recharts was used for visualizing spending data and Lucide React was used for icons.

## Backend

* Node.js
* Express.js
* UUID

Express was used to build REST APIs and UUID is used to generate unique IDs for expenses.

## Persistence

* JSON files (`expenses.json` and `budgets.json`)

I chose JSON file persistence because it was one of the options mentioned in the assignment and keeps the project lightweight without introducing database setup complexity.

## Deployment

* Vercel (Frontend)
* Render (Backend)
* GitHub (Version Control)

---

# Features

### Expense Management

* Add new expenses
* Edit existing expenses
* Delete expenses
* Optional notes for expenses
* Expenses sorted by newest date first

### Filtering

* Filter by category
* Filter by date range:

  * This Month
  * Last Month
  * Custom Range

### Summary Dashboard

* Total spent this month
* Highest expense
* Category-wise spending breakdown
* Total monthly budget

### Charts & Analytics

* Expense distribution by category
* Budget vs spending comparison
* Interactive chart updates based on filters

### Budget Tracking

* Set category-wise budgets
* Visual indication when spending exceeds budget

### CSV Export

* Export currently visible expenses as a CSV file

### Validation

* Prevent negative amounts
* Prevent future dates
* Category selection required

---

# How to Run Locally

## Prerequisites

Make sure Node.js is installed.

## Clone the Repository

```bash
git clone https://github.com/nishustrives07/StudioGraphene_expensetracker.git

cd StudioGraphene_expensetracker
```

## Start Backend

```bash
cd backend

npm install

npm start
```

Backend will run on:

```txt
http://localhost:5000
```

## Start Frontend

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend will run on:

```txt
http://localhost:5173
```

---

# API Documentation

## Get All Expenses

### Request

```http
GET /api/expenses
```

### Response

```json
[
  {
    "id": "uuid",
    "amount": 500,
    "category": "Food",
    "date": "2026-06-05",
    "note": "Dinner"
  }
]
```

---

## Create Expense

### Request

```http
POST /api/expenses
```

### Body

```json
{
  "amount": 500,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Dinner"
}
```

---

## Update Expense

### Request

```http
PUT /api/expenses/:id
```

### Body

```json
{
  "amount": 650,
  "category": "Food",
  "date": "2026-06-05",
  "note": "Updated Dinner"
}
```

---

## Delete Expense

### Request

```http
DELETE /api/expenses/:id
```

---

## Get Budgets

### Request

```http
GET /api/budgets
```

---

## Update Budget

### Request

```http
POST /api/budgets
```

### Body

```json
{
  "category": "Food",
  "amount": 5000
}
```

---

# Project Structure

```txt
StudioGraphene_expensetracker
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── services
│   ├── utils
│   ├── data
│   │   ├── expenses.json
│   │   └── budgets.json
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── assets
│   │   ├── utils
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

# Design Decisions

The assignment explicitly listed JSON-file persistence as a bonus option. Therefore, I chose a JSON-based persistence layer instead of introducing a database. This approach keeps the application lightweight, easy to run locally, and focused on demonstrating API design, state management, filtering, aggregation, and frontend-backend integration.

---

# Known Limitation

When editing an expense, the form gets populated with the selected expense details. Since the form is located near the top of the page, users may need to manually scroll back up before making changes and saving them. If I had more time, I would automatically scroll the user to the edit form when they click the edit button.

---

# Next Steps

If I continue working on this project, I would like to add:

* User authentication
* Multiple user accounts
* Database integration using PostgreSQL or MongoDB
* Recurring expenses
* Monthly PDF reports
* Dark mode
* Better mobile responsiveness
* Automated tests
* Expense forecasting and trends
* Auto-scroll to the edit form during updates

---

# Assignment Requirements Coverage

### Must Have

* Add expenses
* View expenses
* Edit expenses
* Delete expenses
* Category filtering
* Date range filtering
* Monthly spending summary
* Category-wise summary
* Highest expense tracking

### Should Have

* Charts
* Currency formatting
* Form validation

### Nice to Have

* CSV export
* Budget tracking
* Budget alerts
* JSON file persistence

All required features and bonus features mentioned in the assignment have been implemented and deployed.
