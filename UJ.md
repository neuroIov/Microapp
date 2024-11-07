# Detailed User Journey

## 1. Welcome Screen (Splash Screen)
- Component: `SplashScreen.js`
- Description: First screen users see when opening the app
- Features:
  - Animated Neurolov logo
  - Loading progress bar
  - Background animation (e.g., particles or subtle wave effect)
- Duration: 3-5 seconds before transitioning to the next screen

## 2. Claim Screen
- Component: `CheckIn.js`
- Description: Initial screen for new users or daily check-in for returning users
- Features:
  - Large "Claim 500 XP" button
  - Telegram authentication happens in the background when button is pressed
  - Animation showing XP being added to user's account
  - Brief tutorial or tooltip explaining the concept of XP
- User Actions:
  - Press the claim button to receive 100 XP and authenticate
  - Automatically redirects to Home screen after successful claim

## 3. Home Screen
- Component: `Home.js`
- Description: Main gameplay screen where users interact with the fan
- Features:
  - Central fan graphic that rotates when tapped
  - Breathing light effect behind the fan, intensity increases with tap speed
  - XP counter prominently displayed
  - Seek bar showing progress towards next cooldown (500 taps)
  - Boost button for temporary auto-rotation
  - GPU level indicator
- User Actions:
  - Tap the fan to generate XP
  - Activate boost for 5 seconds of automatic rotation
  - Upgrade GPU when enough XP is accumulated
- Special Effects:
  - Fan color changes at 10,000 XP
  - Fan design upgrades at 50,000 XP
  - CP Level changes 25,000 XP
  - Haptic feedback on taps and milestones

## 4. Leaderboard Screen
- Component: `Leaderboard.js`
- Description: Displays user rankings based on XP or compute power
- Features:
  - Tabs for Daily, Weekly, and All-Time leaderboards
  - Top 3 users highlighted with special graphics (gold, silver, bronze)
  - Scrollable list of top 100 users
  - User's own rank prominently displayed
  - Option to view global or friends-only leaderboard
- User Actions:
  - Switch between different timeframes (Daily/Weekly/All-Time)
  - Toggle between global and friends leaderboards
  - Tap on users to view their profiles (if implemented)

## 5. Quest Screen
- Component: `Quest.js`
- Description: Displays available quests and achievements
- Features:
  - Two tabs: "Quests" and "Achievements"
  - List of available quests with progress indicators
  - Quest rewards clearly displayed (custom XP for each quest)
  - "Claim" button for completed quests
  - Achievements with unlock conditions and rewards
- User Actions:
  - View quest details
  - Claim completed quests
  - View achievement progress
  - Initiate quest actions (e.g., share on Twitter, join Telegram group)
- Backend Mechanism:
  - Server regularly updates quest status
  - Verification system for Telegram and Twitter actions
  - Real-time update of quest progress

## 6. Profile Screen
- Component: `Profile.js`
- Description: Displays user stats and achievements
- Features:
  - User avatar and username
  - Total XP and current GPU level
  - Stats dashboard (total taps, quests completed, etc.)
  - Achievements showcase
  - Referral code and stats
- User Actions:
  - Update profile picture
  - View detailed stats
  - Share referral code

## 7. Settings Screen
- Component: `Settings.js`
- Description: Allows users to customize their app experience
- Features:
  - Toggle notifications on/off
  - Sound effects volume control
  - Vibration/haptic feedback toggle
  - Language selection
  - Dark/Light mode toggle
  - Links to Terms of Service and Privacy Policy
  - Option to contact support
- User Actions:
  - Adjust app settings
  - Read legal documents
  - Reach out to support team

## Navigation
- Component: `Navbar.js`
- Description: Persistent bottom navigation bar
- Features:
  - Icons for Home, Leaderboard, Quests, Profile, and Settings
  - Visual indicator for current screen
  - Subtle animations on icon press

## Additional Notes
- Smooth transitions between all screens
- Consistent color scheme and design language throughout the app
- Responsive design to accommodate various device sizes
- Error handling and offline mode capabilities
