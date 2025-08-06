# Vercel Deployment Guide

## Prerequisites

1. **MongoDB Atlas Database**: Set up a MongoDB Atlas cluster and get your connection string
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Vercel CLI**: Install with `npm i -g vercel`

## Environment Variables

Set these environment variables in your Vercel project settings:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/divakar-app
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

## Deployment Steps

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from server directory**:
   ```bash
   cd server
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set project name
   - Confirm deployment

5. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project
   - Go to Settings > Environment Variables
   - Add all the environment variables listed above

6. **Redeploy**:
   ```bash
   vercel --prod
   ```

## Important Notes

- The app is configured to work with Vercel's serverless functions
- MongoDB Atlas is recommended for production
- Make sure your CORS_ORIGIN matches your frontend domain
- JWT_SECRET should be a strong, random string
- Email configuration is needed for OTP functionality

## API Endpoints

Your API will be available at:
- `https://your-project.vercel.app/api/v1/auth`
- `https://your-project.vercel.app/api/v1/projects`
- `https://your-project.vercel.app/api/v1/users`
- `https://your-project.vercel.app/health-check`

## Troubleshooting

1. **Database Connection Issues**: Ensure your MongoDB Atlas cluster allows connections from all IPs (0.0.0.0/0)
2. **CORS Issues**: Update CORS_ORIGIN to match your frontend domain
3. **Build Errors**: Check that all dependencies are in package.json
4. **Environment Variables**: Ensure all required env vars are set in Vercel dashboard 