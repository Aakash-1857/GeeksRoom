// src/stores/userStore.js

import { defineStore } from "pinia";
import {
  signUp,
  signIn,
  logOut,
  subscribeToAuthChanges,
  getUserProfile
} from "@/services/firebase.js"; 

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: null,
    userProfile: null,
    // --- CHANGE #1 ---
    // Let's default this to false. We'll only set it
    // to true *during* an operation.
    isAuthReady: false,
    isLoading: false, 
    error: null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    username: (state) => state.userProfile?.username || null,
    userId: (state) => state.user?.uid || null,
  },

  actions: {
    listenForAuthChanges() {
      // Don't set isLoading!
      subscribeToAuthChanges(async (authUser) => {
        if (authUser) {
          this.user = authUser;
          const { success, profile } = await getUserProfile(authUser.uid);
          if (success) {
            this.userProfile = profile;
          } else {
            this.handleSignOut(); 
            this.error = "Failed to fetch user profile.";
          }
        } else {
          this.user = null;
          this.userProfile = null;
        }
        
        // --- THIS IS THE FIX ---
        // Once all auth logic is done, mark the app as "ready"
        this.isAuthReady = true;
      });
    },
    /**
     * --- UPDATED with try...finally ---
     */
    async handleSignUp(email, password, username) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const { success, error } = await signUp(email, password, username) 
        
        if (!success) {
          throw error; // Let the catch block handle it
        }
        // Success is handled by the listener, so we just return
        return { success: true };

      } catch (error) {
        this.error = error.message || "Failed to sign up.";
        return { success: false, error: error };
      } finally {
        // THIS IS THE FIX:
        // This line will run *no matter what*
        this.isLoading = false;
      }
    },

    /**
     * --- UPDATED with try...finally ---
     */
    async handleSignIn(email, password) {
      this.isLoading = true;
      this.error = null;

      try {
        const { success, error } = await signIn(email, password);

        if (!success) {
          throw error;
        }
        return { success: true };

      } catch (error) {
        this.error = error.message || "Failed to sign in.";
        return { success: false, error: error };
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * --- UPDATED with try...finally ---
     */
    async handleSignOut() {
      // Note: We don't set isLoading for signOut
      // as it's usually instant, but we could.
      this.error = null;
      try {
        await logOut();
        // State will be cleared by the listener
      } catch (error) {
        this.error = error.message || "Failed to sign out.";
      }
    },
  },
});