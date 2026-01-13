# CLAUDE.MD - AI Assistant Guide

This document helps AI assistants understand the wudmc.com codebase and work effectively with it.

## Project Overview

Personal website of Denis Mironov - Software & Data Engineer. Built with **Astro 5.0 + SSR + React + Tailwind CSS**.

**Live Site**: https://wudmc.com

## Tech Stack

- **Astro 5.0** - Modern web framework with SSR (Server-Side Rendering)
- **Node.js adapter** - Standalone server mode
- **React 19** - For interactive components (dashboard)
- **Tailwind CSS 4** - Utility-first CSS framework (via Vite plugin)
- **TypeScript** - Type safety
- **MDX** - Blog content with frontmatter
- **Google BigQuery** - Data infrastructure (planned/in development)

## Project Structure

```
/Users/denismironov/.claude-worktrees/wudmc.com/sad-swartz/
├── public/                 # Static assets (images, fonts, favicon)
├── src/
│   ├── assets/            # Image and media assets (processed by Astro)
│   ├── components/        # Reusable Astro/React components
│   ├── content/           # Blog posts (Markdown/MDX with frontmatter)
│   │   └── blog/         # Individual blog posts
│   ├── content.config.ts  # Content collections configuration
│   ├── consts.ts         # Site-wide constants and configuration
│   ├── layouts/          # Page layouts (BaseLayout, BlogLayout, etc.)
│   ├── pages/            # File-based routing
│   │   ├── api/         # API endpoints (SSR)
│   │   ├── blog/        # Blog pages and [slug].astro
│   │   ├── index.astro  # Home page (About)
│   │   ├── skills.astro # Professional skills
│   │   └── lifestyle.astro # Personal interests
│   └── styles/           # Global CSS
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── DEPLOYMENT.md         # Deployment instructions for GCP VM
└── CLAUDE.MD            # This file

django-backup/           # Legacy Django 4.0 version (archived)
```

## Key Pages

- `/` - Home/About page
- `/skills` - Technical skills and tech stack
- `/lifestyle` - Hobbies and personal interests
- `/blog` - Blog listing page
- `/blog/[slug]` - Individual blog posts
- `/api/bigquery` - API endpoint (placeholder for BigQuery integration)

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at localhost:4321
npm run build        # Build for production → ./dist/
npm run preview      # Preview production build locally
```

## Content Management

### Blog Posts

Location: `src/content/blog/*.md`

Frontmatter schema:
```yaml
---
title: "Post Title"
description: "Post description"
pubDate: 2026-01-12
tags: ["tag1", "tag2"]
---
```

Content collections are defined in `src/content.config.ts`.

## Configuration Files

- **astro.config.mjs**: SSR mode, Node adapter (standalone), React + MDX + Sitemap integrations
- **consts.ts**: Site title, description, social links, navigation
- **content.config.ts**: Blog content collection schema

## Environment Variables

```bash
# .env (for future BigQuery integration)
GCP_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
```

## Deployment

Deployed on GCP VM with Nginx + PM2. See DEPLOYMENT.md for details.

Production build runs as standalone Node.js server on port 4321.

## Git Workflow

- **Main branch**: `master`
- **Current worktree**: `sad-swartz`
- Repository uses git worktrees for isolated feature development

## Migration Context

This site was migrated from Django 4.0 to Astro 5.0 (January 2026).

**Removed in migration:**
- Geonames microservice
- Roulette microservice
- PostgreSQL database (content now in Markdown)

**Added in migration:**
- SSR with Node.js
- React support for future interactive dashboard
- BigQuery infrastructure (placeholder)
- Modern Tailwind CSS styling

Legacy Django code is preserved in `django-backup/`.

## Code Style & Patterns

- Use TypeScript for type safety
- Prefer Astro components for static content
- Use React components only for interactive features
- Tailwind CSS for all styling (utility-first approach)
- MDX for blog posts with rich content

## Common Tasks

### Adding a new blog post
1. Create `src/content/blog/post-slug.md`
2. Add frontmatter (title, description, pubDate, tags)
3. Write content in Markdown
4. Post automatically appears in blog listing

### Adding a new page
1. Create `src/pages/pagename.astro`
2. Use appropriate layout from `src/layouts/`
3. Add navigation link in `src/consts.ts` if needed

### Adding React components
1. Create component in `src/components/`
2. Import with `client:load` or `client:visible` directive
3. React 19 is available for interactive features

## Future Development

Planned features:
- Interactive dashboard with React components
- BigQuery integration for data visualization
- Real-time analytics from GCP
- Enhanced blog features (search, categories)

## Author

**Denis Mironov**
- Website: https://wudmc.com
- Telegram: @wudmc
- GitHub: @WuDMC
- LinkedIn: wudmc

## Notes for AI Assistants

- Always read existing files before proposing changes
- Follow existing code patterns and structure
- Respect the minimal, focused design philosophy
- Don't over-engineer solutions
- Test changes with `npm run dev` before committing
- BigQuery integration is planned but not fully implemented yet
- Preserve the clean, professional aesthetic of the site
