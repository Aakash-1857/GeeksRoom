<template>
  <div class="landing-view">
    <!-- Animated Background -->
    <div class="bg-grid"></div>
    <div class="bg-gradient"></div>
    <div class="floating-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="badge">
          <span class="badge-dot"></span>
          Powered by Community Intelligence
        </div>
        <h1 class="hero-title">
          <span class="gradient-text">Ask Questions.</span>
          <span class="gradient-text">Get Answers.</span>
          <span class="hero-subtitle">Build Knowledge Together.</span>
        </h1>
        <p class="hero-description">
          Join the next generation of knowledge sharing. Connect with experts, 
          explore insights, and be part of a community that values curiosity.
        </p>
        <div class="hero-actions">
          <router-link to="/feed" class="btn btn-primary">
            <span>Start Exploring</span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
          <router-link to="/login" class="btn btn-glass">
            <span>Sign In</span>
          </router-link>
        </div>
        <div class="hero-stats">
        <div class="stat">
          <div class="stat-value">{{ questionCount }}</div>
          <div class="stat-label">Questions</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <div class="stat-value">{{ userCount }}</div>
          <div class="stat-label">Members</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat">
          <div class="stat-value">{{ answerCount }}</div>
          <div class="stat-label">Answers</div>
        </div>
      </div>
      </div>
    </section>

    <!-- Features Grid 
    <section class="features">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-accent">Why Choose</span> Our Platform
        </h2>
        <p class="section-subtitle">
          Experience the future of collaborative learning with cutting-edge features
        </p>
      </div>

      <div class="features-grid">
        <div class="feature-card feature-large">
          <div class="feature-glow"></div>
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <h3 class="feature-title">Lightning Fast Responses</h3>
          <p class="feature-description">
            Get answers in real-time with our optimized notification system and active community members.
          </p>
          <div class="feature-badge">Popular</div>
        </div>

        <div class="feature-card">
          <div class="feature-glow"></div>
          <div class="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <h3 class="feature-title">Smart Recommendations</h3>
          <p class="feature-description">
            AI-powered suggestions help you discover relevant questions and topics.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-glow"></div>
          <div class="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3 class="feature-title">Expert Community</h3>
          <p class="feature-description">
            Connect with verified experts and passionate enthusiasts across all topics.
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-glow"></div>
          <div class="feature-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h3 class="feature-title">Secure & Private</h3>
          <p class="feature-description">
            Your data is protected with enterprise-grade security and privacy controls.
          </p>
        </div>

        <div class="feature-card feature-large">
          <div class="feature-glow"></div>
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <h3 class="feature-title">Real-Time Analytics</h3>
          <p class="feature-description">
            Track your impact with detailed insights into your questions, answers, and community engagement.
          </p>
          <div class="feature-badge">New</div>
        </div>
      </div>
    </section> -->

    <!-- CTA Section -->
    <section class="cta">
      <div class="cta-content">
        <h2 class="cta-title">Ready to Get Started?</h2>
        <p class="cta-description">
          Join thousands of curious minds today and start your journey
        </p>
        <div class="cta-actions">
          <router-link to="/feed" class="btn btn-primary btn-large">
            <span>Explore Now</span>
            <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
      <div class="cta-visual">
        <div class="visual-ring ring-1"></div>
        <div class="visual-ring ring-2"></div>
        <div class="visual-ring ring-3"></div>
      </div>
    </section>
  </div>
</template>

<script setup>
// src/views/LandingView.vue - <script setup>

// --- ADD THESE IMPORTS ---
import { ref, onMounted } from 'vue';
import { 
  getTotalQuestionCount, 
  getTotalAnswerCount, 
  getTotalUserCount 
} from '@/services/firebase.js';

// --- ADD THIS HELPER FUNCTION ---
// This formats 10234 -> "10K+" and 523 -> "500+"
function formatStat(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + 'M+';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  if (num >= 500) {
    return '500+';
  }
  return num.toString();
}

// --- ADD THESE REFS ---
const questionCount = ref('...');
const answerCount = ref('...');
const userCount = ref('...');

// --- ADD THIS LIFECYCLE HOOK ---
onMounted(async () => {
  // Fetch all counts in parallel
  const [qRes, aRes, uRes] = await Promise.all([
    getTotalQuestionCount(),
    getTotalAnswerCount(),
    getTotalUserCount()
  ]);

  if (qRes.success) {
    questionCount.value = formatStat(qRes.count);
  }
  if (aRes.success) {
    answerCount.value = formatStat(aRes.count);
  }
  if (uRes.success) {
    userCount.value = formatStat(uRes.count);
  }
});
// Pure presentation component - no logic needed
</script>

<style scoped>
.landing-view {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Animated Background */
.bg-grid {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(var(--color-border) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
  background-size: 100px 100px;
  opacity: 0.3;
  mask-image: radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%);
  animation: gridMove 20s linear infinite;
  pointer-events: none;
}

@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(100px, 100px); }
}

