import { useEffect, useState } from "react";
import { fetchRecentPaths, fetchSkills, generatePath } from "./api";

const initialForm = {
  learnerName: "",
  goal: "Become a confident MERN stack developer and build deployable full-stack apps.",
  currentLevel: "beginner",
  weeklyHours: 8,
  learningStyle: "practical"
};

const App = () => {
  const [form, setForm] = useState(initialForm);
  const [selectedStrengths, setSelectedStrengths] = useState(["javascript"]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState(["react", "mongodb"]);
  const [skills, setSkills] = useState([]);
  const [recentPaths, setRecentPaths] = useState([]);
  const [generatedPath, setGeneratedPath] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [skillsResponse, recentResponse] = await Promise.all([
          fetchSkills(),
          fetchRecentPaths()
        ]);
        setSkills(skillsResponse.skills);
        setRecentPaths(recentResponse);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setPageLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "weeklyHours" ? Number(value) : value
    }));
  };

  const handleSkillToggle = (type, key) => {
    const stateSetter = type === "strengths" ? setSelectedStrengths : setSelectedWeaknesses;

    stateSetter((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const createdPath = await generatePath({
        ...form,
        strengths: selectedStrengths,
        weaknesses: selectedWeaknesses
      });

      setGeneratedPath(createdPath);
      setRecentPaths((current) => [createdPath, ...current].slice(0, 5));
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">AI-Powered MERN Project</p>
          <h1>Personalized Learning Path Generator</h1>
          <p className="hero-copy">
            Generate tailored weekly study roadmaps from learner strengths, weaknesses,
            goals, and available study time.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>Stack</strong>
            <span>MongoDB, Express, React, Node.js</span>
          </div>
          <div>
            <strong>Use Case</strong>
            <span>EdTech personalization for self-paced learners</span>
          </div>
        </div>
      </section>

      <main className="content-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Create learner profile</h2>
            <p>Answer a few inputs and generate a roadmap instantly.</p>
          </div>

          <form onSubmit={handleSubmit} className="profile-form">
            <label>
              Learner name
              <input
                name="learnerName"
                value={form.learnerName}
                onChange={handleChange}
                placeholder="Aman Sharma"
                required
              />
            </label>

            <label>
              Goal
              <textarea
                name="goal"
                value={form.goal}
                onChange={handleChange}
                rows="4"
                required
              />
            </label>

            <div className="two-column">
              <label>
                Current level
                <select name="currentLevel" value={form.currentLevel} onChange={handleChange}>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </label>

              <label>
                Weekly hours
                <input
                  name="weeklyHours"
                  type="number"
                  min="2"
                  max="40"
                  value={form.weeklyHours}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label>
              Learning style
              <select name="learningStyle" value={form.learningStyle} onChange={handleChange}>
                <option value="practical">Practical</option>
                <option value="visual">Visual</option>
                <option value="theoretical">Theoretical</option>
              </select>
            </label>

            <div className="selector-block">
              <div>
                <h3>Strengths</h3>
                <p>Select skills the learner already feels confident in.</p>
              </div>
              <div className="chip-grid">
                {skills.map((skill) => (
                  <button
                    type="button"
                    key={`strength-${skill.key}`}
                    className={selectedStrengths.includes(skill.key) ? "chip active" : "chip"}
                    onClick={() => handleSkillToggle("strengths", skill.key)}
                  >
                    {skill.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="selector-block">
              <div>
                <h3>Weaknesses</h3>
                <p>Select skills that need focused improvement.</p>
              </div>
              <div className="chip-grid">
                {skills.map((skill) => (
                  <button
                    type="button"
                    key={`weakness-${skill.key}`}
                    className={
                      selectedWeaknesses.includes(skill.key)
                        ? "chip danger active"
                        : "chip danger"
                    }
                    onClick={() => handleSkillToggle("weaknesses", skill.key)}
                  >
                    {skill.title}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="primary-button" disabled={loading || pageLoading}>
              {loading ? "Generating roadmap..." : "Generate learning path"}
            </button>
          </form>
        </section>

        <section className="panel result-panel">
          <div className="panel-heading">
            <h2>Generated roadmap</h2>
            <p>Each path is saved to MongoDB and shown below.</p>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {!generatedPath && !pageLoading && (
            <div className="empty-state">
              <p>Your generated learning path will appear here.</p>
            </div>
          )}

          {generatedPath && (
            <article className="path-card">
              <div className="path-header">
                <div>
                  <p className="eyebrow">Summary</p>
                  <h3>{generatedPath.learnerName}</h3>
                </div>
                <span>{generatedPath.estimatedDurationWeeks} weeks</span>
              </div>
              <p className="source-pill">
                Generated via {generatedPath.generationSource === "llm" ? "AI model" : "rule-based engine"}
              </p>
              <p className="summary-text">{generatedPath.summary}</p>

              <div className="module-list">
                {generatedPath.modules.map((module) => (
                  <section key={module.title} className="module-card">
                    <div className="module-topline">
                      <h4>{module.title}</h4>
                      <span>{module.effortHours} hrs</span>
                    </div>
                    <p>{module.focus}</p>
                    <strong>Outcomes</strong>
                    <ul>
                      {module.outcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                    <strong>Practice project</strong>
                    <p>{module.practiceProject}</p>
                  </section>
                ))}
              </div>
            </article>
          )}
        </section>
      </main>

      <section className="panel recent-panel">
        <div className="panel-heading">
          <h2>Recent generated paths</h2>
          <p>Useful for showing persistence and retrieval in your demo.</p>
        </div>

        <div className="recent-list">
          {recentPaths.length === 0 && <p>No saved learning paths yet.</p>}
          {recentPaths.map((item) => (
            <article className="recent-card" key={item._id}>
              <h3>{item.learnerName}</h3>
              <p>{item.goal}</p>
              <span>
                {item.currentLevel} level | {item.estimatedDurationWeeks} weeks
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default App;
