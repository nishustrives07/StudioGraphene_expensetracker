# Mini Expense Tracker

A full-stack, responsive web application that allows users to record daily expenditures across categories, establish monthly budgets, monitor progress through interactive charts, and export data as CSV files. 

This project was built as a take-home assignment for Studio Graphene.

---

## 1. Project Description
The **Mini Expense Tracker** provides a lightweight yet robust way to log daily spending, view summaries, track spending against monthly budgets, and visualize allocations. The system operates on a single-user model requiring no authentication, persisting transaction data directly to local JSON storage files on the backend.

## 2. Why I Chose This Exercise
During a previous internship, I had the opportunity to build the frontend interfaces and UI components for a dashboard-style expense tracker. While I enjoyed crafting the user interface, the backend was already pre-built, and I didn't get to design the APIs, data modeling, or persistence layer. 

I chose this exercise because it gave me the perfect opportunity to build a **complete, full-stack version** of an expense tracker from scratch. Building both the Express API and the React frontend allowed me to design a cohesive architecture, implement clean validation pipelines across the boundary, and write a robust filesystem database layer.

---

## 3. Features

### Core Requirements
- **CRUD Operations**: Complete capability to Add, View, Edit, and Delete expenses.
- **Date-Sorted Timeline**: Expenses are listed in a table with the newest transactions shown first.
- **Form Validations**: Standard validation checks on amount (must be positive > 0), date (no future dates allowed), and category (required dropdown selection).
- **Global & Category Aggregations**:
  - Total spent in the current calendar month.
  - Highest single expense recorded of all time.
  - Total monthly budget target combined.
- **Quick Filtering**: Filter expenses instantly by category and/or date range preset (All Time, This Month, Last Month, or a Custom start/end date range selector).
- **Visual Analytics**: Interactive Recharts Donut Pie chart displaying spending breakdown by category, updating dynamically to match the filtered state.
- **Currency & Date Formatting**: Full compliance with Indian standard formatting, displaying amounts in INR (e.g. `₹1,234.50`) and local timezone-safe dates (e.g. `04 Jun 2026`).

### Bonus Enhancements
- **Budget Alerts**: Exceeding the set budget limit for a category triggers a warning notification banner on the dashboard and colors its respective progress bar red.
- **Budget Configuration**: Setting category-specific budgets from a dedicated settings card that persists on the backend.
- **CSV Data Export**: Instant client-side download of the *currently filtered* list of expenses in standard CSV formatting.

---

## 4. Tech Stack

- **Frontend**:
  - React (SPA Framework)
  - Vite (Build Tool)
  - Tailwind CSS v3 (Responsive Styling Utility)
  - Recharts (Donut Pie Chart Rendering)
  - Lucide React (UI Icons)
- **Backend**:
  - Node.js & Express (RESTful Web Server)
  - CORS (Cross-Origin Resource Sharing Middleware)
  - UUID (V4 Unique Identifier Generation)
- **Database / Storage**:
  - Local JSON File persistence (asynchronous filesystem operations with atomic temp-write swapping for data integrity).

---

## 5. Project Structure

The project separates the frontend and backend environments cleanly to mimic a production layout:

```text
StudioGraphene_expensetracker/
├── package.json                   # Root package.json to manage concurrent runs
├── README.md                      # Setup, architecture details & run instructions
├── backend/
│   ├── package.json
│   ├── server.js                  # Express server startup entry
│   ├── data/                      # JSON persistence database
│   │   ├── expenses.json
│   │   └── budgets.json
│   ├── routes/                    # Route mappings
│   │   ├── expenses.js
│   │   └── budgets.js
│   ├── controllers/               # Express request and response parsers
│   │   ├── expenseController.js
│   │   └── budgetController.js
│   ├── services/                  # Business logic, validations & data transformations
│   │   ├── expenseService.js
│   │   └── budgetService.js
│   └── utils/                     # Storage helpers
│       └── storage.js
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                # Global state & filter logic coordinator
        ├── index.css              # Styling imports and fade-in animations
        ├── components/            # UI modular components
        │   ├── Header.jsx
        │   ├── SummaryPanel.jsx
        │   ├── ExpenseForm.jsx
        │   ├── BudgetSettings.jsx
        │   ├── ChartsPanel.jsx
        │   └── ExpenseList.jsx
        └── utils/                 # Client utilities
            ├── api.js             # Native fetch client wrappers
            └── formatters.js      # Locale representation utilities
```

