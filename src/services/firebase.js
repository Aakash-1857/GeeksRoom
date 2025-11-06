// src/services/firebase.js

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc,
  getDoc, 
  Timestamp,
  collection, 
  addDoc,     
  query,      
  getDocs,    
  orderBy,    
  limit,
  where,
  runTransaction,
  increment,
  getCountFromServer
} from "firebase/firestore";

// --- Firebase Configuration ---
// Make sure this is filled with your real keys!
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// --- Initialize Firebase Services ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Auth Methods ---

export const signUp = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userDocRef = doc(db, "users", user.uid);
    
    await setDoc(userDocRef, {
      uid: user.uid,
      username: username,
      email: user.email,
      createdAt: Timestamp.now()
    });

    return { success: true, user: user };
  } catch (error) {
    console.error("Error signing up:", error);
    // THE FIX: Always return a failure object
    return { success: false, error: error };
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Error signing in:", error);
    // THE FIX: Always return a failure object
    return { success: false, error: error };
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    // THE FIX: Always return a failure object
    return { success: false, error: error };
  }
};

export const getUserProfile = async (uid) => {
  if (!uid) return { success: false, error: new Error("No UID provided") };
  
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() };
    } else {
      return { success: false, error: new Error("User profile not found") };
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // THE FIX: Always return a failure object
    return { success: false, error: error };
  }
};

// This one is a listener, it is correct as-is
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};


// --- Firestore CRUD Methods ---

