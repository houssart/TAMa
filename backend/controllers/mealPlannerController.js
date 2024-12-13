const fs = require("fs");
const path = require("path");

const mealPlannerDBPath = path.join(__dirname, "../data/mealPlannerDB.json");
let mealPlannerData = JSON.parse(fs.readFileSync(mealPlannerDBPath, "utf-8"));

// Get meals for a specific user and date (or general if userId is null)
const getMealsByDate = (userId, date) => {
  const entries = userId
    ? mealPlannerData.filter((entry) => entry.userId === userId && entry.date === date)
    : mealPlannerData.filter((entry) => entry.date === date);

  if (entries.length > 0) {
    return entries[0];
  } else {
    return { date, meals: {} }; // Return empty structure if no data found
  }
};

const addOrUpdateMeal = (date, type, meal) => {
  const entryIndex = mealPlannerData.findIndex((entry) => entry.date === date);

  if (entryIndex === -1) {
    // Add a new entry
    const newEntry = {
      date,
      meals: { [type]: meal },
    };
    mealPlannerData.push(newEntry);
  } else {
    // Update existing entry
    mealPlannerData[entryIndex].meals[type] = meal;
  }

  fs.writeFileSync(mealPlannerDBPath, JSON.stringify(mealPlannerData, null, 2));
};



const removeMeal = (mealId, mealType) => {
  if (!mealType) {
    throw new Error("Meal type is required");
  }

  const dayIndex = mealPlannerData.findIndex((entry) =>
    Object.entries(entry.meals).some(([type, meal]) => type === mealType && meal.recipeId === mealId)
  );

  if (dayIndex === -1) {
    throw new Error("Meal not found");
  }

  delete mealPlannerData[dayIndex].meals[mealType];

  // Remove the day entry if no meals are left
  if (Object.keys(mealPlannerData[dayIndex].meals).length === 0) {
    mealPlannerData.splice(dayIndex, 1);
  }

  fs.writeFileSync(mealPlannerDBPath, JSON.stringify(mealPlannerData, null, 2));
};



const getMeals = () => {
  try {
    const data = fs.readFileSync(mealPlannerDBPath, "utf-8");
    const meals = JSON.parse(data);

    if (!Array.isArray(meals)) {
      throw new Error("Invalid meal planner data format");
    }

    return meals;
  } catch (error) {
    console.error("Error reading mealPlannerDB.json:", error.message);
    throw new Error("Could not read meal planner database");
  }
};

module.exports = { getMealsByDate, addOrUpdateMeal, removeMeal, getMeals };
