#!/bin/bash

echo "🚀 Starting Vercel deployment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel..."
    vercel login
fi

# Build the project
echo "📦 Building project..."
npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to set your environment variables in the Vercel dashboard:"
echo "   - MONGO_URI"
echo "   - JWT_SECRET"
echo "   - JWT_EXPIRES_IN"
echo "   - EMAIL_HOST"
echo "   - EMAIL_PORT"
echo "   - EMAIL_USER"
echo "   - EMAIL_PASS"
echo "   - CORS_ORIGIN" 