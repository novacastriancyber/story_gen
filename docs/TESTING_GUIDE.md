# Testing Guide - n8n Story Development System

This guide provides comprehensive testing procedures to ensure your n8n Story Development System works correctly.

## Testing Strategy

1. **Unit Tests** - Test each workflow individually
2. **Integration Tests** - Test workflow interactions
3. **End-to-End Tests** - Test complete user journey
4. **Edge Case Tests** - Test boundary conditions and error handling

---

## Part 1: Unit Testing (Individual Workflows)

Test each workflow in isolation before testing the full system.

### Test 1: Story Initialization Workflow

#### Test 1.1: Minimal Required Data

**Input** (POST to Story Initialization webhook):
```json
{
  "outline_of_story": "A hero's journey through a magical land where dreams become reality"
}
```

**Expected Results**:
- ✓ Story ID generated (format: `STORY_[timestamp]`)
- ✓ Google Sheets row inserted with:
  - story_id: `STORY_[timestamp]`
  - book_name: "Untitled"
  - outline_of_story: (as provided)
  - genre: "General"
  - number_of_chapters: 0
  - word_counter_per_chapter: 0
  - calculated_total_words: 0
- ✓ Google Drive folder created: `/Stories/STORY_[timestamp]/Untitled/`
- ✓ 4 downstream webhooks triggered
- ✓ Response JSON returned with story_id

#### Test 1.2: Complete Data

**Input**:
```json
{
  "book_name": "The Crystal Quest",
  "outline_of_story": "A young wizard discovers ancient crystals that hold the power to reshape reality. She must learn to master their power before a dark sorcerer uses them to destroy the world.",
  "genre": "Fantasy",
  "number_of_chapters": 20,
  "word_counter_per_chapter": 3000
}
```

**Expected Results**:
- ✓ Story ID generated
- ✓ calculated_total_words: 60000 (20 × 3000)
- ✓ Google Sheets row with all fields populated
- ✓ Google Drive folder: `/Stories/STORY_[timestamp]/The Crystal Quest/`
- ✓ All 4 downstream workflows triggered with complete payload
- ✓ Success response returned

#### Test 1.3: Special Characters in Book Name

**Input**:
```json
{
  "book_name": "The Hero's \"Journey\": A Tale of Magic & Wonder!",
  "outline_of_story": "Test story with special characters"
}
```

**Expected Results**:
- ✓ Special characters handled correctly
- ✓ Folder created (may sanitize some characters)
- ✓ No errors in workflow execution

---

### Test 2: Synopsis Development Workflow

#### Test 2.1: Basic Synopsis Generation

**Input** (POST to Synopsis webhook):
```json
{
  "story_id": "TEST_SYNOPSIS_001",
  "book_name": "Test Story",
  "outline_of_story": "A detective solves a murder mystery in a small town",
  "genre": "Mystery",
  "number_of_chapters": 15,
  "word_counter_per_chapter": 2000,
  "calculated_total_words": 30000,
  "drive_folder_id": "[your_test_folder_id]"
}
```

**Expected Results**:
- ✓ OpenAI generates 3-act synopsis
- ✓ Synopsis includes:
  - Act I details (~7500 words mentioned)
  - Act II details (~15000 words mentioned)
  - Act III details (~7500 words mentioned)
- ✓ Synopsis file uploaded to Google Drive
- ✓ File named: `TEST_SYNOPSIS_001_synopsis.txt`
- ✓ Success response returned with file_id

#### Test 2.2: Genre-Specific Synopsis

Test different genres:
- Fantasy
- Science Fiction
- Romance
- Thriller
- Historical Fiction

**Expected**: Synopsis content reflects genre conventions

---

### Test 3: Character Development Workflow

**Input** (POST to Character webhook):
```json
{
  "story_id": "TEST_CHAR_001",
  "book_name": "Character Test",
  "outline_of_story": "A coming-of-age story about a young artist finding her voice",
  "genre": "Literary Fiction",
  "drive_folder_id": "[your_test_folder_id]"
}
```

**Expected Results**:
- ✓ OpenAI generates 5-7 character profiles
- ✓ Each character has:
  - Name and role
  - Physical description
  - Personality traits
  - Background
  - Motivations
  - Character arc
  - Relationships
  - Internal/external conflicts
