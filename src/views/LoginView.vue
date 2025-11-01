<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleSubmit">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit" :disabled="userStore.isLoading">Login</button>
    </form>
    <div v-if="userStore.error">{{ userStore.error }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  const { success } = await userStore.handleSignIn(
    email.value, 
    password.value
  );
  if (success) {
    // On success, redirect to the home page
    router.push('/');
  }
};
</script>

<style scoped>
/* Container - centers the form card */
div {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 8rem);
  padding: clamp(1rem, 3vw, 2rem);
}

/* Form card wrapper */
div > div {
  width: 100%;
  max-width: 28rem;
  padding: var(--space-lg);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

/* Heading */
h2 {
  margin: 0 0 clamp(1.5rem, 4vw, 2rem);
  color: var(--color-text);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  text-align: center;
  letter-spacing: -0.025em;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2.5vw, 1.5rem);
}

/* Input fields */
input[type="email"],
input[type="password"] {
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
}

input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: var(--color-text-muted);
  opacity: 0.7;
}

input[type="email"]:focus,
input[type="password"]:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(127, 90, 240, 0.15);
  transform: translateY(-1px);
}

input[type="email"]:hover:not(:focus),
input[type="password"]:hover:not(:focus) {
  border-color: rgba(127, 90, 240, 0.5);
}

/* Submit button */
button[type="submit"] {
  width: 100%;
  padding: clamp(0.75rem, 2vw, 1rem);
  margin-top: clamp(0.5rem, 2vw, 1rem);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border: none;
  border-radius: var(--radius);
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1.0625rem);
  font-weight: 600;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);
}

button[type="submit"]:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-accent), var(--color-primary));
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(127, 90, 240, 0.4);
}

button[type="submit"]:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(127, 90, 240, 0.3);
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
}

/* Error message */
div:last-child {
  margin-top: clamp(1rem, 2.5vw, 1.5rem);
  padding: clamp(0.75rem, 2vw, 1rem);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: var(--radius);
  color: #FCA5A5;
  font-size: clamp(0.875rem, 1.5vw, 0.9375rem);
  text-align: center;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Helper text / links (if you add them later) */
a {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

a:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

/* Animation for error message */
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

/* Responsive adjustments */
@media (max-width: 640px) {
  div > div {
    border: none;
    box-shadow: none;
    background-color: transparent;
  }
  
  h2 {
    margin-bottom: 1.5rem;
  }
}

/* Ensure 16px minimum on mobile to prevent zoom */
@media (max-width: 768px) {
  input[type="email"],
  input[type="password"] {
    font-size: 16px;
  }
}
</style>