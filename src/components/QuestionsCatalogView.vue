<template>
  <div class="question-catalog">
    <div class="catalog-header">
      <h2>Question Feed</h2>
      <router-link :to="{ name: 'AskQuestion' }" class="ask-button">
        Ask a New Question
      </router-link>
    </div>

    <div v-if="questionStore.isLoading && !questionStore.allQuestions.length"
    class="alert alert-info" role="status">
      Loading questions...
    </div>
    <div v-if="questionStore.error" class="alert alert-error" role="alert">
      Failed to load questions: {{ questionStore.error }}
    </div>

    <ul v-if="questionStore.allQuestions.length" class="question-list">
      <li
        v-for="question in questionStore.allQuestions"
        :key="question.id"
        :class="{ 'optimistic-post': question.isOptimistic }"
      >
        <div class="vote-section">
          <Vote 
            :itemId="question.id" 
            :voteCount="question.voteCount" 
            itemType="question" 
          />
        </div>
        <div class="question-summary">
          <router-link
            :to="{ name: 'QuestionDetail', params: { id: question.id } }"
            class="question-title-link"
          >
            <h3>{{ question.title }}</h3>
          </router-link>
          <p class="question-meta">
            Asked by <span class="author-name">{{ question.authorUsername }}</span>
            <span v-if="question.isOptimistic" class="posting-status"> (Posting...)</span>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useQuestionStore } from "@/stores/questionStore";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";
import Vote from '@/components/Shared/Vote.vue';

// --- Store Setup ---
const questionStore = useQuestionStore();
const userStore = useUserStore();
// We kept all the store logic needed for the *feed*
const { allQuestions, isLoading, error } = storeToRefs(questionStore);

// --- All form-related state and functions have been REMOVED ---

// --- Lifecycle ---
onMounted(() => {
  // Fetch questions when the component is first loaded
  questionStore.fetchQuestions();
});
</script>

<style scoped>
/* ========================================
   MAIN CONTAINER
   ======================================== */
.question-catalog {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1rem;
}

/* ========================================
   HEADER SECTION
   ======================================== */
.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.875rem;
  border-bottom: 1px solid rgba(127, 90, 240, 0.15);
}

.catalog-header h2 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.625rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ========================================
   ASK QUESTION BUTTON
   ======================================== */
.ask-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.125rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border: none;
  border-radius: 0.375rem;
  color: var(--color-text);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(127, 90, 240, 0.25);
}

.ask-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(127, 90, 240, 0.35);
}

.ask-button:active {
  transform: translateY(0);
}

/* ========================================
   ALERT MESSAGES
   ======================================== */
.alert {
  padding: 0.75rem 0.875rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: center;
}

.alert-info {
  background: rgba(127, 90, 240, 0.08);
  border: 1px solid rgba(127, 90, 240, 0.2);
  color: var(--color-text-muted);
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #FCA5A5;
}

/* ========================================
   QUESTION LIST - ULTRA COMPACT
   ======================================== */
.question-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* ========================================
   QUESTION CARD - STACKOVERFLOW COMPACT STYLE
   ======================================== */
.question-list li {
  display: grid;
  grid-template-columns: 65px 1fr;
  grid-template-rows: auto;
  align-items: start;
  gap: 0.875rem;
  padding: 0.75rem 0.875rem;
  background: rgba(26, 26, 26, 0.4);
  border: 1px solid rgba(127, 90, 240, 0.15);
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  min-height: 0;
  height: auto;
}

.question-list li:hover {
  border-color: rgba(127, 90, 240, 0.35);
  background: rgba(26, 26, 26, 0.6);
}

.question-list li.optimistic-post {
  opacity: 0.6;
}

/* ========================================
   VOTE SECTION - FORCE COMPACT
   ======================================== */
.vote-section {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  align-self: start;
  min-height: 0;
  height: auto;
  padding: 0;
  margin: 0;
}

/* Override any Vote.vue internal spacing */
.vote-section :deep(*) {
  min-height: 0 !important;
}

/* ========================================
   QUESTION SUMMARY - TIGHT SPACING
   ======================================== */
.question-summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 0;
  margin: 0;
  align-self: start;
}

.question-title-link {
  text-decoration: none;
  color: inherit;
  display: block;
  line-height: 1;
}

.question-summary h3 {
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-size: 1.0625rem;
  font-weight: 600;
  line-height: 1.35;
  transition: color 0.2s ease;
}

.question-title-link:hover h3 {
  color: var(--color-accent);
}

.question-meta {
  margin: 0;
  padding: 0;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  line-height: 1.4;
}

.author-name {
  color: var(--color-accent);
  font-weight: 500;
}

.posting-status {
  color: var(--color-text-muted);
  font-style: italic;
  font-weight: 400;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */
@media (max-width: 768px) {
  .catalog-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .catalog-header h2 {
    text-align: center;
    font-size: 1.5rem;
  }
  
  .ask-button {
    width: 100%;
    justify-content: center;
  }
  
  .question-list li {
    grid-template-columns: 58px 1fr;
    gap: 0.75rem;
    padding: 0.625rem 0.75rem;
  }
  
  .question-summary h3 {
    font-size: 0.9375rem;
  }
}

@media (max-width: 480px) {
  .question-catalog {
    padding: 1rem 0.75rem;
  }
  
  .question-list li {
    grid-template-columns: 52px 1fr;
    gap: 0.625rem;
    padding: 0.5rem 0.625rem;
  }
  
  .question-summary h3 {
    font-size: 0.875rem;
  }
  
  .question-meta {
    font-size: 0.6875rem;
  }
}

/* ========================================
   ACCESSIBILITY
   ======================================== */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (prefers-contrast: high) {
  .question-list li {
    border-width: 2px;
  }
}
</style>