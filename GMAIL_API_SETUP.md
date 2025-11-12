# Gmail API Setup Guide

This guide will help you set up Gmail API integration for the contact form on your website.

## Overview

The contact form uses Gmail API to send emails. You have two authentication options:

1. **OAuth 2.0** (Recommended for personal Gmail accounts)
2. **Service Account** (For Google Workspace accounts)

## Option 1: OAuth 2.0 Setup (Recommended)

This method is best for personal Gmail accounts.

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Gmail API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

### Step 2: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have Google Workspace)
3. Fill in the required information:
   - App name: "Zahir Ali Portfolio"
   - User support email: Your email (z5ali@ucsd.edu)
   - Developer contact: Your email (z5ali@ucsd.edu)
4. Click "Save and Continue"
5. On the "Scopes" page:
   - Click "ADD OR REMOVE SCOPES"
   - Search for "gmail.send" or manually add: `https://www.googleapis.com/auth/gmail.send`
   - Click "UPDATE" then "SAVE AND CONTINUE"
6. On the "Test users" page:
   - **CRITICAL**: Click "+ ADD USERS"
   - Add your Gmail address (the one you'll use for the refresh token)
   - This is REQUIRED to avoid "Access blocked" errors
   - Click "SAVE AND CONTINUE"
7. Review and go back to dashboard (you don't need to publish for personal use)

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000` (for local testing)
   - `https://oauth.pstmn.io/v1/callback` (for Postman testing)
5. Click "Create"
6. **Save the Client ID and Client Secret**

### Step 4: Get Refresh Token

You need to obtain a refresh token. Here's how:

#### Using OAuth 2.0 Playground (Easiest)

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your **Client ID** and **Client Secret**
5. Click "Close" to save
6. In the left panel, find "Gmail API v1"
7. Select `https://www.googleapis.com/auth/gmail.send`
8. Click "Authorize APIs"
9. **IMPORTANT**: Sign in with the SAME Gmail account you added as a test user
10. If you see "Access blocked", go back and add your email as a test user (see Step 2)
11. After authorization, click "Exchange authorization code for tokens"
12. **Copy the Refresh Token** from the response (look for "refresh_token" field)

#### Using Node.js Script (Alternative)

Create a file `get-refresh-token.js`:

```javascript
const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  'YOUR_CLIENT_ID',
  'YOUR_CLIENT_SECRET',
  'http://localhost:3000' // Redirect URI
);

const scopes = ['https://www.googleapis.com/auth/gmail.send'];

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
});

console.log('Visit this URL to authorize:', url);
console.log('After authorization, you\'ll be redirected. Copy the code from the URL and run:');
console.log('node get-refresh-token.js <code>');
```

### Step 5: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:

```
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
GMAIL_REFRESH_TOKEN=your_refresh_token_here
GMAIL_RECIPIENT_EMAIL=z5ali@ucsd.edu
GMAIL_FROM_EMAIL=z5ali@ucsd.edu (optional, defaults to recipient)
```

4. **Important**: After adding variables, redeploy your application

## Option 2: Service Account Setup (Google Workspace)

This method is for Google Workspace accounts.

### Step 1: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to "APIs & Services" > "Credentials"
3. Click "Create Credentials" > "Service account"
4. Fill in the details and create
5. Click on the service account
6. Go to "Keys" tab
7. Click "Add Key" > "Create new key"
8. Choose "JSON" format
9. **Download and save the JSON file securely**

### Step 2: Enable Domain-Wide Delegation (If Needed)

1. In the service account details, enable "Domain-wide delegation"
2. Note the service account email address

### Step 3: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" > "Environment Variables"
3. Add the following variables:

```
GMAIL_CLIENT_EMAIL=service-account-email@project-id.iam.gserviceaccount.com
GMAIL_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
GMAIL_RECIPIENT_EMAIL=z5ali@ucsd.edu
GMAIL_FROM_EMAIL=z5ali@ucsd.edu (optional)
```

**Note**: For `GMAIL_PRIVATE_KEY`, copy the entire private key from the JSON file, including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines. Replace actual newlines with `\n` or keep them as-is if Vercel supports multiline.

## Testing

After setting up, test the contact form:

1. Visit your website
2. Click the email icon
3. Fill out and submit the form
4. Check your email inbox (z5ali@ucsd.edu) for the message

## Troubleshooting

### ⚠️ "Access Blocked" Error (Most Common)

**See `GMAIL_ACCESS_BLOCKED_FIX.md` for detailed fix instructions.**

Quick fix:
1. Go to OAuth consent screen in Google Cloud Console
2. Add your Gmail address as a test user
3. Wait 5-10 minutes
4. Generate a new refresh token
5. Update Vercel environment variables
6. Redeploy

### Error: "Email service not configured"

- Check that all required environment variables are set in Vercel
- Make sure you've redeployed after adding environment variables

### Error: "Failed to get access token"

- Verify your OAuth credentials are correct
- Check that the refresh token hasn't expired
- Ensure the Gmail API is enabled in your Google Cloud project
- Make sure you're using the same Gmail account that's added as a test user

### Error: "Gmail API error: insufficient permissions"

- Verify the OAuth consent screen has your email as a test user
- Check that the scope `gmail.send` is included
- For service accounts, ensure domain-wide delegation is set up correctly

### Error: "Invalid grant"

- Your refresh token may have expired or been revoked
- Generate a new refresh token using OAuth Playground
- Update the `GMAIL_REFRESH_TOKEN` in Vercel and redeploy

### Emails not received

- Check spam folder
- Verify the recipient email address is correct
- Check Gmail API quotas in Google Cloud Console

## Security Notes

- **Never commit credentials to git**
- Store all sensitive data in Vercel environment variables
- Use different credentials for development and production
- Regularly rotate refresh tokens and API keys
- Monitor API usage in Google Cloud Console

## API Quotas

Gmail API has the following default quotas:
- 1 billion quota units per day
- 250 quota units per user per second

Each `send` operation costs 100 quota units. This should be more than sufficient for a personal portfolio website.

## Support

If you encounter issues:
1. Check the Vercel function logs: Vercel Dashboard > Your Project > Functions
2. Check Google Cloud Console logs: APIs & Services > Gmail API > Metrics
3. Review the error messages in the browser console

