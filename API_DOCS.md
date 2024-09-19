

## Base URL

All API requests should be made to: `http://16.16.234.176:3000/api/`

## Authentication

All API endpoints, except for the authentication endpoint, require a valid JWT token in the Authorization header:
Authorization: Bearer <your_jwt_token>
Copy
## Endpoints

### Authentication

#### Authenticate with Telegram

- **URL**: `/auth/telegram`
- **Method**: `POST`
- **Headers**: 
  - `Content-Type: application/json`
  - `X-Telegram-Init-Data: <telegram_init_data>`
- **Body**:
  ```json
  {
    "initData": "<telegram_init_data>"
  }

Success Response:

Code: 200
Content:
jsonCopy{
  "token": "jwt_token_here",
  "user": {
    "id": "telegram_user_id",
    "username": "user_username",
    "firstName": "User's First Name",
    "lastName": "User's Last Name",
    "languageCode": "en",
    "photoUrl": "https://example.com/photo.jpg",
    "xp": 1000
  }
}




User Profile
Get Profile Dashboard

URL: /profile-dashboard
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "user": {
    "username": "user_username",
    "xp": 1000,
    "compute": 500,
    "computePower": 10,
    "totalTaps": 5000,
    "referredBy": "referrer_username",
    "referrals": ["referred_user1", "referred_user2"],
    "lastDailyClaimDate": "2024-09-19T00:00:00Z"
  },
  "quests": [
    {
      "id": "quest_id",
      "title": "Daily Tapper",
      "description": "Tap 100 times today",
      "progress": 50,
      "required": 100,
      "reward": 50
    }
  ],
  "cooldownStatus": {
    "cooling": false,
    "remainingTime": 0
  }
}




Update Profile Dashboard

URL: /profile-dashboard/update
Method: PUT
Headers:

Authorization: Bearer <jwt_token>
Content-Type: application/json


Body:
jsonCopy{
  "username": "new_username"
}

Success Response:

Code: 200
Content:
jsonCopy{
  "message": "Profile updated successfully",
  "user": {
    "username": "new_username"
  }
}




User Actions
Claim Daily XP

URL: /users/claim-daily-xp
Method: POST
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "message": "Daily XP claimed successfully",
  "xpGained": 500,
  "newTotalXp": 1500
}




Tap GPU

URL: /users/tap
Method: POST
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "message": "Tap successful",
  "user": {
    "compute": 510,
    "totalTaps": 5001,
    "computePower": 10,
    "cooldownEndTime": null
  }
}




Upgrade GPU

URL: /users/upgrade-gpu
Method: POST
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "message": "GPU upgraded successfully",
  "newComputePower": 15,
  "xpCost": 1000,
  "newXpTotal": 500
}




Get Cooldown Status

URL: /users/cooldown-status
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "cooldownEndTime": "2024-09-19T12:30:00Z",
  "isCoolingDown": true
}




Get Daily Points

URL: /users/daily-points
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "dailyPoints": 100
}




Referral System
Generate Referral Code

URL: /referral/generate-code
Method: POST
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "referralCode": "ABC123"
}




Apply Referral Code

URL: /referral/apply-code
Method: POST
Headers:

Authorization: Bearer <jwt_token>
Content-Type: application/json


Body:
jsonCopy{
  "referralCode": "ABC123"
}

Success Response:

Code: 200
Content:
jsonCopy{
  "message": "Referral code applied successfully"
}




Get Referral Stats

URL: /referral/stats
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "totalReferrals": 5,
  "referralXP": 1000,
  "topReferrals": [
    {
      "username": "top_referral1",
      "computePower": 20
    },
    {
      "username": "top_referral2",
      "computePower": 15
    }
  ]
}




Quests
Get Quests

URL: /quests
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy[
  {
    "id": "quest_id_1",
    "title": "Daily Tapper",
    "description": "Tap 100 times",
    "progress": 50,
    "required": 100,
    "reward": 50,
    "completed": false
  },
  {
    "id": "quest_id_2",
    "title": "Upgrade Master",
    "description": "Upgrade GPU 5 times",
    "progress": 3,
    "required": 5,
    "reward": 100,
    "completed": false
  }
]




Claim Quest

URL: /quests/:questId/complete
Method: POST
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "message": "Quest claimed successfully",
  "xpGained": 50,
  "newTotalXp": 1550
}




Leaderboard
Get Leaderboard

URL: /leaderboard/:type
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Parameters:

type: 'daily', 'weekly', or 'all-time'


Success Response:

Code: 200
Content:
jsonCopy[
  {
    "username": "top_user1",
    "computePower": 50,
    "compute": 10000
  },
  {
    "username": "top_user2",
    "computePower": 45,
    "compute": 9000
  }
]




Settings
Get Settings

URL: /settings
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "notifications": true,
  "language": "en",
  "theme": "dark"
}




Update Settings

URL: /settings
Method: PUT
Headers:

Authorization: Bearer <jwt_token>
Content-Type: application/json


Body:
jsonCopy{
  "notifications": false,
  "language": "es",
  "theme": "light"
}

Success Response:

Code: 200
Content:
jsonCopy{
  "message": "Settings updated successfully",
  "settings": {
    "notifications": false,
    "language": "es",
    "theme": "light"
  }
}




Achievements
Get Achievements

URL: /achievements
Method: GET
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy[
  {
    "id": "achievement_id_1",
    "name": "First Steps",
    "description": "Tap 1000 times",
    "progress": 750,
    "required": 1000,
    "completed": false
  },
  {
    "id": "achievement_id_2",
    "name": "Upgrade Enthusiast",
    "description": "Upgrade GPU 10 times",
    "progress": 10,
    "required": 10,
    "completed": true
  }
]




Claim Achievement

URL: /achievements/claim/:achievementId
Method: POST
Headers:

Authorization: Bearer <jwt_token>


Success Response:

Code: 200
Content:
jsonCopy{
  "message": "Achievement claimed successfully",
  "xpGained": 100,
  "newTotalXp": 1650
}




Error Responses
All endpoints can return the following error responses:

401 Unauthorized:
jsonCopy{
  "error": "Authentication failed",
  "details": "Invalid or expired token"
}

400 Bad Request:
jsonCopy{
  "error": "Invalid input",
  "details": "Specific error message"
}

404 Not Found:
jsonCopy{
  "error": "Resource not found",
  "details": "Specific error message"
}

500 Internal Server Error:
jsonCopy{
  "error": "Server error",
  "details": "An unexpected error occurred"
}


Rate Limiting
The API implements rate limiting to prevent abuse. Clients are limited to 100 requests per 15-minute window. If this limit is exceeded, the API will respond with a 429 Too Many Requests status code.
Versioning
