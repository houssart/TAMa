import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { fetchRecipeById } from "../services/api";

const RecipeDetails = ({ route, navigation }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [currentServings, setCurrentServings] = useState(1);

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        const data = await fetchRecipeById(recipeId);
        setRecipe(data);
        setCurrentServings(data.servings || 1);
      } catch (error) {
        console.error("Error loading recipe details:", error);
      }
    };

    loadRecipeDetails();
  }, [recipeId]);

  const adjustServings = (newServings) => {
    if (newServings < 1) return;
    setCurrentServings(newServings);
  };

  const calculateIngredientAmount = (amount) => {
    if (!recipe || !recipe.servings) return amount;
    return (amount * currentServings) / recipe.servings;
  };

  const handleAddToMealPlanner = () => {
    navigation.navigate("Meal Planner", { recipe });
  };

  const openLink = (url) => {
    navigation.navigate("WebViewScreen", { url });
  };

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Loading recipe details...</Text>
      </View>
    );
  }

  const tags = [];
  if (recipe.vegan) tags.push("Vegan");
  if (recipe.vegetarian) tags.push("Vegetarian");
  if (recipe.dairyFree) tags.push("Dairy-Free");
  if (recipe.glutenFree) tags.push("Gluten-Free");

  return (
    <View style={styles.container}>
      <ScrollView>
        {recipe.image && <Image source={{ uri: recipe.image }} style={styles.recipeImage} />}
        <View style={styles.recipeHeader}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text>Original Servings: {recipe.servings}</Text>
          <Text>Current Servings: {currentServings}</Text>
        </View>

        <View style={styles.servingsControls}>
          <TouchableOpacity
            style={styles.servingButton}
            onPress={() => adjustServings(currentServings - 1)}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.servingsText}>{currentServings}</Text>
          <TouchableOpacity
            style={styles.servingButton}
            onPress={() => adjustServings(currentServings + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Tags:</Text>
        {tags.length > 0 ? (
          <View style={styles.tags}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.noData}>No tags available</Text>
        )}

        <Text style={styles.sectionHeader}>Ingredients:</Text>
        {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
          <View>
            {recipe.extendedIngredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientContainer}>
                {ingredient.image && (
                  <Image
                    source={{ uri: `https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}` }}
                    style={styles.ingredientImage}
                  />
                )}
                <Text style={styles.ingredientText}>
                  {ingredient.name}: {calculateIngredientAmount(ingredient.amount).toFixed(2)}{" "}
                  {ingredient.measures?.metric?.unitLong || ""}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noData}>No ingredients available</Text>
        )}

        <Text style={styles.sectionHeader}>Link:</Text>
        {recipe.sourceUrl ? (
          <TouchableOpacity onPress={() => openLink(recipe.sourceUrl)}>
            <Text style={styles.linkText}>{recipe.sourceUrl}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.noData}>No link available</Text>
        )}

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back to Recipes</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddToMealPlanner}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f8e1",
  },
  recipeImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  recipeHeader: {
    marginVertical: 10,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b5323",
  },
  sectionHeader: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "bold",
    color: "#4b6f44",
  },
  servingsControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  servingButton: {
    width: 40,
    height: 40,
    backgroundColor: "#a2c3a4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
  },
  servingsText: {
    fontSize: 18,
    marginHorizontal: 20,
    color: "#3b5323",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "#d9ead3",
    borderRadius: 8,
    padding: 5,
    margin: 5,
    color: "#3b5323",
  },
  noData: {
    fontStyle: "italic",
    color: "#888",
  },
  ingredientContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  ingredientImage: {
    width: 40,
    height: 40,
    marginRight: 10,
    borderRadius: 5,
  },
  ingredientText: {
    fontSize: 16,
    color: "#3b5323",
  },
  linkText: {
    color: "#27AE60",
    textDecorationLine: "underline",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#27AE60",
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#27AE60",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  floatingButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default RecipeDetails;
