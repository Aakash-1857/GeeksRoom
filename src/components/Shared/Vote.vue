<template>
  <div class="vote-buttons">
    <button 
      @click="handleUpvote"
      :class="{ active: userVote === 'upvote' }"
      :disabled="!isLoggedIn"
      class="vote-btn upvote-btn"
      :title="!isLoggedIn ? 'Login to vote' : 'Upvote'"
    >
      ▲
    </button>
    
    <span class="vote-count">{{ voteCount }}</span>
    
    <button 
      @click="handleDownvote"
      :class="{ active: userVote === 'downvote' }"
      :disabled="!isLoggedIn"
      class="vote-btn downvote-btn"
      :title="!isLoggedIn ? 'Login to vote' : 'Downvote'"
    >
      ▼
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useQuestionStore } from '@/stores/questionStore';
import { useAnswerStore } from '@/stores/answerStore'; // <-- ADDED THIS IMPORT

const props = defineProps({
  itemId: {
    type: String,
    required: true
  },
  voteCount: {
    type: Number,
    required: true
  },
  itemType: {
    type: String, // 'question' or 'answer'
    required: true,
    validator: (value) => ['question', 'answer'].includes(value)
  }
});

// --- Store Instances ---
const userStore = useUserStore();
const questionStore = useQuestionStore();
const answerStore = useAnswerStore(); // <-- ADDED THIS STORE

// --- Computed Properties ---
const isLoggedIn = computed(() => userStore.isLoggedIn);

// Get the user's current vote on this item
const userVote = computed(() => {
  if (props.itemType === 'question') {
    return questionStore.getUserVote(props.itemId);
  } else if (props.itemType === 'answer') {
    return answerStore.getUserVote(props.itemId); // <-- ADDED THIS LOGIC
  }
  return null; // Default case
});

// --- Event Handlers ---
const handleUpvote = async () => {
  if (!isLoggedIn.value) return;
  
  if (props.itemType === 'question') {
    await questionStore.handleVote(props.itemId, 'upvote');
  } else if (props.itemType === 'answer') {
    await answerStore.handleVote(props.itemId, 'upvote'); // <-- ADDED THIS LOGIC
  }
};

const handleDownvote = async () => {
  if (!isLoggedIn.value) return;
  
  if (props.itemType === 'question') {
    await questionStore.handleVote(props.itemId, 'downvote');
  } else if (props.itemType === 'answer') {
    await answerStore.handleVote(props.itemId, 'downvote'); // <-- ADDED THIS LOGIC
  }
};
</script>

<style scoped>
/* Main Container */
div {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 1.5rem);
  position: relative;
}


/* Loading and Error States */
div:first-child {
  display: grid;
  place-items: center;
  min-height: 50vh;
  color: var(--color-text-muted);
  font-size: 1rem;
}


.error-message {
  position: relative;
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius);
  color: #FCA5A5;
  font-size: 0.9375rem;
  font-weight: 500;
  text-align: center;
}


/* Alert messages */
.alert {
  padding: 0.875rem 1rem;
  border-radius: var(--radius);
  font-size: 0.9375rem;
  margin-bottom: 1rem;
}


.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #FCA5A5;
}


.alert-info {
  background: rgba(127, 90, 240, 0.08);
  border: 1px solid rgba(127, 90, 240, 0.2);
  color: var(--color-text-muted);
}


/* Grid layout for question/answer + votes */
.question-grid,
.answer-list-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.5rem;
  align-items: start;
}


/* Vote Controls */
.vote-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  min-width: 50px;
  position: sticky;
  top: 1rem;
}


.vote-controls button {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}


.vote-controls button:hover {
  background: rgba(127, 90, 240, 0.1);
  border-color: var(--color-primary);
  color: var(--color-primary);
}


.vote-controls button:active {
  transform: scale(0.95);
}


.vote-controls span {
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.125rem 0;
}


/* Question Header Section */
.question-header {
  position: relative;
  padding: 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: 1rem;
}


.question-main-content {
  min-width: 0;
}


