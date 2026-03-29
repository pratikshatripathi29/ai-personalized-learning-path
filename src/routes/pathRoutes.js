const express = require("express");
const {
  getSkills,
  generatePath,
  getRecentPaths
} = require("../controllers/pathController");

const router = express.Router();

router.get("/skills", getSkills);
router.get("/paths/recent", getRecentPaths);
router.post("/paths/generate", generatePath);

module.exports = router;
