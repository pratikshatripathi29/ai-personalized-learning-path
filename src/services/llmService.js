const { generateLearningPath } = require("./pathGenerator");

const buildPrompt = (payload) => {
  const strengths = (payload.strengths || []).join(", ") || "none provided";
  const weaknesses = (payload.weaknesses || []).join(", ") || "none provided";

  return `
You are an expert learning coach for software engineering students.
Create a personalized learning path in JSON only.

Learner name: ${payload.learnerName}
Goal: ${payload.goal}
Current level: ${payload.currentLevel}
Weekly hours: ${payload.weeklyHours}
Learning style: ${payload.learningStyle}
Strengths: ${strengths}
Weaknesses: ${weaknesses}

Return valid JSON with this exact shape:
{
  "summary": "string",
  "estimatedDurationWeeks": number,
  "modules": [
    {
      "title": "string",
      "focus": "string",
      "outcomes": ["string", "string", "string"],
      "recommendedResources": ["string", "string", "string"],
      "practiceProject": "string",
      "effortHours": number
    }
  ]
}

Rules:
- Keep duration between 4 and 8 weeks.
- Make the plan specific to MERN stack preparation.
- Prioritize weaknesses first.
- Use strengths to accelerate advanced topics.
- Each module should feel practical and portfolio-oriented.
- Return JSON only, with no markdown fences.
  `.trim();
};

const parseJsonResponse = (rawText) => {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(cleaned);
};

const normalizeAiPath = (payload, aiOutput) => {
  const modules = Array.isArray(aiOutput.modules) ? aiOutput.modules : [];

  return {
    learnerName: payload.learnerName,
    goal: payload.goal,
    currentLevel: String(payload.currentLevel).toLowerCase(),
    weeklyHours: Number(payload.weeklyHours),
    strengths: payload.strengths || [],
    weaknesses: payload.weaknesses || [],
    learningStyle: String(payload.learningStyle || "practical").toLowerCase(),
    generationSource: "llm",
    estimatedDurationWeeks: Number(aiOutput.estimatedDurationWeeks) || modules.length || 4,
    summary: aiOutput.summary || `Personalized AI roadmap for ${payload.learnerName}.`,
    modules: modules.map((module, index) => ({
      title: module.title || `Week ${index + 1}: Guided module`,
      focus: module.focus || "Personalized improvement plan",
      outcomes:
        Array.isArray(module.outcomes) && module.outcomes.length
          ? module.outcomes.slice(0, 4)
          : [
              "Improve core full-stack concepts",
              "Practice implementation",
              "Build portfolio confidence"
            ],
      recommendedResources:
        Array.isArray(module.recommendedResources) && module.recommendedResources.length
          ? module.recommendedResources.slice(0, 4)
          : ["Official docs", "Hands-on coding practice", "Mini implementation tasks"],
      practiceProject: module.practiceProject || "Build a focused MERN feature",
      effortHours:
        Number(module.effortHours) ||
        Math.max(4, Math.round(Number(payload.weeklyHours || 8) / 2))
    })),
    milestones: modules.map((module, index) => ({
      week: index + 1,
      headline: module.title || `Week ${index + 1}`,
      deliverable: module.practiceProject || "Submit a working feature"
    }))
  };
};

const callOpenAiCompatible = async (payload) => {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || "gpt-4o-mini";
  const apiUrl = process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You generate structured personalized learning plans for MERN stack students."
        },
        {
          role: "user",
          content: buildPrompt(payload)
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`LLM request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("LLM response did not include message content.");
  }

  return parseJsonResponse(text);
};

const generatePathWithAiFallback = async (payload) => {
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    return {
      path: {
        ...generateLearningPath(payload),
        generationSource: "rule-based"
      },
      usedFallback: true
    };
  }

  try {
    const aiOutput = await callOpenAiCompatible(payload);

    return {
      path: normalizeAiPath(payload, aiOutput),
      usedFallback: false
    };
  } catch (error) {
    console.error("AI generation failed, using fallback engine.", error.message);

    return {
      path: {
        ...generateLearningPath(payload),
        generationSource: "rule-based"
      },
      usedFallback: true
    };
  }
};

module.exports = {
  generatePathWithAiFallback
};
