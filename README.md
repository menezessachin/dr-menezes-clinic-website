# Dr. Wilson Menezes Pathology Lab — Website

Official website for **Dr. Wilson Menezes Pathology Lab** in Mahim West, Mumbai. Built with clean semantic HTML5, bespoke Vanilla CSS (*Warm Clinical Heritage* design system), and modular Vanilla JavaScript with zero build dependencies.

## Features

- **Diagnostic Test Directory & Live Search** — Searchable catalogue across Haematology, Biochemistry, Histopathology, Cytology & FNAC, Clinical Pathology, and Hormones & Serology.
- **Multi-Test Selection Tray** — Patients can select individual tests or preventive panels and carry them straight into the booking form or WhatsApp inquiry.
- **Preventive Health Checkup Packages** — Essential Annual, Senior Citizen Comprehensive, Diabetes & Heart Care, and Women's Wellness & Thyroid panels.
- **Doctor Credentials & Legacy** — Highlights Dr. Wilson Menezes's M.D. (Pathology) from Topiwala National Medical College (1985), First Rank in Mumbai University, MMC Reg. No. 49541, and 40+ years of practice.
- **Patient Preparation & Fasting Guide** — Expandable, print-friendly preparation instructions for fasting blood work, urine/stool samples, FNAC visits, and biopsy submissions.
- **Home Sample Collection & Appointment Request** — Context-aware booking form with validation, Sunday closure check, pre-formatted WhatsApp booking link, and printable summary card.
- **Mahim West Location & Live IST Clinic Status** — Live open/closed indicator computed in Mumbai IST, interactive map embed, Google Maps directions, and one-click address copy.

## Project Structure

```
.
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── data.js          # Clinic details, test catalogue, packages & prep guides
│   └── app.js           # Interactive search, filters, booking & IST status
└── assets/
    └── images/
        ├── hero-lab.jpg
        ├── histopathology-craft.jpg
        └── clinic-interior.jpg
```

## Customizing Clinic Details

- **Update tests, packages, timings, or phone/WhatsApp number:** Edit [`js/data.js`](js/data.js) (and update the corresponding links in [`index.html`](index.html) if the phone number changes).
- **Add Dr. Wilson Menezes's personal portrait:** Replace `assets/images/histopathology-craft.jpg` or update the `<img>` inside the `#about` section of [`index.html`](index.html).

## Local Preview & Deployment

Run locally with any static file server:

```bash
python3 -m http.server 8080
```

Because this is a zero-build static site, it can be deployed directly via **GitHub Pages** (Settings → Pages → Deploy from `main` branch root), **Netlify**, or **Vercel**.
