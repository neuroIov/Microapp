# Neurolov GPU Microapp
Backend for Telegram based Micro Application

## Overview
NeuroLov is an engaging GPU tapping game where users can tap to generate compute power, upgrade their virtual GPUs, complete quests, and compete on leaderboards. This repository contains the backend code for the NeuroLov game.

## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [Frontend Integration](#frontend-integration)
10. [Contributing](#contributing)
11. [License](#license)

## Features
- User authentication via Telegram
- GPU tapping mechanism with cooldown periods
- Quest system with daily, weekly, and bonus quests
- Leaderboard functionality
- Referral system
- User profiles and settings

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Redis (for caching and rate limiting)
- JSON Web Tokens (JWT) for authentication

## Prerequisites
- Node.js (v14 or later)
- MongoDB
- Redis
- Telegram Bot Token

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/neurolov-backend.git
   cd neurolov-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration
1. Create a `.env` file in the root directory with the following content:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   REDIS_URL=your_redis_url
   JWT_SECRET=your_jwt_secret
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   CORS_ORIGIN=http://localhost:3000
   ```

2. Replace the placeholder values with your actual configuration details.

## Running the Application
1. Start the server:
   ```
   npm start
   ```

2. For development with auto-restart on file changes:
   ```
   npm run dev
   ```

## API Documentation
Detailed API documentation can be found in the [API_DOCS.md](./API_DOCS.md) file.

## Deployment
You can deploy this application to various platforms. Here are guides for two popular options:

### Deploying to Heroku
1. Install the Heroku CLI and log in.
2. In your project directory, run:
   ```
   heroku create your-app-name
   git push heroku main
   ```
3. Set up environment variables in Heroku dashboard or via CLI:
   ```
   heroku config:set KEY=VALUE
   ```
4. Provision MongoDB and Redis add-ons:
   ```
   heroku addons:create mongolab
   heroku addons:create heroku-redis
   ```

### Deploying to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory and follow the prompts.
3. Set up environment variables in the Vercel dashboard.

For more detailed deployment instructions, refer to the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

## Frontend Integration
For frontend developers integrating with this backend:

1. Base URL: Replace `http://localhost:3000` with the production URL in API calls.
2. Authentication: Include the JWT token in the Authorization header for authenticated requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. CORS: Ensure your frontend's URL is added to the `CORS_ORIGIN` environment variable on the backend.
4. WebSocket: If implementing real-time features, use the WebSocket endpoint provided.
5. Error Handling: Implement proper error handling for various HTTP status codes returned by the API.

Refer to the [API_DOCS.md](./API_DOCS.md) for detailed endpoint information.

## Contributing
We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to contribute to this project.

## License
This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details.
