import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
} from "react-native";
import { fetchRecipes } from "../services/api";

const RecipeList = ({ navigation }) => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [filters, setFilters] = useState({
    vegan: false,
    vegetarian: false,
    dairyFree: false,
    glutenFree: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const data = await fetchRecipes();
        setRecipes(data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    loadRecipes();
  }, []);

  const toggleFilter = (filterKey) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: !prev[filterKey],
    }));
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesQuery = recipe.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;
      return recipe[key] === true;
    });
    return matchesQuery && matchesFilters;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Recipes</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search recipes..."
        value={query}
        onChangeText={setQuery}
      />

      {/* Filter Button */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters((prev) => !prev)}
      >
        <Text style={styles.filterButtonText}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filters}>
          {Object.keys(filters).map((filterKey) => (
            <View key={filterKey} style={styles.filter}>
              <Text>{filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}</Text>
              <Switch
                value={filters[filterKey]}
                onValueChange={() => toggleFilter(filterKey)}
              />
            </View>
          ))}
        </View>
      )}

      {filteredRecipes.length === 0 ? (
        <Text style={styles.noRecipesText}>No recipes found</Text>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.recipeCard}
              onPress={() => navigation.navigate("RecipeDetails", { recipeId: item.id })}
            >
              {item.image && <Image source={{ uri: item.image }} style={styles.recipeImage} />}
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeTitle}>{item.title}</Text>
                <Text style={styles.recipeSubtitle}>{item.readyInMinutes} min</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f2f8e1", // Updated to match RecipeDetails background color
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b5323", // Dark green
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#a2c3a4", // Soft green
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#ffffff", // White background
  },
  filterButton: {
    backgroundColor: "#27AE60", // Green background
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  filterButtonText: {
    color: "#FFFFFF", // White text
    fontSize: 16,
    fontWeight: "bold",
  },
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filter: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  noRecipesText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#a94442", // Soft red
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff", // White background
    borderRadius: 8,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b5323", // Dark green
  },
  recipeSubtitle: {
    fontSize: 14,
    color: "#616161", // Grey
  },
});

export default RecipeList;
