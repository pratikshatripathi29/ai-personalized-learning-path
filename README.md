# AI-Powered Personalized Learning Path Generator

A full-stack MERN project that generates customized weekly learning roadmaps based on learner strengths, weaknesses, goals, level, and available study time.

## Tech Stack

- MongoDB
- Express.js
- React
- Node.js
- Vite for the React build tool

## Features

- Learner profile form with goals, skill strengths, weaknesses, study hours, and learning style
- AI-powered recommendation engine with fallback to a rule-based personalized roadmap
- MongoDB persistence for generated learning paths
- Recent learning path history for demos
- Responsive single-page UI
- Production-ready Express setup that serves the built React app

## Project Structure

```text
ai-power/
  client/
  src/
  server.js
  package.json
```

## Local Setup

### 1. Create environment file

Copy `.env.example` to `.env` and update the MongoDB connection string.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ai_learning_paths
NODE_ENV=development
LLM_PROVIDER=openai
LLM_API_KEY=
LLM_MODEL=gpt-4o-mini
LLM_API_URL=
```

If you want real AI-generated learning paths, add your LLM API key.
If `LLM_API_KEY` is empty, the project still works with the built-in rule-based engine.

### 2. Install dependencies

```bash
npm install
npm run client:install
```

### 3. Start MongoDB

Make sure MongoDB is running locally, or use MongoDB Atlas.

### 4. Run the backend

```bash
npm run dev
```

### 5. Run the frontend

In a second terminal:

```bash
npm run client:dev
```

Open `http://localhost:5173`

## Production Build

```bash
npm install
npm run client:install
npm run build
npm start
```

In production, Express serves the React build from `client/dist`.

## Deployment

### Option 1: Render

- Create one new Web Service
- Set build command to `npm install && npm run client:install && npm run build`
- Set start command to `npm start`
- Add environment variables from `.env`
- Use MongoDB Atlas for `MONGODB_URI`

### Option 2: Railway

- Deploy the repo
- Set `MONGODB_URI`, `NODE_ENV=production`, and `PORT`
- Use build command `npm install && npm run client:install && npm run build`
- Use start command `npm start`

## CV Notes

You can describe this project as:

> Built a deployable MERN application that generates personalized learning roadmaps using learner profiling, recommendation logic, MongoDB persistence, and a responsive React dashboard.

Stronger CV version:

> Built a deployable MERN application that generates personalized learning roadmaps using learner profiling, LLM-assisted recommendation logic with rule-based fallback, MongoDB persistence, and a responsive React dashboard.

## Manual Steps You Still Need To Do

1. Install Node.js and MongoDB if they are not already installed.
2. Run `npm install` in the root folder.
3. Run `npm run client:install` inside the project root.
4. Create `.env` from `.env.example`.
5. Start MongoDB or create a MongoDB Atlas database.
6. Add `LLM_API_KEY` if you want real AI-generated paths.
7. Run the app locally and test one generated learning path.
8. Deploy it to Render or Railway with your production MongoDB URI.
