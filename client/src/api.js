const jsonHeaders = {
  "Content-Type": "application/json"
};

export const fetchSkills = async () => {
  const response = await fetch("/api/skills");
  if (!response.ok) {
    throw new Error("Failed to load skill catalog.");
  }
  return response.json();
};

export const fetchRecentPaths = async () => {
  const response = await fetch("/api/paths/recent");
  if (!response.ok) {
    throw new Error("Failed to load recent learning paths.");
  }
  return response.json();
};

export const generatePath = async (payload) => {
  const response = await fetch("/api/paths/generate", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate learning path.");
  }

  return data;
};
