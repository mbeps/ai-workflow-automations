# Nodebase

Nodebase is a visual AI workflow automation platform. Build automation pipelines by connecting trigger, AI, and action nodes on a drag-and-drop canvas — no code required. Think n8n or Zapier with first-class AI integration, built on Next.js, tRPC, PostgreSQL, and Inngest.

# Features

## Authentication
- Email/password sign-in and registration
- OAuth via GitHub and Google

## Credentials
- Encrypted API key storage
- Supports OpenAI, Anthropic, Gemini, and OpenRouter providers
- Creation gated to premium users

## Workflows
- Visual node-graph editor with drag-and-drop canvas
- Snap-to-grid layout, minimap, and inline name editing
- Auto-generated slugs and case-insensitive name search
- Creation gated to premium users

## Node Types
- **Triggers:** Manual button, Google Form webhook, Stripe event webhook
- **AI:** Anthropic (Claude Sonnet 4.5), OpenAI (GPT-4), Gemini (2.0 Flash), OpenRouter (NVIDIA Nemotron)
- **Actions:** HTTP request, Discord, Slack

## Executions
- Durable background execution via Inngest
- Workflows run as topologically sorted DAGs
- Nodes share context via Handlebars templates (`{{variableName.text}}`)
- Paginated execution history with per-run output and error inspection

## Subscriptions
- Optional Polar.sh billing integration
- When billing is disabled, all users are treated as premium

# Requirements

Below are the requirements to run this project:

- **Node.js** 20 or higher
- **PostgreSQL** 17 with pgvector extension 
- The following environment variables must be configured
- **Inngest** 
- **Polar** (Optional)

> **Docker** can be used for development to run PostgreSQL and Inngest locally without manual setup.

# Stack