/* Main Question Title - DE-FLASHIFIED */
.question-header h2 {
  margin: 0 0 0.5rem;
  color: var(--color-text);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}


/* Main Question Body - DE-FLASHIFIED */
.question-header p {
  margin: 0 0 0.75rem;
  color: var(--color-text);
  font-size: 1rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-wrap: break-word;
}


.question-header small {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.4;
}


.question-header small span {
  color: var(--color-accent);
  font-style: italic;
}


/* Code blocks within question/answer content */
.question-header pre,
.answers-section pre {
  padding: 0.75rem;
  background: rgba(13, 13, 13, 0.8);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 0.75rem 0;
}


.question-header code,
.answers-section code {
  padding: 0.125rem 0.375rem;
  background: rgba(127, 90, 240, 0.1);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 0.25rem;
  color: var(--color-accent);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
}


.question-header pre code,
.answers-section pre code {
  padding: 0;
  background-color: transparent;
  border: none;
  color: var(--color-text);
}


/* Separator */
hr {
  margin: 1rem 0;
  border: none;
  border-top: 1px solid var(--color-border);
}


/* Answers Section */
.answers-section {
  margin-bottom: 1rem;
}


/* Answers Header - DE-FLASHIFIED (Simple flex header) */
.answers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}


.answers-header h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}


/* Post Answer Button */
.post-answer-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border: none;
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  text-align: center;
}


.post-answer-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);
}


.post-answer-button:active:not(:disabled) {
  transform: translateY(0);
}


/* Answer List */
.answers-section ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.5rem;
}


/* ANSWER CARD - STACKOVERFLOW STYLE COMPACT FIX */
/* This is the critical fix - completely reset all card-like styles */
.answers-section li.answer-list-item {
  position: relative;
  padding: 0.5rem !important;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: border-color 0.2s ease;
  min-height: auto !important;
  height: auto !important;
  /* Explicitly reset any card-like properties */
  box-shadow: none !important;
  margin: 0 !important;
}


.answers-section li:hover {
  border-color: rgba(127, 90, 240, 0.4);
}


.answers-section li.optimistic-post {
  opacity: 0.6;
}


.answer-content {
  min-width: 0;
  /* Ensure no extra spacing inside answer content */
  padding: 0 !important;
  margin: 0 !important;
}


/* Answer Body Text - STACKOVERFLOW STYLE (COMPACT) */
.answers-section li p {
  margin: 0 0 0.25rem !important;
  color: var(--color-text);
  font-size: 0.9375rem;
  line-height: 1.4;
  word-wrap: break-word;
}


.answers-section li small {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.3;
  margin: 0 !important;
}


.answers-section li small span {
  color: var(--color-accent);
  font-style: italic;
}


/* No Answers Message */
.answers-section .alert {
  text-align: center;
}


/* Login Prompt */
.login-prompt-box {
  position: relative;
  padding: 0.75rem;
  background: rgba(127, 90, 240, 0.05);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: var(--radius);
  text-align: center;
  margin-bottom: 1rem;
}


.login-prompt-box p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}


.login-prompt-box a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}


.login-prompt-box a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}


/* Question Not Found */
div:last-child p {
  padding: 1.5rem;
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  text-align: center;
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .answers-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .post-answer-button {
    width: 100%;
    justify-content: center;
  }
}


@media (max-width: 640px) {
  .question-header {
    padding: 0.75rem;
  }
  
  .answers-section li.answer-list-item {
    padding: 0.375rem !important;
    gap: 0.375rem;
  }
  
  .vote-controls {
    min-width: 45px;
    padding: 0.125rem;
  }
  
  .vote-controls button {
    width: 1.75rem;
    height: 1.75rem;
    font-size: 0.75rem;
  }
  
  .vote-controls span {
    font-size: 0.75rem;
  }
  
  .question-header h2 {
    font-size: 1.25rem;
  }
  
  .question-header p {
    font-size: 0.9375rem;
  }
  
  .answers-section li p {
    font-size: 0.9375rem;
  }
}


/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>