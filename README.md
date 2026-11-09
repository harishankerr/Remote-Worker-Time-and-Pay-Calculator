# Time & Pay Calculator

A modern, distraction-free web calculator designed for freelancers, remote contractors, and developers to track time intervals in hours, minutes, and seconds, calculate earnings, convert across 24+ global currencies, and project full-time salaries.

Built with **vanilla HTML, CSS, and JavaScript** — zero build tools, zero frameworks, and zero external dependencies required.

---

## ✨ Features

- **⏱ Flexible Time Interval Tracking**:
  - Add multiple time rows with hours, minutes, and seconds.
  - Automatically calculates both formatted duration (`HHh MMm SSs`) and decimal hours (`X.XX hrs`).
  - Fast data-entry: Press **Enter** on the seconds field to automatically spawn a new row and focus its hours field.

- **✕ Quick Entry Deletion**:
  - Individual delete button (`✕`) on every row with instant recalculation and re-indexing.
  - "Reset All" action to quickly start a new calculation.

- **🌍 Global Remote Worker Currency Conversion**:
  - Supports 24 popular global currencies (USD, INR, EUR, GBP, PHP, CAD, AUD, BRL, MXN, PKR, BDT, NGN, IDR, VND, COP, ARS, PLN, ZAR, SGD, AED, MYR, JPY, TRY, EGP).
  - Automatically fetches live exchange rates via free Open Exchange Rates API (`open.er-api.com`) with offline fallback rates.
  - Supports custom exchange rate overrides if you work under a fixed contract rate.

- **📊 Salary Projections Sidebar**:
  - Projects approximate earnings across standard periods: **Hourly**, **Daily** (8h), **Weekly** (40h), **Bi-weekly** (80h), **Semi-monthly**, **Monthly**, **Quarterly**, and **Annual** (52 weeks / 2,080h).
  - Displays figures side by side in both **USD ($)** and your **selected currency**.
  - **Standard vs. Adjusted Toggle**: Compare unadjusted 2,080-hour salary against vacation/holiday adjusted figures (e.g. 10 holidays & 15 vacation days).
  - Collapsible drawer to customize daily hours, weekly days, holidays, and vacation days.

- **💾 Automatic Persistence & "Save Info"**:
  - **Autosaves** your hourly rate, chosen currency, and time entries as you work using browser `localStorage`.
  - Dedicated **Save Info** button provides visual confirmation.
  - Exchange rates are never stored locally and are always fetched fresh on reload.
  - One-click **"Reset to default"** link to restore original settings ($15/hr, INR, blank intervals).

- **🎨 Plain & Minimalist Design**:
  - Clean, uncrowded layout with a neutral color scheme and crisp system typography.
  - Responsive two-column desktop dashboard that smoothly adapts to tablets and mobile screens.

---

## 🚀 Quick Start

### 1. Run Locally
Because this project uses vanilla web standards, you can run it immediately without installing any dependencies:

Simply double-click `index.html` to open it in your default web browser, or serve it using Python:

```bash
# Clone the repository
git clone https://github.com/your-username/time-calculator.git
cd time-calculator

# Start a local static server
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

---

## 🌐 Deploy to GitHub Pages

You can host this calculator on GitHub Pages for free in less than a minute:

1. Push your repository to GitHub.
2. In your repository, go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**.
5. Your calculator will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 📂 Project Structure

```
├── index.html       # Application markup and structure
├── style.css        # Clean, modern stylesheet and responsive layout
├── script.js        # Core calculator logic, exchange rates, and localStorage
├── .gitignore       # Git ignore rules for OS and editor artifacts
├── LICENSE          # MIT Open Source License
└── README.md        # Documentation and guide
```

---

## 🛠 Tech Stack

- **HTML5**: Semantic markup, accessible inputs, and clean structure.
- **CSS3**: CSS Grid, Flexbox, custom properties (CSS variables), responsive breakpoints.
- **JavaScript (ES6+)**: Vanilla DOM manipulation, `localStorage` API, and Fetch API.
- **Exchange Rates**: [Open Exchange Rates API](https://open.er-api.com/) (free tier, no API key required).

---

## 📄 License

This project is licensed under the [GNU General Public License v3.0 (GPLv3)](LICENSE).
