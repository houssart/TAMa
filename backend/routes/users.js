const express = require("express");
const router = express.Router();
const { registerUser, loginUser, authenticate, getUserDetails, updateUserPreferences } = require("../controllers/userController");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await registerUser(email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const result = await loginUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/me", authenticate, (req, res) => {
  try {
    const user = getUserDetails(req.userId);
    res.json(user);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

router.put("/me/preferences", authenticate, (req, res) => {
  try {
    const updatedUser = updateUserPreferences(req.userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
