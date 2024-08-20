## API Documentation

# GPU Tapping Game API Documentation

Base URL: `http://prod.eba-cimgkmsm.eu-north-1.elasticbeanstalk.com/api`

## Authentication

All endpoints except `/auth/telegram` require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### 1. Telegram Authentication

- `POST /auth/telegram`
  - Authenticate user via Telegram
  - Parameters: `{ id: string, first_name: string, username: string }`
  - Returns: `{ token: string, user: { id: string, username: string } }`

**Example:**
    
- **URL**: `/auth/telegram`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "id": "12345678",
    "first_name": "neo",
    "username": "neohex"
  }
  ```
- **Response**: 
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMTExMTExMTEiLCJ1c2VybmFtZSI6ImJpbmFyeWJvZGkiLCJpYXQiOjE3MjQwNDY0OTksImV4cCI6MTcyNDEzMjg5OX0.r-GlIrf5tCKKoup_fDcTO35N4iyu021TkYR_RT-hpiY",
    "user": {
      "id": "12345678",
      "username": "neohex"
    }
  }
  ```

### 2. Claim Daily XP

- `POST /api/users/claim-daily-xp`
  - Perform daily check-in
  - Returns: `{ xp: number, lastDailyClaimDate: number }`

  **Example:**

- **URL**: `/api/users/claim-daily-xp`
- **Method**: `POST`
- **Headers**: Authorization
- **Response**: 
  ```json
  {
    "message": "Daily XP claimed successfully",
    "user": {
      "xp": 100,
      "lastDailyClaimDate": "2024-08-13T12:34:56.789Z"
    }
  }
  ```

### 3. Tap GPU

  - `POST /api/users/tap`
  - Register a GPU tap
  - Returns: `{ compute: number, totalTaps: number, computePower: number }`

**Example:**

**URL**: `api/users/tap`
**Method**: `POST`
**Auth required**: Yes (JWT Token in Authorization header)

### Success Response

**Code**: `200 OK`
**Content example**:

```json
{
    "message": "Tap successful",
    "user": {
        "compute": 28,
        "totalTaps": 28,
        "computePower": 1
    },
    "breathingLight": {
        "color": "blue",
        "intensity": 0.028
    }
}
```

### Error Responses

**Condition**: If GPU is in cooldown
**Code**: `400 BAD REQUEST`
**Content**:

```json
{
  "message": "GPU is cooling down",
  "cooldownEndTime": "2023-08-13T12:34:56.789Z",
  "breathingLight": {
    "color": "red",
    "intensity": 1
  }
}
```

**Condition**: If user is not found
**Code**: `404 NOT FOUND`
**Content**: `{ "message": "User not found" }`

**Condition**: If there's a server error
**Code**: `500 INTERNAL SERVER ERROR`
**Content**: `{ "message": "Internal server error" }`



### 4. Upgrade GPU

  - `POST /api/users/upgrade-gpu`
  - Upgrade user's GPU
  - Returns: `{ message: string, user: object }`

**Example:**

