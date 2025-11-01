<template>
  <div class="home">
    <h1>Q&A Platform</h1>
    <p>Welcome to the main feed.</p>
    
    <QuestionsCatalogView />
  </div>
</template>

<script setup>
// We'll create and import this component next
import QuestionsCatalogView from '@/components/QuestionsCatalogView.vue';
</script>

<script>
// ADD THIS SCRIPT BLOCK (not setup)
export default {
  name: 'HomeView' // This name must match the 'include' in keep-alive
}
</script>