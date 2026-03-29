const skillCatalog = {
  javascript: {
    title: "JavaScript Fundamentals",
    focus: "Core language basics, ES6+, arrays, objects, and problem solving",
    outcomes: [
      "Write clean JavaScript using modern syntax",
      "Solve coding tasks with arrays, objects, and functions",
      "Understand asynchronous behavior with promises and async/await"
    ],
    resources: [
      "JavaScript.info core chapters",
      "MDN JavaScript Guide",
      "Build 10 vanilla JavaScript mini exercises"
    ],
    project: "Create an interactive quiz app with scoring and timer"
  },
  react: {
    title: "React Frontend Development",
    focus: "Components, state, hooks, forms, and API integration",
    outcomes: [
      "Build reusable UI components",
      "Manage data flow with hooks",
      "Consume REST APIs and render personalized dashboards"
    ],
    resources: [
      "React official learn section",
      "Vite + React practice app",
      "Build a dashboard with forms and charts"
    ],
    project: "Build a learner profile dashboard with dynamic progress cards"
  },
  node: {
    title: "Node.js Backend Foundations",
    focus: "Express APIs, middleware, controllers, and validation",
    outcomes: [
      "Design RESTful routes and controller layers",
      "Handle JSON requests and responses",
      "Structure backend logic for scale"
    ],
    resources: [
      "Express official guide",
      "REST API best practices notes",
      "Build a backend for a task planner"
    ],
    project: "Create an API for assessments, recommendations, and saved plans"
  },
  mongodb: {
    title: "MongoDB Data Modeling",
    focus: "Schemas, collections, CRUD, and document relationships",
    outcomes: [
      "Design collections for learner profiles and plans",
      "Use Mongoose schemas and queries",
      "Persist and retrieve personalized recommendations"
    ],
    resources: [
      "MongoDB University basics",
      "Mongoose docs for schemas and models",
      "CRUD practice with sample learner data"
    ],
    project: "Store and fetch learner goals and generated learning paths"
  },
  dsa: {
    title: "Logic and Problem Solving",
    focus: "Arrays, strings, recursion, complexity, and debugging",
    outcomes: [
      "Approach coding problems systematically",
      "Improve debugging confidence",
      "Strengthen interview-style reasoning"
    ],
    resources: [
      "NeetCode beginner roadmap",
      "Big-O complexity cheat sheet",
      "Solve 3 focused problems per study block"
    ],
    project: "Implement utility functions used by the recommendation engine"
  },
  uiux: {
    title: "UI and Product Thinking",
    focus: "Layouts, accessibility, user flow, and design decisions",
    outcomes: [
      "Design interfaces around user goals",
      "Improve readability and interaction design",
      "Apply accessibility basics to forms and dashboards"
    ],
    resources: [
      "Refactoring UI notes",
      "WCAG quick reference",
      "Redesign an existing app screen for clarity"
    ],
    project: "Refine the learning path dashboard for mobile and desktop"
  }
};

module.exports = skillCatalog;