- **URL**: `/users/upgrade-gpu`
- **Method**: `POST`
- **Headers**: Authorization
- **Response**: 

  ```json
  {
    "message": "GPU upgraded",
    "user": {
      // Updated user object
    }
  }

  or

  {
    "message": "Not enough compute for upgrade"
}
  ``

### 5. Add Referral

- **URL**: `/users/add-referral`
- **Method**: `POST`
- **Headers**: Authorization
- **Body**:
  ```json
  {
    "referredId": "telegram_id_of_referred_user"
  }
  ```
 **Response**: 
  ```json
  {
    "message": "Referral added successfully",
    "referrer": {
      // Referrer user object
    },
    "referred": {
      // Referred user object
    }
  }
  ```
### 6. Generate Referral Code

- `POST /api/referral/generate-code`
  - Generate referral code
  - Returns: `{ referralCode: string }`

**Example:**

- **URL**: `/referral/generate-code`
- **Method**: `GET`
- **Headers**: Authorization
- **Response**: 
  ```json
  {
    "referralCode": "ABCD1234"
  }
  ```
  
### 7. Apply Referral Code 

- `POST /api/referral/apply-code`
  - Apply referral code
  - Parameters: `{ referralCode: string }`
  - Returns: `{ message: string, xpEarned: number }`

**Example:**

- **URL**: `/referral/apply-code`
- **Method**: `POST`
- **Headers**: Authorization
- **Body**:
  ```json
  {
    "referralCode": "ABCD1234"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Referral code applied successfully"
  }
  ```
  

### 8. Get All Active Quests

  - `GET /api/quests`
  - Retrieve  quests
  - Returns: `[{ id: string, name: string, description: string, xpReward: number, completed: boolean }]`

**Example:**

- **URL**: `/quests`
- **Method**: `GET`
- **Headers**: Authorization
- **Response**: Array of active quests

### 9. Claim Quests

  - `POST /api/quests/claim/:questId`
  - Claim completed quest
  - Returns: `{ message: string, xp: number }`

### 10. Achievements 
  - `GET /api/achievements`
  - Retrieve user achievements
  - Returns: `[{ id: string, name: string, description: string, completed: boolean, progress: number }]`
    
### 11. Get Timeframe Leaderboard

- **URL**: `/api/leaderboard/:timeframe`
- **Method**: `GET`
- **Headers**: Authorization
- **Parameters**: 
  - `timeframe`: "daily", "weekly", or "monthly"
- **Response**: Array of top 100 users for the specified timeframe

### 11.1 Get Daily Leaderboard

- **URL**: `/api/leaderboard/daily`
- **Method**: `GET`
- **Headers**: Authorization
- **Response**: Array of top daily users

### 11.2 Get Weekly Leaderboard

- **URL**: `/api/leaderboard/weekly`
- **Method**: `GET`
- **Headers**: Authorization
- **Response**: Array of top weekly users

### 11.3 Get All-time Leaderboard

- **URL**: `/api/leaderboard/ all-time`
- **Method**: `GET`
- **Headers**: Authorization
- **Response**: Array of top all-time users

 **Example Response**: 
     {
        "_id": "66c232c9780ceaeac4e9e52f",
        "username": "johndoe",
        "compute": 28,
        "computePower": 1
    },
   {
        "_id": "66c236a4a55ec79bf83bf64c",
        "username": "binarybodi",
        "compute": 28,
        "computePower": 1
    },


### 12. Get User Profile and Dashboard Data

- **URL**: `/profile-dashboard`
- **Method**: `GET`
- **Headers**: Authorization
- **Response**: 
  ```json
  {
    "user": {
      // User data
    },
    "quests": [
      // Active quests
    ],
    "cooldownStatus": {
      // Cooldown information
    }
  }
  ```

### 13. Update User Profile

- **URL**: `/profile-dashboard/update`
- **Method**: `PUT`
- **Headers**: Authorization
- **Body**:
  ```json
  {
    "username": "new_username"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Profile updated successfully",
    "user": {
      // Updated user object
    }
  }
  ```

### 14. Get Referral Statistics

- **URL**: `/referral/stats`
- **Method**: `GET`
- **Headers**: Authorization
- **Response**: 
  ```json
  {
    "totalReferrals": 5,
    "referralXP": 1000,
    "topReferrals": [
      { "username": "user1", "computePower": 100 },
      { "username": "user2", "computePower": 90 }
    ]
  }
  ```
### 15. View Settings
- `GET /api/settings`
  - Get user settings
  - Returns: `{ notifications: boolean, language: string, theme: string }`

### 16. Change Settings

- `PUT /api/settings`
  - Update user settings
  - Parameters: `{ notifications?: boolean, language?: string, theme?: string }`
  - Returns: `{ message: string, settings: object }`

  
All endpoints may return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses will have the following format:
```json
{
  "message": "Error description"
}
```

## Notes for Frontend Integration

1. Store the JWT token securely (e.g., in HttpOnly cookies or secure local storage) after receiving it from the Telegram authentication process.
2. Include the JWT token in the Authorization header for all authenticated requests.
3. Handle token expiration and implement a refresh mechanism if necessary.
4. Implement proper error handling and display user-friendly messages.
5. Consider implementing a loading state while waiting for API responses.
6. For real-time updates (if implemented), use WebSocket connections or implement polling mechanisms as advised by the backend team.
7. Be aware of any rate limiting policies (e.g., 100 requests per 15 minutes per IP).

Please contact the backend team if you encounter any issues or need further clarification on any endpoint.

