<template>
  <div class="question-catalog">
    <div v-if="userStore.isLoggedIn" class="post-question-form">
      <h3>Ask a New Question</h3>
      <form @submit.prevent="handlePostQuestion">
        <input
          type="text"
          v-model="newQuestionTitle"
          placeholder="What's your question?"
          required
        />
        <textarea
          v-model="newQuestionContent"
          placeholder="Add more details..."
          required
        ></textarea>
        <button type="submit" :disabled="questionStore.isLoading">
          {{ questionStore.isLoading ? "Posting..." : "Post Question" }}
        </button>
      </form>
      <div v-if="questionStore.error" class="error">
        {{ questionStore.error }}
      </div>
    </div>

    <div v-if="!userStore.isLoggedIn">
      <p>
        Please <router-link to="/login">login</router-link> to post a question.
      </p>
    </div>

    <hr />

    <h2>Question Feed</h2>
    <div v-if="questionStore.isLoading && !questionStore.allQuestions.length">
      Loading questions...
    </div>
    <div v-if="questionStore.error" class="error">
      Failed to load questions: {{ questionStore.error }}
    </div>

    <ul v-if="questionStore.allQuestions.length" class="question-list">
      <li
        v-for="question in questionStore.allQuestions"
        :key="question.id"
        :class="{ 'optimistic-post': question.isOptimistic }"
      >
        <div class="vote-controls">
          <Vote 
            :itemId="question.id" 
            :voteCount="question.voteCount" 
            itemType="question" 
          />
        </div>
        <div class="question-content">
          <router-link
            :to="{ name: 'QuestionDetail', params: { id: question.id } }"
          >
            <h3>{{ question.title }}</h3>
          </router-link>
          <p>
            Asked by {{ question.authorUsername }}
            <span v-if="question.isOptimistic"> (Posting...)</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuestionStore } from "@/stores/questionStore";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import Vote from '@/components/Shared/Vote.vue';

// --- Store Setup ---
const questionStore = useQuestionStore();
const userStore = useUserStore();
// We don't need storeToRefs for userStore if we only use it for logic/getters
// but we do for questionStore to make the list reactive in the template
const { allQuestions, isLoading, error } = storeToRefs(questionStore);

// --- State for New Question Form ---
const newQuestionTitle = ref("");
const newQuestionContent = ref("");

// --- Actions ---
const handlePostQuestion = async () => {
  if (!newQuestionTitle.value.trim() || !newQuestionContent.value.trim()) {
    return; // Simple validation
  }

  // Call the optimistic action from the store
  await questionStore.postQuestion(
    newQuestionTitle.value,
    newQuestionContent.value
  );

  // Clear the form only if there was no error
  if (!questionStore.error) {
    newQuestionTitle.value = "";
    newQuestionContent.value = "";
  }
};



// --- Lifecycle ---
onMounted(() => {
  // Fetch questions when the component is first loaded
  questionStore.fetchQuestions();
});
</script>

<style scoped>
.question-catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(1rem, 3vw, 2rem);
}

/* Post Question Form Section */
.post-question-form {
  margin-bottom: clamp(2rem, 5vw, 3rem);
  padding: clamp(1.5rem, 4vw, 2rem);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.post-question-form h3 {
  margin: 0 0 clamp(1rem, 3vw, 1.5rem);
  color: var(--color-text);
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.post-question-form form {
  display: flex;
  flex-direction: column;
  gap: clamp(0.75rem, 2vw, 1rem);
}

.post-question-form input[type="text"],
.post-question-form textarea {
  width: 100%;
  padding: clamp(0.75rem, 2vw, 1rem);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1rem);
  font-family: var(--font-family);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  resize: vertical;
}

.post-question-form textarea {
  min-height: 120px;
}

.post-question-form input[type="text"]::placeholder,
.post-question-form textarea::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

.post-question-form input[type="text"]:focus,
.post-question-form textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(127, 90, 240, 0.15);
}

.post-question-form button {
  padding: clamp(0.75rem, 2vw, 1rem);
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
}

.post-question-form button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(127, 90, 240, 0.4);
}

.post-question-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Login prompt */
.question-catalog > div:not(.post-question-form) {
  padding: clamp(1rem, 3vw, 1.5rem);
  background-color: rgba(127, 90, 240, 0.05);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: var(--radius);
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.question-catalog > div:not(.post-question-form) p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: clamp(0.9375rem, 2vw, 1rem);
}

.question-catalog > div:not(.post-question-form) a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-catalog > div:not(.post-question-form) a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* Separator */
hr {
  margin: clamp(2rem, 5vw, 3rem) 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

/* Feed Heading */
h2 {
  margin: 0 0 clamp(1.5rem, 4vw, 2rem);
  color: var(--color-text);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  letter-spacing: -0.025em;
}

/* Error messages */
.error {
  padding: clamp(0.75rem, 2vw, 1rem);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius);
  color: #FCA5A5;
  font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
  text-align: center;
  margin-top: clamp(0.75rem, 2vw, 1rem);
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Question List */
.question-list {
  display: grid;
  gap: clamp(1rem, 2.5vw, 1.5rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

/* Question Card */
.question-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: clamp(1rem, 3vw, 1.5rem);
  padding: clamp(1rem, 3vw, 1.5rem);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.question-list li:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
  border-color: rgba(127, 90, 240, 0.3);
}

.question-list li.optimistic-post {
  opacity: 0.6;
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Vote Controls Sidebar */
.vote-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  min-width: 60px;
}

.vote-controls button {
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.vote-controls button:hover {
  background-color: rgba(127, 90, 240, 0.1);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: scale(1.1);
}

.vote-controls button:active {
  transform: scale(0.95);
}

.vote-controls span {
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.125rem);
  font-weight: 600;
  padding: 0.25rem 0;
}

/* Question Content */
.question-content {
  min-width: 0;
}

.question-content h3 {
  margin: 0 0 clamp(0.5rem, 1.5vw, 0.75rem);
  color: var(--color-text);
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.025em;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.question-content a {
  text-decoration: none;
  color: inherit;
}

.question-content a:hover h3 {
  color: var(--color-accent);
}

.question-content p {
  margin: 0;
  color: var(--color-text-muted);
  font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
  line-height: 1.6;
}

.question-content p span {
  color: var(--color-accent);
  font-style: italic;
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

/* Responsive adjustments */
@media (max-width: 640px) {
  .question-list li {
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .vote-controls {
    min-width: 50px;
    padding: 0.25rem;
  }
  
  .vote-controls button {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }
  
  .vote-controls span {
    font-size: 0.9375rem;
  }
}

/* Mobile font size minimum */
@media (max-width: 768px) {
  .post-question-form input[type="text"],
  .post-question-form textarea {
    font-size: 16px;
  }
}

/* Desktop enhancements */
@media (min-width: 1024px) {
  .question-list {
    gap: 1.5rem;
  }
  
  .question-list li:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(127, 90, 240, 0.15);
  }
}
</style>
