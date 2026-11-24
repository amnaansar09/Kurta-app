# Aasani – Adaptive Everyday Wear

A web app for **Aasani**, a line of modular adaptive Pakistani kurtas for older women. Women with arthritis, stiff shoulders or limited mobility can use it, and so can the people who shop for them.

> Traditional clothing. Designed around changing abilities.

## What's in the app

| Section | What it does |
| --- | --- |
| **Home** | The product story, the five design principles, and a table matching each difficulty to how the design solves it. |
| **Find my fit** | Six large-button questions: main difficulty, seated dressing, pacemaker/implant, help needed, changing fit, occasion. They lead to a recommended kurta, with a plain-language reason for every feature. |
| **Design a kurta** | A modular configurator with a live sketch: opening, fastening, sleeves (length, width, detachable), side panels, neckline, length extension, fabric, colour, print and embroidery. It also shows a *movement-needed* profile, a design-requirements checklist, pacemaker safety warnings, saved designs and a printable **tailor's spec sheet**. |
| **Collection** | Classic, Flex, Ease and Occasion, each ready to customise. |
| **Dressing guide** | Seated step-by-step instructions for full and partial openings, taking the kurta off, and caregiver tips. |
| **Saved** | Designs saved on this device (localStorage). |

### Accessibility built in
- Large base text plus three text-size settings, and a high-contrast mode (both remembered)
- Tap targets of at least 56 px, clear focus outlines, a skip link, and keyboard-operable tabs and radio cards
- One question per screen in the quiz, with plain language throughout

### Recommendation logic (summary)
- Shoulder/arm difficulty, or a caregiver always helps → **Ease**: full front opening and wide, deep-armhole sleeves (plus detachable sleeves if someone helps)
- Hand/finger difficulty → concealed magnets, or **soft hook-and-loop** if there is a pacemaker or implant
- Pacemaker, or not sure → never magnets
- Fit changes from day to day → adjustable side panels (**Flex**)
- Gatherings → **Occasion** styling with the same adaptive features hidden inside

## Running it

No build step and no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Structure

```
index.html          page shell and all views
css/styles.css      styles, high-contrast and print styles
js/data.js          modular options, variants, quiz and guide content
js/kurta-svg.js     draws the kurta sketch from a design config
js/app.js           router, fit finder, designer, saved designs, guide
```
