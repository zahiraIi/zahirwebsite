# Step-by-Step: Implement Gmail API for Contact Form

Follow these steps to get your contact form working with Gmail API.

## Quick Setup (15-20 minutes)

### Step 1: Google Cloud Console Setup (5 min)

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account (use the Gmail account you want to send from)

2. **Create or Select Project**
   - Click the project dropdown at the top
   - Click "New Project" or select an existing one
   - Name it: "Zahir Portfolio" (or any name)

3. **Enable Gmail API**
   - Go to: https://console.cloud.google.com/apis/library/gmail.googleapis.com
   - Click "ENABLE"

### Step 2: Configure OAuth Consent Screen (5 min)

1. **Go to OAuth Consent Screen**
   - Navigate to: https://console.cloud.google.com/apis/credentials/consent
   - Select "External" (unless you have Google Workspace)
   - Click "CREATE"

2. **Fill App Information**
   
   You'll see a form with several fields. Here's what to fill in:
   
   **App name** (required):
   - Type: `Zahir Ali Portfolio`
   - This is what users will see when authorizing your app
   
   **User support email** (required):
   - Click the dropdown and select: `z5ali@ucsd.edu`
   - Or type: `z5ali@ucsd.edu`
   - This is the email users can contact if they have questions
   
   **App logo** (optional):
   - You can skip this for now
   - Click "UPLOAD" if you want to add a logo later
   
   **Application home page** (optional):
   - Type: `https://zahirali.com`
   - This is your website URL
   
   **Application privacy policy link** (optional):
   - You can skip this for personal use
   - Or add: `https://zahirali.com` (if you have a privacy policy)
   
   **Application terms of service link** (optional):
   - You can skip this for personal use
   
   **Authorized domains** (optional):
   - You can skip this for personal use
   
   **Developer contact information** (required):
   - Type: `z5ali@ucsd.edu`
   - This is where Google will send important notifications
   
   **Click "SAVE AND CONTINUE"** button at the bottom

3. **Add Scopes**
   - Click "ADD OR REMOVE SCOPES"
   - Search for: `gmail.send`
   - Check: `https://www.googleapis.com/auth/gmail.send`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

4. **Add Test Users** ⚠️ CRITICAL - THIS FIXES "Error 403: access_denied"
   
   **This step is ESSENTIAL!** If you skip this, you'll get "Error 403: access_denied"
   
   - Scroll to "Test users" section
   - Click "+ ADD USERS" button
   - **Add the EXACT Gmail address you'll use to sign in**
   - Example: If you'll sign in as `zahirali986@gmail.com`, add that
   - Or if using `z5ali@ucsd.edu`, add that
   - **Important:** Use the email you'll actually sign in with in OAuth Playground
   - Click "ADD"
   - Verify your email appears in the test users list
   - Click "SAVE AND CONTINUE"

5. **Review and Go Back**
   - Click "BACK TO DASHBOARD"
   - **Important:** Your app will be in "Testing" mode - this is PERFECT for personal use!
   - **You do NOT need to verify or publish** - Testing mode works forever
   - If you see "Verification required" messages, you can ignore them

### Step 3: Create OAuth Credentials (3 min)

1. **Go to Credentials**
   - Navigate to: https://console.cloud.google.com/apis/credentials
   - Click "+ CREATE CREDENTIALS"
   - Select "OAuth client ID"

2. **Configure OAuth Client**
   - Application type: "Web application"
   - Name: `Zahir Portfolio Contact Form`
   - Authorized redirect URIs: Click "ADD URI" for each:
     - Add: `https://developers.google.com/oauthplayground` ⚠️ IMPORTANT
     - Add: `https://oauth.pstmn.io/v1/callback` (optional, for alternative tools)
   - Click "CREATE"
   
   **⚠️ Note:** Make sure to add `https://developers.google.com/oauthplayground` - this is required for OAuth Playground to work!

3. **Save Credentials** ⚠️ IMPORTANT
   - **Copy the Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - **Copy the Client Secret** (looks like: `GOCSPX-abc123...`)
   - Save these somewhere safe - you'll need them in Step 5

### Step 4: Get Refresh Token (5 min)

1. **Open OAuth Playground**
   - Go to: https://developers.google.com/oauthplayground/

2. **Configure Playground**
   - Click the gear icon (⚙️) in top right
   - ✅ Check "Use your own OAuth credentials"
   - Paste your **Client ID**
   - Paste your **Client Secret**
   - Click "Close"

