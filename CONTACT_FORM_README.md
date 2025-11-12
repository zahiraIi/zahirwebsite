# Contact Form Integration

The contact form has been successfully integrated into your website. When users click the email icon, they'll see a beautiful modal form to send you messages.

## What's Been Added

1. **Contact Form Component** (`js/components/ContactForm.js`)
   - Modal form with name, email, subject, and message fields
   - Client-side validation
   - Loading states and success/error messages

2. **Gmail API Endpoint** (`api/send-email.js`)
   - Vercel serverless function
   - Supports OAuth 2.0 authentication (recommended)
   - Supports Service Account authentication (for Google Workspace)

3. **Updated Email Button** (`index.html`)
   - Changed from `mailto:` link to button that opens contact form
   - Maintains the same visual appearance

4. **Initialization** (`js/app.js`)
   - Contact form is automatically initialized on page load
   - Email button is connected to open the form

## Quick Setup

1. **Follow the Gmail API setup guide**: See `GMAIL_API_SETUP.md` for detailed instructions

2. **Set environment variables in Vercel**:
   ```
   GMAIL_CLIENT_ID=your_client_id
   GMAIL_CLIENT_SECRET=your_client_secret
   GMAIL_REFRESH_TOKEN=your_refresh_token
   GMAIL_RECIPIENT_EMAIL=z5ali@ucsd.edu
   ```

3. **Deploy to Vercel** - The API endpoint will be available at `/api/send-email`

## How It Works

1. User clicks the email icon
2. Contact form modal opens
3. User fills out the form
4. Form submits to `/api/send-email`
5. Serverless function authenticates with Gmail API
6. Email is sent to `z5ali@ucsd.edu`
7. User sees success message

## Testing Locally

For local testing, you'll need to:

1. Set up a local development server that can handle the API route
2. Or use Vercel CLI: `vercel dev` to test serverless functions locally
3. Or test directly on the deployed Vercel site

## Features

- ✅ Beautiful, responsive modal design
- ✅ Form validation (client-side)
- ✅ Loading states during submission
- ✅ Success/error messages
- ✅ Auto-closes on success
- ✅ Accessible (keyboard navigation, ARIA labels)
- ✅ Mobile-friendly

## Next Steps

1. Complete Gmail API setup (see `GMAIL_API_SETUP.md`)
2. Test the form on your deployed site
3. Monitor Vercel function logs for any issues

## Troubleshooting

If the form doesn't work:

1. Check browser console for errors
2. Check Vercel function logs (Dashboard > Functions)
3. Verify environment variables are set correctly
4. Ensure Gmail API is enabled in Google Cloud Console
5. Check that OAuth consent screen is configured

For detailed troubleshooting, see `GMAIL_API_SETUP.md`.

