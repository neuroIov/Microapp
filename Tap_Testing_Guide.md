# Testing Guide for Updated Tap Endpoint

1. **Setup**:
   - Ensure your server is running.
   - Have a valid JWT token for authentication.

2. **Basic Tap Test**:
   - Send a POST request to `/api/users/tap`
   - Headers: 
     ```
     Authorization: Bearer <your_jwt_token>
     Content-Type: application/json
     ```
   - Expected result: 
     - Status 200 OK
     - Response includes `user` and `breathingLight` objects
     - `breathingLight.color` should be "blue"
     - `breathingLight.intensity` should be a value between 0 and 1

3. **Approaching Cooldown Test**:
   - Send multiple POST requests to `/api/users/tap` (around 990-999 times)
   - Check that `breathingLight.intensity` increases with each tap
   - `breathingLight.color` should remain "blue"

4. **Cooldown Trigger Test**:
   - Continue sending POST requests until `totalTaps` in the response is a multiple of 1000
   - In the response where `totalTaps` becomes a multiple of 1000:
     - `cooldownEndTime` should be present
     - `breathingLight.color` should be "red"
     - `breathingLight.intensity` should be 1

5. **Cooldown Period Test**:
   - Immediately after triggering cooldown, send another POST request
   - Expected result:
     - Status 400 Bad Request
     - Response includes `cooldownEndTime` and `breathingLight` object
     - `breathingLight.color` should be "red"
     - `breathingLight.intensity` should be 1

6. **Post-Cooldown Test**:
   - Wait until after the `cooldownEndTime`
   - Send a POST request to `/api/users/tap`
   - Verify that tapping is allowed again and `breathingLight` returns to blue color

7. **Error Handling Test**:
   - Send a request with an invalid JWT token
   - Expected result: Status 403 Forbidden

8. **Compute Power Test**:
   - Note the `computePower` value in the response
   - Use the `/api/users/upgrade-gpu` endpoint to upgrade the GPU
   - Send a tap request and verify that the compute gained per tap has increased

Remember to reset the user's state in the database between major test cases to ensure consistent results.
