const LearningPath = require("../models/LearningPath");
const { skillCatalog } = require("../services/pathGenerator");
const { generatePathWithAiFallback } = require("../services/llmService");

const getSkills = (req, res) => {
  res.json({
    skills: Object.entries(skillCatalog).map(([key, value]) => ({
      key,
      title: value.title,
      focus: value.focus
    }))
  });
};

const generatePath = async (req, res) => {
  const {
    learnerName,
    goal,
    currentLevel,
    weeklyHours,
    strengths,
    weaknesses,
    learningStyle
  } = req.body;

  if (!learnerName || !goal || !currentLevel || !weeklyHours) {
    return res.status(400).json({
      message: "learnerName, goal, currentLevel, and weeklyHours are required."
    });
  }

  const { path: generatedPath, usedFallback } = await generatePathWithAiFallback({
    learnerName,
    goal,
    currentLevel,
    weeklyHours,
    strengths: Array.isArray(strengths) ? strengths : [],
    weaknesses: Array.isArray(weaknesses) ? weaknesses : [],
    learningStyle
  });

  const savedPath = await LearningPath.create(generatedPath);

  return res.status(201).json({
    ...savedPath.toObject(),
    usedFallback
  });
};

const getRecentPaths = async (req, res) => {
  const recentPaths = await LearningPath.find().sort({ createdAt: -1 }).limit(5);
  res.json(recentPaths);
};

module.exports = {
  getSkills,
  generatePath,
  getRecentPaths
};