3. **Authorize**
   - In left panel, scroll to "Gmail API v1"
   - Check: `https://www.googleapis.com/auth/gmail.send`
   - Click "Authorize APIs" button
   - **Sign in with the SAME Gmail account you added as test user**
   - Click "Allow" to grant permissions

4. **Get Refresh Token**
   - Click "Exchange authorization code for tokens"
   - In the response, find `"refresh_token": "1//abc123..."`
   - **Copy the refresh_token value** (the long string)
   - Save this - you'll need it in Step 5

### Step 5: Add Environment Variables to Vercel (2 min)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project (zahirwebsite)

2. **Navigate to Settings**
   - Click "Settings" tab
   - Click "Environment Variables" in left sidebar

3. **Add Variables**
   Click "Add New" for each:

   **Variable 1:**
   - Name: `GMAIL_CLIENT_ID`
   - Value: (paste your Client ID from Step 3)
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

   **Variable 2:**
   - Name: `GMAIL_CLIENT_SECRET`
   - Value: (paste your Client Secret from Step 3)
   - Environment: Select all
   - Click "Save"

   **Variable 3:**
   - Name: `GMAIL_REFRESH_TOKEN`
   - Value: (paste your refresh token from Step 4)
   - Environment: Select all
   - Click "Save"

   **Variable 4:**
   - Name: `GMAIL_RECIPIENT_EMAIL`
   - Value: `z5ali@ucsd.edu`
   - Environment: Select all
   - Click "Save"

   **Variable 5 (Optional):**
   - Name: `GMAIL_FROM_EMAIL`
   - Value: `z5ali@ucsd.edu` (or your Gmail address)
   - Environment: Select all
   - Click "Save"

4. **Redeploy** ⚠️ IMPORTANT
   - Go to "Deployments" tab
   - Click the three dots (⋯) on latest deployment
   - Click "Redeploy"
   - Or push a new commit to trigger redeploy

### Step 6: Test the Contact Form

1. **Visit your website**
   - Go to: https://zahirali.com (or your domain)

2. **Test the form**
   - Click the email icon
   - Fill out the form:
     - Name: Test User
     - Email: test@example.com
     - Message: This is a test message
   - Click "Send Message"

3. **Check for success**
   - You should see: "Message sent successfully!"
   - Check your email inbox (z5ali@ucsd.edu)
   - You should receive the email

## Important: About App Verification

**You DON'T need to verify your app for personal use!**

- Your app can stay in "Testing" mode forever
- Testing mode is perfect for personal portfolio sites
- Only test users (you) can use it - which is exactly what you want
- No verification, no publishing, no complex process needed

If you see "Verification required" messages, you can safely ignore them. Just make sure you're added as a test user and you're good to go!

See `NO_VERIFICATION_NEEDED.md` for more details.

## Troubleshooting

### "Error 400: redirect_uri_mismatch" ⚠️ COMMON

**This means the redirect URI isn't authorized. Quick fix:**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click the edit icon (✏️) on your OAuth Client ID
3. Under "Authorized redirect URIs", click "+ ADD URI"
4. Add exactly: `https://developers.google.com/oauthplayground`
5. Click "SAVE"
6. Wait 1-2 minutes, then try OAuth Playground again

See `FIX_REDIRECT_URI_ERROR.md` for detailed instructions.

### "Error 403: access_denied" - "App is currently being tested" ⚠️ COMMON

**This means your email isn't in the test users list. Quick fix:**

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Scroll to "Test users" section
3. Click "+ ADD USERS"
4. Add your email: `zahirali986@gmail.com` (or whatever email you're using)
5. Click "ADD"
6. Wait 5-10 minutes
7. Sign in with that email in OAuth Playground
8. Try authorizing again

See `FIX_403_ACCESS_DENIED.md` for detailed instructions.

### "Access blocked" error (other types)
- Make sure you added your Gmail address as a test user in Step 2
- Wait 5-10 minutes after adding test user
- Generate a new refresh token

### "Email service not configured"
- Check that all environment variables are set in Vercel
- Make sure you redeployed after adding variables

### "Failed to get access token"
- Verify your Client ID and Client Secret are correct
- Check that refresh token hasn't expired
- Make sure you're using the same Gmail account

### Emails not received
- Check spam folder
- Verify GMAIL_RECIPIENT_EMAIL is correct
- Check Vercel function logs for errors

## Check Vercel Function Logs

1. Go to Vercel Dashboard > Your Project
2. Click "Functions" tab
3. Click on `/api/send-email`
4. Check "Logs" tab for any errors

## Need Help?

If you encounter issues:
1. Check the error message in the contact form
2. Check Vercel function logs
3. Verify all environment variables are set correctly
4. Make sure you redeployed after adding variables

