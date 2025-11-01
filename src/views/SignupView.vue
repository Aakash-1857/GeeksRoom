<template>
  <div>
    <h2>Sign Up</h2>
    <form @submit.prevent="handleSubmit">
      <input type="text" v-model="username" placeholder="Username" required />
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit" :disabled="userStore.isLoading">Sign Up</button>
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
    router.push('/');
  }
};
</script>