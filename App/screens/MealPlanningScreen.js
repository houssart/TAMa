import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from "react-native";
import api from "../services/api";

const MealPlanningScreen = ({ navigation }) => {
  const [mealPlanner, setMealPlanner] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);

  const daysOfWeek = [
    { id: "1", name: "Monday" },
    { id: "2", name: "Tuesday" },
    { id: "3", name: "Wednesday" },
    { id: "4", name: "Thursday" },
    { id: "5", name: "Friday" },
    { id: "6", name: "Saturday" },
    { id: "7", name: "Sunday" },
  ];

  // Fetch meals from the backend
  const loadMeals = async () => {
    try {
      const response = await api.get("/mealplanner");
      const data = response.data || [];
      setMealPlanner(data);
    } catch (error) {
      console.error("Error fetching meal planner:", error.response?.data || error.message);
      setMealPlanner([]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", loadMeals);
    return unsubscribe;
  }, [navigation]);

  const handleAddMeal = (day) => {
    navigation.navigate("MealSelectionScreen", { selectedDay: day });
  };

  const handleDeleteMeal = async (mealId, mealType) => {
    try {
      await api.delete(`/mealplanner/meals`, { data: { mealId, mealType } });
      Alert.alert("Meal Deleted", "The meal was successfully removed.");
      loadMeals(); // Refresh meals
    } catch (error) {
      console.error("Error deleting meal:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to delete the meal.");
    }
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
  };

  const renderMealsForDay = (day) => {
    const dayEntry = mealPlanner.find((entry) => entry.date === day);

    if (!dayEntry || !dayEntry.meals) {
      return null;
    }

    return Object.entries(dayEntry.meals).map(([mealType, meal]) => (
      <TouchableOpacity
        key={`${day}-${mealType}`}
        style={styles.mealCard}
        onPress={() =>
          isDeleteMode
            ? handleDeleteMeal(meal.recipeId, mealType)
            : navigation.navigate("RecipeDetails", { recipeId: meal.recipeId })
        }
      >
        <Image source={{ uri: meal.image }} style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealTitle}>{meal.title}</Text>
          <Text style={styles.mealSubtitle}>
            {mealType.charAt(0).toUpperCase() + mealType.slice(1)} -{" "}
            {meal.readyInMinutes} min
          </Text>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Meal Planner</Text>
      <FlatList
        data={daysOfWeek}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.dayContainer}>
            <Text style={styles.dayText}>{item.name}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddMeal(item.name)}
            >
              <Text style={styles.addButtonText}>Add Meal</Text>
            </TouchableOpacity>
            {renderMealsForDay(item.name)}
          </View>
        )}
      />
      <TouchableOpacity
        style={[styles.addButton, styles.deleteButton]}
        onPress={toggleDeleteMode}
      >
        <Text style={styles.addButtonText}>
          {isDeleteMode ? "Cancel Delete" : "Delete Meal"}
        </Text>
      </TouchableOpacity>
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
  dayContainer: {
    padding: 10,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b5323",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "#27AE60",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#C0392B",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
  },
  mealCard: {
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
  mealImage: {
    width: 100,
    height: 100,
  },
  mealInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b5323",
  },
  mealSubtitle: {
    fontSize: 14,
    color: "#616161",
  },
});

export default MealPlanningScreen;
