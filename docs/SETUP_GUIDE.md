# Setup Guide - n8n Story Development System

This guide walks you through the complete setup process, from importing workflows to testing your first story submission.

## Prerequisites

Before you begin, ensure you have:

- [ ] An n8n instance (Cloud or self-hosted) - [Sign up at n8n.io](https://n8n.io)
- [ ] Completed [CREDENTIALS_CONFIG.md](./CREDENTIALS_CONFIG.md) and have all credentials ready
- [ ] Google Sheets spreadsheet ID
- [ ] Google Drive "Stories" folder ID
- [ ] Access to the 5 workflow JSON files in the `workflows/` directory

---

## Step 1: Import Workflows

Import workflows **in this order** (important for dependency resolution):

### 1.1 Import Story Initialization Workflow

1. In n8n, click **Workflows** → **Add workflow** → **Import from File**
2. Select `workflows/01_story_initialization.json`
3. Click **Import**

### 1.2 Import Downstream Workflows

Repeat the import process for each workflow:

1. `workflows/02_synopsis_development.json`
2. `workflows/03_character_development.json`
3. `workflows/04_worldbuilding_development.json`
4. `workflows/05_chapter_planning.json`

**Result**: You should now have 5 workflows in your n8n instance.

---

## Step 2: Configure Credentials

For each workflow, you need to assign credentials to the appropriate nodes.

### 2.1 Story Initialization Workflow

1. Open the **Story Initialization Workflow**
2. Click on the **Google Sheets - Insert Submission** node
3. In the **Credentials** dropdown, select your Google Sheets credential
4. Click on both **Google Drive** nodes (Create Story Folder, Create Book Folder)
5. In the **Credentials** dropdown for each, select your Google Drive credential
6. If you included an Email node, select your SMTP credential
7. Click **Save** (top right)

### 2.2 Synopsis Development Workflow

1. Open the **Synopsis Development Workflow**
2. Click on the **OpenAI - Generate Synopsis** node
3. Select your OpenAI API credential
4. Click on the **Google Drive - Upload Synopsis** node
5. Select your Google Drive credential
6. Click **Save**

### 2.3 Character Development Workflow

1. Open the **Character Development Workflow**
2. Assign OpenAI credential to the OpenAI node
3. Assign Google Drive credential to the Google Drive node
4. Click **Save**

### 2.4 Worldbuilding Development Workflow

1. Open the **Worldbuilding Development Workflow**
2. Assign OpenAI credential to the OpenAI node
3. Assign Google Drive credential to the Google Drive node
4. Click **Save**

### 2.5 Chapter Planning Workflow

1. Open the **Chapter Planning Workflow**
2. Assign OpenAI credential to the OpenAI node
3. Assign Google Drive credential to the Google Drive node
4. Click **Save**

---

## Step 3: Activate Workflows and Get Webhook URLs

Each workflow needs to be activated to generate its webhook URL.

### 3.1 Activate Downstream Workflows First

**Important**: Activate workflows 2-5 BEFORE workflow 1, so you have their webhook URLs.

#### Synopsis Development Workflow

1. Open the **Synopsis Development Workflow**
2. Click the **Activate** toggle (top right) - it should turn green
3. Click on the **Webhook - Synopsis Trigger** node
4. Click **"Listen for Test Event"** or **"Copy webhook URL"**
5. **Copy the full webhook URL** - it will look like:
   ```
   https://your-n8n-instance.app.n8n.cloud/webhook/synopsis-development
   ```
6. **Save this URL** - you'll need it in Step 4

#### Repeat for Other Workflows

Repeat the process above for:
- **Character Development Workflow** → Get webhook URL
- **Worldbuilding Development Workflow** → Get webhook URL
- **Chapter Planning Workflow** → Get webhook URL

**Result**: You should now have 4 webhook URLs saved.

---

## Step 4: Configure Story Initialization Workflow

Now update the Story Initialization workflow with the webhook URLs and IDs.

### 4.1 Update Google Sheets ID

1. Open the **Story Initialization Workflow**
2. Click on the **Google Sheets - Insert Submission** node
3. In the **Document** field:
   - If using **ID mode**: Paste your Google Sheets spreadsheet ID
   - If using **URL mode**: Paste the full Google Sheets URL
4. Verify the **Sheet** is set to "Form_Submissions"

### 4.2 Update Google Drive Folder ID

1. Click on the **Google Drive - Create Story Folder** node
2. In the **Parent Folder** field:
   - Paste your "Stories" folder ID
   - Or use the folder picker if available

### 4.3 Update Webhook URLs for Downstream Workflows

Update each of the 4 HTTP Request nodes:

#### Trigger Synopsis Workflow Node

1. Click on the **Trigger Synopsis Workflow** node
2. In the **URL** field, replace:
   ```
   {{PLACEHOLDER_SYNOPSIS_WEBHOOK_URL}}
   ```
   with your actual Synopsis webhook URL:
   ```
   https://your-n8n-instance.app.n8n.cloud/webhook/synopsis-development
   ```

#### Trigger Character Workflow Node

1. Click on the **Trigger Character Workflow** node
2. Replace `{{PLACEHOLDER_CHARACTER_WEBHOOK_URL}}` with the Character webhook URL

#### Trigger Worldbuilding Workflow Node

1. Click on the **Trigger Worldbuilding Workflow** node
2. Replace `{{PLACEHOLDER_WORLDBUILDING_WEBHOOK_URL}}` with the Worldbuilding webhook URL

#### Trigger Chapter Planning Workflow Node

1. Click on the **Trigger Chapter Planning Workflow** node
2. Replace `{{PLACEHOLDER_CHAPTER_WEBHOOK_URL}}` with the Chapter Planning webhook URL

### 4.4 Save and Activate

1. Click **Save** (top right)
2. Click **Activate** toggle to turn it green

---

## Step 5: Get Story Initialization Webhook URL

1. In the **Story Initialization Workflow**
2. Click on the **Webhook - Story Submission** node
3. Click **"Listen for Test Event"** or **"Copy webhook URL"**
4. **Copy the webhook URL** - this is what the form will submit to:
   ```
   https://your-n8n-instance.app.n8n.cloud/webhook/story-submission
   ```
5. **Save this URL** - you'll need it for the form

---

## Step 6: Configure the HTML Form

1. Open `form/script.js` in a text editor
2. Find this line at the top:
   ```javascript
   const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/story-submission';
   ```
3. Replace it with your actual Story Initialization webhook URL:
   ```javascript
   const WEBHOOK_URL = 'https://your-n8n-instance.app.n8n.cloud/webhook/story-submission';
   ```
4. Save the file

---

## Step 7: Test the System

### 7.1 Test Each Workflow Individually

Before testing end-to-end, verify each workflow works:

#### Test Synopsis Workflow

1. Open **Synopsis Development Workflow**
2. Click **"Execute Workflow"** manually
3. Or use a tool like Postman/curl to POST to the webhook:
   ```bash
   curl -X POST https://your-n8n-instance.app.n8n.cloud/webhook/synopsis-development \
     -H "Content-Type: application/json" \
     -d '{
       "story_id": "TEST_001",
       "book_name": "Test Story",
       "outline_of_story": "A test story about testing",
       "genre": "Testing",
       "number_of_chapters": 10,
       "word_counter_per_chapter": 1000,
       "calculated_total_words": 10000,
       "drive_folder_id": "YOUR_TEST_FOLDER_ID"
     }'
   ```
4. Check that synopsis was generated and saved to Google Drive

#### Test Other Workflows

Repeat similar tests for Character, Worldbuilding, and Chapter Planning workflows.

### 7.2 Test End-to-End via Form

1. Open `form/index.html` in a web browser (or deploy it - see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md))
2. Fill out the form:
   - **Book Name**: "The Crystal Quest"
   - **Outline of Story**: "A young wizard discovers ancient crystals that hold the power to reshape reality. She must learn to master their power before a dark sorcerer uses them to destroy the world."
   - **Genre**: "Fantasy"
   - **Number of Chapters**: 20
   - **Word Counter per Chapter**: 3000
