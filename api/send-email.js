/**
 * Vercel Serverless Function for sending emails via Gmail API
 * 
 * This endpoint handles contact form submissions and sends emails using Gmail API.
 * 
 * Required Environment Variables:
 * - GMAIL_CLIENT_EMAIL: Service account email (or OAuth client email)
 * - GMAIL_PRIVATE_KEY: Private key for service account (base64 encoded or raw)
 * - GMAIL_RECIPIENT_EMAIL: Email address to receive messages (z5ali@ucsd.edu)
 * 
 * For OAuth 2.0 setup, you'll also need:
 * - GMAIL_CLIENT_ID: OAuth 2.0 client ID
 * - GMAIL_CLIENT_SECRET: OAuth 2.0 client secret
 * - GMAIL_REFRESH_TOKEN: OAuth 2.0 refresh token
 */

/**
 * Encode email content in RFC 2822 format
 * @param {Object} params - Email parameters
 * @returns {string} Encoded email string
 */
function encodeEmail({ from, to, subject, text }) {
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    text
  ];
  
  return lines.join('\r\n');
}

/**
 * Get OAuth 2.0 access token using refresh token
 * @param {string} clientId - OAuth client ID
 * @param {string} clientSecret - OAuth client secret
 * @param {string} refreshToken - OAuth refresh token
 * @returns {Promise<string>} Access token
 */
async function getAccessToken(clientId, clientSecret, refreshToken) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Send email using Gmail API with OAuth 2.0
 * @param {Object} params - Email parameters
 * @returns {Promise<Object>} Gmail API response
 */
async function sendEmailWithOAuth({
  accessToken,
  from,
  to,
  subject,
  message
}) {
  const emailContent = encodeEmail({
    from,
    to,
    subject,
    text: message
  });

  // Base64 encode the email (URL-safe)
  const encodedEmail = Buffer.from(emailContent)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        raw: encodedEmail,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gmail API error: ${JSON.stringify(error)}`);
  }

  return await response.json();
}

/**
 * Send email using Gmail API with Service Account
 * Note: Service account support requires google-auth-library package
 * For now, we recommend using OAuth 2.0 method for personal Gmail accounts
 * @param {Object} params - Email parameters
 * @returns {Promise<Object>} Gmail API response
 */
async function sendEmailWithServiceAccount({
  clientEmail,
  privateKey,
  from,
  to,
  subject,
  message
}) {
  // Service account authentication requires google-auth-library
  // Install it with: npm install google-auth-library
  // Then uncomment and use the code below
  
  /*
  const { GoogleAuth } = await import('google-auth-library');
  
  const auth = new GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/gmail.send'],
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();

  if (!accessToken.token) {
    throw new Error('Failed to obtain access token from service account');
  }

  return sendEmailWithOAuth({
    accessToken: accessToken.token,
    from,
    to,
    subject,
    message
  });
  */
  
  throw new Error(
    'Service account authentication is not fully implemented. ' +
    'Please use OAuth 2.0 method (recommended for personal Gmail accounts) ' +
    'or install google-auth-library and uncomment the service account code.'
  );
}

/**
 * Main handler function
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get request body
    const { name, email, subject, message, to } = req.body;

    // Validate required fields (subject is optional now, defaults to "Contact Form Submission")
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, and message are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Get recipient email (from env or request)
    const recipientEmail = process.env.GMAIL_RECIPIENT_EMAIL || to || 'z5ali@ucsd.edu';
    
    // Use provided subject or default
    const emailSubject = subject || 'Contact Form Submission';
    
    // Format the email message
    const formattedMessage = `
From: ${name} <${email}>

${message}

---
This message was sent from the contact form on zahirali.com
    `.trim();

    // Determine authentication method and send email
    let result;

    // Method 1: OAuth 2.0 (preferred for personal Gmail accounts)
    if (
      process.env.GMAIL_CLIENT_ID &&
      process.env.GMAIL_CLIENT_SECRET &&
      process.env.GMAIL_REFRESH_TOKEN
    ) {
      const accessToken = await getAccessToken(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REFRESH_TOKEN
      );

      result = await sendEmailWithOAuth({
        accessToken,
        from: process.env.GMAIL_FROM_EMAIL || recipientEmail,
        to: recipientEmail,
        subject: `Contact Form: ${emailSubject}`,
        message: formattedMessage
      });
    }
    // Method 2: Service Account (for Google Workspace)
    else if (
      process.env.GMAIL_CLIENT_EMAIL &&
      process.env.GMAIL_PRIVATE_KEY
    ) {
      result = await sendEmailWithServiceAccount({
        clientEmail: process.env.GMAIL_CLIENT_EMAIL,
        privateKey: process.env.GMAIL_PRIVATE_KEY,
        from: process.env.GMAIL_FROM_EMAIL || recipientEmail,
        to: recipientEmail,
        subject: `Contact Form: ${emailSubject}`,
        message: formattedMessage
      });
    }
    // No credentials configured
    else {
      console.error('Gmail API credentials not configured');
      return res.status(500).json({
        error: 'Email service not configured. Please set up Gmail API credentials.'
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      messageId: result.id,
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: error.message || 'Failed to send email'
    });
  }
}

