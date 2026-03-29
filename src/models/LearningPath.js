const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    focus: { type: String, required: true },
    outcomes: [{ type: String, required: true }],
    recommendedResources: [{ type: String, required: true }],
    practiceProject: { type: String, required: true },
    effortHours: { type: Number, required: true }
  },
  { _id: false }
);

const milestoneSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    headline: { type: String, required: true },
    deliverable: { type: String, required: true }
  },
  { _id: false }
);

const learningPathSchema = new mongoose.Schema(
  {
    learnerName: { type: String, required: true },
    goal: { type: String, required: true },
    currentLevel: { type: String, required: true },
    weeklyHours: { type: Number, required: true },
    strengths: [{ type: String, required: true }],
    weaknesses: [{ type: String, required: true }],
    estimatedDurationWeeks: { type: Number, required: true },
    learningStyle: { type: String, required: true },
    generationSource: { type: String, required: true, default: "rule-based" },
    summary: { type: String, required: true },
    modules: [moduleSchema],
    milestones: [milestoneSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("LearningPath", learningPathSchema);