3. Click **Submit Story Idea**
4. You should see a success message with the Story ID

### 7.3 Verify Results

Check that everything worked:

1. **Google Sheets**:
   - Open your Form_Submissions spreadsheet
   - Verify a new row was added with all 7 columns filled

2. **Google Drive**:
   - Open your Stories folder
   - You should see a new folder: `STORY_[timestamp]/The Crystal Quest/`
   - Inside, you should eventually see 4 files:
     - `synopsis.txt`
     - `characters.txt`
     - `worldbuilding.txt`
     - `chapter_plan.txt`

3. **n8n Execution Log**:
   - Go to **Executions** in n8n
   - You should see 5 successful executions (1 for each workflow)
   - Click on each to see the data flow and verify no errors

---

## Step 8: Troubleshooting

### Common Issues and Solutions

#### Issue: "Webhook not found" Error

**Solution**:
- Ensure the workflow is **activated** (toggle is green)
- Double-check the webhook URL is correct
- Try deactivating and reactivating the workflow

#### Issue: Google Sheets "Invalid range" Error

**Solution**:
- Verify the sheet name is exactly "Form_Submissions" (case-sensitive)
- Check that the spreadsheet ID is correct
- Ensure the credential has access to the spreadsheet

#### Issue: Google Drive "Folder not found" Error

