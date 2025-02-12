# Backend Developer Task - Everything Green Limited

This repository contains the solution for the Backend Developer position at Everything Green Limited. The task is divided into two parts: **API Development & Authentication** and **Webhook Implementation**. Below is an explanation of each task and how I approached it.

## Task 1: API Development & Authentication

### API Routes:
1. **GET /api/users** - Fetches all users from the database.
2. **POST /api/users** - Allows you to add a new user with `name`, `email`, and `password`.
3. **GET /api/users/:id** - Fetches a user by their unique `id`.

### Authentication:
- The API routes are secured using **JWT Authentication**. A middleware is used to verify the token in the `Authorization` header for each request.
- If the token is invalid or missing, the API will respond with an error message, requiring the user to provide a valid token to access the endpoints.

### Database:
- **MongoDB** is used with **Mongoose** for storing and managing the user data. 
- The user model includes fields for `name`, `email`, and `password`, with password hashes stored securely using **bcryptjs**.

### Implementation Details:
- I implemented middleware to handle the authentication flow and used Mongoose for database management.
- The `POST /api/users` endpoint checks if the user already exists before creating a new user to prevent duplicate entries.

---

## Task 2: Webhook Implementation

### Webhook Endpoint:
- **POST /api/webhook** - Receives data sent to the webhook, validates the request signature, and processes the event data. 

### Webhook Signature Verification:
- A secret key (`WEBHOOK_SECRET`) is used to generate a HMAC signature from the request body. The webhook checks if the `x-signature` header matches the computed signature to ensure that the request came from a trusted source.
- If the signature is invalid, the webhook responds with a `401` error.

### Storing Event Data:
- The webhook stores the received data (including the `eventType` and `data` fields) in a JSON file (`db.json`) on the server.
- Each event entry contains a timestamp to track when the event was received.

### Generate Webhook Signature:
- A separate route, **POST /api/generate-webhook-signature**, can be used to generate a valid signature for a payload.
- This is useful for testing the webhook with valid signatures.

### Example Payload:
Here is an example of the expected data format sent to the webhook:

```json
{
  "eventType": "user_signup",
  "data": {
    "email": "test@example.com",
    "name": "John Doe"
  }
}
