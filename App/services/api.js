import axios from "axios";

// Replace this with your backend's IP address and port
const BASE_URL = "http://100.64.197.179:5000";

// Create an Axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Fetch all recipes
export const fetchRecipes = async () => {
  try {
    const response = await api.get("/recipes");
    return response.data;
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};

// Fetch a single recipe by ID
export const fetchRecipeById = async (id) => {
  try {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error(`Recipe with ID ${id} not found.`);
    } else {
      console.error("Error fetching recipe:", error);
    }
    throw error;
  }
};


// Search for recipes by name
export const searchRecipes = async (query) => {
  try {
    const response = await api.get(`/recipes/search?query=${query}`);
    return response.data;
  } catch (error) {
    console.error("Error searching recipes:", error);
    throw error;
  }
};

// Add a meal to the meal planner
export const addMealToPlanner = async (day, mealData) => {
  try {
    const response = await api.post(`/mealplanner/${day}`, mealData);
    return response.data;
  } catch (error) {
    console.error("Error adding meal to planner:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch meals for a specific day
export const fetchMealsByDay = async (day) => {
  try {
    const response = await api.get(`/mealplanner/${day}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meals for the day:", error.response?.data || error.message);
    throw error;
  }
};

export default api;