## Backend
- [**Next.js**](https://nextjs.org): Full-stack React framework — SSR, App Router, and Server Actions.
- [**tRPC**](https://trpc.io): End-to-end typesafe APIs — call backend procedures from the frontend with full TypeScript inference and zero code generation.
- [**Prisma ORM**](https://www.prisma.io): Type-safe database access with schema-first modelling and migrations.
- [**Inngest**](https://www.inngest.com): Durable workflow and background-job orchestration with automatic retries and step functions.
- [**Better Auth**](https://www.better-auth.com): Composable, plugin-based authentication framework for TypeScript.
- [**Polar.sh**](https://polar.sh): Billing platform — usage billing, subscriptions, and global tax compliance.
- [**Vercel AI SDK**](https://ai-sdk.dev): Unified TypeScript SDK for AI apps — 100+ models, streaming, and tool calling.
- [**Sentry**](https://sentry.io): Application monitoring — errors, traces, and performance metrics.

## Frontend
- [**React Flow**](https://reactflow.dev): Customisable React library for building node-based editors and interactive diagrams.
- [**Tailwind CSS**](https://tailwindcss.com): Utility-first CSS framework for composing designs in markup.
- [**shadcn/ui**](https://ui.shadcn.com): Beautifully designed, accessible, open-code UI components.
- [**Jotai**](https://jotai.org): Primitive and flexible atomic state management for React.
- [**TanStack Query**](https://tanstack.com/query/latest): Powerful data-fetching and server-state management, powering the tRPC client.

## Database
- [**PostgreSQL**](https://www.postgresql.org): The world's most advanced open-source relational database.


# Setting Up Project

## Prerequisites
- [Node.js](https://nodejs.org) 20 or higher
- [Docker](https://www.docker.com) and Docker Compose

## 1. Clone the Repository

```bash
git clone git@github.com:mbeps/ai-workflow-automations.git
cd ai-workflow-automations
```

## 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Open `.env.local` and populate the following variables based on your environment.

### Base Configuration
These variables are common to both development and production environments.

#### Database
- `DATABASE_URL`: The PostgreSQL connection string for Prisma.

#### Better Auth Authentication
- `BETTER_AUTH_SECRET`: A secure secret key for authentication (Better Auth).
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (Optional): Credentials for GitHub OAuth integration.
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (Optional): Credentials for Google OAuth integration.

#### Sentry Monitoring
- `SENTRY_AUTH_TOKEN`: Authorisation token for Sentry error tracking and performance monitoring.

#### Polar Billing
- `NEXT_PUBLIC_ENABLE_POLAR`: A boolean flag to enable or disable Polar payment integration (defaults to `"true"`). 
- `POLAR_ACCESS_TOKEN` (Optional): The access token for the Polar API.
- `POLAR_PRODUCT_ID` (Optional): The unique identifier for your Polar product.
- `NEXT_PUBLIC_POLAR_PRODUCT_SLUG` (Optional): The URL slug for your Polar product.
- `POLAR_SUCCESS_URL` (Optional): The redirect URL following a successful Polar payment transaction.

> **Note**: If the flag is set to `"false"`, all users will be treated as premium and no billing will occur. The Polar-related environment variables can then be ignored. If set to `"true"`, these variables are required for Polar billing to function correctly.

#### Inngest Background Jobs
- `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`: Keys for Inngest event signature verification and communication.

#### Security
- `ENCRYPTION_KEY`: A secure key used for encrypting sensitive data, such as workflow credentials.

### Development Configuration
Variables specifically tailored for local development.

#### Docker Database
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Configuration for the PostgreSQL container.

#### Local URLs
- `BETTER_AUTH_URL`: Set to the local development address (e.g. `http://localhost:3000`).
- `NEXT_PUBLIC_APP_URL`: Set to the local development address (e.g. `http://localhost:3000`).

#### Inngest Specific
- `INNGEST_BASE_URL`: The local endpoint for the Inngest development server (e.g. `http://localhost:8288`).
- `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`: For local development using the Docker container, these should be set to `"local"`.

#### Ngrok Tunnelling
- `NGROK_URL`: The public-facing URL provided by Ngrok for local webhook testing.

### Production Configuration
Variables dedicated to the production environment (e.g. Vercel).

#### Production URLs
- `BETTER_AUTH_URL`: Set to your production domain (e.g. `https://your-app.vercel.app`).
- `NEXT_PUBLIC_APP_URL`: The public-facing URL of the live application.

#### Inngest
- `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`: Real secret keys are required for production.

## 4. Start Docker Services

```bash
docker compose up -d
```

This starts two services:

- **`db`** — PostgreSQL 17 with pgvector, used as the application database.
- **`inngest`** — Inngest local dev server, which automatically connects to your app at `localhost:3000/api/inngest`. The Inngest dev UI is available at http://localhost:8288.

## 5. Push the Database Schema

```bash
npm run db:push
```

This applies the Prisma schema to your database. Suitable for initial setup and local development.

## 6. Start the Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000.

---

## Useful Commands

| Command               | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `npm run dev`         | Start the Next.js dev server with Turbopack                  |
| `npm run build`       | Create a production build                                    |
| `npm start`           | Start the production server                                  |
| `npm run db:push`     | Push Prisma schema to the database                           |
| `npm run db:studio`   | Open Prisma Studio (database GUI) at `http://localhost:5555` |
| `npm run inngest:dev` | Start the Inngest dev server via CLI (alternative to Docker) |


# References

1. [Next.js Documentation](https://nextjs.org/docs) — Official docs for the App Router, Server Actions, and routing.
2. [tRPC Documentation](https://trpc.io/docs) — Guide to building type-safe API procedures.
3. [Prisma Documentation](https://www.prisma.io/docs) — ORM schema definition, migrations, and query API.
4. [Inngest Documentation](https://www.inngest.com/docs) — Durable functions and background job orchestration.
5. [Better Auth Documentation](https://www.better-auth.com/docs) — Authentication setup with OAuth and plugins.
6. [React Flow Documentation](https://reactflow.dev/learn) — Node-based editor components and APIs.
7. [Vercel AI SDK Documentation](https://ai-sdk.dev/docs) — Multi-provider AI model integration.
8. [Polar.sh Documentation](https://polar.sh/docs/) — Subscription billing setup and webhook configuration.
9. [PostgreSQL Documentation](https://www.postgresql.org/docs) — Database reference.
10. [Sentry Documentation](https://docs.sentry.io) — Error monitoring and performance tracing.
11. [Jotai Documentation](https://jotai.org/docs) — Atomic state management API.
12. [shadcn/ui](https://ui.shadcn.com/docs) — Component library and installation guide.
13. [Tailwind CSS Documentation](https://tailwindcss.com/docs) — Utility-first CSS reference.
14. [Handlebars Documentation](https://handlebarsjs.com/guide/) — Template syntax used for referencing node output data in workflows.
15. [Zod](https://zod.dev) — TypeScript-first schema validation with static type inference, used throughout the project for validation schemas.
16. [TanStack Query](https://tanstack.com/query/latest/docs) — Powerful data-fetching and server-state management, powering the tRPC client.
17. [pgvector](https://github.com/pgvector/pgvector) — Open-source PostgreSQL extension for vector similarity search, used as the database Docker image.