# Fix: Error 400: redirect_uri_mismatch

This error means the redirect URI you're using doesn't match what's configured in Google Cloud Console.

**You're seeing:** "Access blocked: Zahir Portfolio's request is invalid" with "Error 400: redirect_uri_mismatch"

## Quick Fix (2 minutes)

### Step 1: Go to OAuth Credentials

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID (the one you created)
3. Click the **pencil icon** (✏️) to edit it

### Step 2: Add OAuth Playground Redirect URI

1. Scroll down to **"Authorized redirect URIs"** section
2. Click **"+ ADD URI"** button
3. A text field will appear - type this **EXACT** URI (copy and paste):
   ```
   https://developers.google.com/oauthplayground
   ```
   ⚠️ **Important:** 
   - Must be `https://` (not `http://`)
   - No trailing slash at the end
   - No spaces before or after
   - Exactly as shown above
   
4. (Optional) Also add this one for alternative tools:
   ```
   https://oauth.pstmn.io/v1/callback
   ```
5. Scroll to bottom and click **"SAVE"** button
6. Wait for confirmation message

### Step 3: Try Again in OAuth Playground

1. Go back to: https://developers.google.com/oauthplayground/
2. Make sure you've configured your credentials (gear icon)
3. Select the Gmail scope again
4. Click "Authorize APIs"
5. It should work now!

## Detailed Steps with Screenshots

### Finding Your OAuth Client

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. You'll see a list of OAuth 2.0 Client IDs
3. Find the one you created (probably named "Zahir Portfolio Contact Form")
4. Click the **pencil/edit icon** on the right

### Adding Redirect URIs

In the edit form, you'll see a section like this:

```
Authorized redirect URIs
┌─────────────────────────────────────────────┐
│ https://oauth.pstmn.io/v1/callback         │
│                                             │
│ [+ ADD URI]                                 │
└─────────────────────────────────────────────┘
```

1. Click **"+ ADD URI"**
2. A new text field will appear
3. Type exactly: `https://developers.google.com/oauthplayground`
4. Press Enter or click outside the field
5. Click **"SAVE"** button at the bottom of the page

### Complete List of Redirect URIs to Add

For OAuth Playground, add:
- `https://developers.google.com/oauthplayground`

For alternative tools, you can also add:
- `https://oauth.pstmn.io/v1/callback`

## Why This Happens

The OAuth Playground uses a specific redirect URI. If that URI isn't in your "Authorized redirect URIs" list, Google blocks the request for security reasons.

## After Fixing

1. Wait 1-2 minutes for changes to propagate
2. Go back to OAuth Playground
3. Try authorizing again
4. You should see the Google sign-in page instead of the error

## Still Not Working?

If you still get the error:

1. **Check the exact redirect URI** - Make sure you copied it exactly (no trailing slashes, correct protocol)
2. **Wait a bit longer** - Sometimes it takes 2-5 minutes for changes to take effect
3. **Clear browser cache** - Try in an incognito/private window
4. **Double-check the OAuth Client** - Make sure you're editing the right one

## Alternative: Use a Different Method

If OAuth Playground continues to cause issues, you can use this alternative:

1. Use the redirect URI: `http://localhost:3000` (or any local URL)
2. Add it to your authorized redirect URIs
3. Use a local OAuth flow instead

But the OAuth Playground method is usually the easiest once you add the correct redirect URI.