- ✓ File uploaded: `TEST_CHAR_001_characters.txt`
- ✓ Success response returned

---

### Test 4: Worldbuilding Development Workflow

**Input** (POST to Worldbuilding webhook):
```json
{
  "story_id": "TEST_WORLD_001",
  "book_name": "World Test",
  "outline_of_story": "An epic space opera set in a galaxy-spanning empire",
  "genre": "Science Fiction",
  "drive_folder_id": "[your_test_folder_id]"
}
```

**Expected Results**:
- ✓ OpenAI generates world documentation
- ✓ Includes sections on:
  - Setting and geography
  - Social structure
  - Political systems
  - Economic systems
  - Technology level
  - History and lore
  - (Magic if fantasy genre)
- ✓ File uploaded: `TEST_WORLD_001_worldbuilding.txt`
- ✓ Success response returned

---

### Test 5: Chapter Planning Workflow

#### Test 5.1: Standard Chapter Count

**Input** (POST to Chapter Planning webhook):
```json
{
  "story_id": "TEST_CHAPTER_001",
  "book_name": "Chapter Test",
  "outline_of_story": "A thriller about a journalist uncovering corruption",
  "genre": "Thriller",
  "number_of_chapters": 12,
  "word_counter_per_chapter": 2500,
  "calculated_total_words": 30000,
  "drive_folder_id": "[your_test_folder_id]"
}
```

**Expected Results**:
- ✓ OpenAI generates exactly 12 chapter outlines (NOT a different number)
- ✓ Each chapter includes:
  - Chapter number and title
  - Target word count: 2500
  - Setting and timeframe
  - POV character
  - Key events and scenes
  - Character development moments
  - Plot progression
  - Ending/transition
- ✓ File uploaded: `TEST_CHAPTER_001_chapter_plan.txt`
- ✓ Success response returned

#### Test 5.2: Edge Case - Very Few Chapters

**Input**:
```json
{
  "number_of_chapters": 3,
  "word_counter_per_chapter": 10000
}
```

**Expected**: 3 detailed chapter outlines, no complaints about low chapter count

#### Test 5.3: Edge Case - Many Chapters

**Input**:
```json
{
  "number_of_chapters": 50,
  "word_counter_per_chapter": 2000
}
```

**Expected**: 50 chapter outlines (may be less detailed per chapter due to token limits)

---

## Part 2: Integration Testing

Test how workflows interact with each other.

### Integration Test 1: Full Workflow Cascade

**Steps**:
1. Submit form with complete data
2. Wait for Story Initialization to complete
3. Verify all 4 downstream workflows were triggered

**Expected**:
- ✓ Story Initialization completes first (~10 seconds)
- ✓ Synopsis, Character, Worldbuilding, Chapter Planning run in parallel
- ✓ All workflows complete within 2-3 minutes
- ✓ All 4 files appear in Google Drive folder

### Integration Test 2: Data Consistency

**Steps**:
1. Submit story with specific book_name and story_id
2. Check that all 4 generated files reference the same:
   - story_id
   - book_name
   - Consistent story details

**Expected**:
- ✓ All files have matching metadata in headers
- ✓ Content is consistent across files (characters match worldbuilding, etc.)

### Integration Test 3: Folder Structure

**Steps**:
1. Submit multiple stories in quick succession
2. Check Google Drive folder structure

**Expected**:
```
Stories/
├── STORY_1704123456789/
│   └── First Story Name/
│       ├── synopsis.txt
│       ├── characters.txt
│       ├── worldbuilding.txt
│       └── chapter_plan.txt
├── STORY_1704123457890/
│   └── Second Story Name/
│       ├── synopsis.txt
│       ├── characters.txt
│       ├── worldbuilding.txt
│       └── chapter_plan.txt
```

---

## Part 3: End-to-End Testing

Test the complete user journey from form to generated content.

### E2E Test 1: Happy Path

**Steps**:
1. Open the HTML form
2. Fill in all fields:
   - Book Name: "The Last Starship"
   - Outline: "In the year 3000, humanity's last starship searches for a new home as Earth becomes uninhabitable."
   - Genre: "Science Fiction"
   - Chapters: 25
   - Words per Chapter: 4000
