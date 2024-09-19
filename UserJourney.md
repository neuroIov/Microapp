# Neurolov Compute Bot: User Journey

## 1. Initial Access

1. User discovers the Neurolov Compute Bot on Telegram.
2. User starts a chat with the bot by clicking "Start" or sending "/start".
3. Bot responds with a welcome message and a button to launch the Mini App.

## 2. Authentication

1. User clicks the button to launch the Mini App.
2. The Telegram client opens the Mini App in a WebView.
3. The app automatically authenticates the user using Telegram WebApp data.
4. If it's the user's first time, a new account is created on the backend.

## 3. Home Screen

1. User sees their profile information:
   - Username
   - Avatar (if available)
   - Current XP
   - Current Compute Power
2. The main feature, a tappable area representing the GPU, is prominently displayed.
3. Navigation options are available for other sections of the app.

## 4. Core Gameplay: Tapping

1. User taps on the GPU area to generate compute power.
2. Each tap:
   - Increases the user's XP
   - Generates compute power
   - Animates the GPU (e.g., fan spinning faster)
3. A progress bar fills up as the user taps.
4. After a certain number of taps (e.g., 500), the GPU enters a cooldown period.

## 5. Cooldown and Boost

1. During cooldown, tapping is disabled for a short period (e.g., 5 seconds).
2. User can use a "Boost" feature to instantly cool down the GPU and gain bonus taps.
3. Boosts are limited and replenish over time.

## 6. Upgrades

1. User can access an upgrade screen from the main menu.
2. Various upgrades are available, such as:
   - Increasing compute power per tap
   - Reducing cooldown time
   - Increasing XP gain
3. Upgrades cost XP or compute power to purchase.

## 7. Quests and Achievements

1. Daily and weekly quests are available, offering bonus XP and rewards.
2. Quests might include:
   - Tap X times in a day
   - Use Y boosts
   - Reach a certain XP milestone
3. Long-term achievements track overall progress and milestones.

## 8. Leaderboard

1. Users can view global and friend leaderboards.
2. Leaderboards show rankings based on:
   - Total XP
   - Compute power generated
   - Achievements unlocked

## 9. Referral System

1. Users can generate a unique referral code.
2. Sharing this code with friends provides bonuses when new users join.
3. A referral dashboard shows statistics and rewards earned from referrals.

## 10. Daily Check-in

1. Users are encouraged to check in daily for bonus rewards.
2. A streak system provides increasing rewards for consecutive daily logins.

## 11. Settings and Customization

1. Users can adjust app settings, including:
   - Notification preferences
   - Theme options (if available)
   - Sound and vibration settings
2. Profile customization options, such as changing display name or avatar.

## 12. Social Features

1. Users can add friends within the app.
2. Ability to view friends' progress and stats.
3. Optional: Collaborative tasks or competitions with friends.

## 13. Rewards and Virtual Currency

1. As users progress, they earn a virtual currency (e.g., "NeuroCoins").
2. This currency can be used for special upgrades or cosmetic items.

## 14. Mini-games or Bonus Features

1. Occasional mini-games or special events to keep engagement high.
2. These could offer unique rewards or boost progression temporarily.

## 15. Help and Support

1. An FAQ section for common questions.
2. In-app method to contact support for issues or feedback.

## 16. Regular Updates

1. Users receive notifications about app updates and new features.
2. Seasonal events or themed challenges to keep content fresh.
