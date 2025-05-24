# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Primary Commands:**
- `pnpm dev` - Start development server (React Router dev server)
- `pnpm start` - Start Cloudflare Workers local development server
- `pnpm build` - Build for production
- `pnpm deploy` - Deploy to Cloudflare
- `pnpm validate` - Run format, lint, and typecheck in parallel

**Code Quality:**
- `pnpm lint` - Run Biome linter
- `pnpm format` - Check formatting with Prettier
- `pnpm typecheck` - Generate types and run TypeScript check

## Architecture Overview

This is a React Router v7 full-stack application deployed on Cloudflare Workers with AI/LLM capabilities. The app uses file-based routing with the flat-routes convention and integrates multiple Cloudflare services.

**Key Technologies:**
- React Router v7 with SSR enabled
- Cloudflare Workers, D1 (SQLite), R2 Storage, Workflows
- AI/LLM integration via @ai-sdk and @assistant-ui
- Kysely for type-safe database queries
- Conform for form validation with Zod schemas
- shadcn/ui components with Tailwind CSS
- Internationalization support (en, ja, zh)

**File-based Routing:**
- Uses `remix-flat-routes` convention in `app/routes/`
- Route files use flat-routes naming (dots for nesting, + for layout routes)
- Ignores `**/index.ts` and `**/_shared/**` files
- Examples: `($lang)._index` for localized home, `demo+/_layout` for demo section layout

**Cloudflare Integration:**
- Workers entry point: `workers/app.ts`
- D1 database binding: `DB`
- R2 storage binding: `R2`
- Workflow binding: `CONTACT_WORKFLOW`
- Assets served from `build/client`

**AI Features:**
- Chat interface with message handling and artifact generation
- Custom attachment adapter for file uploads
- PDF text extraction using LLM workflows
- Integration with Google and OpenAI AI providers

**Database & Services:**
- Kysely query builder with D1 SQLite database
- Services in `app/services/` for DB, R2, and environment
- Migrations in `/migrations/` directory
- Type-safe database schema generation

**Component Architecture:**
- shadcn/ui components in `app/components/ui/`
- Assistant UI components in `app/components/assistant-ui/`
- Custom components for file handling and animations
- Internationalization components in `app/i18n/`

## Important Patterns

**Route Organization:**
- Public routes under `_public+/` (marketing pages)
- Demo routes under `demo+/` (feature demonstrations)
- API routes at root level (`api.*/`)
- Language-specific routes using `($lang)` convention

**Form Handling:**
- Use Conform with Zod schemas for validation
- Server actions for form submission
- Honeypot validation for spam protection

**File Uploads:**
- R2 storage for file management
- Pre-signed URL generation for direct uploads
- Custom file drop components with validation

**AI Integration:**
- Use @ai-sdk for LLM provider integration
- Custom attachment adapters for file handling
- Artifact system for code/document generation