---

## 6. API Documentation

All routes assume a base URL of `http://localhost:5000/api`.

### Expenses API

#### 1. Get All Expenses
- **Endpoint**: `GET /expenses`
- **Description**: Returns all saved expenses, ordered by date (newest first).
- **Response** (`200 OK`):
  ```json
  [
    {
      "id": "c309b854-e69e-4f51-be2d-f018e2bb6cb8",
      "amount": 2500,
      "category": "Food",
      "date": "2026-06-04",
      "note": "Weekly groceries"
    }
  ]
  ```

#### 2. Create Expense
- **Endpoint**: `POST /expenses`
- **Request Body**:
  ```json
  {
    "amount": 1250.50,
    "category": "Transport",
    "date": "2026-06-03",
    "note": "Train pass"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "4e723da5-8cf1-45bc-9c2b-2872bc0e19a4",
    "amount": 1250.50,
    "category": "Transport",
    "date": "2026-06-03",
    "note": "Train pass"
  }
  ```

#### 3. Edit Expense
- **Endpoint**: `PUT /expenses/:id`
- **Request Body**:
  ```json
  {
    "amount": 1300.00,
    "category": "Transport",
    "date": "2026-06-03",
    "note": "Train pass (Updated price)"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "id": "4e723da5-8cf1-45bc-9c2b-2872bc0e19a4",
    "amount": 1300.00,
    "category": "Transport",
    "date": "2026-06-03",
    "note": "Train pass (Updated price)"
  }
  ```

#### 4. Delete Expense
- **Endpoint**: `DELETE /expenses/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true
  }
  ```

---

### Budgets API

#### 1. Get Budgets
- **Endpoint**: `GET /budgets`
- **Description**: Returns key-value pairs representing monthly budgets assigned to categories.
- **Response** (`200 OK`):
  ```json
  {
    "Food": 5000,
    "Transport": 3000,
    "Bills": 15000,
    "Entertainment": 2000,
    "Other": 0
  }
  ```

#### 2. Update Category Budget
- **Endpoint**: `POST /budgets`
- **Request Body**:
  ```json
  {
    "category": "Food",
    "amount": 6500
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "Food": 6500,
    "Transport": 3000,
    "Bills": 15000,
    "Entertainment": 2000,
    "Other": 0
  }
  ```

---

## 7. How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (LTS version is recommended).

### 1. Install Dependencies
You can install packages for the root, frontend, and backend with a single command from the project root:
```bash
npm run install:all
```
*(Uses `--legacy-peer-deps` on the frontend workspace to bypass conflicts between React 19's peer requirements and some third-party packages like Recharts).*

### 2. Run in Development Mode
Start both backend and frontend development servers concurrently:
```bash
npm run dev
```
- **Frontend** will be hosted on: `http://localhost:5173`
- **Backend API** will run on: `http://localhost:5000`

---

## 8. Live Demo Links
- **Frontend Live (Production Build)**: `[URL Placeholder]`
- **Backend API Endpoint**: `[URL Placeholder]`

---

## 9. Next Steps
If given more time, I would expand the application to include:
1. **Multi-User Authentication**: Incorporate JWT or session-based cookies and connect a MongoDB/PostgreSQL database to store unique user records.
2. **Interactive Date Range Slider**: Add a slider for filtering dates more fluidly.
3. **Budget Progress Estimators**: Use historical monthly averages to warn users if their current rate of spending is on track to exceed their budget limit before the end of the month.
4. **Data Imports**: Support uploading/parsing banking CSV statements to auto-categorize and batch-add transactions.

---

## 10. Development Notes & AI Declaration
In alignment with professional transparency guidelines, I would like to declare that this project was built with the assistance of an agentic AI coder (specifically Google's **Gemini 3.5 Flash** models). 

The AI was used to:
- Scaffold the initial Vite and React template project structures.

- Implement standard boilerplates like the Express configuration and basic React component architectures.

All core design patterns, validations, database layer choices (atomic JSON file writing), folder splits, and business logics were designed, reviewed, and finalized by me to ensure high security, data reliability, and performance.
