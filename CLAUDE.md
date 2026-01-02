# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a **documentation repository** for an n8n workflow automation system that manages story/book development submissions. It is not an executable codebase but rather contains implementation planning documents.

## Project Overview

The n8n story development system automates the creative writing workflow through several interconnected workflows:

1. **Story Initialization Workflow** - Receives form submissions via webhook, generates story IDs, creates Google Drive folder structure, and triggers downstream workflows
2. **Synopsis Development Workflow** - Uses OpenAI to generate detailed story synopses based on the outline
3. **Character Development Workflow** - Creates character profiles and development arcs
4. **Worldbuilding Development Workflow** - Develops setting, lore, and world details
5. **Chapter Planning Workflow** - Plans individual chapter outlines and structure

## Current Form Field Schema

The actual web form captures these fields (as of January 2, 2026 revision):

- `book_name` - Text input (optional)
- `outline_of_story` - Textarea (**REQUIRED** - the only mandatory field)
- `genre` - Text input (optional)
- `number_of_chapters` - Number input (optional)
- `word_counter_per_chapter` - Number input (optional)
- `calculated_total_words` - Derived field: `number_of_chapters × word_counter_per_chapter`

**Important**: The form no longer captures submitter information (name/email), deadline, themes, audience, tone, or special requirements that were in earlier versions.

## Key Integration Points

The system integrates with:
- **Google Sheets** - `Form_Submissions` table stores all submission data
- **Google Drive** - Folder structure: `/Stories/{Story_ID}/{book_name}/`
- **OpenAI API** - Generates synopsis, characters, worldbuilding, and chapter outlines
- **Email Notifications** - Confirms submissions and sends generated content
- **Webhooks** - Form submits to Story Initialization, which triggers downstream workflows

## Field Name Migration (Important for Modifications)

If updating workflows or documentation, note these field name changes:

| Old Field | New Field | Notes |
|-----------|-----------|-------|
| `story_title` | `book_name` | Renamed for clarity |
| `initial_idea` | `outline_of_story` | More descriptive name |
| `target_word_count` | *(calculated field)* | Now derived from chapters × words/chapter |
| `submitter_name` | *(removed)* | No longer captured |
| `submitter_email` | *(removed)* | No longer captured |

## Document Structure

The main implementation plan (`n8n_implementation_plan_revision_summary.md`) contains:

- **Section 3.2** - Google Sheets table schema
- **Section 5.x** - Detailed workflow specifications (5.1-5.5)
- **Section 8.1** - AI prompt templates
- **Section 9.1** - Form field design specifications
- **Section 9.2** - HTML form template with JavaScript submission handler

## When Modifying Workflows

If the actual n8n implementation needs changes:

1. **Webhook payloads** must match the current 5-field form structure
2. **Google Sheets mappings** must use new field names (`book_name`, `outline_of_story`, etc.)
3. **AI prompts** should reference `outline_of_story` not `initial_idea`
4. **Total word count** is calculated, not submitted directly
5. **Email templates** need updating if referencing old field names

## HTML Form Styling

The form uses a minimal, centered design:
- Max-width: 600px
- White background with subtle shadow
- Salmon/coral submit button (#FF6B6B)
- n8n branding footer with circles logo
- Form POST to webhook endpoint as JSON

## Testing Critical Paths

When validating changes to the n8n implementation:
- Form validation (only `outline_of_story` required)
- Story ID generation
- Total word count calculation
- Google Drive folder creation using `book_name`
- Workflow data passing between initialization → synopsis → character → worldbuilding → chapters
