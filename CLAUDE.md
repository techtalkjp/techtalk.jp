# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Primary Commands:**

- `pnpm dev` - Start React Router development server (port 5173)
- `pnpm start` - Start Cloudflare Workers local development server (port 8788)
- `pnpm build` - Build for production
- `pnpm deploy` - Deploy to Cloudflare Workers
- `pnpm validate` - Run format and lint checks in parallel

**Code Quality:**

- `pnpm lint` - Run Biome linter
- `pnpm format` - Check formatting with Prettier
- `pnpm format:fix` - Auto-fix formatting issues
- `pnpm typecheck` - Generate types and run TypeScript check
- `pnpm typegen` - Generate Wrangler types for Cloudflare bindings

**Database:**

- `pnpm migrations:list` - List all migrations
- `pnpm migrations:apply` - Apply migrations to local D1 database
- `pnpm migrations:apply:production` - Apply migrations to production

## Architecture Overview

This is a React Router v7 full-stack application deployed on Cloudflare Workers with AI/LLM capabilities.

**Core Stack:**

- React Router v7 with SSR enabled (Vite-based)
- Cloudflare Workers runtime with Node.js compatibility
- TypeScript with strict type checking
- Tailwind CSS v4 with shadcn/ui components

**Infrastructure Services:**

- **D1 Database**: SQLite database accessed via Kysely query builder
- **R2 Storage**: Object storage for file uploads and media
- **Workflows**: Async processing for contact forms and PDF extraction
- **AI Integration**: Google Gemini and OpenAI providers via @ai-sdk

**File-based Routing:**
Routes follow the `remix-flat-routes` convention in `app/routes/`:

- Dots (.) create URL segments: `about.contact` → `/about/contact`
- Plus (+) creates layout routes: `demo+/_layout` wraps all demo routes
- Underscores (\_) create pathless routes: `_public+` groups public pages
- Parentheses create optional segments: `($lang)._index` → `/` or `/ja/`
- Dollar signs ($) create dynamic segments: `$id` matches any value

**Key Bindings (from wrangler.jsonc):**

- `DB` - D1 database instance
- `R2` - R2 storage bucket
- `CONTACT_WORKFLOW` - Contact form workflow
- `ASSETS` - Static assets from build/client

## Important Patterns

**Route Organization:**

```
app/routes/
├── _public+/           # Marketing/public pages with shared layout
│   ├── ($lang)._index/ # Localized homepage
│   └── api.contact/    # Contact form API
├── demo+/              # Feature demonstrations
├── llm.*/              # AI/LLM feature routes
├── api.*/              # API endpoints
└── resources+/         # Resource management routes
```

**Form Handling with Conform:**

- Use Zod schemas for validation
- Implement server actions for form submission
- Add honeypot fields for spam protection
- Handle file uploads via R2 pre-signed URLs

**Database Patterns:**

- Kysely with CamelCase plugin for type-safe queries
- Services abstract database operations in `app/services/`
- Migrations in `/migrations/` directory
- Generated Prisma types in `app/generated/prisma/`

**AI/LLM Integration:**

- Chat interfaces using @assistant-ui components
- Custom attachment adapters for file handling
- Artifact generation for code/documents
- PDF text extraction via Cloudflare Workflows

**Internationalization:**

- Supported locales: en, ja, zh-Hans, zh-Hant
- Locale detection in `app/i18n/utils/detectLocale.ts`
- Translation files in `app/i18n/assets/locales/`
- URL-based locale switching with `($lang)` routes

**Component Architecture:**

- UI primitives in `app/components/ui/` (shadcn/ui)
- Assistant UI in `app/components/assistant-ui/`
- Route-specific components in route directories
- Shared utilities in `app/libs/utils.ts`

**File Upload Flow:**

1. Generate pre-signed URL via `/resources/upload-urls`
2. Direct upload to R2 from client
3. Process uploaded files in server actions
4. Store references in D1 database

**Testing & Validation:**
When making changes, always run:

1. `pnpm typecheck` - Ensure type safety
2. `pnpm lint` - Check code quality
3. `pnpm validate` - Run all checks in parallel