.bg-gradient {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 20% 30%, rgba(127, 90, 240, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(157, 127, 234, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.floating-orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--color-primary), transparent);
  top: -200px;
  right: -200px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--color-accent), transparent);
  bottom: -150px;
  left: -150px;
  animation-delay: 7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, var(--color-primary), transparent);
  top: 50%;
  left: 50%;
  animation-delay: 14s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(100px, -100px) scale(1.1); }
  66% { transform: translate(-100px, 100px) scale(0.9); }
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 1;
}

.hero-content {
  max-width: 900px;
  text-align: center;
  animation: fadeInUp 1s ease-out;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(127, 90, 240, 0.1);
  border: 1px solid rgba(127, 90, 240, 0.3);
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-accent);
  backdrop-filter: blur(10px);
  margin-bottom: 2rem;
  animation: slideDown 1s ease-out 0.2s backwards;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.gradient-text {
  display: block;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 50%, var(--color-primary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: slideUp 1s ease-out 0.4s backwards;
}

.hero-subtitle {
  display: block;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--color-text-muted);
  font-weight: 600;
  margin-top: 0.5rem;
  animation: slideUp 1s ease-out 0.6s backwards;
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-muted);
  line-height: 1.8;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1s ease-out 0.8s backwards;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 4rem;
  animation: fadeIn 1s ease-out 1s backwards;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s;
}

.btn:hover::before {
  opacity: 1;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-text);
  box-shadow: 0 10px 40px rgba(127, 90, 240, 0.4), 0 0 0 1px rgba(127, 90, 240, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 50px rgba(127, 90, 240, 0.5), 0 0 0 1px rgba(127, 90, 240, 0.5);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-glass {
  background: rgba(26, 26, 26, 0.6);
  color: var(--color-text);
  border: 1px solid rgba(127, 90, 240, 0.3);
  backdrop-filter: blur(10px);
}

.btn-glass:hover {
  background: rgba(26, 26, 26, 0.8);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 1.125rem;
}

.btn-icon {
  transition: transform 0.3s;
}

.btn:hover .btn-icon {
  transform: translateX(4px);
}

/* Hero Stats */
.hero-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 1rem;
  backdrop-filter: blur(20px);
  animation: fadeIn 1s ease-out 1.2s backwards;
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
}

/* Features Section */
.features {
  position: relative;
  padding: 8rem 2rem;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.title-accent {
  color: var(--color-primary);
}

.section-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
}

.features-grid {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  grid-auto-flow: dense;
}

.feature-large {
  grid-column: span 2;
}

.feature-card {
  position: relative;
  padding: 2.5rem;
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 1.5rem;
  backdrop-filter: blur(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.feature-glow {
  position: absolute;
  inset: -100%;
  background: radial-gradient(circle at center, rgba(127, 90, 240, 0.3) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}

.feature-card:hover {
  transform: translateY(-8px);
  border-color: var(--color-primary);
  box-shadow: 0 20px 60px rgba(127, 90, 240, 0.3);
}

.feature-card:hover .feature-glow {
  opacity: 1;
}

.feature-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(127, 90, 240, 0.2) 0%, rgba(157, 127, 234, 0.1) 100%);
  border-radius: 1rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  transition: all 0.4s;
  position: relative;
  z-index: 1;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, rgba(127, 90, 240, 0.3) 0%, rgba(157, 127, 234, 0.2) 100%);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-text);
  position: relative;
  z-index: 1;
}

.feature-description {
  color: var(--color-text-muted);
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

.feature-badge {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  padding: 0.375rem 0.75rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text);
  z-index: 1;
}

/* CTA Section */
.cta {
  position: relative;
  padding: 8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.cta-content {
  max-width: 700px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-text) 0%, var(--color-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-description {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  margin-bottom: 2.5rem;
}

.cta-actions {
  display: flex;
  justify-content: center;
}

.cta-visual {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.visual-ring {
  position: absolute;
  border: 1px solid rgba(127, 90, 240, 0.2);
  border-radius: 50%;
  animation: ringExpand 15s infinite ease-in-out;
}

.ring-1 {
  width: 400px;
  height: 400px;
  animation-delay: 0s;
}

.ring-2 {
  width: 600px;
  height: 600px;
  animation-delay: 5s;
}

.ring-3 {
  width: 800px;
  height: 800px;
  animation-delay: 10s;
}

@keyframes ringExpand {
  0%, 100% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1); opacity: 0.3; }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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

/* Responsive Design */
@media (max-width: 1024px) {
  .feature-large {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: 4rem 1.5rem;
  }

  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .stat-divider {
    width: 100%;
    height: 1px;
  }

  .features {
    padding: 4rem 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .feature-card {
    padding: 2rem;
  }

  .cta {
    padding: 4rem 1.5rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .badge {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

/* Smooth scrolling improvements */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .feature-card,
  .hero-stats {
    border-width: 2px;
  }
}
</style>