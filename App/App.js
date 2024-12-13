import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import RecipeList from "./screens/RecipeList";
import RecipeDetails from "./screens/RecipeDetails";
import WebViewScreen from "./screens/WebViewScreen"; // WebViewScreen for opening URLs
import UserSettings from "./screens/UserSettings"; // Placeholder for user preferences screen
import MealPlanningScreen from "./screens/MealPlanningScreen";
import MealSelectionScreen from "./screens/MealSelectionScreen";
import Icon from "react-native-vector-icons/Ionicons";

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
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Recipes") {
              iconName = focused ? "ios-restaurant" : "ios-restaurant-outline";
            } else if (route.name === "UserSettings") {
              iconName = focused ? "ios-settings" : "ios-settings-outline";
            } else if (route.name === "MealPlanner") {
              iconName = focused ? "ios-calendar" : "ios-calendar-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
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
