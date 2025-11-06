<template>
  <div class="question-detail-container">
    <div v-if="isLoading" class="loading-state">
      Loading question details...
    </div>

    <div v-else-if="error" class="alert alert-error" role="alert">
      Failed to load question: {{ error }}
    </div>

    <div v-else-if="question" class="question-detail-content">
      
      <!-- QUESTION CARD -->
      <div class="question-card">
        <div class="question-grid">
          <div class="vote-wrapper">
            <Vote
              :itemId="question.id"
              :voteCount="question.voteCount"
              itemType="question"
            />
          </div>
          <div class="question-body">
            <h2 class="question-title">{{ question.title }}</h2>
            <p class="question-text">{{ question.content }}</p>
            <small class="question-meta">Asked by {{ question.authorUsername }}</small>
          </div>
        </div>
      </div>

      <!-- TIGHT SEPARATOR -->
      <hr />

      <!-- ANSWERS SECTION -->
      <div class="answers-container">
        <div class="answers-heading-row">
          <h3 class="answers-title">Answers</h3>
          <router-link
            v-if="userStore.isLoggedIn"
            :to="{ name: 'PostAnswer', params: { id: question.id } }"
            class="post-answer-btn"
          >
            Post Your Answer
          </router-link>
        </div>

        <div v-if="answerStore.isLoading" class="alert alert-info" role="status">
          Loading answers...
        </div>
        <div v-if="answerStore.error" class="alert alert-error">
          {{ answerStore.error }}
        </div>
        
        <ul v-if="answerStore.getAnswers.length" class="answers-list">
          <li
            v-for="answer in answerStore.getAnswers"
            :key="answer.id"
            :class="['answer-card', { 'optimistic-post': answer.isOptimistic }]"
          >
            <div class="answer-grid">
              <div class="vote-wrapper">
                <Vote
                  :itemId="answer.id"
                  :voteCount="answer.voteCount"
                  itemType="answer"
                />
              </div>
              <div class="answer-body">
                <p class="answer-text">{{ answer.content }}</p>
                <small class="answer-meta">
                  Answered by {{ answer.authorUsername }}
                  <span v-if="answer.isOptimistic"> (Posting...)</span>
                </small>
              </div>
            </div>
          </li>
        </ul>

        <div v-else-if="!answerStore.isLoading" class="alert alert-info">
          No answers yet. Be the first!
        </div>
      </div>

      <div v-if="!userStore.isLoggedIn" class="login-prompt">
        <p><router-link to="/login">Login</router-link> to post an answer.</p>
      </div>

    </div>
    
    <div v-else class="not-found">
      <p>Question not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useQuestionStore } from '@/stores/questionStore';
import { useAnswerStore } from '@/stores/answerStore';
import { useUserStore } from '@/stores/userStore';
import { getQuestionById } from '@/services/firebase';
import Vote from '@/components/Shared/Vote.vue';

const props = defineProps({
  id: {
    type: String,
    required: true,
  }
});

const questionStore = useQuestionStore();
const answerStore = useAnswerStore();
const userStore = useUserStore();

const question = ref(null); 
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    let foundQuestion = questionStore.allQuestions.find(q => q.id === props.id);

    if (foundQuestion) {
      question.value = foundQuestion;
    } else {
      const { success, question: fetchedQuestion, error: fetchError } = await getQuestionById(props.id);
      if (success) {
        question.value = fetchedQuestion;
      } else {
        throw fetchError;
      }
    }

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
/* ========================================
   RESET & CONTAINER - NUCLEAR OVERRIDE
   ======================================== */
.question-detail-container {
  max-width: 1100px !important;
  margin: 0 auto !important;
  padding: 1.25rem 1rem !important;
}

.question-detail-container * {
  box-sizing: border-box;
}

/* Force reset all spacing */
.question-detail-content {
  padding: 0 !important;
  margin: 0 !important;
}

/* ========================================
   LOADING & ERROR STATES
   ======================================== */
