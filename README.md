# kniho-hlod-backend

REST API backend for the **kniho-hlod** book lending application.

## Tech Stack

- **Runtime:** Node.js 22 + TypeScript
- **Framework:** Express (via `@eleansphere/be-core`)
- **ORM:** Sequelize 6 + PostgreSQL (`pg`)
- **Auth:** JWT (`createExtractUser` middleware on protected routes)
- **Password hashing:** bcrypt
- **File uploads:** multer (avatar images stored as BLOB)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Render (triggered by GitHub Actions)

## Architecture

The app is built on the internal `@eleansphere/be-core` framework, which handles Express setup, database connection, CRUD routing, file uploads, and JWT authentication. All domain models and DTO types come from `@eleansphere/kniho-hlod-service`.

```
src/
├── index.ts    # Entry point — calls createApp() with modelConfigs + plugin
├── plugin.ts   # Custom plugin — User and ProfileImage routes with bcrypt hooks
└── logger.ts   # Simple request/app logger
```

### Model registration

All four models (Book, Loan, ProfileImage, User) are defined in `@eleansphere/kniho-hlod-service` and registered via `modelConfigs` in `index.ts`. Book and Loan use auto-generated CRUD routes. User and ProfileImage use `skipAutoRoutes: true` — their routes are registered manually in `plugin.ts` to support custom bcrypt hooks and file upload handling.

### Authentication

- `/api/books`, `/api/loans` — protected automatically via `userScoped: true` in entity config (be-core applies `createExtractUser`)
- `/api/users`, `/api/profile-images` — protected manually via `createExtractUser` in `plugin.ts`
- `/api/auth/login` — public
- `/api/auth/me` — protected

## API Endpoints

| Route | Auth | Notes |
|-------|------|-------|
| `POST /api/auth/login` | Public | Returns JWT |
| `GET /api/auth/me` | JWT | Returns current user |
| `GET/POST/PUT/DELETE /api/users` | JWT | bcrypt on create/update |
| `POST/GET /api/profile-images` | JWT | File upload (avatar BLOB) |
| `GET/POST/PUT/DELETE /api/books` | JWT + userScoped | Filtered by ownerId |
| `GET/POST/PUT/DELETE /api/loans` | JWT + userScoped | Filtered by ownerId |

## Local Development

### Prerequisites

- Node.js 22+
- Access to the `@eleansphere` and `@kniho-hlod` GitHub Package Registries (requires a GitHub PAT with `read:packages`)
- Copy `.env.example` to `.env` and fill in values

### Commands

```bash
npm run dev      # nodemon watch mode
npm run build    # tsc compile to dist/
npm run start    # node dist/index.js
npm run format   # prettier --write src/
```

## Environment Variables

Create a `.env` file (see `.env.example`):

| Variable          | Required   | Description                              |
| ----------------- | ---------- | ---------------------------------------- |
| `DATABASE_URL`    | Yes        | PostgreSQL connection string             |
| `JWT_SECRET`      | Yes        | Secret for signing JWT tokens (use a strong 32+ char random value) |
| `PORT`            | No         | Server port (default: 3000)              |
| `NODE_AUTH_TOKEN` | Build only | GitHub PAT with `read:packages`          |

## Deployment

Pushes to `master` trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`), which:

1. Checks out code
2. Installs dependencies from GitHub Package Registry
3. Compiles TypeScript
4. Triggers a Render deploy webhook

Required GitHub repository secrets:

- `NODE_AUTH_TOKEN` — GitHub PAT with `read:packages`
- `RENDER_DEPLOY_HOOK_URL` — Render deploy hook URL
