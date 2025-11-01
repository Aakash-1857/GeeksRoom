// src/stores/questionStore.js
// Replace your existing questionStore with this secure version

import { defineStore } from "pinia";
import { 
  createQuestion, 
  getQuestions, 
  voteQuestion,
  getUserVoteOnQuestion
} from "@/services/firebase.js";
import { useUserStore } from "./userStore.js";

export const useQuestionStore = defineStore("questionStore", {
  state: () => ({
    questions: [],
    isLoading: false,
    error: null,
    lastVisibleQuestion: null,
  }),

  getters: {
    allQuestions: (state) => state.questions,
    
    /**
     * Returns a function that gets the user's vote on a specific question
     */
    getUserVote: (state) => {
      return (questionId) => {
        const userStore = useUserStore();
        const userId = userStore.userId;
        if (!userId) return null;
        
        const question = state.questions.find(q => q.id === questionId);
        if (!question) return null;
        
        return getUserVoteOnQuestion(question, userId);
      };
    }
  },

  actions: {
    async fetchQuestions() {
      this.isLoading = true;
      this.error = null;
      try {
        const { success, questions, lastVisible } = await getQuestions();
        if (success) {
          this.questions = questions;
          this.lastVisibleQuestion = lastVisible;
        } else {
          throw new Error("Failed to fetch questions.");
        }
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    async postQuestion(title, content) {
      this.isLoading = true;
      this.error = null;
      
      const userStore = useUserStore();
      const authorUid = userStore.userId;
      const authorUsername = userStore.username;

      if (!authorUid || !authorUsername) {
        this.error = "User not logged in.";
        this.isLoading = false;
        return;
      }

      const tempQuestion = {
        id: `temp_${Date.now()}`,
        title,
        content,
        authorUid,
        authorUsername,
        voteCount: 0,
        upvotedBy: [],
        downvotedBy: [],
        createdAt: new Date(),
        isOptimistic: true
      };

      try {
        this.questions.unshift(tempQuestion);

        const { success, docId, error } = await createQuestion(
          title, 
          content, 
          authorUid, 
          authorUsername
        );

        if (success) {
          const postIndex = this.questions.findIndex(q => q.id === tempQuestion.id);
          if (postIndex !== -1) {
            this.questions[postIndex].id = docId;
            this.questions[postIndex].isOptimistic = false;
          }
        } else {
          throw error;
        }
      } catch (err) {
        this.error = err.message;
        this.questions = this.questions.filter(q => q.id !== tempQuestion.id);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Handles voting with authentication check and vote toggling
     * @param {string} questionId - The question ID
     * @param {string} voteType - 'upvote' or 'downvote'
     */
    async handleVote(questionId, voteType) {
      const userStore = useUserStore();
      const userId = userStore.userId;

      // CRITICAL: Check if user is logged in
      if (!userId) {
        this.error = "You must be logged in to vote.";
        return { success: false, error: "Not authenticated" };
      }

      // Find the question
      const questionIndex = this.questions.findIndex(q => q.id === questionId);
      if (questionIndex === -1) {
        this.error = "Question not found.";
        return { success: false, error: "Question not found" };
      }

      const question = this.questions[questionIndex];
      
      // Determine current vote state
      const currentVote = getUserVoteOnQuestion(question, userId);
      
      // Store original state for rollback
      const originalUpvotedBy = [...(question.upvotedBy || [])];
      const originalDownvotedBy = [...(question.downvotedBy || [])];
      const originalVoteCount = question.voteCount;

      // Calculate optimistic update
      let newUpvotedBy = originalUpvotedBy.filter(id => id !== userId);
      let newDownvotedBy = originalDownvotedBy.filter(id => id !== userId);
      
      // If clicking same vote, remove it (toggle off)
      // If clicking different vote, add to new array
      if (voteType === 'upvote' && currentVote !== 'upvote') {
        newUpvotedBy.push(userId);
      } else if (voteType === 'downvote' && currentVote !== 'downvote') {
        newDownvotedBy.push(userId);
      }
      
      const newVoteCount = newUpvotedBy.length - newDownvotedBy.length;

      // Optimistic update
      this.questions[questionIndex].upvotedBy = newUpvotedBy;
      this.questions[questionIndex].downvotedBy = newDownvotedBy;
      this.questions[questionIndex].voteCount = newVoteCount;

      try {
        // Call Firebase with current vote state
        const { success, error } = await voteQuestion(
          questionId, 
          userId, 
          voteType, 
          currentVote
        );
        
        if (!success) {
          throw error;
        }
        
        return { success: true };
      } catch (err) {
        this.error = `Vote failed: ${err.message}`;
        
        // Rollback on error
        this.questions[questionIndex].upvotedBy = originalUpvotedBy;
        this.questions[questionIndex].downvotedBy = originalDownvotedBy;
        this.questions[questionIndex].voteCount = originalVoteCount;
        
        return { success: false, error: err };
      }
    }
  }
});