# Chatbot FE

Simple React + Vite frontend for a chatbot UI. It expects an external backend reachable via `VITE_ENDPOINT`.

## Prerequisites
- Node.js 18+ and npm

## Running the frontend locally
1) Install deps: `npm install`
2) Configure env: copy `.env` and set `VITE_ENDPOINT` to your backend URL
3) Start dev server: `npm run dev` then open the shown local URL
4) Build for production: `npm run build`

## Backend
- A backend service is required but not included in this repo. The frontend sends POST requests to `${VITE_ENDPOINT}/message` with `{ userId, message }`.
- Start your backend locally (commonly `http://localhost:3000`), then ensure `VITE_ENDPOINT` points to it.

## Database and platform
- No database or cloud platform is configured in this repository. Use whatever your backend expects (configure and run it separately).

## LLM usage
- No LLM logic is present in this frontend code. If the backend uses an LLM, document and configure it there; the frontend will relay responses it receives.
