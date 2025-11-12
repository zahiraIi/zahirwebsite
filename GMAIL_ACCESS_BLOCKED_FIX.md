# Fix "Access Blocked" Error - Quick Guide

If you're seeing "Access blocked: This app's request is invalid" or similar errors, follow these steps:

## Quick Fix Steps

### 1. Add Yourself as a Test User (Most Common Fix)

If your OAuth consent screen is in "Testing" mode:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** > **OAuth consent screen**
3. Scroll down to **Test users** section
4. Click **+ ADD USERS**
5. Add your Gmail address (the one you're using for the refresh token)
6. Click **SAVE**
7. **Important**: Wait 5-10 minutes for changes to propagate

### 2. Verify OAuth Consent Screen Status

1. Go to **APIs & Services** > **OAuth consent screen**
2. Check the **Publishing status**:
   - If it says "Testing" → Add yourself as a test user (Step 1)
   - If it says "In production" → Should work for all users

### 3. Check App Verification Status

For personal use, you typically don't need verification, but check:

1. In **OAuth consent screen**, look for any warnings
2. If you see "App verification required", you can ignore it for personal use
3. For personal apps, "Testing" mode is fine

### 4. Verify Scopes Are Correct

1. Go to **OAuth consent screen**
2. Click **EDIT APP**
3. Go to **Scopes** tab
4. Make sure you have: `https://www.googleapis.com/auth/gmail.send`
5. If missing, click **ADD OR REMOVE SCOPES** and add it
6. Save and continue

### 5. Re-generate Refresh Token

After fixing the consent screen, you may need a new refresh token:

1. Go to [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (⚙️) in top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In left panel, find **Gmail API v1**
6. Select `https://www.googleapis.com/auth/gmail.send`
7. Click **Authorize APIs**
8. **Important**: Make sure you're signed in with the SAME Gmail account you added as a test user
9. Click **Exchange authorization code for tokens**
10. Copy the new **Refresh Token**

### 6. Update Environment Variables

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Update `GMAIL_REFRESH_TOKEN` with the new token
3. **Redeploy** your application (important!)

## Common Error Messages & Solutions

### "Access blocked: This app's request is invalid"
- **Solution**: Add your email as a test user (Step 1)

### "Error 403: access_denied"
- **Solution**: Check that your email is in the test users list

### "This app isn't verified"
- **Solution**: For personal use, this is OK. Just add yourself as a test user

### "Invalid grant" when getting access token
- **Solution**: Your refresh token may have expired. Generate a new one (Step 5)

## Step-by-Step: Complete Fix

1. ✅ Add your Gmail address as a test user in OAuth consent screen
2. ✅ Verify scope `gmail.send` is added
3. ✅ Generate a new refresh token using OAuth Playground
4. ✅ Update `GMAIL_REFRESH_TOKEN` in Vercel environment variables
5. ✅ Redeploy your Vercel application
6. ✅ Test the contact form again

## Still Not Working?

### Check Vercel Function Logs

1. Go to Vercel Dashboard > Your Project
2. Click **Functions** tab
3. Click on `/api/send-email`
4. Check the logs for specific error messages

### Verify Environment Variables

Make sure all these are set in Vercel:
```
GMAIL_CLIENT_ID=your_client_id_here
GMAIL_CLIENT_SECRET=your_client_secret_here
GMAIL_REFRESH_TOKEN=your_refresh_token_here
GMAIL_RECIPIENT_EMAIL=z5ali@ucsd.edu
```

### Test the API Directly

You can test the API endpoint directly using curl:

```bash
curl -X POST https://your-domain.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message"
  }'
```

Check the response for specific error messages.

## Alternative: Use a Different Email Service

If Gmail API continues to cause issues, consider:
- **EmailJS** (easier setup, free tier available)
- **SendGrid** (reliable, free tier)
- **Resend** (modern, developer-friendly)

Would you like me to help you set up an alternative email service?

