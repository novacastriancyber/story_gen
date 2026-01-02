# Deployment Guide - n8n Story Development System

This guide covers deployment options for the HTML form and production considerations for the n8n workflows.

## Overview

The deployment consists of two parts:

1. **n8n Workflows** - Backend automation (already deployed in n8n)
2. **HTML Form** - Frontend submission interface (needs hosting)

---

## Part 1: Deploying the HTML Form

The form consists of 3 files in the `form/` directory:
- `index.html`
- `styles.css`
- `script.js`

### Option A: GitHub Pages (Recommended for Simple Deployment)

**Pros**: Free, easy setup, automatic HTTPS, GitHub integration
**Cons**: Public repository required for free tier, limited to static sites

#### Steps:

1. **Create GitHub Repository**
   ```bash
   cd path/to/n8n_story_development_implementation_plan
   git add form/
   git commit -m "Add story submission form"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Source: Deploy from branch `main`
   - Folder: Select `/` (root) or create a `/docs` folder and move form files there
   - Click **Save**

3. **Update Form Path** (if needed)
   - If files are in a subfolder, update paths in `index.html`:
   ```html
   <link rel="stylesheet" href="form/styles.css">
   <script src="form/script.js"></script>
   ```

4. **Access Your Form**
   - URL will be: `https://[username].github.io/[repository-name]/form/index.html`
   - Or configure a custom domain

**Time to deploy**: 5-10 minutes

---

### Option B: Netlify (Recommended for Production)

**Pros**: Free tier, automatic deployments, custom domains, form handling, HTTPS
**Cons**: Requires Netlify account

#### Steps:

