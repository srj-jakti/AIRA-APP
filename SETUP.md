# AIRA Setup Guide

This guide will help you set up the AIRA trading platform from scratch.

## Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git
- Supabase account
- Railway account
- Vercel account
- GitHub account

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd aira-trading-platform
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cd ..
```

### 3. Setup Supabase Database

1. Create a new project on [Supabase](https://supabase.com)
2. Copy your project URL and anon key
3. Get your database connection string from Settings > Database

### 4. Configure Environment Variables

#### Frontend (.env.local)

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

#### Backend (.env)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```
DATABASE_URL=your_supabase_database_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
PORT=3001
NODE_ENV=development
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your_openai_api_key
ENCRYPTION_KEY=your_32_character_encryption_key
```

### 5. Setup Database Schema

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Run Development Servers

From the root directory:

```bash
# Run both frontend and backend
npm run dev

# Or run separately:
npm run dev:frontend  # Frontend on http://localhost:3000
npm run dev:backend   # Backend on http://localhost:3001
```

## Production Deployment

### 1. Setup GitHub Repository

1. Create a new repository on GitHub
2. Push your code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

3. Setup branch protection rules:
   - Go to Settings > Branches
   - Add rule for `main` branch
   - Enable "Require pull request reviews before merging"
   - Enable "Require status checks to pass before merging"

### 2. Deploy Backend to Railway

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Connect your GitHub repository
4. Select the `backend` directory
5. Add environment variables:
   - `DATABASE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `PORT`
   - `NODE_ENV=production`
   - `REDIS_URL`
   - `OPENAI_API_KEY`
   - `ENCRYPTION_KEY`
6. Deploy

### 3. Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Select the `frontend` directory
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your Railway backend URL)
   - `NEXT_PUBLIC_WS_URL` (your Railway WebSocket URL)
5. Deploy

### 4. Configure GitHub Actions

Add the following secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `VERCEL_TOKEN` - Get from Vercel account settings
- `VERCEL_ORG_ID` - Get from Vercel project settings
- `VERCEL_PROJECT_ID` - Get from Vercel project settings
- `RAILWAY_TOKEN` - Get from Railway account settings

### 5. Setup Custom Domain (Optional)

#### Vercel (Frontend)
1. Go to your Vercel project settings
2. Add your custom domain
3. Configure DNS records as instructed

#### Railway (Backend)
1. Go to your Railway project settings
2. Generate a domain or add custom domain
3. Update `NEXT_PUBLIC_API_URL` in Vercel environment variables

## Database Migrations

When you make changes to the Prisma schema:

```bash
cd backend
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

For production:

```bash
npx prisma migrate deploy
```

## Testing

```bash
# Run all tests
npm test

# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && npm test
```

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check if your IP is whitelisted in Supabase
- Ensure Prisma client is generated: `npx prisma generate`

### Frontend Build Errors

- Clear Next.js cache: `rm -rf frontend/.next`
- Reinstall dependencies: `rm -rf frontend/node_modules && npm install`

### Backend Build Errors

- Clear TypeScript build: `rm -rf backend/dist`
- Regenerate Prisma client: `npx prisma generate`

## Next Steps

After setup is complete:

1. Review the [Design Document](.kiro/specs/ai-trading-webapp/design.md)
2. Review the [Requirements](.kiro/specs/ai-trading-webapp/requirements.md)
3. Follow the [Implementation Tasks](.kiro/specs/ai-trading-webapp/tasks.md)

## Support

For issues or questions, please create an issue in the GitHub repository.