3. Click Submit
4. Wait for success message
5. Check Google Sheets
6. Check Google Drive
7. Wait 2-3 minutes for content generation
8. Check all 4 files are created

**Expected**:
- ✓ Form submits successfully
- ✓ Success message displays with story_id
- ✓ Google Sheets row appears immediately
- ✓ Google Drive folder appears immediately
- ✓ All 4 content files appear within 3 minutes
- ✓ Files contain relevant, high-quality content
- ✓ Total calculated words: 100,000

### E2E Test 2: Minimal Input

**Steps**:
1. Fill in only the required field (outline)
2. Leave all other fields empty
3. Submit

**Expected**:
- ✓ Form accepts submission (outline_of_story is the only required field)
- ✓ Workflows handle null/empty values gracefully
- ✓ Defaults applied: book_name="Untitled", genre="General"

### E2E Test 3: Form Validation

**Steps**:
1. Try to submit with empty outline
2. Fill outline with only 5 characters
3. Fill outline with 500 words

**Expected**:
- ✓ Empty outline shows error: "Please provide a story outline"
- ✓ Very short outline shows error: "Must be at least 10 characters"
- ✓ Long outline submits successfully

---

## Part 4: Edge Case Testing

### Edge Case 1: Very Long Outline (Stress Test)

**Input**:
```json
{
  "outline_of_story": "[5000 words of detailed story outline]"
}
```

**Expected**:
- ✓ Workflow handles large input
- ✓ OpenAI may truncate if exceeds token limit
- ✓ No errors, graceful handling

### Edge Case 2: Unicode Characters

**Input**:
```json
{
  "book_name": "La última aventura: 最后的冒险",
  "outline_of_story": "A story with émojis 🚀 and spëcial çharacters"
}
```

**Expected**:
- ✓ Unicode handled correctly
- ✓ Files created with proper encoding
- ✓ No garbled text

### Edge Case 3: Zero Chapters

**Input**:
```json
{
  "number_of_chapters": 0,
  "word_counter_per_chapter": 0
}
```

**Expected**:
- ✓ calculated_total_words: 0
- ✓ Chapter Planning workflow still runs
- ✓ OpenAI asked to plan, may default to reasonable number

### Edge Case 4: Extremely High Word Count

**Input**:
```json
{
  "number_of_chapters": 100,
  "word_counter_per_chapter": 10000
}
```

**Expected**:
- ✓ calculated_total_words: 1,000,000
- ✓ Workflows complete without errors
- ✓ OpenAI plans for epic-length novel

---

## Part 5: Error Handling Tests

### Error Test 1: Invalid Webhook URL

**Steps**:
1. Deactivate Synopsis Development workflow
2. Submit form

**Expected**:
- ✓ Story Initialization completes successfully
- ✓ HTTP Request to Synopsis webhook fails gracefully
- ✓ Other 3 workflows still execute
- ✓ Error logged in n8n execution log

### Error Test 2: Invalid Google Sheets ID

**Steps**:
1. Change Sheets ID to invalid value
2. Submit form

**Expected**:
- ✓ Workflow fails at Google Sheets node
- ✓ Error message: "Spreadsheet not found" or similar
- ✓ Execution stops, downstream workflows not triggered

### Error Test 3: Invalid OpenAI API Key

**Steps**:
1. Temporarily change OpenAI key to invalid value
2. Trigger Synopsis workflow

**Expected**:
- ✓ Workflow fails at OpenAI node
- ✓ Error message: "Invalid API key"
- ✓ Execution marked as failed in n8n

### Error Test 4: OpenAI Rate Limit

**Steps**:
1. Submit many stories rapidly to hit rate limit
2. Wait for rate limit error

**Expected**:
- ✓ Workflow fails with rate limit error
- ✓ Retry after waiting (manual or automatic)
- ✓ Subsequent executions succeed

---

## Part 6: Performance Tests

### Performance Test 1: Execution Time

**Measure**:
- Story Initialization: Should complete in < 30 seconds
- Each AI workflow: Should complete in 30-60 seconds
- Total end-to-end: Should complete in < 3 minutes

**Test**: Submit story and time each stage

### Performance Test 2: Concurrent Submissions

**Steps**:
1. Submit 5 stories simultaneously
2. Monitor n8n execution queue

