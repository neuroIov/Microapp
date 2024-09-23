# Neurolov Compute Bot - Complete Documentation

## Table of Contents
1. [User Journey](#user-journey)
2. [Backend Architecture](#backend-architecture)
3. [API Documentation](#api-documentation)
4. [Frontend Architecture](#frontend-architecture)
5. [Telegram Integration](#telegram-integration)

## 1. User Journey

### 1.1 Onboarding
1. User discovers the Neurolov Compute Bot on Telegram.
2. User starts the bot by sending the `/start` command.
3. Bot sends a welcome message with an introduction to the app.
4. User is prompted to open the Web App via an inline button.

### 1.2 Authentication
1. Web App opens and automatically authenticates the user using Telegram data.
2. Backend validates the Telegram data and creates or retrieves the user account.
3. JWT token is generated and stored for subsequent API calls.

### 1.3 Main Gameplay Loop
1. User lands on the Home screen, showing their current XP, compute power, and fan animation.
2. User taps the fan to generate compute power and earn XP.
3. As user taps, the fan speed increases, and XP is accumulated.
4. User can upgrade their GPU to increase compute power.
5. Cooldown period is triggered after 500 taps, requiring the user to wait before tapping again.

### 1.4 Quests and Achievements
1. User can access the Quest screen to view available quests.
2. Completing quests rewards the user with XP and other bonuses.
3. Achievements are unlocked based on user progress and actions.

### 1.5 Leaderboard
1. User can view global and friends leaderboards.
2. Leaderboards show rankings based on XP or compute power.

### 1.6 Referral System
1. User can generate a unique referral code.
2. Sharing the code with friends rewards both the referrer and the new user.
3. Multi-level referral system provides ongoing rewards.

### 1.7 Settings and Profile
1. User can customize app settings (notifications, sound, language, theme).
2. Profile page shows user stats and achievements.

## 2. Backend Architecture

### 2.1 Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

### 2.2 Main Components
1. **Server Setup** (`app.js`): Configures Express app, middleware, and routes.
2. **Database Connection** (`mongoose.js`): Establishes MongoDB connection.
3. **Authentication Middleware** (`auth.js`): Verifies JWT tokens for protected routes.
4. **Controllers** (`userController.js`, etc.): Handle business logic for various features.
5. **Models** (`User.js`, `Quest.js`, etc.): Define data schemas and methods.
6. **Routes** (`userRoutes.js`, etc.): Define API endpoints and link to controllers.
7. **Utilities** (`telegramUtils.js`, `referralUtils.js`, etc.): Helper functions for various tasks.

### 2.3 Key Features
- Telegram WebApp authentication
- User actions (tapping, upgrading, boosts)
- Quest and achievement systems
- Leaderboard generation
- Referral system with multi-level rewards
- Daily and weekly task resets using cron jobs

## 3. API Documentation

### 3.1 Authentication
- `POST /auth/telegram`: Authenticate user with Telegram data

### 3.2 User Actions
- `POST /users/tap`: Record a tap action
- `POST /users/upgrade-gpu`: Upgrade user's GPU
- `POST /users/claim-daily-xp`: Claim daily XP bonus
- `POST /users/boost`: Activate temporary boost

### 3.3 Quests and Achievements
- `GET /quests`: Retrieve available quests
- `POST /quests/:questId/claim`: Claim completed quest
- `GET /achievements`: Get user achievements
- `POST /achievements/:achievementId/claim`: Claim achievement reward

### 3.4 Leaderboard
- `GET /leaderboard/:type`: Get leaderboard (daily, weekly, all-time)
- `GET /leaderboard/position/:type`: Get user's position on leaderboard

### 3.5 Referral System
- `POST /referral/generate-code`: Generate referral code
- `POST /referral/apply-code`: Apply referral code
- `GET /referral/stats`: Get referral statistics

### 3.6 User Profile and Settings
- `GET /profile-dashboard`: Get user profile data
- `PUT /profile-dashboard/update`: Update user profile
- `GET /settings`: Retrieve user settings
- `PUT /settings`: Update user settings

## 4. Frontend Architecture

### 4.1 Technologies Used
- React
- React Router for navigation
- Styled Components for styling
- Framer Motion for animations


### 4.2 Main Components
1. **App Container** (`App.js`): Sets up routing and global providers
2. **Authentication Context** (`AuthContext.js`): Manages user authentication state
3. **Settings Context** (`SettingsContext.js`): Manages app settings
4. **API Hook** (`useApi.js`): Custom hook for making API calls
5. **Telegram WebApp Hook** (`useTelegramWebApp.js`): Manages Telegram WebApp integration

### 4.3 Key Pages
- Home (`Home.js`): Main gameplay screen with tapping mechanism
- Leaderboard (`Leaderboard.js`): Displays user rankings
- Quests (`Quest.js`): Shows available and completed quests
- Achievements (`Achievement.js`): Displays user achievements
- Profile (`Profile.js`): User profile and stats
- Settings (`Settings.js`): App settings and customization

### 4.4 Styling and Theming
- Global styles defined in `GlobalStyle.js`
- Theme configuration in `theme.js`


## 5. Telegram Integration

### 5.1 Bot Setup
- Bot is created using BotFather on Telegram
- Bot token is securely stored in environment variables

### 5.2 WebApp Integration
- Telegram WebApp is initialized in the frontend (`telegramUtils.js`)
- User data is securely passed from Telegram to the web app

### 5.3 Bot Commands
- `/start`: Introduces the bot and provides a button to open the WebApp
- `/help`: Displays available commands and basic information
- `/stats`: Shows user's current stats directly in Telegram chat

### 5.4 Inline Mode
- Bot supports inline mode for sharing referral links

### 5.5 Security Considerations
- InitData from Telegram is validated on the backend to prevent tampering
- JWT tokens are used for maintaining session in the WebApp

