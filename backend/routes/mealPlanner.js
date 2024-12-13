const express = require("express");
const router = express.Router();
const { authenticate } = require("../controllers/userController");
const {
  getMealsByDate,
  addOrUpdateMeal,
  removeMeal,
  getMeals,
} = require("../controllers/mealPlannerController");

// Get meals for a specific date (user-specific if authenticated)
router.get("/:date", (req, res) => {
  const { date } = req.params;

  if (req.headers.authorization) {
    // If the user is authenticated, fetch user-specific data
    try {
      authenticate(req, res, () => {
        const meals = getMealsByDate(req.userId, date);
        res.json(meals);
      });
    } catch (error) {
      res.status(401).send("Invalid token");
    }
  } else {
    // If not authenticated, fallback to non-user-specific data
    const meals = getMealsByDate(null, date); // Passing `null` for userId
    res.json(meals);
  }
});

router.post("/:date", (req, res) => {
  const { type, recipeId, title, image, readyInMinutes } = req.body;

  if (!type || !recipeId || !title || !image || !readyInMinutes) {
    return res.status(400).json({ error: "Meal type, recipe ID, and recipe title are required" });
  }

  try {
    addOrUpdateMeal(req.params.date, type, {
      recipeId,
      title,
      image,
      readyInMinutes,
    });
    res.status(201).json({ message: "Meal added successfully" });
  } catch (error) {
    console.error("Error adding meal:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/meals", (req, res) => {
  const { mealId, mealType } = req.body;

  try {
    if (!mealId || !mealType) {
      return res.status(400).json({ error: "Meal ID and type are required" });
    }

    removeMeal(mealId, mealType);
    res.status(200).json({ message: "Meal deleted successfully" });
  } catch (error) {
    console.error("Error deleting meal:", error.message);
    res.status(500).json({ error: error.message });
  }
});


router.get("/", (req, res) => {
  try {
    const meals = getMeals();
    res.json(meals || []); // Always return an array
  } catch (error) {
    console.error("Error fetching all meals:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