export const createQuestion = async (title, content, authorUid, authorUsername) => {
  try {
    const questionsCollectionRef = collection(db, "questions");
    const newQuestionDoc = await addDoc(questionsCollectionRef, {
      title: title,
      content: content,
      authorUid: authorUid,
      authorUsername: authorUsername,
      createdAt: Timestamp.now(),
      voteCount: 0,
      upvotedBy: [],      // NEW: Initialize empty arrays
      downvotedBy: []     // NEW: Initialize empty arrays
    });
    return { success: true, docId: newQuestionDoc.id };
  } catch (error) {
    console.error("Error creating question:", error);
    return { success: false, error: error };
  }
};
export const getQuestions = async (lastVisibleQuestion = null) => {
  const POSTS_PER_PAGE = 10;
  
  try {
    const questionsCollectionRef = collection(db, "questions");
    const q = query(
      questionsCollectionRef, 
      orderBy("createdAt", "desc"), 
      limit(POSTS_PER_PAGE)
    );
    
    const querySnapshot = await getDocs(q);
    const questions = [];
    querySnapshot.forEach((doc) => {
      questions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
    return { success: true, questions: questions, lastVisible: lastVisible };
  } catch (error) {
    console.error("Error fetching questions:", error);
    // THE FIX: Always return a failure object
    return { success: false, error: error };
  }
};

export const createAnswer = async (content, questionId, authorUid, authorUsername) => {
  try {
    const answersCollectionRef = collection(db, "answers");
    const newAnswerDoc = await addDoc(answersCollectionRef, {
      content: content,
      questionId: questionId,
      authorUid: authorUid,
      authorUsername: authorUsername,
      createdAt: Timestamp.now(),
      voteCount: 0,
      upvotedBy: [],      // NEW: Initialize empty arrays
      downvotedBy: []     // NEW: Initialize empty arrays
    });
    return { success: true, docId: newAnswerDoc.id };
  } catch (error) {
    console.error("Error creating answer:", error);
    return { success: false, error: error };
  }
};

export const getAnswersByQuestionId = async (questionId) => {
  try {
    const answersCollectionRef = collection(db, "answers");
    const q = query(
      answersCollectionRef,
      where("questionId", "==", questionId),
      orderBy("createdAt", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const answers = [];
    querySnapshot.forEach((doc) => {
      answers.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return { success: true, answers: answers };
  } catch (error) {
    console.error("Error fetching answers:", error);
    // THE FIX: Always return a failure object
    return { success: false, error: error };
  }
};

// Add these functions to your firebase.js file
// Replace the existing voteQuestion function

import { 
  arrayUnion, 
  arrayRemove 
} from "firebase/firestore";

/**
 * Votes on a question with proper authentication and vote tracking
 * @param {string} questionId - The question document ID
 * @param {string} userId - The authenticated user's UID
 * @param {string} voteType - 'upvote' or 'downvote' or 'remove'
 * @param {string} currentVote - User's current vote state: 'upvote', 'downvote', or null
 */
export const voteQuestion = async (questionId, userId, voteType, currentVote) => {
  if (!userId) {
    return { success: false, error: new Error("Must be logged in to vote") };
  }

  const questionDocRef = doc(db, "questions", questionId);

  try {
    await runTransaction(db, async (transaction) => {
      const questionDoc = await transaction.get(questionDocRef);
      if (!questionDoc.exists()) {
        throw new Error("Question document does not exist!");
      }

      const data = questionDoc.data();
      const upvotedBy = data.upvotedBy || [];
      const downvotedBy = data.downvotedBy || [];
      
      // Calculate new arrays based on vote type
      let newUpvotedBy = [...upvotedBy];
      let newDownvotedBy = [...downvotedBy];
      
      // Remove user from both arrays first (clean slate)
      newUpvotedBy = newUpvotedBy.filter(id => id !== userId);
      newDownvotedBy = newDownvotedBy.filter(id => id !== userId);
      
      // Add user to appropriate array based on voteType
      if (voteType === 'upvote' && currentVote !== 'upvote') {
        newUpvotedBy.push(userId);
      } else if (voteType === 'downvote' && currentVote !== 'downvote') {
        newDownvotedBy.push(userId);
      }
      // If voteType matches currentVote, we're removing the vote (already removed above)
      
      // Calculate new vote count
      const newVoteCount = newUpvotedBy.length - newDownvotedBy.length;
      
      // Update document
      transaction.update(questionDocRef, {
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy,
        voteCount: newVoteCount
      });
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error voting on question:", error);
    return { success: false, error: error };
  }
};

/**
 * Votes on an answer with proper authentication and vote tracking
 * @param {string} answerId - The answer document ID
 * @param {string} userId - The authenticated user's UID
 * @param {string} voteType - 'upvote' or 'downvote' or 'remove'
 * @param {string} currentVote - User's current vote state: 'upvote', 'downvote', or null
 */
export const voteAnswer = async (answerId, userId, voteType, currentVote) => {
  if (!userId) {
    return { success: false, error: new Error("Must be logged in to vote") };
  }

  const answerDocRef = doc(db, "answers", answerId);

  try {
    await runTransaction(db, async (transaction) => {
      const answerDoc = await transaction.get(answerDocRef);
      if (!answerDoc.exists()) {
        throw new Error("Answer document does not exist!");
      }

      const data = answerDoc.data();
      const upvotedBy = data.upvotedBy || [];
      const downvotedBy = data.downvotedBy || [];
      
      // Calculate new arrays based on vote type
      let newUpvotedBy = [...upvotedBy];
      let newDownvotedBy = [...downvotedBy];
      
      // Remove user from both arrays first (clean slate)
      newUpvotedBy = newUpvotedBy.filter(id => id !== userId);
      newDownvotedBy = newDownvotedBy.filter(id => id !== userId);
      
      // Add user to appropriate array based on voteType
      if (voteType === 'upvote' && currentVote !== 'upvote') {
        newUpvotedBy.push(userId);
      } else if (voteType === 'downvote' && currentVote !== 'downvote') {
        newDownvotedBy.push(userId);
      }
      // If voteType matches currentVote, we're removing the vote (already removed above)
      
      // Calculate new vote count
      const newVoteCount = newUpvotedBy.length - newDownvotedBy.length;
      
      // Update document
      transaction.update(answerDocRef, {
        upvotedBy: newUpvotedBy,
        downvotedBy: newDownvotedBy,
        voteCount: newVoteCount
      });
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error voting on answer:", error);
    return { success: false, error: error };
  }
};

/**
 * Helper function to get user's current vote on a question
 * @param {object} question - The question object with upvotedBy/downvotedBy arrays
 * @param {string} userId - The user's UID
 * @returns {'upvote' | 'downvote' | null}
 */
export const getUserVoteOnQuestion = (question, userId) => {
  if (!userId || !question) return null;
  
  const upvotedBy = question.upvotedBy || [];
  const downvotedBy = question.downvotedBy || [];
  
  if (upvotedBy.includes(userId)) return 'upvote';
  if (downvotedBy.includes(userId)) return 'downvote';
  return null;
};

/**
 * Helper function to get user's current vote on an answer
 * @param {object} answer - The answer object with upvotedBy/downvotedBy arrays
 * @param {string} userId - The user's UID
 * @returns {'upvote' | 'downvote' | null}
 */
export const getUserVoteOnAnswer = (answer, userId) => {
  if (!userId || !answer) return null;
  
  const upvotedBy = answer.upvotedBy || [];
  const downvotedBy = answer.downvotedBy || [];
  
  if (upvotedBy.includes(userId)) return 'upvote';
  if (downvotedBy.includes(userId)) return 'downvote';
  return null;
};
export const getQuestionById = async (questionId) => {
  try {
    const questionDocRef = doc(db, "questions", questionId);
    const docSnap = await getDoc(questionDocRef);

    if (docSnap.exists()) {
      return { success: true, question: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: new Error("Question not found") };
    }
  } catch (error) {
    console.error("Error fetching question:", error);
    return { success: false, error: error };
  }
};
// Add 'getCountFromServer' to your 'firebase/firestore' imports at the top
// e.g., import { db, auth, collection, getCountFromServer, ... } from "./firebase.js";

// --- PASTE THESE NEW FUNCTIONS AT THE END OF THE FILE ---

/**
 * Gets the total count of all questions.
 */
export async function getTotalQuestionCount() {
  try {
    const questionsCol = collection(db, "questions");
    const snapshot = await getCountFromServer(questionsCol);
    return { success: true, count: snapshot.data().count };
  } catch (error) {
    console.error("Error getting question count:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Gets the total count of all answers.
 */
export async function getTotalAnswerCount() {
  try {
    // NOTE: This assumes all answers are in a single 'answers' collection
    // If you have answers nested, this will need to be different.
    const answersCol = collection(db, "answers");
    const snapshot = await getCountFromServer(answersCol);
    return { success: true, count: snapshot.data().count };
  } catch (error) {
    console.error("Error getting answer count:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Gets the total count of all users.
 */
export async function getTotalUserCount() {
  try {
    // This assumes your user profiles are in a 'users' collection
    const usersCol = collection(db, "users");
    const snapshot = await getCountFromServer(usersCol);
    return { success: true, count: snapshot.data().count };
  } catch (error) {
    console.error("Error getting user count:", error);
    return { success: false, error: error.message };
  }
}
// Export auth and db
export { auth, db };