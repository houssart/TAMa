const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Import routes
const recipeRoutes = require("./routes/recipes");
const userRoutes = require("./routes/users");
const mealPlannerRoutes = require("./routes/mealPlanner");

// Routes
app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);
app.use("/mealPlanner", mealPlannerRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the Mobile App Backend");
});

// Handle undefined routes
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`);
  next();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://100.64.197.179:${PORT}`);
});
