# GeeksRoom

A modern, community-driven Q&A platform built with Vue 3 and Firebase. Inspired by Stack Overflow, GeeksRoom is a space for developers and tech enthusiasts to ask questions, share knowledge, and collaborate.

This app was built from the ground up, from initial design and secure backend architecture to a fully responsive, pixel-perfect UI.

---

## 🚀 Live Demo

The project is fully deployed and live on Firebase Hosting.

**You can view and use the live application here:** [**https://geekroom-e7b67.web.app/**](https://geekroom-e7b67.web.app/)


## ✨ Core Features

* **Full CRUD Operations:** Users can create, read, edit, and delete their own questions and answers.
* **Real-time Voting:** Secure, real-time upvoting and downvoting on both questions and answers.
* **Secure Authentication:** Complete user auth flow (Signup, Login, Logout) using Firebase Authentication.
* **Protected Routes & Rules:** Client-side route guards and server-side Firestore Security Rules ensure only authenticated users can post, edit, or vote.
* **Rich Text Content:** Built-in Markdown parser (`marked`) and sanitizer (`dompurify`) to safely render user-generated code blocks, lists, and blockquotes.
* **Dynamic Data:** The landing page live-fetches total user and question counts from Firestore using `getCountFromServer()` for high efficiency.
* **Modern UI:** A fully responsive, mobile-first design with a cohesive violet-and-black theme, built from scratch with custom CSS.

## 🛠️ Tech Stack

* **Frontend:** Vue 3 (Composition API, Vue Router)
* **State Management:** Pinia
* **Backend:** Firebase
* **Authentication:** Firebase Auth
* **Database:** Cloud Firestore (for real-time data)
* **Hosting:** Firebase Hosting
* **Styling:** Custom CSS (Mobile-first, with CSS Variables)
* **Utilities:** `marked` (Markdown parsing), `dompurify` (HTML sanitizing)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
