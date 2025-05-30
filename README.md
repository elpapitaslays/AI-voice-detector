# 🧠🎙️ AI Voice Detector Web App

A full-stack web application that **listens to your voice**, **transcribes it**, and **responds using artificial intelligence**. Built with **React + Node.js** on the frontend and **Python** on the backend.

---

## 📚 Description

This project is a real-time voice assistant for the web, combining speech recognition, AI response generation, and text-to-speech in a seamless experience. Ideal for building intelligent assistants, accessibility tools, or educational bots.

### 🔁 Flow Overview

1. User uploads the audio into the app.
2. React transcribes speech using Web Speech API.
3. Transcribed text is sent to a **Node.js server**.
4. Node forwards the request to the **Python backend**.
5. Python uses an AI model (like GPT) to generate a response.
6. The response is sent back and vocalized in the browser.

---

## 🧱 Tech Stack

### 🖥️ Frontend (React + Node.js)

- `React` for UI
- `react-speech-recognition` for capturing voice
- `Web Speech API` for TTS
- `fetch` for API calls
- `Node.js + Express` server for routing and middle layer

### 🧠 Backend (Python)

- `Flask`
- `transformers` LLM engine
- `uvicorn`
- `.env` for API key management

---
