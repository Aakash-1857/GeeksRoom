<template>
  <div> <div> 
      <h2>Sign Up</h2>
      <form @submit.prevent="handleSubmit">
        <input type="text" v-model="username" placeholder="Username" required />
        <input type="email" v-model="email" placeholder="Email" required />
        <input type="password" v-model="password" placeholder="Password" required />
        <button type="submit" :disabled="userStore.isLoading">Sign Up</button>
      </form>
      
      <div v-if="userStore.error" class="alert alert-error" role="alert">{{ userStore.error }}</div>

      <p class="login-prompt">
        Already have an account? 
        <router-link to="/login">Login</router-link>
      </p>
    </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  const { success } = await userStore.handleSignUp(
    email.value, 
    password.value, 
    username.value
  );
  if (success) {
    // On success, the auth listener in App.vue will update state,
    // and we can redirect the user.
    router.push('/feed');
  }
};
</script>



<style scoped>
/* Container - centers the form card */
div {
  position: relative;
  display: grid;
  place-items: center;
  min-height: calc(100vh - 8rem);
  padding: clamp(1rem, 3vw, 2rem);
  overflow: hidden;
}

/* Animated background elements */
div::before {
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

div::after {
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
div > div {
  position: relative;
  width: 100%;
  max-width: 28rem;
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
div > div::before {
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

div > div:hover::before {
  opacity: 1;
}

/* Heading */
h2 {
  margin: 0 0 clamp(2rem, 5vw, 2.5rem);
  color: var(--color-text);
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  font-weight: 800;
  text-align: center;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeIn 0.6s ease-out 0.2s backwards;
}

/* Form */
form {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 1.25rem);
  animation: fadeIn 0.6s ease-out 0.4s backwards;
}

/* Input fields */
input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: clamp(1rem, 2.5vw, 1.125rem);
  background: rgba(13, 13, 13, 0.8);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 0.75rem;
  color: var(--color-text);
  font-size: clamp(1rem, 2vw, 1rem);
  font-family: var(--font-family);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  backdrop-filter: blur(10px);
}

input[type="text"]::placeholder,
input[type="email"]::placeholder,
input[type="password"]::placeholder {
  color: var(--color-text-muted);
  opacity: 0.6;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus {
  border-color: var(--color-primary);
  background: rgba(13, 13, 13, 0.95);
  box-shadow: 0 0 0 4px rgba(127, 90, 240, 0.15),
              0 8px 24px rgba(127, 90, 240, 0.2);
  transform: translateY(-2px);
}

input[type="text"]:hover:not(:focus),
input[type="email"]:hover:not(:focus),
input[type="password"]:hover:not(:focus) {
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

/* Login prompt */
.login-prompt {
  margin-top: clamp(1.75rem, 4vw, 2rem);
  text-align: center;
  color: var(--color-text-muted);
  font-size: clamp(0.9375rem, 2vw, 1rem);
  animation: fadeIn 0.6s ease-out 0.6s backwards;
}

.login-prompt a {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.login-prompt a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-prompt a:hover {
  color: var(--color-primary);
}

.login-prompt a:hover::after {
  width: 100%;
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
  div > div {
    padding: clamp(1.5rem, 5vw, 2rem);
    border-radius: 1rem;
  }
  
  h2 {
    margin-bottom: 1.75rem;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    padding: 0.875rem;
  }
  
  button[type="submit"] {
    padding: 0.875rem;
  }
}

/* Ensure 16px minimum on mobile to prevent zoom */
@media (max-width: 768px) {
  input[type="text"],
  input[type="email"],
  input[type="password"] {
    font-size: 16px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  div > div {
    border-width: 2px;
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"] {
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