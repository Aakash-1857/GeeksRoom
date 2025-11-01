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
/* This is the exact style block from Claude's example */
.vote-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.vote-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: 2px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  border-radius: 0.375rem;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vote-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  background-color: rgba(127, 90, 240, 0.1);
}

.vote-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.vote-btn.active {
  border-color: var(--color-primary);
  background-color: var(--color-primary);
  color: white;
  font-weight: bold;
}

.upvote-btn.active {
  background-color: #10b981;
  border-color: #10b981;
}

.downvote-btn.active {
  background-color: #ef4444;
  border-color: #ef4444;
}

.vote-count {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  min-width: 2rem;
  text-align: center;
}
</style>