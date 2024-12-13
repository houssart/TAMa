const express = require("express");
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  filterRecipesByName,
} = require("../controllers/recipeController");

// Get all recipes
router.get("/", (req, res) => {
  const recipes = getAllRecipes();
  res.json(recipes);
});

// Get a single recipe by ID
router.get("/:id", (req, res) => {
  const recipe = getRecipeById(req.params.id);
  if (!recipe) {
    return res.status(404).json({ error: "Recipe not found" });
  }
  res.json(recipe);
});



// Add a new recipe
router.post("/", (req, res) => {
  const newRecipe = addRecipe(req.body);
  res.status(201).json(newRecipe);
});

// Update a recipe
router.put("/:id", (req, res) => {
  const updatedRecipe = updateRecipe(req.params.id, req.body);
  if (!updatedRecipe) return res.status(404).send("Recipe not found");
  res.json(updatedRecipe);
});

// Delete a recipe
router.delete("/:id", (req, res) => {
  const deletedRecipe = deleteRecipe(req.params.id);
  if (!deletedRecipe) return res.status(404).send("Recipe not found");
  res.json(deletedRecipe);
});

router.get("/search", (req, res) => {
  const { query } = req.query; // Extract query from request URL
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const matchingRecipes = filterRecipesByName(query);
  res.json(matchingRecipes);
});

module.exports = router;
