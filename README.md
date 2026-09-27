# श्री केशर फॅब्रिकेशन वर्क्स — Website

Rath (temple chariot) fabrication business website for Shree Keshar Fabrication Works, Maharashtra.

## Tech Stack

- **React 19** + **Vite**
- **Tailwind CSS v4**
- **React Router v7**
- **Lucide Icons**
- Bilingual: **Marathi (मराठी)** + **English**

## Getting Started

```bash
npm install
npm run dev
```

Site: [http://localhost:5173](http://localhost:5173)
Admin: [http://localhost:5173/admin](http://localhost:5173/admin) (Password: `keshar2024`)

## Project Structure

```
src/
├── admin/          # Admin panel (login, gallery, services, contact, settings)
├── components/     # Reusable UI components
├── data/           # Static site data (siteData.js)
├── i18n/           # Translations (Marathi + English)
├── pages/          # Page components
├── App.jsx         # Router setup
├── main.jsx        # Entry point
└── index.css       # Global styles & theme
public/
└── images/
    ├── gallery/    # Rath gallery photos (rath-1.jpg to rath-16.jpg)
    ├── hero.jpg    # Hero background
    └── owner-harsh.jpg
```

## Admin Panel

Access at `/admin` — password: `keshar2024`

| Section | What it manages |
|---------|----------------|
| फोटो व्यवस्थापन | Gallery photos — upload, delete, reorder |
| सेवा व किंमत | Services & pricing |
| संपर्क माहिती | Phone, WhatsApp, email, address |
| सेटिंग्स | Social media links |

## Deployment

```bash
npm run build
```

Deployed on Vercel. Config in `vercel.json`.
