import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from "react-native";
import RecipeList from "./screens/RecipeList";
import RecipeDetails from "./screens/RecipeDetails";
import WebViewScreen from "./screens/WebViewScreen"; // WebViewScreen for opening URLs
import UserSettings from "./screens/UserSettings"; // Placeholder for user preferences screen
import MealPlanningScreen from "./screens/MealPlanningScreen";
import MealSelectionScreen from "./screens/MealSelectionScreen";

// Stack Navigator for Recipes
const RecipeStack = createStackNavigator();

function RecipeStackScreen() {
  return (
    <RecipeStack.Navigator screenOptions={{ headerShown: false }}>
      <RecipeStack.Screen
        name="RecipeList"
        component={RecipeList}
        options={{ title: "Recipes" }}
      />
      <RecipeStack.Screen
        name="RecipeDetails"
        component={RecipeDetails}
        options={{ title: "Recipe Details" }}
      />
      <RecipeStack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{ title: "Web View" }}
      />
    </RecipeStack.Navigator>
  );
}

const MealPlannerStack = createStackNavigator();

function MealPlannerStackScreen() {
  return (
    <MealPlannerStack.Navigator screenOptions={{ headerShown: false }}>
      <MealPlannerStack.Screen
        name="MealPlanningScreen"
        component={MealPlanningScreen}
        options={{ title: "Meal Planner" }}
      />
      <MealPlannerStack.Screen
        name="MealSelectionScreen"
        component={MealSelectionScreen}
        options={{ title: "Select Meal" }}
      />
    </MealPlannerStack.Navigator>
  );
}

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused }) => {
            let imageSource;

            if (route.name === "Recipes") {
              imageSource = focused
                ? require("./assets/list-icon.png") // Focused icon
                : require("./assets/list-icon.png"); // Default icon
            } else if (route.name === "UserSettings") {
              imageSource = focused
                ? require("./assets/user-icon.png")
                : require("./assets/user-icon.png");
            } else if (route.name === "MealPlanner") {
              imageSource = focused
                ? require("./assets/calendar-icon.png")
                : require("./assets/calendar-icon.png");
            }

            return (
              <Image
                source={imageSource}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            );
          },
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#D1F2EB",
          tabBarStyle: {
            backgroundColor: "#27AE60",
            borderTopWidth: 0,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Recipes" component={RecipeStackScreen} />
        <Tab.Screen name="MealPlanner" component={MealPlannerStackScreen} />
        <Tab.Screen name="UserSettings" component={UserSettings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
