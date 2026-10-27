# Penny Wise – money skills for kids (10–13)

A self-contained static web app (HTML/CSS/JS, no build step, no backend, no tracking, works offline).

## Run locally
    cd money-app && python3 -m http.server 8000   # then open http://localhost:8000

## Deploy on GitHub Pages
Published at https://samtalksai.github.io/Penny-wise/ (GitHub Pages, branch `main`, folder `/`).

Open Graph and X card images use the absolute URL
`https://samtalksai.github.io/Penny-wise/img/og-image.png`.

## Files
- `index.html` – shell, meta tags (Open Graph / X card)
- `css/style.css` – pastel, mobile-first styles (+ print styles for the certificate)
- `js/content.js` – lesson text, quizzes, bonus questions, parent tips (edit content here)
- `js/app.js` – router, activities, SVG chart, progress in localStorage (`pennywise-progress-v1`)
- `img/` – favicon and social preview image
