<template>
  <!-- Fixed Navbar -->
  <nav class="navbar">
    <div class="nav-container">
      <!-- Brand Logo -->
      <router-link to="/" class="nav-brand" @click="closeMenu">
        Q&A Platform
      </router-link>

      <!-- Hamburger Toggle Button -->
      <button 
        @click="toggleMobileMenu" 
        class="mobile-nav-toggle"
        :class="{ 'is-active': isMobileMenuOpen }"
        :aria-expanded="isMobileMenuOpen"
        aria-controls="nav-menu"
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Navigation Menu -->
      <div 
        class="nav-menu" 
        id="nav-menu"
        :class="{ 'is-open': isMobileMenuOpen }"
      >
        <!-- Logged Out Navigation -->
        <div v-if="!isLoggedIn" class="nav-links">
          <router-link to="/" @click="closeMenu">Home</router-link>
          <router-link to="/login" @click="closeMenu">Login</router-link>
          <router-link to="/signup" @click="closeMenu" class="nav-button-signup">
            Sign Up
          </router-link>
        </div>
        
        <!-- Logged In Navigation -->
        <div v-if="isLoggedIn" class="nav-links">
          <router-link to="/feed" @click="closeMenu">Feed</router-link>
          <span class="nav-welcome">Welcome, {{ username }}</span>
          <button @click="handleLogout" class="nav-button-logout">Logout</button>
        </div>
      </div>
    </div>
  </nav>

  <!-- Mobile Menu Overlay (Click-away-to-close) -->
  <div 
    v-if="isMobileMenuOpen" 
    class="mobile-menu-overlay"
    @click="closeMenu"
  ></div>

  <!-- App Loading State -->
  <div v-if="!isAuthReady" class="loading-app-container">
    <div class="loading-spinner"></div>
    <p>Loading App...</p>
  </div>
  
  <!-- Main Router View -->
  <main v-else class="main-content">
    <router-view v-slot="{ Component }">
      <keep-alive include="HomeView">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const { isLoggedIn, username, isAuthReady } = storeToRefs(userStore);

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMenu = () => {
  isMobileMenuOpen.value = false;
};

// Close menu on escape key
const handleEscapeKey = (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMenu();
  }
};

// CRITICAL: Listen for auth changes on mount
onMounted(() => {
  userStore.listenForAuthChanges();
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
});

// Logout handler
const handleLogout = async () => {
  await userStore.handleSignOut();
  closeMenu();
  router.push('/'); 
};
</script>

<style scoped>
/* Fixed Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(26, 26, 26, 0.8);
  border-bottom: 1px solid rgba(127, 90, 240, 0.2);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 1rem clamp(1.5rem, 5vw, 3rem);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  animation: slideDown 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

/* Brand Logo */
.nav-brand {
  font-size: 1.375rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.nav-brand::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-brand:hover::after {
  width: 100%;
}

/* Desktop Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

/* Navigation Links */
.nav-links a {
  position: relative;
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--color-primary);
}

.nav-links a:hover::after,
.nav-links a.router-link-active::after {
  width: 100%;
}

/* Welcome Text */
.nav-welcome {
  color: var(--color-text);
  font-size: 0.9375rem;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  background: rgba(127, 90, 240, 0.1);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}

/* Button Styles */
.nav-button-signup,
.nav-button-logout {
  position: relative;
  padding: 0.625rem 1.25rem;
  border: 1px solid rgba(127, 90, 240, 0.3);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--color-text);
  font-weight: 600;
  font-size: 0.9375rem;
  font-family: var(--font-family);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.nav-button-signup {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(127, 90, 240, 0.3);
}

.nav-button-signup::before,
.nav-button-logout::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.nav-button-signup:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(127, 90, 240, 0.4);
}

.nav-button-signup:hover::before {
  opacity: 1;
}

.nav-button-logout:hover {
  background: rgba(127, 90, 240, 0.15);
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

.nav-button-logout:hover::before {
  opacity: 1;
}

/* Hamburger Menu Toggle */
.mobile-nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 28px;
  height: 28px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 1001;
  padding: 0;
}

.mobile-nav-toggle span {
  display: block;
  width: 100%;
  height: 3px;
  background: var(--color-text);
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

/* Hamburger "X" Animation */
.mobile-nav-toggle.is-active span:nth-child(1) {
  transform: rotate(45deg) translateY(8px);
}

.mobile-nav-toggle.is-active span:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.mobile-nav-toggle.is-active span:nth-child(3) {
  transform: rotate(-45deg) translateY(-8px);
}

/* Mobile Menu Overlay (Click-away-to-close) */
.mobile-menu-overlay {
  display: none;
}

/* Mobile Responsive Styles */
@media (max-width: 768px) {
  .mobile-nav-toggle {
    display: flex;
  }
  
  .nav-menu {
    position: fixed;
    top: 73px; /* Below navbar */
    left: 0;
    right: 0;
    width: 100%;
    max-height: calc(100vh - 73px);
    background: rgba(26, 26, 26, 0.98);
    border-bottom: 1px solid rgba(127, 90, 240, 0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    
    /* Hide by default */
    display: none;
    flex-direction: column;
    align-items: stretch;
    padding: 2rem 1.5rem;
    gap: 0;
    overflow-y: auto;
    
    /* Slide animation */
    animation: slideDownMenu 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  @keyframes slideDownMenu {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .nav-menu.is-open {
    display: flex;
  }
  
  .nav-links {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: 0;
  }
  
  .nav-links a {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(127, 90, 240, 0.1);
    font-size: 1.0625rem;
  }
  
  .nav-links a::after {
    display: none;
  }

  .nav-welcome {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .nav-button-signup,
  .nav-button-logout {
    width: 100%;
    padding: 0.875rem;
    margin-top: 1rem;
    text-align: center;
  }
  
  /* Mobile overlay for click-away */
  .mobile-menu-overlay {
    display: block;
    position: fixed;
    top: 73px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}

/* Main Content Area (accounts for fixed navbar) */
.main-content {
  padding-top: 73px; /* Height of navbar */
  min-height: 100vh;
}

/* Loading State */
.loading-app-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  min-height: 100vh;
  padding-top: 73px;
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(127, 90, 240, 0.2);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-app-container p {
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Tablet Adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
  .nav-links {
    gap: 1rem;
  }
  
  .nav-links a {
    font-size: 0.9375rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .navbar {
    border-bottom-width: 2px;
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