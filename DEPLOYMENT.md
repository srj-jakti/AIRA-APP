# Deployment Checklist

This document provides a comprehensive checklist for deploying AIRA to production.

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests pass locally
- [ ] No linting errors
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] CHANGELOG.md updated

### Security
- [ ] All secrets stored in environment variables
- [ ] No hardcoded credentials in code
- [ ] API keys rotated if needed
- [ ] Database credentials secured
- [ ] HTTPS enabled for all endpoints

### Database
- [ ] Database migrations tested
- [ ] Backup strategy in place
- [ ] Connection pooling configured
- [ ] Indexes optimized
- [ ] Row Level Security (RLS) policies configured

### Environment Variables
- [ ] All required env vars documented
- [ ] Production env vars configured in Vercel
- [ ] Production env vars configured in Railway
- [ ] Supabase credentials configured
- [ ] OpenAI API key configured
- [ ] Razorpay keys configured (production mode)

## Deployment Steps

### 1. Database Setup

```bash
# Run migrations on production database
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 2. Backend Deployment (Railway)

1. Push code to main branch
2. Verify Railway deployment triggered
3. Check deployment logs for errors
4. Verify health endpoint: `https://your-backend.railway.app/health`
5. Test API endpoint: `https://your-backend.railway.app/api/v1/status`

### 3. Frontend Deployment (Vercel)

1. Push code to main branch
2. Verify Vercel deployment triggered
3. Check build logs for errors
4. Verify deployment preview
5. Promote to production if preview looks good

### 4. Post-Deployment Verification

#### Backend Health Checks
- [ ] Health endpoint responding
- [ ] Database connection working
- [ ] WebSocket connections working
- [ ] Redis connection working
- [ ] External API connections working (Zerodha, OpenAI)

#### Frontend Verification
- [ ] Landing page loads correctly
- [ ] Login/signup working
- [ ] Dashboard accessible
- [ ] API calls to backend working
- [ ] WebSocket connection established
- [ ] PWA installable

#### Integration Tests
- [ ] User registration flow
- [ ] Login flow (email/password and Google OAuth)
- [ ] API configuration
- [ ] Strategy creation
- [ ] Backtest execution
- [ ] Payment flow (test mode)

### 5. Monitoring Setup

- [ ] Sentry error tracking configured
- [ ] Vercel Analytics enabled
- [ ] Railway logs accessible
- [ ] Health monitoring alerts configured
- [ ] Uptime monitoring configured

### 6. Performance Verification

- [ ] Lighthouse audit score ≥90
- [ ] API response times <500ms
- [ ] Database query times <100ms
- [ ] Page load times <3s

## Rollback Procedure

If issues are detected after deployment:

### Frontend Rollback (Vercel)
1. Go to Vercel dashboard
2. Select previous deployment
3. Click "Promote to Production"

### Backend Rollback (Railway)
1. Go to Railway dashboard
2. Select previous deployment
3. Click "Redeploy"

### Database Rollback
```bash
# Rollback last migration
cd backend
npx prisma migrate resolve --rolled-back <migration_name>
```

## Post-Deployment Tasks

- [ ] Announce deployment in team channels
- [ ] Update status page
- [ ] Monitor error rates for 24 hours
- [ ] Monitor performance metrics
- [ ] Respond to user feedback
- [ ] Document any issues encountered

## Emergency Contacts

- DevOps Lead: [Contact]
- Backend Lead: [Contact]
- Frontend Lead: [Contact]
- Database Admin: [Contact]

## Deployment Schedule

- **Development**: Continuous deployment on push to `development` branch
- **Staging**: Deployment on push to `staging` branch
- **Production**: Manual promotion after staging verification

## Maintenance Windows

- Scheduled maintenance: Sundays 2:00 AM - 4:00 AM IST
- Emergency maintenance: As needed with user notification

## Compliance Checklist

- [ ] SEBI disclaimers present on all pages
- [ ] Terms of Service updated
- [ ] Privacy Policy updated
- [ ] Refund Policy updated
- [ ] All AI-generated content labeled
- [ ] Risk warnings displayed appropriately

## Notes

- Always test in staging before production deployment
- Keep deployment window short (< 30 minutes)
- Have rollback plan ready before deployment
- Monitor closely for first 24 hours after deployment
