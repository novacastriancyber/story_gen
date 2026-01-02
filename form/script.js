// =============================================
// CONFIGURATION - UPDATE THIS WITH YOUR WEBHOOK URL
// =============================================
const WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/story-submission';

// =============================================
// FORM SUBMISSION HANDLER
// =============================================
document.getElementById('storyForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const messageDiv = document.getElementById('message');
    const submitBtn = e.target.querySelector('.submit-btn');

    // Disable submit button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Hide any previous messages
    messageDiv.classList.add('hidden');

    // Collect form data
    const formData = {
        book_name: document.getElementById('book_name').value.trim() || null,
        outline_of_story: document.getElementById('outline_of_story').value.trim(),
        genre: document.getElementById('genre').value.trim() || null,
        number_of_chapters: parseInt(document.getElementById('number_of_chapters').value) || null,
        word_counter_per_chapter: parseInt(document.getElementById('word_counter_per_chapter').value) || null
    };

    // Validate required field
    if (!formData.outline_of_story) {
        showMessage('Please provide a story outline. This field is required.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Story Idea';
        return;
    }

    // Validate outline length
    if (formData.outline_of_story.length < 10) {
        showMessage('Story outline must be at least 10 characters long.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Story Idea';
        return;
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const result = await response.json();

            // Build success message
            let successMessage = `Success! Your story has been submitted.`;

            if (result.story_id) {
                successMessage += `\n\nStory ID: ${result.story_id}`;
            }

            if (result.details) {
                if (result.details.total_words > 0) {
                    successMessage += `\nTotal Words: ${result.details.total_words.toLocaleString()}`;
                }
                if (result.details.chapters > 0) {
                    successMessage += `\nChapters: ${result.details.chapters}`;
                }
            }

            successMessage += `\n\nYour story development has been initiated. You'll receive generated content shortly!`;

            showMessage(successMessage, 'success');

            // Reset form after successful submission
            document.getElementById('storyForm').reset();
            updateTotalWords(); // Reset calculated total
        } else {
            // Handle HTTP errors
            let errorMessage = 'Submission failed. ';

            try {
                const errorData = await response.json();
                errorMessage += errorData.message || `Server responded with status ${response.status}`;
            } catch {
                errorMessage += `Server responded with status ${response.status}`;
            }

            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Submission error:', error);
        showMessage(`An error occurred: ${error.message}. Please try again.`, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Story Idea';
    }
});

// =============================================
// MESSAGE DISPLAY FUNCTION
// =============================================
function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');

    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide success messages after 8 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 8000);
    }
}

// =============================================
// REAL-TIME TOTAL WORDS CALCULATION
// =============================================
document.getElementById('number_of_chapters').addEventListener('input', updateTotalWords);
document.getElementById('word_counter_per_chapter').addEventListener('input', updateTotalWords);

function updateTotalWords() {
    const chapters = parseInt(document.getElementById('number_of_chapters').value) || 0;
    const wordsPerChapter = parseInt(document.getElementById('word_counter_per_chapter').value) || 0;
    const total = chapters * wordsPerChapter;

    const totalWordsDisplay = document.getElementById('totalWordsDisplay');
    const totalWordsValue = document.getElementById('totalWordsValue');

    if (total > 0) {
        totalWordsValue.textContent = total.toLocaleString();
        totalWordsDisplay.classList.remove('hidden');
    } else {
        totalWordsDisplay.classList.add('hidden');
    }
}

// =============================================
// FORM FIELD ENHANCEMENTS
// =============================================

// Auto-resize textarea as user types
const outlineTextarea = document.getElementById('outline_of_story');
outlineTextarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Capitalize book name as user types (optional enhancement)
document.getElementById('book_name').addEventListener('input', function(e) {
    // This is optional - can be removed if not desired
    // Capitalizes first letter of each word
    const words = e.target.value.split(' ');
    const capitalized = words.map(word => {
        if (word.length > 0) {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
        return word;
    });
    // Only update if user isn't actively typing (to avoid cursor jump)
    if (e.target.value !== capitalized.join(' ')) {
        const cursorPos = e.target.selectionStart;
        e.target.value = capitalized.join(' ');
        e.target.setSelectionRange(cursorPos, cursorPos);
    }
});

// =============================================
// INITIALIZATION
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Story Idea Submission Form Loaded');
    console.log('Webhook URL:', WEBHOOK_URL);

    // Warn if webhook URL hasn't been updated
    if (WEBHOOK_URL.includes('your-n8n-instance.com')) {
        console.warn('⚠️ WARNING: Please update the WEBHOOK_URL in script.js with your actual n8n webhook URL');
    }
});
