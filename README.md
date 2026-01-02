# n8n Story Development System

An automated story development platform that uses AI to transform basic story ideas into comprehensive development documents including synopsis, characters, worldbuilding, and chapter-by-chapter outlines.

## Overview

This system provides a complete workflow automation solution for writers, publishers, and content creators to rapidly develop story concepts into structured narratives ready for writing.

**What it does:**

1. Accepts story idea submissions via web form
2. Generates unique Story ID and organizes data in Google Sheets
3. Creates structured Google Drive folder for all generated content
4. Uses OpenAI GPT-4 to generate:
   - **Detailed 3-Act Synopsis** with plot progression
   - **Character Profiles** with backstories, arcs, and relationships
   - **Worldbuilding Documentation** covering setting, culture, history, and more
   - **Chapter-by-Chapter Outlines** with scenes, beats, and pacing
5. Stores all generated content as organized text files in Google Drive

## System Architecture

```
HTML Form
   ↓
Story Initialization (n8n)
   ├─ Generate Story ID
   ├─ Save to Google Sheets
   ├─ Create Drive Folders
   └─ Trigger 4 AI Workflows ↓
       ├─ Synopsis Development (OpenAI → Drive)
       ├─ Character Development (OpenAI → Drive)
       ├─ Worldbuilding Development (OpenAI → Drive)
       └─ Chapter Planning (OpenAI → Drive)
```

## Key Features

- **Automated Workflow**: Complete story development happens automatically
- **AI-Powered**: Leverages OpenAI GPT-4 for high-quality content generation
- **Organized Storage**: All content stored in structured Google Drive folders
- **Data Tracking**: Submission data logged in Google Sheets
- **Flexible Input**: Only story outline required, all other fields optional
- **Production Ready**: Includes complete documentation and deployment guides

## Quick Start

### Prerequisites

