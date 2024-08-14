# Deployment Guide

This guide provides detailed instructions for deploying the NeuroLov backend to different platforms.

## Deploying to Heroku

1. Sign up for a Heroku account and install the Heroku CLI.
2. Log in to Heroku CLI:
   ```
   heroku login
   ```
3. In your project directory, create a Heroku app:
   ```
   heroku create your-app-name
   ```
4. Add a MongoDB add-on:
   ```
   heroku addons:create mongolab
   ```
5. Add a Redis add-on:
   ```
   heroku addons:create heroku-redis
   ```
6. Set environment variables:
   ```
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   heroku config:set CORS_ORIGIN=https://your-frontend-url.com
   ```
7. Deploy your application:
   ```
   git push heroku main
   ```
8. Ensure at least one instance is running:
   ```
   heroku ps:scale web=1
   ```

## Deploying to Vercel

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```
2. Log in to Vercel:
   ```
   vercel login
   ```
3. Deploy your application:
   ```
   vercel
   ```
4. Follow the prompts to set up your project.
5. Set environment variables in the Vercel dashboard or use the Vercel CLI:
   ```
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add TELEGRAM_BOT_TOKEN
   vercel env add CORS_ORIGIN
   ```
6. For subsequent deployments, use:
   ```
   vercel --prod
   ```

Remember to update your frontend application with the new backend URL after deployment.