**Solution**:
- Verify the Stories folder ID is correct
- Check that the credential has access to the folder
- Ensure the folder isn't in Trash

#### Issue: OpenAI "Invalid API key" Error

**Solution**:
- Verify the API key is correct (no extra spaces)
- Check that billing is set up in OpenAI
- Ensure the key hasn't been revoked

#### Issue: Workflows trigger but content isn't generated

**Solution**:
- Check n8n execution logs for errors
- Verify OpenAI API key has sufficient credits
- Check if requests are being rate-limited (wait and retry)

#### Issue: Form submission fails with CORS error

**Solution**:
- If testing locally: Use a local server (not `file://` protocol)
- In n8n Cloud: CORS is handled automatically
- In self-hosted n8n: Configure CORS settings in n8n configuration

---

## Step 9: Workflow Execution Logs

Monitor your workflows:

1. In n8n, go to **Executions**
2. You'll see all workflow runs
3. Click on any execution to see:
   - Input data
   - Node-by-node execution
   - Output data
   - Any errors

**Tip**: Set up error notifications in n8n Settings to get alerted when workflows fail.

---

## Step 10: Optional Enhancements

### Enable Error Notifications

1. In n8n, go to **Settings** → **Workflow Settings**
2. Enable **Error Workflow**
3. Create an error handler workflow that sends you email/Slack notifications

### Add Workflow Descriptions

For each workflow:
1. Click **Workflow Settings** (gear icon)
2. Add a description and tags
3. This helps with organization

### Set Execution Timeouts

For long-running workflows (especially with OpenAI):
1. Go to **Workflow Settings**
2. Set **Execution Timeout** to 300 seconds (5 minutes)
3. This prevents workflows from running indefinitely

---

## Next Steps

1. Review [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) to deploy the form to production
2. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md) for comprehensive testing procedures
3. Start using the system for real story development!

---

## Configuration Checklist

Before going live, ensure:

- [ ] All 5 workflows imported successfully
- [ ] All credentials configured and working
- [ ] All 4 downstream webhook URLs updated in Story Initialization
- [ ] Google Sheets ID updated
- [ ] Google Drive folder ID updated
- [ ] Form webhook URL updated in `script.js`
- [ ] Tested each workflow individually
- [ ] Tested end-to-end form submission
- [ ] Verified Google Sheets entry
- [ ] Verified Google Drive folder creation
- [ ] Verified all 4 content files generated
- [ ] Reviewed execution logs for errors

---

**Setup Complete!** 🎉

Your n8n Story Development System is now ready to use.

**Last Updated**: January 2026
**System Version**: 1.0.0
