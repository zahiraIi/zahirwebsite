# Fix: Error 403: access_denied - "App is currently being tested"

**You're seeing:** "Access blocked: Zahir Portfolio has not completed the Google verification process" with "Error 403: access_denied"

This means your OAuth app is in "Testing" mode and your email isn't added as a test user.

## Quick Fix (2 minutes)

### Step 1: Go to OAuth Consent Screen

1. Go to: **https://console.cloud.google.com/apis/credentials/consent**
2. You'll see your app's consent screen settings

### Step 2: Add Yourself as a Test User

1. Scroll down to the **"Test users"** section
2. Look for a button that says **"+ ADD USERS"** or **"ADD USERS"**
3. Click it
4. A dialog box will appear
5. **Type your email address:** `zahirali986@gmail.com`
6. Click **"ADD"** or **"SAVE"**
7. You should see your email appear in the test users list

### Step 3: Save and Wait

1. Make sure you see your email (`zahirali986@gmail.com`) in the test users list
2. If there's a "SAVE" button, click it
3. **Wait 5-10 minutes** for Google's servers to update

### Step 4: Try Again

1. Go back to: **https://developers.google.com/oauthplayground/**
2. Make sure you've configured your credentials (gear icon)
3. Select the Gmail scope: `https://www.googleapis.com/auth/gmail.send`
4. Click **"Authorize APIs"**
5. **Sign in with:** `zahirali986@gmail.com` (the email you just added)
6. It should work now!

## Detailed Step-by-Step

### Finding the Test Users Section

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. You'll see several sections:
   - App information
   - Scopes
   - **Test users** ← This is what you need
   - Summary
3. Click on **"Test users"** or scroll to that section

### Adding Your Email

In the Test users section, you'll see:

```
Test users
┌─────────────────────────────────────────────┐
│ Users who can access your app while it's    │
│ in testing mode:                            │
│                                             │
│ [No test users added]                       │
│                                             │
│ [+ ADD USERS]  ← Click this                │
└─────────────────────────────────────────────┘
```

1. Click **"+ ADD USERS"**
2. A popup/dialog will appear
3. Type: `zahirali986@gmail.com`
4. Click **"ADD"** or press Enter
5. Your email should appear in the list

### Visual Guide

After adding, it should look like:

```
Test users
┌─────────────────────────────────────────────┐
│ Users who can access your app while it's    │
│ in testing mode:                            │
│                                             │
│ • zahirali986@gmail.com                    │
│                                             │
│ [+ ADD USERS]                              │
└─────────────────────────────────────────────┘
```

## Important Notes

1. **Use the exact email** you'll sign in with in OAuth Playground
2. **Wait 5-10 minutes** after adding - Google needs time to update
3. **Sign in with that email** when authorizing in OAuth Playground
4. You can add multiple test users if needed

## Why This Happens

When your OAuth app is in "Testing" mode (which is normal for personal apps), only emails in the "Test users" list can authorize the app. This is a security feature.

## Alternative: Publish Your App (Not Recommended for Personal Use)

If you want anyone to use your app (not just test users), you'd need to:
1. Complete Google's verification process
2. Submit your app for review
3. This is complex and not needed for personal portfolio sites

**For personal use, just add yourself as a test user - it's much simpler!**

## Still Not Working?

If you still get the error after adding your email:

1. **Double-check the email** - Make sure it's exactly `zahirali986@gmail.com` (no typos)
2. **Wait longer** - Sometimes it takes 10-15 minutes
3. **Check you're signed in with the right account** - In OAuth Playground, make sure you sign in with `zahirali986@gmail.com`
4. **Clear browser cache** - Try in an incognito/private window
5. **Verify the email is saved** - Go back to test users section and confirm your email is there

## Quick Checklist

- [ ] Went to OAuth consent screen
- [ ] Found "Test users" section
- [ ] Clicked "+ ADD USERS"
- [ ] Added `zahirali986@gmail.com`
- [ ] Email appears in the list
- [ ] Waited 5-10 minutes
- [ ] Signed in with `zahirali986@gmail.com` in OAuth Playground
- [ ] Tried authorizing again

