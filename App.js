import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import ListsScreen from "./app/screens/ListsScreen";
import TasksScreen from "./app/screens/TasksScreen";
import Colors from "./constants/Colors";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { 
            backgroundColor: Colors.primary,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: "#fff",
          headerTitleStyle: { 
            fontWeight: "bold",
            fontSize: 20,
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen 
          name="Lists" 
          component={ListsScreen}
          options={{ title: 'My Lists' }}
        />
        <Stack.Screen 
          name="Tasks" 
          component={TasksScreen}
          options={({ route }) => ({ 
            title: route.params?.listTitle || 'Tasks',
            headerBackTitle: 'Back'
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}