**Expected**:
- ✓ All workflows queue and execute
- ✓ No failures due to concurrent execution
- ✓ All complete successfully (may take longer)

### Performance Test 3: Large Batch

**Steps**:
1. Submit 20 stories over 1 hour
2. Monitor:
   - n8n execution logs
   - OpenAI usage
   - Google API quotas

**Expected**:
- ✓ All submissions succeed
- ✓ No quota limits hit
- ✓ Costs remain within expected range

---

## Part 7: Content Quality Tests

### Quality Test 1: Synopsis Coherence

**Evaluate**:
- Does the synopsis match the outline?
- Are all 3 acts present?
- Is it well-structured?
- Does it make narrative sense?

**Pass Criteria**: 80%+ match to outline, clear 3-act structure

### Quality Test 2: Character Consistency

**Evaluate**:
- Do characters fit the genre?
- Are characters distinct from each other?
- Do character arcs make sense?

**Pass Criteria**: Characters are unique and genre-appropriate

### Quality Test 3: Worldbuilding Depth

**Evaluate**:
- Is worldbuilding detailed?
- Does it support the story?
- Is it internally consistent?

**Pass Criteria**: Comprehensive worldbuilding across all categories

### Quality Test 4: Chapter Planning

**Evaluate**:
- Correct number of chapters generated?
- Do chapters progress logically?
- Is pacing appropriate?

**Pass Criteria**: Exact chapter count, logical progression

---

## Part 8: Regression Testing

After making changes to workflows, rerun this test suite:

### Regression Test Checklist

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E happy path test passes
- [ ] Edge cases handled correctly
- [ ] Error handling still works
- [ ] Performance remains acceptable
- [ ] Content quality maintained

---

## Part 9: Testing Tools

### Recommended Tools

**For API Testing**:
- **Postman** - GUI for testing webhooks
- **curl** - Command-line testing
- **HTTPie** - User-friendly HTTP client

**Example curl commands**:

```bash
# Test Story Initialization
curl -X POST https://your-n8n.app.n8n.cloud/webhook/story-submission \
  -H "Content-Type: application/json" \
  -d '{
    "book_name": "Test Story",
    "outline_of_story": "A test story outline",
    "genre": "Test",
    "number_of_chapters": 10,
    "word_counter_per_chapter": 1000
  }'

# Test Synopsis Development
curl -X POST https://your-n8n.app.n8n.cloud/webhook/synopsis-development \
  -H "Content-Type: application/json" \
  -d '{
    "story_id": "TEST_001",
    "book_name": "Test",
    "outline_of_story": "Test outline",
    "genre": "Test",
    "number_of_chapters": 10,
    "word_counter_per_chapter": 1000,
    "calculated_total_words": 10000,
    "drive_folder_id": "your_folder_id"
  }'
```

---

## Part 10: Test Data

### Sample Test Stories

**Fantasy**:
```json
{
  "book_name": "The Dragon's Legacy",
  "outline_of_story": "A young dragon rider must unite the fractured kingdoms to face an ancient evil awakening from centuries of slumber.",
  "genre": "Fantasy",
  "number_of_chapters": 30,
  "word_counter_per_chapter": 3500
}
```

**Mystery**:
```json
{
  "book_name": "The Vanishing Point",
  "outline_of_story": "A detective investigates a series of impossible disappearances in a coastal town where nothing is as it seems.",
  "genre": "Mystery",
  "number_of_chapters": 18,
  "word_counter_per_chapter": 2800
}
```

**Romance**:
```json
{
  "book_name": "Second Chances",
  "outline_of_story": "Two childhood friends reunite after 20 years apart and must confront their past to build a future together.",
  "genre": "Romance",
  "number_of_chapters": 24,
  "word_counter_per_chapter": 2500
}
```

---

## Test Completion Checklist

Before deploying to production:

- [ ] All unit tests completed
- [ ] All integration tests completed
- [ ] At least 3 different E2E tests completed
- [ ] Edge cases tested
- [ ] Error handling verified
- [ ] Performance benchmarks met
- [ ] Content quality approved
- [ ] Documentation matches actual behavior

---

**Testing Complete!** ✅

Your system is validated and ready for production use.

**Last Updated**: January 2026
**System Version**: 1.0.0
