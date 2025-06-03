# techtalk.jp

A modern full-stack web application built with React Router v7 and deployed on Cloudflare Workers, featuring AI-powered chat interfaces and multi-language support.

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive chat with artifact generation for code, documents, and visualizations
- **Multi-language Support**: Full internationalization for English, Japanese, and Chinese (Simplified/Traditional)
- **Modern Tech Stack**: React Router v7 with SSR, TypeScript, and Tailwind CSS v4
- **Edge Computing**: Deployed on Cloudflare Workers for global low-latency access
- **File Management**: Direct file uploads to Cloudflare R2 with pre-signed URLs
- **Form Handling**: Type-safe forms with Zod validation and spam protection
- **Component Library**: Pre-built UI components using shadcn/ui

## 🛠️ Tech Stack

### Frontend
- **React 19** with React Router v7
- **TypeScript** for type safety
- **Tailwind CSS v4** with shadcn/ui components
- **Framer Motion** for animations
- **MDX** for content authoring

### Backend & Infrastructure
- **Cloudflare Workers** - Edge runtime
- **Cloudflare D1** - SQLite database
- **Cloudflare R2** - Object storage
- **Cloudflare Workflows** - Async processing
- **Kysely** - Type-safe SQL query builder

### AI Integration
- **AI SDK** - Multi-provider LLM integration
- **Assistant UI** - Chat interface components
- Support for Google Gemini and OpenAI

## 📋 Prerequisites

- Node.js 20+
- pnpm 9+
- Cloudflare account (for deployment)
- API keys for AI providers (optional)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/techtalk.jp.git
   cd techtalk.jp
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your environment variables:
   - `GOOGLE_GENERATIVE_AI_API_KEY` - For Google Gemini
   - `OPENAI_API_KEY` - For OpenAI
   - Database and R2 configurations (auto-configured for local development)

4. **Run database migrations**
   ```bash
   pnpm migrations:apply
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```
   
   Visit http://localhost:5173

## 🔧 Development

### Available Scripts

- `pnpm dev` - Start React Router dev server (port 5173)
- `pnpm start` - Start Cloudflare Workers dev server (port 8788)
- `pnpm build` - Build for production
- `pnpm deploy` - Deploy to Cloudflare
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm lint` - Run linter
- `pnpm format` - Check code formatting
- `pnpm validate` - Run all checks

### Project Structure

```
techtalk.jp/
├── app/
│   ├── routes/          # File-based routing
│   ├── components/      # React components
│   ├── services/        # Backend services
│   └── i18n/           # Internationalization
├── workers/            # Cloudflare Workers entry
├── migrations/         # Database migrations
└── public/            # Static assets
```

### Key Routes

- `/` - Homepage (multi-language)
- `/chat` - AI chat interface
- `/assistant` - Assistant UI demo
- `/demo/*` - Feature demonstrations
- `/api/*` - API endpoints

## 🌐 Deployment

1. **Configure Cloudflare**
   ```bash
   pnpm wrangler login
   ```

2. **Create D1 database**
   ```bash
   pnpm wrangler d1 create techtalkjp
   ```

3. **Create R2 bucket**
   ```bash
   pnpm wrangler r2 bucket create techtalk
   ```

4. **Deploy to Cloudflare**
   ```bash
   pnpm deploy
   ```

## 🔒 Security

- Environment variables for sensitive data
- Honeypot validation for forms
- Pre-signed URLs for secure file uploads
- Type-safe database queries

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Router](https://reactrouter.com/) for the amazing framework
- [Cloudflare](https://cloudflare.com/) for the edge platform
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [AI SDK](https://sdk.vercel.ai/) for LLM integration