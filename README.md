# WUDMC.COM - Personal Website

Personal website of Denis Mironov - Software & Data Engineer, built with **Astro 5.0 + SSR + React + Tailwind CSS**.

## 🚀 Tech Stack

- **Astro 5.0** - Modern web framework with SSR support
- **Node.js adapter** - Server-side rendering
- **React 19** - For interactive components (dashboard)
- **Tailwind CSS 4** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Google BigQuery** - Data infrastructure (planned)

## 📁 Project Structure

```text
├── public/               # Static assets (images, fonts)
├── src/
│   ├── components/      # Reusable Astro/React components
│   ├── content/         # Blog posts (Markdown/MDX)
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   │   ├── api/        # API endpoints (SSR)
│   │   ├── blog/       # Blog pages
│   │   ├── index.astro # Home page
│   │   ├── skills.astro
│   │   └── lifestyle.astro
│   └── styles/          # Global CSS
├── django-backup/       # Previous Django version (backup)
└── DEPLOYMENT.md        # Deployment instructions
```

## 🧞 Commands

| Command                | Action                                     |
| :--------------------- | :----------------------------------------- |
| `npm install`          | Install dependencies                       |
| `npm run dev`          | Start dev server at `localhost:4321`       |
| `npm run build`        | Build production site to `./dist/`         |
| `npm run preview`      | Preview production build locally           |
| `npm run astro ...`    | Run Astro CLI commands                     |

## 🌐 Pages

- **/** - Home page (About me)
- **/skills** - Professional skills and tech stack
- **/lifestyle** - Hobbies and life interests
- **/blog** - Blog with articles (Markdown)
- **/api/bigquery** - API endpoint for BigQuery (placeholder)

## 📝 Blog

Blog posts are written in Markdown/MDX format in `src/content/blog/`. Each post has frontmatter metadata:

```md
---
title: "Post Title"
description: "Post description"
pubDate: 2026-01-12
tags: ["tag1", "tag2"]
---

Post content here...
```

## 🔮 Future Features

- **Interactive Dashboard** with React components
- **BigQuery integration** for data visualization
- **Real-time analytics** from GCP

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions on GCP VM with Nginx.

**Quick deploy:**
1. Build: `npm run build`
2. Start with PM2: `pm2 start dist/server/entry.mjs --name wudmc-astro`
3. Configure Nginx to proxy to `localhost:4321`

## 🌍 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Google Cloud Platform (for future BigQuery integration)
GCP_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

## 📚 Migration Notes

This project was migrated from Django 4.0 to Astro 5.0. The previous Django version is backed up in `django-backup/` directory.

**Removed:**
- Geonames microservice
- Roulette microservice
- PostgreSQL database (content moved to Markdown)

**Added:**
- SSR with Node.js
- React support for future dashboard
- BigQuery infrastructure (placeholder)
- Modern Tailwind CSS styling

## 👤 Author

**Denis Mironov**
- Website: [wudmc.com](https://wudmc.com)
- Telegram: [@wudmc](https://t.me/wudmc)
- GitHub: [@WuDMC](https://github.com/WuDMC)
- LinkedIn: [wudmc](https://www.linkedin.com/in/wudmc/)

## 📄 License

Personal project - All rights reserved
