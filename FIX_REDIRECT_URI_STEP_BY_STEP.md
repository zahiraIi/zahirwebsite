# Step-by-Step: Fix redirect_uri_mismatch Error

You're seeing "Error 400: redirect_uri_mismatch" - here's exactly how to fix it:

## Step 1: Open Your OAuth Client Settings

1. Go to: **https://console.cloud.google.com/apis/credentials**
2. You'll see a list of credentials
3. Find the one that says **"OAuth 2.0 Client ID"** (probably named "Zahir Portfolio Contact Form")
4. Look for the **pencil/edit icon (✏️)** on the right side of that row
5. **Click the edit icon**

## Step 2: Find the Redirect URI Section

After clicking edit, you'll see a form. Scroll down until you see:

```
Authorized redirect URIs
```

This section might be empty or have some URIs already listed.

## Step 3: Add the OAuth Playground URI

1. Look for a button that says **"+ ADD URI"** or **"ADD URI"**
2. **Click it**
3. A new text input field will appear
4. **Type exactly this** (copy and paste to avoid typos):
   ```
   https://developers.google.com/oauthplayground
   ```
5. Make sure there are:
   - ✅ No spaces before or after
   - ✅ No trailing slash at the end
   - ✅ Exactly as shown above

## Step 4: Save the Changes

1. Scroll to the bottom of the page
2. Look for a blue button that says **"SAVE"**
3. **Click "SAVE"**
4. You should see a confirmation message

## Step 5: Wait and Retry

1. **Wait 1-2 minutes** for Google's servers to update
2. Go back to: **https://developers.google.com/oauthplayground/**
3. Make sure you've configured your credentials (gear icon)
4. Select the Gmail scope: `https://www.googleapis.com/auth/gmail.send`
5. Click **"Authorize APIs"** again
6. It should work now!

## Common Mistakes

❌ **Wrong URI:**
- `http://developers.google.com/oauthplayground` (missing 's' in https)
- `https://developers.google.com/oauthplayground/` (extra slash at end)
- `https://oauthplayground.com` (wrong domain)

✅ **Correct URI:**
- `https://developers.google.com/oauthplayground` (exactly this)

## If You Still Get the Error

1. **Double-check the URI** - Make sure it's exactly `https://developers.google.com/oauthplayground`
2. **Check you're editing the right OAuth Client** - Make sure it's the one you're using in OAuth Playground
3. **Wait longer** - Sometimes it takes 3-5 minutes for changes to propagate
4. **Clear browser cache** - Try in an incognito/private window
5. **Check for typos** - Copy and paste the URI instead of typing it

## Alternative: Check What URI OAuth Playground is Using

If you want to see exactly what redirect URI OAuth Playground is trying to use:

1. In OAuth Playground, after clicking "Authorize APIs"
2. Look at the URL in your browser's address bar
3. You'll see something like: `redirect_uri=https://developers.google.com/oauthplayground`
4. Make sure that exact URI is in your authorized list

## Still Not Working?

If after following all these steps you still get the error:

1. **Screenshot your "Authorized redirect URIs" section** and check:
   - Is the URI there?
   - Is it spelled correctly?
   - Are there any extra spaces?

2. **Try a different browser** or incognito mode

3. **Check the OAuth Client ID** - Make sure the Client ID in OAuth Playground matches the one you're editing

4. **Create a new OAuth Client** as a last resort:
   - Create a new OAuth 2.0 Client ID
   - Add the redirect URI from the start
   - Use the new Client ID and Secret in OAuth Playground

