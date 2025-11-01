<template>
  <div v-if="isLoading">
    Loading question details...
  </div>

  <div v-else-if="error" class="error">
    Failed to load question: {{ error }}
  </div>

  <div v-else-if="question">
    
    <div class="question-header question-grid">
      <div class="vote-controls">
        <Vote
          :itemId="question.id"
          :voteCount="question.voteCount"
          itemType="question"
        />
      </div>
      <div class="question-main-content">
        <h2>{{ question.title }}</h2>
        <p>{{ question.content }}</p>
        <small>Asked by {{ question.authorUsername }}</small>
      </div>
    </div>

    <hr />

    <div class="answers-section">
      <h3>Answers</h3>
      <div v-if="answerStore.isLoading">Loading answers...</div>
      <div v-if="answerStore.error" class="error">{{ answerStore.error }}</div>
      
      <ul v-if="answerStore.getAnswers.length">
        <li
          v-for="answer in answerStore.getAnswers"
          :key="answer.id"
          :class="{ 'optimistic-post': answer.isOptimistic }"
          class="answer-list-item"
        >
          <div class="vote-controls">
            <Vote
              :itemId="answer.id"
              :voteCount="answer.voteCount"
              itemType="answer"
            />
          </div>
          <div class="answer-content">
            <p>{{ answer.content }}</p>
            <small>
              Answered by {{ answer.authorUsername }}
              <span v-if="answer.isOptimistic"> (Posting...)</span>
            </small>
          </div>
        </li>
      </ul>
      <div v-else-if="!answerStore.isLoading">
        <p> No answers yet. Be the first! </p>
      </div>
    </div>

    <div v-if="userStore.isLoggedIn" class="post-answer-form">
      <h4>Your Answer</h4>
      <form @submit.prevent="handlePostAnswer">
        <textarea 
          v-model="newAnswerContent" 
          placeholder="Type your answer here..."
          required
        ></textarea>
        <button type="submit" :disabled="answerStore.isLoading">
          {{ answerStore.isLoading ? 'Posting...' : 'Post Answer' }}
        </button>
      </form>
    </div>
    <div v-else>
      <p><router-link to="/login">Login</router-link> to post an answer.</p>
    </div>

  </div>
  
  <div v-else>
    <p>Question not found.</p>
  </div>

</template>

<script setup>
// src/views/QuestionDetailView.vue
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuestionStore } from '@/stores/questionStore';
import { useAnswerStore } from '@/stores/answerStore';
import { useUserStore } from '@/stores/userStore';
import { getQuestionById } from '@/services/firebase';
import Vote from '@/components/Shared/Vote.vue';

// --- Props & Route ---
const props = defineProps({
  id: {
    type: String,
    required: true,
  }
});

// --- Store Setup ---
const questionStore = useQuestionStore();
const answerStore = useAnswerStore();
const userStore = useUserStore();

// --- State ---
const newAnswerContent = ref('');
const question = ref(null); 
const isLoading = ref(true);
const error = ref(null);

