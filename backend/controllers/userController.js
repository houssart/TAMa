const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userDBPath = path.join(__dirname, "../data/userDB.json");
let users = JSON.parse(fs.readFileSync(userDBPath, "utf-8"));

const secretKey = "secret_key";

const registerUser = async (email, password) => {
  if (users.find((user) => user.email === email)) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    email,
    password: hashedPassword,
    preferences: {
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      ketogenic: false,
    },
  };

  users.push(newUser);
  fs.writeFileSync(userDBPath, JSON.stringify(users, null, 2));
  return { id: newUser.id, email: newUser.email, preferences: newUser.preferences };
};

const loginUser = async (email, password) => {
  const user = users.find((user) => user.email === email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });
  return { token, userId: user.id };
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("Access denied");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};

const getUserDetails = (userId) => {
  const user = users.find((user) => user.id === userId);
  if (!user) throw new Error("User not found");
  return { id: user.id, email: user.email, preferences: user.preferences };
};

const updateUserPreferences = (userId, newPreferences) => {
  const user = users.find((user) => user.id === userId);
  if (!user) throw new Error("User not found");

  user.preferences = { ...user.preferences, ...newPreferences };
  fs.writeFileSync(userDBPath, JSON.stringify(users, null, 2));
  return { id: user.id, email: user.email, preferences: user.preferences };
};

module.exports = {
  registerUser,
  loginUser,
  authenticate,
  getUserDetails,
  updateUserPreferences,
};
