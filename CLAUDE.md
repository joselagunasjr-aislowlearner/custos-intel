# Custos Intel — Fire & Life Safety Plan Review

## Project Overview
Full-stack application for fire & life safety plan review targeting multifamily and commercial buildings in Chippewa Falls, WI. Reviewers upload iPhone photos of building plans, get AI-assisted code compliance analysis, track checklist items per project, and generate compliance reports.

## Stack
- **Frontend**: React + Vite SPA (`packages/web/`) → GitHub Pages
- **Backend**: NestJS + TypeORM (`packages/api/`) → Railway
- **Database**: PostgreSQL via Supabase
- **Storage**: Supabase Storage (bucket: `plan-photos`)
- **Auth**: Supabase Auth (email/password), validated server-side via JwtAuthGuard
- **AI**: Claude API (Vision) for plan photo analysis

## Monorepo Structure
```
packages/api/     — NestJS backend (port 3000)
packages/web/     — Vite + React SPA (port 5173)
```

## Commands
```bash
npm run api:dev      # Start NestJS dev server
npm run api:build    # Build backend
npm run web:dev      # Start Vite dev server
npm run web:build    # Build frontend for deployment

# Seed database (from packages/api/)
npx ts-node src/seeds/run-seeds.ts
```

## Environment Variables
### Backend (packages/api/.env)
```
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
PORT=3000
NODE_ENV=development
```

### Frontend (packages/web/.env)
```
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Code Jurisdiction
All code references target Chippewa Falls, WI:
- NFPA 13 (2012), NFPA 14 (2010), NFPA 72 (2010)
- IBC 2012, IFC 2012
- Wisconsin SPS 361-366
- Chippewa Falls Municipal Code Ch. 14 & 17

## Database
- Migration SQL: `packages/api/src/migrations/001-initial-schema.sql`
- Run against Supabase SQL Editor
- Seed data: 47 checklist items + 70+ code references

## API Prefix
All endpoints use `/api/v1/` prefix. Auth guard validates Supabase JWT on protected routes.

## Frontend Routing
Uses React Router with `basename: '/custos-intel/'` for GitHub Pages. SPA fallback via 404.html copy.
