# FactVault AI - Daily Fun Fact Tracker & Duplicate Prevention System

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen)](https://briandivacox.github.io/funfacts/)
[![Version](https://img.shields.io/badge/version-1.5.0-blue)](#)

A complete **Daily Fun Fact Tracking & Duplicate Prevention System** powered by Gemini AI, Google Sheets, and Google Keep integration.

🌐 **Live Web Application**: [https://briandivacox.github.io/funfacts/](https://briandivacox.github.io/funfacts/)

---

## 🌟 Key Features

- **Multi-Tier Duplicate Prevention Engine**:
  - **Tier 1**: Exact normalized string matching (100% precision).
  - **Tier 2**: Levenshtein edit distance metric for catching minor word variations.
  - **Tier 3**: Jaccard keyword overlap ratio for flagging rephrased facts.
  - **Tier 4**: Gemini negative constraint prompt injection across historical database.
- **Google Keep & Tasks Integration**:
  - Formatted strictly for the `FunFacts` Google Keep list (`< 180 characters`, emojis, and `#funfact` hashtag).
- **Google Apps Script Backend (`backend/Code.gs`)**:
  - Automated 12:00 AM midnight trigger.
  - `Fact Log` Google Sheet persistence.
- **Indexed Database**:
  - Pre-seeded with 64 historical fun facts audited for duplicates.
- **Desktop Batch Utilities**:
  - `start_dashboard.bat`: Launch local server and open dashboard.
  - `backup_folder.bat`: Instant zip archive backup.
  - `organize_files.bat`: File & sort directory items into category folders.

---

## 🚀 Getting Started

1. Open the live web app: [https://briandivacox.github.io/funfacts/](https://briandivacox.github.io/funfacts/)
2. Or run locally:
   ```bash
   start_dashboard.bat
   ```