.loading-state,
.not-found {
  display: grid;
  place-items: center;
  min-height: 50vh;
  color: var(--color-text-muted, #9CA3AF);
  font-size: 1rem;
}

.alert {
  padding: 0.75rem 0.875rem !important;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  margin: 0 0 0.75rem 0 !important;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #FCA5A5;
}

.alert-info {
  background: rgba(127, 90, 240, 0.08);
  border: 1px solid rgba(127, 90, 240, 0.2);
  color: var(--color-text-muted, #9CA3AF);
}

/* ========================================
   QUESTION CARD - COMPACT
   ======================================== */
.question-card {
  padding: 0 !important;
  margin: 0 0 0.625rem 0 !important;
  background: transparent !important;
  border: none !important;
}

.question-grid,
.answer-grid {
  display: grid !important;
  grid-template-columns: 65px 1fr !important;
  gap: 0.875rem !important;
  align-items: start !important;
  padding: 0.75rem 0.875rem !important;
  background: rgba(26, 26, 26, 0.4) !important;
  border: 1px solid rgba(127, 90, 240, 0.15) !important;
  border-radius: 0.375rem !important;
  margin: 0 !important;
  min-height: 0 !important;
  height: auto !important;
}

/* ========================================
   VOTE WRAPPER - FORCE COMPACT
   ======================================== */
.vote-wrapper {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: flex-start !important;
  padding: 0 !important;
  margin: 0 !important;
  min-height: 0 !important;
  height: auto !important;
  gap: 0 !important;
}

/* Nuclear override for Vote.vue internals */
.vote-wrapper :deep(*) {
  min-height: 0 !important;
  margin: 0 !important;
}

.vote-wrapper :deep(.vote-buttons) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 0.25rem !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* ========================================
   QUESTION CONTENT
   ======================================== */
.question-body,
.answer-body {
  min-width: 0;
  padding: 0 !important;
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.question-title {
  margin: 0 !important;
  padding: 0 !important;
  color: var(--color-text, #F3F4F6);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
}

.question-text{
  margin: 0 !important;
  padding: 0 !important;
  color: var(--color-text, #F3F4F6);
  font-size: 1rem;
  line-height: 1.4 !important;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.answer-text {
  margin: 0 !important;
  padding: 0 !important;
  color: var(--color-text, #F3F4F6);
  font-size: 1rem;
  line-height: 1.4 !important;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.question-meta,
.answer-meta {
  margin: 0 !important;
  padding: 0 !important;
  color: var(--color-text-muted, #9CA3AF);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
}

.answer-meta span {
  color: var(--color-accent, #A78BFA);
  font-style: italic;
}

/* ========================================
   SEPARATOR - OVERRIDE GLOBAL .divider CLASS
   ======================================== */
hr {
  height: 1px !important;
  background: rgba(127, 90, 240, 0.15) !important;
  border: none !important;
  border-top: 1px solid rgba(127, 90, 240, 0.15) !important;
  margin: 0.625rem 0 !important;
  padding: 0 !important;
}

/* Double override in case .divider class is still present */
hr.divider {
  margin: 0.625rem 0 !important;
}

/* ========================================
   ANSWERS SECTION - FORCE TIGHT SPACING
   ======================================== */
.answers-container {
  padding: 0 !important;
  margin: 0 !important;
}

.answers-heading-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  gap: 0.875rem !important;
  margin: 0 0 0.75rem 0 !important;
  padding: 0 !important;
}

.answers-title {
  margin: 0 !important;
  padding: 0 !important;
  color: var(--color-text, #F3F4F6);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

/* ========================================
   POST ANSWER BUTTON
   ======================================== */
.post-answer-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1.125rem !important;
  background: linear-gradient(135deg, #7F5AF0 0%, #A78BFA 100%);
  border: none;
  border-radius: 0.375rem;
  color: #F3F4F6;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(127, 90, 240, 0.25);
  margin: 0 !important;
}

.post-answer-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(127, 90, 240, 0.35);
}

/* ========================================
   ANSWERS LIST - ULTRA COMPACT
   ======================================== */
.answers-list {
  list-style: none !important;
  padding: 0 !important;
  margin: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0.5rem !important;
}

.answer-card {
  padding: 0 !important;
  margin: 0 !important;
  background: transparent !important;
  border: none !important;
  min-height: 0 !important;
  height: auto !important;
}

.answer-card.optimistic-post {
  opacity: 0.6;
}

.answer-card:hover .answer-grid {
  border-color: rgba(127, 90, 240, 0.35) !important;
  background: rgba(26, 26, 26, 0.6) !important;
}

/* ========================================
   LOGIN PROMPT
   ======================================== */
.login-prompt {
  padding: 0.875rem 1rem !important;
  background: rgba(127, 90, 240, 0.05);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 0.375rem;
  text-align: center;
  margin: 0.875rem 0 0 0 !important;
}

.login-prompt p {
  margin: 0 !important;
  color: var(--color-text-muted, #9CA3AF);
  font-size: 0.875rem;
  font-weight: 500;
}

.login-prompt a {
  color: var(--color-accent, #A78BFA);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.login-prompt a:hover {
  color: #7F5AF0;
  text-decoration: underline;
}

/* ========================================
   RESPONSIVE
   ======================================== */
@media (max-width: 768px) {
  .answers-heading-row {
    flex-direction: column !important;
    align-items: stretch !important;
  }
  
  .post-answer-btn {
    width: 100%;
    justify-content: center;
  }
  
  .question-grid,
  .answer-grid {
    grid-template-columns: 58px 1fr !important;
    gap: 0.75rem !important;
  }
}

@media (max-width: 480px) {
  .question-detail-container {
    padding: 1rem 0.75rem !important;
  }
  
  .question-grid,
  .answer-grid {
    grid-template-columns: 52px 1fr !important;
    gap: 0.625rem !important;
    padding: 0.5rem 0.625rem !important;
  }
  
  .question-title {
    font-size: 1.125rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>