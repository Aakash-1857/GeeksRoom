<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <span v-if="!isLoggedIn">
      <router-link to="/login">Login</router-link> |
      <router-link to="/signup">Signup</router-link>
    </span>
    <span v-if="isLoggedIn">
      <span>Welcome, {{ username }}</span> |
      <button @click="handleLogout">Logout</button>
    </span>
  </nav>

  <div v-if="userStore.isAuthReady">Loading App...</div>
  
 <router-view v-slot="{ Component }">
    <keep-alive include="HomeView">
      <component :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, username,isAuthReady } = storeToRefs(userStore);

// This is the most important part of App.vue
onMounted(() => {
  userStore.listenForAuthChanges();
});

const handleLogout = async () => {
  await userStore.handleSignOut();
  // Redirect to home after logout
  router.push('/'); 
};
</script>

<style scoped>
nav {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  padding: clamp(1rem, 3vw, 1.5rem) clamp(1.5rem, 5vw, 3rem);
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

nav a {
  position: relative;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

nav a::after {
  content: '';
  position: absolute;
  bottom: -0.25rem;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

nav a:hover,
nav a.router-link-active {
  color: var(--color-primary);
}

nav a:hover::after,
nav a.router-link-active::after {
  width: 100%;
}

nav span {
  display: inline-flex;
  align-items: center;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  color: var(--color-text);
  font-size: clamp(0.875rem, 1.5vw, 1rem);
}

nav button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-muted);
  font-weight: 500;
  font-size: clamp(0.875rem, 1.5vw, 1rem);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

nav button:hover {
  background-color: rgba(127, 90, 240, 0.1);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-1px);
}

nav button:active {
  transform: translateY(0);
}

/* Main content wrapper */
:deep(.router-view-wrapper) {
  padding: clamp(2rem, 5vw, 3rem);
  min-height: calc(100vh - 5rem);
}

/* If you're wrapping router-view in a div, target it directly */
div:has(> *) {
  padding: clamp(2rem, 5vw, 3rem);
  max-width: 1400px;
  margin: 0 auto;
}

/* Loading state */
div:has-text("Loading") {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  color: var(--color-text-muted);
  font-size: 1.125rem;
}
</style>