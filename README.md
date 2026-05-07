# API Testing Documentation Generator

A modern, professional API documentation tool built with **ReactJS** and **TailwindCSS**. Paste your Postman test results into this system and instantly generate beautiful documentation — then export it as a polished Excel file.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Pages Overview](#pages-overview)
3. [Adding an API Record](#adding-an-api-record)
4. [Using the JSON Editor](#using-the-json-editor)
5. [API Collections Table](#api-collections-table)
6. [Exporting to Excel](#exporting-to-excel)
7. [Import & Export JSON](#import--export-json)
8. [History Timeline](#history-timeline)
9. [Dashboard](#dashboard)
10. [Settings](#settings)
11. [Keyboard Tips](#keyboard-tips)
12. [Project Structure](#project-structure)

---

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## Pages Overview

The sidebar on the left contains all navigation. Click any item to switch pages. The sidebar can be collapsed by clicking the arrow button at the bottom.

| Page | What it does |
|---|---|
| **Dashboard** | Overview stats, method breakdown, recent APIs |
| **API Collections** | Full table of all API records with search and filters |
| **Add API** | Form to add or edit a single API record |
| **History** | All records grouped by date in a timeline view |
| **Export Excel** | Choose filters and download your documentation |
| **Settings** | Import / export JSON backup, clear all data |

---

## Adding an API Record

Go to **Add API** from the sidebar or click the **+ Add API** button in the top-right navbar.

### Step-by-step

**1. Fill in Basic Information**

| Field | Description |
|---|---|
| **API Name** | A short descriptive name, e.g. `Get User List` |
| **Method** | Click one of the four method buttons: `GET` `POST` `PUT` `DELETE` |
| **URL** | The full endpoint URL, e.g. `https://api.example.com/v1/users` |
| **Status Code** | Select from the dropdown — the Result badge updates automatically |
| **Response Time** | Enter the time in milliseconds from Postman, e.g. `245` |
| **Description** | Any notes, edge cases, or context about this endpoint |

**2. Status Code → Auto Result**

When you select a status code, the **Auto Result** badge changes instantly:

| Status Code | Result |
|---|---|
| 200, 201, 204, 206, 301, 302, 304 | ✅ **PASS** (green) |
| 400, 401, 403, 404, 405, 500, 502, 503… | ❌ **FAIL** (red) |

**3. Request Body visibility**

- **GET** and **DELETE** — the Request Body section is automatically hidden.
- **POST** and **PUT** — the Request Body section is shown automatically.

**4. Paste JSON data**

Copy your JSON from Postman and paste it into the two JSON editors:
- **Request Body** — the body you sent (hidden for GET)
- **Response Body** — the response Postman received

**5. Save**

Click **Save API** (or **Update API** when editing). You will be taken to the Collections page and a toast notification confirms the save.

> **Clear Form** resets all fields. **Cancel** goes back without saving.

---

## Using the JSON Editor

Each JSON field uses a Monaco-powered code editor (the same engine as VS Code).

### Toolbar buttons (top-right of each editor)

| Button | What it does |
|---|---|
| **Beautify** | Formats the JSON with proper indentation. Also validates. |
| **Validate** | Checks if the JSON is valid without modifying it |
| **Copy** | Copies the content to your clipboard |
| **∧ / ∨** | Collapses or expands the editor to save screen space |

### Validation indicators

- **✅ Valid JSON** — shown in green when JSON is correct
- **❌ Invalid JSON** — shown in red with the error message below the editor

### Tips

- You can paste raw JSON directly — hit **Beautify** to clean it up instantly.
- If the field is empty, it is treated as valid (no error shown).
- You can collapse editors you don't need to reduce scrolling.

---

## API Collections Table

The **Collections** page shows all your saved records in a sortable, filterable table.

### Search

Type in the search box to filter by **API Name**, **URL**, or **Status Code**.

### Method filter

Click the pill buttons (`ALL`, `GET`, `POST`, `PUT`, `DELETE`) to show only records for that method.

### Result filter

Click `ALL`, `PASS`, or `FAIL` to filter by test result.

### Sorting

Click any **column header** to sort by that column. Click again to reverse the direction. The active sort column shows a small arrow indicator.

### Pagination

- Use the **page number buttons** to jump to a specific page.
- Change the **rows per page** (5 / 10 / 25 / 50) using the dropdown at the bottom-left.
- The counter shows "Showing X–Y of Z".

### Row actions

Hover over any row to reveal three action buttons on the right:

| Icon | Action |
|---|---|
| ✏️ Edit | Opens the form pre-filled with that record's data |
| ⧉ Duplicate | Creates a copy named `"Original Name (Copy)"` |
| 🗑 Delete | Shows a confirmation dialog before deleting |

---

## Exporting to Excel

### Quick export

Click the **Excel** button in the top navbar to export **all records** immediately.

### Filtered export (recommended)

Go to **Export Excel** in the sidebar for full control:

1. **Set a filename** — default is `API_Documentation`
2. **Choose methods** — click to toggle which methods to include (grayed = excluded)
3. **Choose results** — filter to only `PASS`, only `FAIL`, or `ALL`
4. **Preview** — see exactly which records will be exported at the bottom
5. Click **Export to Excel** to download the `.xlsx` file

### What the Excel file contains

The downloaded file has two sheets:

**Sheet 1 — Summary**
Columns: No, API Name, Method, URL, Status Code, Status, Result, Response Time, Created Date

**Sheet 2 — Full Details**
All Summary columns plus: Description, Request Headers, Request Body, Response Body

Both sheets have:
- Frozen header row (stays visible when you scroll down)
- Auto-fitted column widths
- Clean professional layout

---

## Import & Export JSON

Use JSON export/import to back up your data or move it between devices.

### Export JSON

- Click **JSON** in the top navbar, or
- Go to **Settings → Export JSON Backup**

This downloads a `.json` file of all (or filtered) records.

### Import JSON

- Click **Import** in the top navbar, or
- Go to **Settings → Import JSON**

Select a `.json` file that was previously exported from this app. Records are **merged** with your existing data (not replaced).

> If the import file is invalid, an error alert will appear describing the problem.

---

## History Timeline

The **History** page shows all records sorted by creation date, grouped into sections:

- **Today**
- **Yesterday**
- **[Specific date]** — e.g. "May 5, 2026"

Each entry shows the method badge, API name, status code, result, and timestamp.

Hover over any entry to access **Edit**, **Duplicate**, and **Delete** buttons.

---

## Dashboard

The Dashboard gives you a quick overview of your entire collection.

### Stat Cards

| Card | Shows |
|---|---|
| Total APIs | Number of all records |
| Passed | Count of PASS results + success rate |
| Failed | Count of FAIL results |
| Top Method | The HTTP method used most |

### Method Breakdown

A horizontal bar chart showing what percentage of records use each HTTP method.

### Quick Stats

- Average response time across all records that have a time entered
- Success rate percentage
- Fail rate percentage

### Recent APIs

The 5 most recently added records. Click **View all →** to go to Collections.

---

## Settings

Go to **Settings** from the sidebar.

### Data Storage

Shows how many records you have stored and approximately how much localStorage space they use.

### Import & Export

Same import/export functions as the navbar — available here as well.

### Danger Zone — Clear All Records

Permanently deletes **all** records from localStorage. A confirmation dialog appears before anything is deleted. This action cannot be undone, so export a JSON backup first if you need to keep your data.

---

## Keyboard Tips

| Shortcut | Action |
|---|---|
| `Tab` | Move between form fields |
| `Ctrl + Z` (in Monaco editor) | Undo last change |
| `Ctrl + /` (in Monaco editor) | Toggle comment |
| `Alt + Shift + F` (in Monaco editor) | Format / Beautify JSON |
| `Escape` | Close confirmation dialogs |

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx        Global state, CRUD actions, toast
├── utils/
│   ├── constants.js          Method colors, status codes, config
│   └── helpers.js            Date formatting, JSON validate/beautify
├── storage/
│   └── apiStorage.js         localStorage read / write / import / export
├── export/
│   └── excelExport.js        XLSX generation (Summary + Full Details)
├── components/
│   ├── Sidebar.jsx            Collapsible left navigation
│   ├── Navbar.jsx             Top bar with quick-action buttons
│   ├── MethodBadge.jsx        Colored HTTP method pill
│   ├── StatusBadge.jsx        Status code + PASS/FAIL result badges
│   ├── DashboardCard.jsx      Stat card with icon and number
│   ├── JsonEditor.jsx         Monaco editor + Beautify/Validate/Copy
│   ├── ApiTable.jsx           Search, filter, sort, paginated table
│   ├── ConfirmModal.jsx       Reusable confirmation dialog
│   └── Toast.jsx              Success / error notification
└── pages/
    ├── Dashboard.jsx          Overview stats and charts
    ├── Collections.jsx        Full table view
    ├── ApiFormPage.jsx        Add / Edit form
    ├── History.jsx            Timeline grouped by date
    ├── ExportPage.jsx         Filtered Excel / JSON export
    └── Settings.jsx           Data management
```

### Tech Stack

| Library | Purpose |
|---|---|
| ReactJS 19 | UI framework |
| TailwindCSS 3 | Utility-first styling |
| Vite 8 | Build tool and dev server |
| @monaco-editor/react | VS Code-powered JSON editor |
| xlsx (SheetJS) | Excel file generation |
| file-saver | File download helper |
| lucide-react | Icon library |

### Data Storage

All records are saved to **`localStorage`** under the key `api_docs_v1`. No server, no database, no account required. Data persists between browser sessions on the same device.

---

## Workflow Example

Here is a typical workflow from Postman test to finished documentation:

1. Run your API test in Postman
2. Open this app and click **+ Add API**
3. Enter the **API Name** (e.g. `Create New User`)
4. Select **Method** → `POST`
5. Paste the **URL** from Postman
6. Select the **Status Code** returned (e.g. `201`)
7. Enter the **Response Time** from Postman (e.g. `312`)
8. Paste the **Request Body** JSON → click **Beautify**
9. Paste the **Response Body** JSON → click **Beautify**
11. Add any **Description / Notes** about this endpoint
12. Click **Save API**
13. Repeat for all your endpoints
14. Go to **Export Excel** → click **Export to Excel**
15. Share the `.xlsx` file with your team or attach it to your report
