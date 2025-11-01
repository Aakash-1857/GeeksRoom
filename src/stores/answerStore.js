// src/stores/answerStore.js
// Replace your existing answerStore with this secure version

import { defineStore } from "pinia";
import { 
  createAnswer, 
  getAnswersByQuestionId,
  voteAnswer,
  getUserVoteOnAnswer
} from "@/services/firebase.js";
import { useUserStore } from "./userStore.js";

export const useAnswerStore = defineStore("answerStore", {
  state: () => ({
    answers: [],
    currentQuestionId: null,
    isLoading: false,
    error: null,
  }),

  getters: {
    getAnswers: (state) => state.answers,
    
    /**
     * Returns a function that gets the user's vote on a specific answer
     */
    getUserVote: (state) => {
      return (answerId) => {
        const userStore = useUserStore();
        const userId = userStore.userId;
        if (!userId) return null;
        
        const answer = state.answers.find(a => a.id === answerId);
        if (!answer) return null;
        
        return getUserVoteOnAnswer(answer, userId);
      };
    }
  },

  actions: {
    async fetchAnswers(questionId) {
      if (this.currentQuestionId === questionId) {
        return; 
      }

      this.isLoading = true;
      this.error = null;
      this.answers = [];
      this.currentQuestionId = questionId;

      try {
        const { success, answers, error } = await getAnswersByQuestionId(questionId);
        if (success) {
          this.answers = answers;
        } else {
          throw error;
        }
      } catch (err) {
        this.error = err.message || "Failed to fetch answers.";
      } finally {
        this.isLoading = false;
      }
    },

    async postAnswer(content) {
      if (!this.currentQuestionId) {
        this.error = "No active question to post an answer to.";
        return;
      }

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

      const tempAnswer = {
        id: `temp_${Date.now()}`,
        content,
        questionId: this.currentQuestionId,
        authorUid,
        authorUsername,
        voteCount: 0,
        upvotedBy: [],
        downvotedBy: [],
        createdAt: new Date(),
        isOptimistic: true,
      };

      try {
        this.answers.push(tempAnswer);

        const { success, docId, error } = await createAnswer(
          content,
          this.currentQuestionId,
          authorUid,
          authorUsername
        );

        if (success) {
          const answerIndex = this.answers.findIndex(a => a.id === tempAnswer.id);
          if (answerIndex !== -1) {
            this.answers[answerIndex].id = docId;
            this.answers[answerIndex].isOptimistic = false;
          }
        } else {
          throw error;
        }
      } catch (err) {
        this.error = err.message;
        this.answers = this.answers.filter(a => a.id !== tempAnswer.id);
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Handles voting on answers with authentication check and vote toggling
     * @param {string} answerId - The answer ID
     * @param {string} voteType - 'upvote' or 'downvote'
     */
    async handleVote(answerId, voteType) {
      const userStore = useUserStore();
      const userId = userStore.userId;

      // CRITICAL: Check if user is logged in
      if (!userId) {
        this.error = "You must be logged in to vote.";
        return { success: false, error: "Not authenticated" };
      }

      // Find the answer
      const answerIndex = this.answers.findIndex(a => a.id === answerId);
      if (answerIndex === -1) {
        this.error = "Answer not found.";
        return { success: false, error: "Answer not found" };
      }

      const answer = this.answers[answerIndex];
      
      // Determine current vote state
      const currentVote = getUserVoteOnAnswer(answer, userId);
      
      // Store original state for rollback
      const originalUpvotedBy = [...(answer.upvotedBy || [])];
      const originalDownvotedBy = [...(answer.downvotedBy || [])];
      const originalVoteCount = answer.voteCount;

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
      this.answers[answerIndex].upvotedBy = newUpvotedBy;
      this.answers[answerIndex].downvotedBy = newDownvotedBy;
      this.answers[answerIndex].voteCount = newVoteCount;

      try {
        // Call Firebase with current vote state
        const { success, error } = await voteAnswer(
          answerId, 
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
        this.answers[answerIndex].upvotedBy = originalUpvotedBy;
        this.answers[answerIndex].downvotedBy = originalDownvotedBy;
        this.answers[answerIndex].voteCount = originalVoteCount;
        
        return { success: false, error: err };
      }
    },

    clearAnswers() {
      this.answers = [];
      this.currentQuestionId = null;
      this.error = null;
    }
  }
});