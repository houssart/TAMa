const fs = require("fs");
const path = require("path");

const recipeDBPath = path.join(__dirname, "../data/recipesDB.json");
let recipes = JSON.parse(fs.readFileSync(recipeDBPath, "utf-8"));

const getAllRecipes = () => {
  return recipes.map((recipe, index) => ({
    id : recipe.id || index + 1,
    title: recipe.title,
    image: recipe.image,
    readyInMinutes: recipe.readyInMinutes,
    vegan: recipe.vegan || false,
    vegetarian: recipe.vegetarian || false,
    dairyFree: recipe.dairyFree || false,
    glutenFree: recipe.glutenFree || false,
  }));
};

const getRecipeById = (id) => {
  return recipes.find((recipe) => recipe.id === parseInt(id)) || null;
};

const addRecipe = (recipe) => {
  if (!recipe.title || !recipe.readyInMinutes) {
    throw new Error("Title and readyInMinutes are required");
  }
  recipe.id = recipes.length + 1;
  recipes.push(recipe);
  fs.writeFileSync(recipeDBPath, JSON.stringify(recipes, null, 2));
  return recipe;
};


const updateRecipe = (id, updatedData) => {
  const index = recipes.findIndex((recipe) => recipe.id === parseInt(id));
  if (index === -1) return null;
  recipes[index] = { ...recipes[index], ...updatedData };
  fs.writeFileSync(recipeDBPath, JSON.stringify(recipes, null, 2));
  return recipes[index];
};

const deleteRecipe = (id) => {
  const index = recipes.findIndex((recipe) => recipe.id === parseInt(id));
  if (index === -1) return null;
  const deletedRecipe = recipes.splice(index, 1);
  fs.writeFileSync(recipeDBPath, JSON.stringify(recipes, null, 2));
  return deletedRecipe[0];
};

const filterRecipesByName = (query) => {
  if (!query || query.trim() === "") return [];
  
  const lowerCaseQuery = query.toLowerCase();
  return recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(lowerCaseQuery)
  );
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  filterRecipesByName,
};