1. **Sign Up**
   - Go to [Netlify](https://www.netlify.com/)
   - Sign up with GitHub (recommended) or email

2. **Deploy**

   **Method 1: Drag and Drop**
   - Drag the `form/` folder to Netlify's deploy dropzone
   - Wait for deployment (usually < 1 minute)

   **Method 2: Connect Git Repository**
   - Click **New site from Git**
   - Connect to your GitHub repository
   - Build settings:
     - Base directory: `form/`
     - Build command: (leave empty)
     - Publish directory: `/`
   - Click **Deploy site**

3. **Configure Custom Domain** (Optional)
   - Go to **Site settings** → **Domain management**
   - Add custom domain
   - Follow DNS configuration instructions

4. **Update Form Webhook URL**
   - Ensure `script.js` has the correct webhook URL
   - Redeploy if needed

**Time to deploy**: 5-10 minutes

---

### Option C: Vercel

**Pros**: Free tier, excellent performance, automatic deployments, custom domains
**Cons**: Requires Vercel account

#### Steps:

1. **Sign Up**
   - Go to [Vercel](https://vercel.com/)
   - Sign up with GitHub

2. **Deploy**
   - Click **New Project**
   - Import your Git repository
   - Configure:
     - Framework: None (static HTML)
     - Root directory: `form/`
     - Build command: (leave empty)
     - Output directory: `/`
   - Click **Deploy**

3. **Access Your Site**
   - Vercel provides a URL: `https://[project-name].vercel.app`
   - Configure custom domain in settings

**Time to deploy**: 5-10 minutes

---

### Option D: Self-Hosted (Advanced)

**Pros**: Full control, can run on your own infrastructure
**Cons**: Requires server management, SSL certificate setup

#### Option D1: Using Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/story-form;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Optional: Add CORS headers if needed
    add_header Access-Control-Allow-Origin *;
}
```

#### Option D2: Using Apache

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/story-form

    <Directory /var/www/story-form>
        AllowOverride All
        Require all granted
    </Directory>

    # Optional: CORS headers
    Header set Access-Control-Allow-Origin "*"
</VirtualHost>
```

**Time to deploy**: 30-60 minutes (depending on server setup)

---

### Option E: n8n Form Trigger (Alternative)

Instead of hosting a separate HTML form, use n8n's built-in Form trigger:

#### Steps:

1. In Story Initialization workflow, replace the Webhook trigger with **Form Trigger**
2. Configure form fields:
   - book_name (Text)
   - outline_of_story (Textarea, required)
   - genre (Text)
   - number_of_chapters (Number)
   - word_counter_per_chapter (Number)
3. Save and activate
4. n8n generates a form URL automatically

**Pros**: No separate hosting needed, built into n8n
**Cons**: Limited customization, n8n branding, less control over styling

---

## Part 2: n8n Deployment Considerations

### Option A: n8n Cloud (Recommended)

**Already deployed if you're using n8n Cloud!**

#### Production Checklist:

- [ ] Workflows are activated
- [ ] Error notifications configured
- [ ] Execution history retention set
- [ ] Backup workflows regularly (export JSON files)
- [ ] Monitor usage and costs

#### Scaling Considerations:

- n8n Cloud scales automatically
- Check your plan limits (executions per month)
- Upgrade plan if needed for higher volume

---

### Option B: Self-Hosted n8n

If running your own n8n instance:

#### Deployment Methods:

**Docker (Recommended)**

```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

**Docker Compose (Production)**

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password
      - N8N_HOST=your-domain.com
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://your-domain.com/
    volumes:
      - ~/.n8n:/home/node/.n8n
```

**npm (Manual)**

```bash
npm install n8n -g
n8n start
```

---

## Part 3: Production Checklist

### Security

- [ ] **HTTPS Enabled** - Use SSL/TLS for both form and webhooks
- [ ] **Webhook Authentication** - Enable header or query auth in n8n webhook settings
- [ ] **Rate Limiting** - Implement on form submission (prevent spam)
- [ ] **Input Validation** - Webhook validates required fields
- [ ] **API Key Security** - Never expose OpenAI key in frontend
- [ ] **CORS Configuration** - Only allow trusted domains
- [ ] **Error Messages** - Don't expose sensitive information in errors

### Performance

- [ ] **CDN Usage** - Use CDN for static form assets (if applicable)
- [ ] **Workflow Timeouts** - Set appropriate timeouts (5 minutes recommended)
- [ ] **Concurrent Executions** - n8n handles parallel workflows, but monitor
- [ ] **OpenAI Rate Limits** - Respect API limits (consider queuing for high volume)
- [ ] **Caching** - Cache static form resources

### Monitoring

- [ ] **n8n Execution Logs** - Regularly review for errors
- [ ] **Error Notifications** - Set up alerts for failed workflows
- [ ] **OpenAI Usage Monitoring** - Track costs in OpenAI dashboard
- [ ] **Google API Quotas** - Monitor Sheets/Drive API usage
- [ ] **Form Submissions** - Track submission rates and errors

### Backup and Recovery

- [ ] **Workflow Backups** - Export workflows regularly (version control in Git)
- [ ] **Google Sheets Backup** - Enable version history, regular exports
- [ ] **Google Drive Backup** - Enable file versioning
- [ ] **Credential Documentation** - Securely document all credentials (not in code!)
- [ ] **Disaster Recovery Plan** - Know how to restore workflows and data

### Cost Management

- [ ] **OpenAI Usage Limits** - Set monthly spending limits in OpenAI
- [ ] **n8n Plan Limits** - Monitor executions, upgrade if needed
- [ ] **Google API Costs** - Free tier should be sufficient for moderate use
- [ ] **Hosting Costs** - GitHub Pages/Netlify/Vercel free tiers are generous

---

## Part 4: Environment-Specific Configuration

### Development Environment

```javascript
// form/script.js
const WEBHOOK_URL = 'https://localhost:5678/webhook/story-submission';
```

- Use ngrok or similar to expose local n8n for testing
- Keep test data separate from production

### Staging Environment

```javascript
// form/script.js
const WEBHOOK_URL = 'https://staging-n8n.your-company.com/webhook/story-submission';
```

- Mirror production setup
- Test workflow changes before deploying to production

### Production Environment

```javascript
// form/script.js
const WEBHOOK_URL = 'https://n8n.your-company.com/webhook/story-submission';
```

- Fully secured with HTTPS
- All monitoring and backups in place

---

## Part 5: Custom Domain Setup

### For Form Hosting

#### GitHub Pages

1. Add `CNAME` file to repository with your domain
2. Configure DNS:
   ```
   Type: CNAME
   Name: stories (or www)
   Value: [username].github.io
   ```
3. Enable HTTPS in GitHub Pages settings

#### Netlify/Vercel

1. Add domain in platform settings
2. Follow DNS configuration instructions
3. HTTPS is automatic

### For n8n (Self-Hosted)

1. Configure reverse proxy (Nginx/Apache) with SSL
2. Update `N8N_HOST` environment variable
3. Update `WEBHOOK_URL` in environment variables

---

## Part 6: Scaling Considerations

### For Low Volume (< 100 submissions/month)

- n8n Cloud free tier is sufficient
- GitHub Pages/Netlify free tier works
- OpenAI costs: ~$50-100/month

### For Medium Volume (100-1000 submissions/month)

- n8n Cloud paid plan ($20-50/month)
- Netlify/Vercel free or pro tier
- OpenAI costs: ~$500-2000/month
- Consider OpenAI usage limits and batching

### For High Volume (1000+ submissions/month)

- n8n Cloud business plan or self-hosted
- Dedicated hosting for form
- OpenAI enterprise pricing
- Implement queuing system
- Consider caching synopsis/character templates

---

## Part 7: Troubleshooting Production Issues

### Issue: Slow OpenAI Response Times

**Solution**:
- OpenAI API can take 10-30 seconds per workflow
- Increase workflow timeout to 5 minutes
- Consider implementing a queue + status page

### Issue: Exceeded Google API Quota

**Solution**:
- Google Sheets: 100 requests per 100 seconds per user (should be enough)
- Google Drive: 1000 requests per 100 seconds (should be enough)
- If exceeded: implement exponential backoff retry logic

### Issue: CORS Errors on Form Submission

**Solution**:
- Ensure n8n webhook allows CORS (usually automatic in n8n Cloud)
- Self-hosted: Add CORS headers in n8n or reverse proxy
- Check browser console for specific error

---

## Next Steps

1. Choose a deployment option for the form
2. Follow the security checklist
3. Set up monitoring and alerts
4. Review [TESTING_GUIDE.md](./TESTING_GUIDE.md) for production testing
5. Launch and monitor!

---

**Deployment Complete!** 🚀

Your n8n Story Development System is now live in production.

**Last Updated**: January 2026
**System Version**: 1.0.0
