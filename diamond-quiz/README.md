# 💎 Diamond Quiz Application

A modern, interactive diamond selection quiz built with **React + TypeScript**.  
The app guides users through a series of questions and recommends a diamond based on their preferences, then redirects them to a results page with the selected filters passed as URL query parameters.

---

## ⚙️ Project Setup

The setup is intentionally simple.

### 1. Clone the repository

```bash
git clone https://github.com/ashfaqaxe-stack/diamond-quiz-frontend.git
cd diamond-quiz-frontend
```

### 2. Install Dependencies

```
npm install
```

### 3. Run the project

```
npm run dev
```

_The app will start locally and be available on:_

```
http://localhost:5173

```

## 🧩 Customizing the Quiz

The entire quiz is data-driven and can be customized without touching component logic.

### Quiz data location

```
src/data/quiz_data.json
```

## 🚀 Features

- Step-by-step guided quiz experience
- Dynamic progress bar with percentage
- Question-specific validation
- Intro screen before quiz start
- Data-driven quiz (powered by JSON)
- Clean redirect with search params on submission
- Fully typed with TypeScript
- Responsive & mobile-friendly UI

---

## 🧠 How the Quiz Works

1. User starts on an **intro screen**
2. Answers a series of questions:
    - Setting style
    - Metal & karat
    - Diamond origin
    - Shape
    - Budget
    - Priority (size vs quality)
3. On final submission:
    - Answers are converted to query parameters
    - User is redirected to the configured results URL

Example redirect:

---

## 📦 Quiz Data System

The quiz is **fully data-driven**.

### `quiz_data.json`

- Contains all quiz content
- Easy to update without touching logic
- CMS-friendly & scalable

### `quiz_data.ts`

- Wraps JSON with TypeScript
- Performs runtime validation
- Exports a typed `quizData` object used across the app

This approach keeps:

- ✨ Flexibility of JSON
- 🛡 Safety of TypeScript

---

## 🔁 Redirect Logic

Redirect behavior is configured inside quiz data:

```json
"redirect": {
  "url": "/results",
  "paramMap": {
    "settingStyle": "setting",
    "metal": "metal",
    "metalKarat": "karat"
  }
}
```

## 📌 Notes

- Validation is handled per step to avoid incomplete submissions
- Adding or removing a question only requires updating JSON + UI component
- Designed to be scalable for multiple quizzes
