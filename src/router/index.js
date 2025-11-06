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
    name: 'Landing',
    component: () => import('@/views/LandingView.vue'), // Lazy load
    // This view will contain the QuestionCatalog
    // We'll add 'beforeEnter: requireAuth' later
  },
  {
    path:'/feed',
    name:'Home',
    component: ()=>import('@/views/HomeView.vue')
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
    path: '/ask',
    name: 'AskQuestion',
    component: () => import('@/views/AskQuestionView.vue'), // We will create this file next
    beforeEnter: requireAuth, // This protects the route!
  },
  {
    path: '/question/:id',
    name: 'QuestionDetail',
    component: () => import('@/views/QuestionDetailView.vue'), // Lazy load
    // We'll create this file in the next step
    props: true,
  },
  {
    path: '/question/:id/answer',
    name: 'PostAnswer',
    component: () => import('@/views/PostAnswerView.vue'), // We will create this file next
    beforeEnter: requireAuth, // This protects the route!
    props: true, // This passes the :id as a prop
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