// --- Actions ---
const handlePostAnswer = async () => {
  if (!newAnswerContent.value.trim()) return;
  
  await answerStore.postAnswer(newAnswerContent.value);
  
  if (!answerStore.error) {
    newAnswerContent.value = '';
  }
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  try {
    // 1. Try to get the question from the store first
    let foundQuestion = questionStore.allQuestions.find(q => q.id === props.id);

    if (foundQuestion) {
      question.value = foundQuestion;
    } else {
      // 2. If not in store (e.g., page refresh), fetch it
      const { success, question: fetchedQuestion, error: fetchError } = await getQuestionById(props.id);
      if (success) {
        question.value = fetchedQuestion;
        // Optional: add it to the store
        // questionStore.questions.push(fetchedQuestion);
      } else {
        throw fetchError;
      }
    }

    // 3. Now that we have the question, fetch its answers
    await answerStore.fetchAnswers(props.id);

  } catch (err) {
    console.error("Failed to load page data:", err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  answerStore.clearAnswers();
});
</script>

<style scoped>
/* Main Container */
div {
  max-width: 1400px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

/* Loading and Error States */
div:first-child {
  display: grid;
  place-items: center;
  min-height: 50vh;
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.125rem);
}

.error {
  padding: clamp(1rem, 3vw, 1.5rem);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius);
  color: #FCA5A5;
  font-size: clamp(0.9375rem, 2vw, 1rem);
  text-align: center;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Two-Column Grid Layout (Desktop) */
@media (min-width: 1024px) {
  div:has(.question-header) {
    display: grid;
    grid-template-columns: 1fr minmax(250px, 300px);
    gap: clamp(2rem, 4vw, 3rem);
    align-items: start;
  }
  
  .question-header,
  hr,
  .answers-section,
  .post-answer-form,
  div:has(> p > a[href="/login"]) {
    grid-column: 1;
  }
}

/* Question Header Section */
.question-header {
  padding: clamp(1.5rem, 4vw, 2.5rem);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
}

.question-header h2 {
  margin: 0 0 clamp(1rem, 3vw, 1.5rem);
  color: var(--color-text);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.question-header p {
  margin: 0 0 clamp(1.5rem, 3vw, 2rem);
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.question-header small {
  display: block;
  color: var(--color-text-muted);
  font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
  line-height: 1.6;
}

/* Code blocks within question/answer content */
.question-header pre,
.answers-section pre {
  padding: clamp(1rem, 2vw, 1.5rem);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  overflow-x: auto;
  margin: clamp(1rem, 2vw, 1.5rem) 0;
}

.question-header code,
.answers-section code {
  padding: 0.125rem 0.375rem;
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
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
  margin: clamp(2rem, 4vw, 3rem) 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

/* Answers Section */
.answers-section {
  margin-bottom: clamp(2rem, 4vw, 3rem);
}

.answers-section h3 {
  margin: 0 0 clamp(1.5rem, 3vw, 2rem);
  color: var(--color-text);
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.answers-section > div:first-of-type {
  padding: clamp(1rem, 3vw, 1.5rem);
  color: var(--color-text-muted);
  font-size: clamp(0.9375rem, 2vw, 1rem);
  text-align: center;
}

/* Answer List */
.answers-section ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.answers-section li {
  padding: clamp(1.5rem, 3vw, 2rem);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.answers-section li:hover {
  box-shadow: var(--shadow);
  border-color: rgba(127, 90, 240, 0.2);
}

.answers-section li.optimistic-post {
  opacity: 0.6;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.answers-section li p {
  margin: 0 0 clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.0625rem);
  line-height: 1.7;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.answers-section li small {
  display: block;
  color: var(--color-text-muted);
  font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
  line-height: 1.6;
}

.answers-section li small span {
  color: var(--color-accent);
  font-style: italic;
}

/* No Answers Message */
.answers-section > div:last-of-type p {
  padding: clamp(1.5rem, 3vw, 2rem);
  background-color: rgba(127, 90, 240, 0.05);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  font-size: clamp(0.9375rem, 2vw, 1rem);
  text-align: center;
  margin: 0;
}

/* Post Answer Form */
.post-answer-form {
  padding: clamp(1.5rem, 4vw, 2rem);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
}

.post-answer-form h4 {
  margin: 0 0 clamp(1rem, 3vw, 1.5rem);
  color: var(--color-text);
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.post-answer-form form {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.5vw, 1.5rem);
}

.post-answer-form textarea {
  width: 100%;
  min-height: 200px;
  padding: clamp(0.75rem, 2vw, 1rem);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1rem);
  font-family: var(--font-family);
  line-height: 1.6;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  resize: vertical;
}

.post-answer-form textarea::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.post-answer-form textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(127, 90, 240, 0.15);
}

.post-answer-form textarea:hover:not(:focus) {
  border-color: rgba(127, 90, 240, 0.5);
}

.post-answer-form button {
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border: none;
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: clamp(0.9375rem, 2vw, 1rem);
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);
  align-self: flex-start;
}

.post-answer-form button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(127, 90, 240, 0.4);
}

.post-answer-form button:active:not(:disabled) {
  transform: translateY(0);
}

.post-answer-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Login Prompt */
div:has(> p > a[href="/login"]) {
  padding: clamp(1rem, 3vw, 1.5rem);
  background-color: rgba(127, 90, 240, 0.05);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: var(--radius);
  text-align: center;
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
}

div:has(> p > a[href="/login"]) p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: clamp(0.9375rem, 2vw, 1rem);
}

div:has(> p > a[href="/login"]) a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

div:has(> p > a[href="/login"]) a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* Question Not Found */
div:last-child p {
  padding: clamp(2rem, 4vw, 3rem);
  color: var(--color-text-muted);
  font-size: clamp(1rem, 2vw, 1.125rem);
  text-align: center;
}

/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.4;
  }
}

/* Mobile font size minimum */
@media (max-width: 768px) {
  .post-answer-form textarea {
    font-size: 16px;
  }
}

/* Tablet adjustments */
@media (min-width: 641px) and (max-width: 1023px) {
  .question-header,
  .answers-section li,
  .post-answer-form {
    padding: 1.5rem;
  }
}

/* Desktop enhancements */
@media (min-width: 1024px) {
  .answers-section li:hover {
    transform: translateX(4px);
  }
  
  .post-answer-form button {
    min-width: 180px;
  }
}



/* --- ADD THESE STYLES AT THE END --- */

/* Grid layout for question/answer + votes */
.question-grid,
.answer-list-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(1rem, 3vw, 1.5rem);
  align-items: start;
}

/* Styles for the vote component container */
.vote-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding-top: 0.25rem; /* Aligns better with title */
  min-width: 60px;
}

/* Container for the main text content */
.question-main-content,
.answer-content {
  min-width: 0; /* Prevents text overflow issues */
}
</style>