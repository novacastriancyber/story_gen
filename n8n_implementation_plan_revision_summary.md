# n8n Story Development Implementation Plan - Revision Summary

**Date**: January 2, 2026  
**Revised File**: `/home/ubuntu/n8n_story_development_implementation_plan.md`

## Overview

The implementation plan has been updated to match the actual form submission fields shown in the uploaded screenshot (`/home/ubuntu/Uploads/2026-01-02_153712.png`).

## Form Field Changes

### Old Fields (Removed)
- `story_title` → Replaced with `book_name`
- `initial_idea` → Replaced with `outline_of_story`
- `target_word_count` → Now calculated from `number_of_chapters * word_counter_per_chapter`
- `deadline` → Removed (not in actual form)
- `submitter_name` → Removed (not captured in form)
- `submitter_email` → Removed (not captured in form)
- `key_themes` → Removed (not in actual form)
- `target_audience` → Removed (not in actual form)
- `tone` → Removed (not in actual form)
- `special_requirements` → Removed (not in actual form)

### New/Updated Fields (Matching Actual Form)
1. **book_name** - Text input (optional)
2. **outline_of_story** - Textarea (REQUIRED - marked with *)
3. **genre** - Text input (optional)
4. **number_of_chapters** - Number input with steppers (optional)
5. **word_counter_per_chapter** - Number input with steppers (optional)
6. **calculated_total_words** - Calculated field (number_of_chapters × word_counter_per_chapter)

---

## Sections Updated

### 1. Section 3.2: Google Sheets - Form_Submissions Table
**Updated**: Column schema to match new form fields

**Changes**:
- Replaced old form fields with new ones
- Added `calculated_total_words` column for derived total word count
- Removed submitter information columns (can be added via workflow if needed)

### 2. Section 5.1: Story Initialization Workflow
**Updated**: Webhook trigger node expected input

**Changes**:
- Updated webhook expected JSON input to use new field names
- Modified Function Node to calculate total word count: `numberOfChapters * wordsPerChapter`
- Updated Google Sheets mapping to use `book_name`, `outline_of_story`, etc.
- Updated duplicate check to look for `book_name` instead of `story_title`
- Updated folder creation to use `book_name`
- Updated HTTP Request node that triggers Synopsis Workflow to pass new fields
- Updated email notification to show new fields

### 3. Section 5.2: Synopsis Development Workflow
**Updated**: Webhook trigger and AI prompt generation

**Changes**:
- Updated webhook expected input to use `book_name`, `outline_of_story`, etc.
- Modified OpenAI prompt to use new field names
- Updated Function Node for formatting synopsis to use `book_name`
- Updated email subject line to use `book_name`

### 4. Section 5.3: Character Development Workflow
**Updated**: Webhook trigger

**Changes**:
- Updated expected input to use `book_name` instead of `story_title`

### 5. Section 5.4: Worldbuilding Development Workflow
**Updated**: Webhook trigger

**Changes**:
- Updated expected input to use `book_name` instead of `story_title`

### 6. Section 5.5: Chapter Planning Workflow
**Updated**: AI prompt for chapter count determination

**Changes**:
- Updated prompt to use `number_of_chapters` and `word_counter_per_chapter` from form
- Changed from calculating optimal chapter count to using provided count

### 7. Section 8.1: AI Prompt Templates - Synopsis Generation
**Updated**: AI prompt template

**Changes**:
- Replaced `story_title` with `book_name`
- Replaced `initial_idea` with `outline_of_story`
- Removed `target_audience`, `tone`, `key_themes`, `special_requirements`
- Added `number_of_chapters` and `word_counter_per_chapter`
- Updated word count calculations for Acts to use new formula

### 8. Section 9.1: Form Fields Design
**Completely Replaced**: New field specifications matching actual form

**Changes**:
- Removed all old field specifications
- Added minimal 5-field form specification matching screenshot
- Noted that only "Outline of Story" is required
- Added notes about calculated fields and missing submitter info

### 9. Section 9.2: Form HTML Template
**Completely Replaced**: New HTML form matching screenshot design

**Changes**:
- Created simpler form with clean, minimal design
- Matches exact styling from screenshot:
  - White background with subtle shadow
  - Centered layout with max-width 600px
  - "Story Idea" / "Receive Story Ideas" header
  - 5 form fields exactly as shown
  - Salmon/coral-colored submit button
  - n8n branding in footer with circles logo
- Added form submission JavaScript:
  - Converts number fields to integers
  - Posts JSON data to webhook
  - Shows success/error messages
  - Resets form after submission
- Removed all complex multi-section form structure
- Removed unnecessary optional fields

---

## Field Name Mapping Reference

For developers implementing or modifying the workflows:

| Old Field Name | New Field Name | Type | Required |
|----------------|----------------|------|----------|
| `story_title` | `book_name` | Text | No |
| `initial_idea` | `outline_of_story` | Textarea | **YES** |
| `genre` | `genre` | Text | No |
| `target_word_count` | *(calculated)* | Number | - |
| - | `number_of_chapters` | Number | No |
| - | `word_counter_per_chapter` | Number | No |
| `submitter_name` | *(removed)* | - | - |
| `submitter_email` | *(removed)* | - | - |
| `key_themes` | *(removed)* | - | - |
| `target_audience` | *(removed)* | - | - |
| `tone` | *(removed)* | - | - |
| `special_requirements` | *(removed)* | - | - |
| `deadline` | *(removed)* | - | - |

---

## Important Notes for Implementation

1. **Total Word Count Calculation**: The system now calculates total word count as:
   ```javascript
   targetWordCount = number_of_chapters * word_counter_per_chapter
   ```

2. **Required Validation**: Only `outline_of_story` is required. All other fields are optional.

3. **Missing Submitter Information**: The form no longer captures submitter name/email. If needed:
   - Add hidden fields to the form
   - Capture via authentication in n8n
   - Add as separate form fields
   - Use a default value in workflows

4. **Chapter Count**: The form now allows users to specify chapter count upfront, which the system uses directly rather than calculating an optimal count.

5. **Backward Compatibility**: Existing workflows referencing old field names need to be updated or will fail. Review all:
   - Webhook triggers
   - Google Sheets mappings
   - Email templates
   - AI prompts
   - Data flow between workflows

---

## Testing Checklist

After implementing these changes, test:

- [ ] Form displays correctly with all 5 fields
- [ ] Only "Outline of Story" is required (form validates)
- [ ] Form submits to webhook successfully
- [ ] Story ID is generated correctly
- [ ] Total word count is calculated properly
- [ ] Google Drive folder structure is created
- [ ] Google Sheets records are inserted with correct field names
- [ ] Synopsis workflow receives correct data
- [ ] Email notifications include correct field values
- [ ] Chapter planning uses provided chapter count

---

## Files Modified

1. `/home/ubuntu/n8n_story_development_implementation_plan.md` - Main implementation plan

---

**End of Revision Summary**
