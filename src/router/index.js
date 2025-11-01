// src/router/index.js

import { useUserStore } from '@/stores/userStore';
import { createRouter, createWebHistory } from 'vue-router';


// We can define a simple auth guard
const requireAuth = (to, from, next) => {
  const userStore = useUserStore()
  // We rely on the store's "isLoggedIn" getter
  // but the store might not be ready yet.
  // We'll add a 'isAuthReady' guard later if needed.
  // For now, this is the simple version.
  if (!userStore.isLoggedIn) {
    next({ name: 'Login' });
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'), // Lazy load
    // This view will contain the QuestionCatalog
    // We'll add 'beforeEnter: requireAuth' later
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'), // Lazy load
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('@/views/SignupView.vue'), // Lazy load
  },
  {
    path: '/question/:id',
    name: 'QuestionDetail',
    component: () => import('@/views/QuestionDetailView.vue'), // Lazy load
    // We'll create this file in the next step
    props: true,
  },
];

const router = createRouter({
  // --- THIS IS THE FIX ---
  // Before: history: createWebHistory(process.env.BASE_URL),
  // After:
  history: createWebHistory(), // Pass no arguments
  routes,
});

export default router;