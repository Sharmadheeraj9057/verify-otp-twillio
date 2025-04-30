# College Portal 2FA Login

This project demonstrates a simple college portal login system with two-factor authentication (2FA) using Twilio OTP.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your `.env` file with your Twilio credentials.

3. Run the server:
   ```
   node server.js
   ```

4. Open your browser and go to `http://localhost:3000`

## Features

- Login page with student ID, password, and phone input
- OTP verification via Twilio SMS
- OTP expires after 60 seconds