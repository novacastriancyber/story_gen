# Credentials Configuration Guide

This guide walks you through setting up all required credentials for the n8n Story Development System.

## Overview

The system requires 4 types of credentials:

1. **Google Sheets OAuth2** - For storing form submissions
2. **Google Drive OAuth2** - For creating folders and storing generated files
3. **OpenAI API** - For AI content generation
4. **SMTP (Optional)** - For email notifications

---

## 1. Google Sheets Setup

### Step 1: Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Story Development Form Submissions" (or your preferred name)
4. Rename the first sheet to **"Form_Submissions"** (exact name required)

### Step 2: Set Up Column Headers

In the `Form_Submissions` sheet, add these column headers in Row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| story_id | book_name | outline_of_story | genre | number_of_chapters | word_counter_per_chapter | calculated_total_words |

### Step 3: Get the Spreadsheet ID

1. Look at your Google Sheets URL:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123xyz-EXAMPLE-ID/edit
   ```
2. Copy the ID between `/d/` and `/edit`:
   ```
   1ABC123xyz-EXAMPLE-ID
   ```
3. **Save this ID** - you'll need it when configuring the workflow

### Step 4: Create Google Sheets Credential in n8n

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Search for and select **Google Sheets OAuth2 API**
4. Click **Connect my account**
5. Sign in with your Google account
6. Grant the requested permissions
7. Name the credential (e.g., "Google Sheets Account")
8. Save

---

## 2. Google Drive Setup

### Step 1: Create the Stories Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named **"Stories"** (this will be the parent folder)
3. (Optional) Organize this folder in a location that makes sense for you

### Step 2: Get the Folder ID

1. Open the "Stories" folder
2. Look at the URL:
   ```
   https://drive.google.com/drive/folders/1XYZ789abc-EXAMPLE-FOLDER-ID
   ```
3. Copy the ID after `/folders/`:
   ```
   1XYZ789abc-EXAMPLE-FOLDER-ID
   ```
4. **Save this ID** - you'll need it when configuring the workflow

### Step 3: Create Google Drive Credential in n8n

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Search for and select **Google Drive OAuth2 API**
4. Click **Connect my account**
5. Sign in with your Google account (can be the same as Sheets)
6. Grant the requested permissions
7. Name the credential (e.g., "Google Drive Account")
8. Save

### Folder Structure (Auto-Created by Workflow)

Once the system runs, it will create this structure automatically:

```
Stories/                          [You create this manually]
  └── STORY_1234567890/          [Auto-created]
      └── {Book Name}/           [Auto-created]
          ├── synopsis.txt       [Auto-created]
          ├── characters.txt     [Auto-created]
          ├── worldbuilding.txt  [Auto-created]
          └── chapter_plan.txt   [Auto-created]
```

---

## 3. OpenAI API Setup

### Step 1: Get Your OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** (usually at https://platform.openai.com/api-keys)
4. Click **Create new secret key**
5. Name it (e.g., "n8n Story Development")
6. **Copy the key immediately** - you won't be able to see it again!
7. Save it securely

### Step 2: Add Billing Information

1. Go to **Settings** → **Billing**
2. Add a payment method
3. Set up usage limits (recommended: $10-20/month for moderate use)

### Step 3: Understand Model Costs

The workflows use **GPT-4 Turbo** by default:

- **Input**: ~$0.01 per 1K tokens
- **Output**: ~$0.03 per 1K tokens
- **Estimated cost per story**: $0.50 - $2.00

For lower costs, you can edit the workflows to use:
- **GPT-3.5 Turbo**: ~90% cheaper, lower quality
- **GPT-4**: Same price, slightly slower

### Step 4: Create OpenAI Credential in n8n

1. In n8n, go to **Settings** → **Credentials**
2. Click **Add Credential**
3. Search for and select **OpenAI API**
4. Paste your API key
5. Name the credential (e.g., "OpenAI Account")
6. Save

---

## 4. SMTP/Email Setup (Optional)

Email notifications are optional. If you want to send emails when stories are submitted or processed:

### Option A: Gmail (Recommended for Testing)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to [Google Account](https://myaccount.google.com/)
   - **Security** → **2-Step Verification** → **App passwords**
   - Select "Mail" and "Other" (name it "n8n")
   - Copy the 16-character password

3. In n8n, create **SMTP** credential:
   - **Host**: `smtp.gmail.com`
   - **Port**: `465`
   - **Secure**: Yes (SSL/TLS)
   - **User**: Your Gmail address
   - **Password**: The app password (16 characters, no spaces)

### Option B: SendGrid (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Use SendGrid's SMTP settings:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587`
   - **User**: `apikey`
   - **Password**: Your SendGrid API key