- n8n instance ([Sign up at n8n.io](https://n8n.io))
- Google account (for Sheets and Drive)
- OpenAI API account ([Get API key](https://platform.openai.com/))

### Installation (5 Steps)

1. **Set up credentials** → Follow [docs/CREDENTIALS_CONFIG.md](./docs/CREDENTIALS_CONFIG.md)
2. **Import workflows** → Import 5 JSON files from `workflows/` folder
3. **Configure webhooks** → Follow [docs/SETUP_GUIDE.md](./docs/SETUP_GUIDE.md)
4. **Deploy form** → Host files from `form/` folder (see [docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md))
5. **Test** → Submit a story and verify results (see [docs/TESTING_GUIDE.md](./docs/TESTING_GUIDE.md))

## File Structure

```
├── workflows/                          # n8n workflow JSON files
│   ├── 01_story_initialization.json    # Main orchestration hub
│   ├── 02_synopsis_development.json    # AI synopsis generation
│   ├── 03_character_development.json   # AI character profiles
│   ├── 04_worldbuilding_development.json # AI world documentation
│   └── 05_chapter_planning.json        # AI chapter outlines
│
├── form/                               # HTML submission form
│   ├── index.html                      # Form structure
│   ├── styles.css                      # Form styling
│   └── script.js                       # Submission logic
│
├── docs/                               # Documentation
│   ├── CREDENTIALS_CONFIG.md           # Credential setup guide
│   ├── SETUP_GUIDE.md                  # Step-by-step installation
│   ├── DEPLOYMENT_GUIDE.md             # Production deployment
│   └── TESTING_GUIDE.md                # Testing procedures
│
├── CLAUDE.md                           # Claude Code guidance
├── README.md                           # This file
└── n8n_implementation_plan_revision_summary.md  # Implementation details
```

## Form Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| **book_name** | Text | No | Title of the book/story |
| **outline_of_story** | Textarea | **YES** | Story outline or concept (only required field) |
| **genre** | Text | No | Genre (Fantasy, Sci-Fi, Mystery, etc.) |
| **number_of_chapters** | Number | No | Target number of chapters |
| **word_counter_per_chapter** | Number | No | Target words per chapter |

**Calculated Field**: `total_words` = `number_of_chapters × word_counter_per_chapter`

## Generated Content

Each story submission creates:

```
Google Drive/Stories/
└── STORY_[timestamp]/
    └── [Book Name]/
        ├── [story_id]_synopsis.txt          # 3-act synopsis
        ├── [story_id]_characters.txt        # Character profiles
        ├── [story_id]_worldbuilding.txt     # World documentation
        └── [story_id]_chapter_plan.txt      # Chapter outlines
```

## Technology Stack

- **n8n** - Workflow automation platform
- **OpenAI GPT-4** - AI content generation
- **Google Sheets** - Data storage and tracking
- **Google Drive** - File storage and organization
- **HTML/CSS/JavaScript** - Form frontend

## Cost Estimate

Per story submission:
- **OpenAI API**: $0.50 - $2.00 (4 GPT-4 API calls)
- **Google Sheets/Drive**: Free (within quotas)
- **n8n**: Included in plan
- **Form Hosting**: Free (GitHub Pages/Netlify)

**Estimated monthly cost for 50 stories**: $25-100 in OpenAI credits

## Documentation

### Getting Started
- [CREDENTIALS_CONFIG.md](./docs/CREDENTIALS_CONFIG.md) - Set up Google Sheets, Google Drive, OpenAI, and SMTP credentials
- [SETUP_GUIDE.md](./docs/SETUP_GUIDE.md) - Complete installation walkthrough with screenshots

### Deployment
- [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) - Deploy form to production (GitHub Pages, Netlify, Vercel)
- [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) - Comprehensive testing procedures

### Reference
- [CLAUDE.md](./CLAUDE.md) - Repository architecture and field schema
- [Implementation Plan](./n8n_implementation_plan_revision_summary.md) - Revision summary and field changes

## Workflow Details

### 1. Story Initialization Workflow

**Trigger**: Webhook from form submission

**Actions**:
- Generates unique Story ID (`STORY_[timestamp]`)
- Calculates total word count
- Inserts row in Google Sheets with all submission data
- Creates Google Drive folder structure
- Triggers 4 downstream AI workflows in parallel
- Returns success response with Story ID

**Nodes**: 10 nodes (Webhook, Function, Google Sheets, Google Drive ×2, HTTP Request ×4, Respond)

### 2. Synopsis Development Workflow

**Trigger**: HTTP Request from Story Initialization

**Actions**:
- Calls OpenAI GPT-4 to generate detailed 3-act synopsis
- Formats synopsis with metadata header
- Uploads synopsis.txt to Google Drive
- Returns success confirmation

**Nodes**: 5 nodes (Webhook, OpenAI, Function, Google Drive, Respond)

### 3. Character Development Workflow

**Trigger**: HTTP Request from Story Initialization

**Actions**:
- Calls OpenAI GPT-4 to generate 5-7 character profiles
- Each profile includes: role, description, personality, backstory, arc, relationships, conflicts
- Uploads characters.txt to Google Drive
- Returns success confirmation

**Nodes**: 5 nodes (Webhook, OpenAI, Function, Google Drive, Respond)

### 4. Worldbuilding Development Workflow

**Trigger**: HTTP Request from Story Initialization

**Actions**:
- Calls OpenAI GPT-4 to generate comprehensive world documentation
- Covers: setting, culture, politics, economics, technology, magic, history, religion
- Uploads worldbuilding.txt to Google Drive
- Returns success confirmation

**Nodes**: 5 nodes (Webhook, OpenAI, Function, Google Drive, Respond)

### 5. Chapter Planning Workflow

**Trigger**: HTTP Request from Story Initialization

**Actions**:
- Calls OpenAI GPT-4 to generate chapter-by-chapter outlines
- Uses user-provided chapter count (does NOT recalculate)
- Each chapter includes: title, word count, setting, POV, events, development, progression
- Uploads chapter_plan.txt to Google Drive
- Returns success confirmation

**Nodes**: 5 nodes (Webhook, OpenAI, Function, Google Drive, Respond)

## Security & Best Practices

- HTTPS required for production
- Webhook authentication recommended
- API keys stored in n8n credentials (never in code)
- Input validation on form and workflows
- Rate limiting on OpenAI calls
- Regular backups of Google Sheets data
- Workflow execution logs monitored

## Troubleshooting

### Common Issues

**"Webhook not found"**
- Ensure workflow is activated
- Verify webhook URL is correct

**Google Sheets/Drive errors**
- Check credential permissions
- Verify Spreadsheet ID and Folder ID are correct

**OpenAI errors**
- Verify API key is valid
- Check billing is set up
- Monitor rate limits

**See [TESTING_GUIDE.md](./docs/TESTING_GUIDE.md) for detailed troubleshooting**

## Customization

### Modify AI Prompts

Edit the OpenAI nodes in any workflow to customize:
- Synopsis structure (change from 3-act to Hero's Journey, etc.)
- Character profile template (add/remove fields)
- Worldbuilding categories
- Chapter outline format

### Change OpenAI Model

Default: **GPT-4 Turbo**

To use GPT-3.5 Turbo (cheaper, lower quality):
1. Open workflow in n8n
2. Click OpenAI node
3. Change model from `gpt-4-turbo-preview` to `gpt-3.5-turbo`

### Add Email Notifications

See commented Email node in Story Initialization workflow for setup instructions.

## Roadmap

Potential enhancements:
- [ ] Add user authentication to form
- [ ] Generate sample chapters (first chapter draft)
- [ ] Export to Markdown/PDF formats
- [ ] Integration with writing tools (Scrivener, etc.)
- [ ] Multi-language support
- [ ] Character image generation (DALL-E)
- [ ] Interactive story editor interface
- [ ] Version control for story iterations

## Contributing

This is an implementation reference for n8n story development automation. Feel free to:
- Fork and customize for your needs
- Extend workflows with additional features
- Share improvements and customizations

## License

MIT License - see LICENSE file

## Support

- **Issues**: [GitHub Issues](https://github.com/novacastriancyber/story_gen/issues)
- **Documentation**: See `docs/` folder
- **n8n Community**: [community.n8n.io](https://community.n8n.io)
- **OpenAI Support**: [help.openai.com](https://help.openai.com)

## Acknowledgments

- **n8n** - Workflow automation platform
- **OpenAI** - AI content generation
- **Google** - Sheets and Drive integration

---

**Version**: 1.0.0
**Last Updated**: January 2026
**Created by**: Story Development Automation Project

## Quick Links

- [Setup Guide](./docs/SETUP_GUIDE.md) - Start here
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Go live
- [Testing Guide](./docs/TESTING_GUIDE.md) - Validate your setup
- [GitHub Repository](https://github.com/novacastriancyber/story_gen)

---

**Ready to automate your story development?** Start with the [Setup Guide](./docs/SETUP_GUIDE.md)!
