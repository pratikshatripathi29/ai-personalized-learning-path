const skillCatalog = require("../data/skillCatalog");

const levelMultipliers = {
  beginner: 1.2,
  intermediate: 1,
  advanced: 0.8
};

const learningStyleMap = {
  visual: "visual demos and UI-first exercises",
  practical: "mini projects and implementation-heavy practice",
  theoretical: "concept reviews followed by structured exercises"
};

const normalizeTopics = (topics = []) =>
  topics
    .map((topic) => String(topic).trim().toLowerCase())
    .filter(Boolean);

const unique = (items) => [...new Set(items)];

const resolveSkills = (weaknesses, strengths, goal) => {
  const goalText = goal.toLowerCase();
  const catalogKeys = Object.keys(skillCatalog);

  const matchedWeaknesses = weaknesses.filter((item) => catalogKeys.includes(item));
  const inferredFromGoal = catalogKeys.filter((key) => goalText.includes(key));
  const strengthBoosts = strengths.includes("javascript") ? ["react", "node"] : [];

  const selected = unique([
    ...matchedWeaknesses,
    ...inferredFromGoal,
    ...strengthBoosts,
    "mongodb"
  ]);

  return selected.length ? selected.slice(0, 5) : ["javascript", "react", "node", "mongodb"];
};

const buildMilestones = (modules) =>
  modules.map((module, index) => ({
    week: index + 1,
    headline: module.title,
    deliverable: module.practiceProject
  }));

const generateLearningPath = (payload) => {
  const strengths = normalizeTopics(payload.strengths);
  const weaknesses = normalizeTopics(payload.weaknesses);
  const weeklyHours = Number(payload.weeklyHours) || 6;
  const currentLevel = String(payload.currentLevel || "beginner").toLowerCase();
  const learningStyle = String(payload.learningStyle || "practical").toLowerCase();

  const selectedSkills = resolveSkills(weaknesses, strengths, payload.goal);
  const multiplier = levelMultipliers[currentLevel] || 1;
  const effortPerModule = Math.max(4, Math.round((weeklyHours * multiplier) / 2));

  const modules = selectedSkills.map((skillKey, index) => {
    const skill = skillCatalog[skillKey];
    const weaknessPriority = weaknesses.includes(skillKey);
    const focusPrefix = weaknessPriority ? "Priority recovery" : "Growth acceleration";

    return {
      title: `Week ${index + 1}: ${skill.title}`,
      focus: `${focusPrefix} in ${skill.focus}`,
      outcomes: skill.outcomes,
      recommendedResources: skill.resources,
      practiceProject: skill.project,
      effortHours: effortPerModule
    };
  });

  const estimatedDurationWeeks = modules.length;
  const styleText = learningStyleMap[learningStyle] || learningStyleMap.practical;
  const summary = `${payload.learnerName} is targeting ${payload.goal}. This plan emphasizes ${weaknesses.join(", ") || "core full-stack foundations"} while using strengths in ${strengths.join(", ") || "self-driven learning"} through ${styleText}.`;

  return {
    learnerName: payload.learnerName,
    goal: payload.goal,
    currentLevel,
    weeklyHours,
    strengths,
    weaknesses,
    learningStyle,
    estimatedDurationWeeks,
    summary,
    modules,
    milestones: buildMilestones(modules)
  };
};

module.exports = {
  generateLearningPath,
  skillCatalog
};