### Option C: Other SMTP Providers

You can use any SMTP service:
- **AWS SES**
- **Mailgun**
- **Postmark**
- **Your own mail server**

Just configure the SMTP credential with the provider's settings.

---

## 5. Credential Reference Table

When you import the workflows, you'll need to update credential placeholders:

| Placeholder | Replace With | Where to Find |
|-------------|--------------|---------------|
| `{{GOOGLE_SHEETS_CREDENTIAL_ID}}` | Your Google Sheets credential name | n8n Settings → Credentials |
| `{{GOOGLE_DRIVE_CREDENTIAL_ID}}` | Your Google Drive credential name | n8n Settings → Credentials |
| `{{OPENAI_CREDENTIAL_ID}}` | Your OpenAI credential name | n8n Settings → Credentials |
| `{{EMAIL_CREDENTIAL_ID}}` | Your SMTP credential name (if using email) | n8n Settings → Credentials |

**Note**: n8n will automatically prompt you to select credentials when you import the workflows. You don't need to manually edit these placeholders - just select the appropriate credential from the dropdown.

---

## 6. Required Scopes and Permissions

### Google Sheets OAuth2 Scopes

The credential needs these permissions:
- `https://www.googleapis.com/auth/spreadsheets` - Read/write spreadsheets
- `https://www.googleapis.com/auth/drive.file` - Access files created by the app

### Google Drive OAuth2 Scopes

The credential needs these permissions:
- `https://www.googleapis.com/auth/drive.file` - Create and modify files/folders
- `https://www.googleapis.com/auth/drive` - Full drive access (optional, for broader access)

These are typically granted automatically when you connect your account through n8n.

---

## 7. Security Best Practices

1. **Never commit credentials to version control**
2. **Use different credentials for development vs production**
3. **Rotate API keys regularly** (every 90 days recommended)
4. **Set usage limits** on OpenAI to prevent unexpected charges
5. **Restrict Google Sheet/Drive access** to only the necessary folders
6. **Enable 2FA** on all accounts (Google, OpenAI)
7. **Monitor usage** regularly through each service's dashboard

---

## 8. Troubleshooting

### Google Sheets/Drive: "Insufficient permissions" Error

**Solution**: Re-authenticate the credential and ensure all scopes are granted.

### OpenAI: "Invalid API Key" Error

**Solution**:
- Verify the key was copied correctly (no extra spaces)
- Check if the key has been revoked
- Ensure billing is set up in OpenAI

### OpenAI: "Rate limit exceeded" Error

**Solution**:
- Wait a few minutes and retry
- Check your OpenAI usage limits
- Consider upgrading your OpenAI plan

### SMTP: "Authentication failed" Error

**Solution**:
- For Gmail: Ensure you're using an App Password, not your regular password
- Verify username/password are correct
- Check that the SMTP host and port are correct
- Ensure SSL/TLS settings match your provider's requirements

---

## Next Steps

Once all credentials are configured:

1. Proceed to [SETUP_GUIDE.md](./SETUP_GUIDE.md) to import and configure the workflows
2. Test each credential individually before running the full system
3. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md) for validation procedures

---

**Last Updated**: January 2026
**System Version**: 1.0.0
