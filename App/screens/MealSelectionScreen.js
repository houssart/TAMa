import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";
import { fetchRecipes } from "../services/api";
import api from "../services/api";

const MealSelectionScreen = ({ route, navigation }) => {
  const { selectedDay } = route.params;
  const [recipes, setRecipes] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState("lunch");

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

  const handleAddMeal = async (recipe) => {
    const payload = {
      type: selectedMealType,
      recipeId: recipe.id,
      title: recipe.title,
      image: recipe.image || "https://via.placeholder.com/100",
      readyInMinutes: recipe.readyInMinutes,
    };

    console.log("Payload sent to API:", payload);

    try {
      await api.post(`/mealplanner/${selectedDay}`, payload);
      alert(`Added ${recipe.title} to ${selectedMealType} on ${selectedDay}.`);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding meal:", error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Meal for {selectedDay}</Text>

      <View style={styles.mealTypeContainer}>
        {["lunch", "dinner"].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.mealTypeButton,
              selectedMealType === type && styles.selectedMealTypeButton,
            ]}
            onPress={() => setSelectedMealType(type)}
          >
            <Text
              style={[
                styles.mealTypeButtonText,
                selectedMealType === type && styles.selectedMealTypeButtonText,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => handleAddMeal(item)}
          >
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
            <View style={styles.recipeInfo}>
              <Text style={styles.recipeTitle}>{item.title}</Text>
              <Text style={styles.recipeSubtitle}>
                Ready in {item.readyInMinutes} min
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f8e1",
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3b5323",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 20,
  },
  mealTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  mealTypeButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#d9ead3",
    alignItems: "center",
    borderRadius: 5,
  },
  selectedMealTypeButton: {
    backgroundColor: "#27AE60",
  },
  mealTypeButtonText: {
    color: "#3b5323",
    fontWeight: "bold",
  },
  selectedMealTypeButtonText: {
    color: "#ffffff",
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recipeImage: {
    width: 100,
    height: 100,
  },
  recipeInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b5323",
  },
  recipeSubtitle: {
    fontSize: 14,
    color: "#616161",
  },
});

export default MealSelectionScreen;
