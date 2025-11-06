<template>
  <div class="post-answer-view">
    <div class="post-answer-form">
      <h4>Your Answer</h4>
      <p>
        Posting an answer to:
        <strong>{{ questionTitle }}</strong>
      </p>
      <form @submit.prevent="handlePostAnswer">
        <textarea
          v-model="newAnswerContent"
          placeholder="Type your answer here..."
          required
        ></textarea>
        <button type="submit" :disabled="answerStore.isLoading">
          {{ answerStore.isLoading ? "Posting..." : "Post Answer" }}
        </button>
      </form>
      <div v-if="answerStore.error" class="alert alert-error" role="alert">
        {{ answerStore.error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAnswerStore } from "@/stores/answerStore";
import { useQuestionStore } from "@/stores/questionStore";
import { useRouter } from "vue-router";

// --- Props & Route ---
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const answerStore = useAnswerStore();
const questionStore = useQuestionStore();

// --- State ---
const newAnswerContent = ref("");

// Get the question title for context
const questionTitle = computed(() => {
  const q = questionStore.allQuestions.find((q) => q.id === props.id);
  return q ? q.title : "this question";
});

// --- Actions ---
const handlePostAnswer = async () => {
  if (!newAnswerContent.value.trim()) return;

  // Set the current question ID in the store, just in case
  answerStore.currentQuestionId = props.id;

  await answerStore.postAnswer(newAnswerContent.value);

  // --- THIS IS THE CHANGE ---
  // On success, redirect back to the QuestionDetail page
  if (!answerStore.error) {
    router.push({ name: "QuestionDetail", params: { id: props.id } });
  }
};
</script>

<style scoped>
/* Container - centers the form card */
.post-answer-view {
  position: relative;
  display: grid;
  place-items: center;
  min-height: calc(100vh - 8rem);
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
}

/* Animated background elements */
.post-answer-view::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(127, 90, 240, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 20s infinite ease-in-out;
}

.post-answer-view::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(157, 127, 234, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: float 25s infinite ease-in-out reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(50px, -50px) scale(1.05); }
  66% { transform: translate(-50px, 50px) scale(0.95); }
}

/* Form card wrapper */
.post-answer-view > * {
  position: relative;
  width: 100%;
  max-width: 42rem;
  padding: clamp(2rem, 5vw, 3rem);
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(127, 90, 240, 0.2),
              0 0 0 1px rgba(127, 90, 240, 0.1) inset;
  animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

/* Subtle glow effect on card */
.post-answer-view > *::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, 
    rgba(127, 90, 240, 0.1) 0%, 
    transparent 50%, 
    rgba(157, 127, 234, 0.1) 100%);
  border-radius: 1.5rem;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.4s;
}

.post-answer-view > *:hover::before {
  opacity: 1;
}

/* Heading */
h4 {
  margin: 0 0 clamp(1.25rem, 3vw, 1.5rem);
  color: var(--color-text);
  font-size: clamp(1.5rem, 4vw, 1.875rem);
  font-weight: 800;
  text-align: center;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeIn 0.6s ease-out 0.2s backwards;
}

/* Context paragraph */
p {
  margin: 0 0 clamp(2rem, 4vw, 2.5rem);
  padding: clamp(1rem, 2.5vw, 1.25rem);
  background: rgba(13, 13, 13, 0.5);
  border: 1px solid rgba(127, 90, 240, 0.15);
  border-radius: 0.75rem;
  color: var(--color-text-muted);
  font-size: clamp(0.9375rem, 2vw, 1rem);
  line-height: 1.7;
  text-align: center;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.6s ease-out 0.3s backwards;
}

p strong {
  display: block;
  margin-top: 0.5rem;
  color: var(--color-text);
  font-weight: 700;
  font-size: clamp(1rem, 2vw, 1.125rem);
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 1.25rem);
  animation: fadeIn 0.6s ease-out 0.4s backwards;
}

/* Textarea */
textarea {
  width: 100%;
  min-height: 200px;
  max-height: 500px;
  padding: clamp(1rem, 2.5vw, 1.125rem);
  background: rgba(13, 13, 13, 0.8);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 0.75rem;
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1rem);
  font-family: var(--font-family);
  line-height: 1.6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  backdrop-filter: blur(10px);
  resize: vertical;
}

textarea::placeholder {
  color: var(--color-text-muted);
  opacity: 0.6;
}

textarea:focus {
  border-color: var(--color-primary);
  background: rgba(13, 13, 13, 0.95);
  box-shadow: 0 0 0 4px rgba(127, 90, 240, 0.15),
              0 8px 24px rgba(127, 90, 240, 0.2);
  transform: translateY(-2px);
}

textarea:hover:not(:focus) {
  border-color: rgba(127, 90, 240, 0.4);
  background: rgba(13, 13, 13, 0.9);
}

/* Submit button */
button[type="submit"] {
  position: relative;
  width: 100%;
  padding: clamp(1rem, 2.5vw, 1.125rem);
  margin-top: clamp(0.5rem, 2vw, 0.75rem);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border: none;
  border-radius: 0.75rem;
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.0625rem);
  font-weight: 700;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 40px rgba(127, 90, 240, 0.3),
              0 0 0 1px rgba(127, 90, 240, 0.3) inset;
  overflow: hidden;
}

/* Button shine effect */
button[type="submit"]::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

button[type="submit"]:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(127, 90, 240, 0.4),
              0 0 0 1px rgba(127, 90, 240, 0.5) inset;
}

button[type="submit"]:hover:not(:disabled)::before {
  opacity: 1;
}

button[type="submit"]:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 8px 30px rgba(127, 90, 240, 0.3),
              0 0 0 1px rgba(127, 90, 240, 0.3) inset;
}

button[type="submit"]:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Error message */
.error-message {
  margin-top: clamp(1.25rem, 3vw, 1.5rem);
  padding: clamp(0.875rem, 2.5vw, 1rem);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  color: #FCA5A5;
  font-size: clamp(0.875rem, 1.8vw, 0.9375rem);
  font-weight: 500;
  text-align: center;
  backdrop-filter: blur(10px);
  animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .post-answer-view > * {
    padding: clamp(1.5rem, 5vw, 2rem);
    border-radius: 1rem;
  }
  
  h4 {
    margin-bottom: 1.25rem;
  }
  
  p {
    padding: 0.875rem;
  }
  
  textarea {
    padding: 0.875rem;
    min-height: 180px;
  }
  
  button[type="submit"] {
    padding: 0.875rem;
  }
}

/* Ensure 16px minimum on mobile to prevent zoom */
@media (max-width: 768px) {
  textarea {
    font-size: 16px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .post-answer-view > * {
    border-width: 2px;
  }
  
  textarea {
    border-width: 2px;
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