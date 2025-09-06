import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Colors from "../../constants/Colors";
import TaskItem from "../components/TaskItem";
import { loadData, saveData } from "../storage";

export default function TasksScreen({ route, navigation }) {
  const { listId, listTitle } = route.params;
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    navigation.setOptions({ title: listTitle });
    
    const fetchData = async () => {
      const savedTasks = await loadData(`tasks-${listId}`);
      if (savedTasks) setTasks(savedTasks);
    };
    fetchData();
  }, []);

  const addTask = () => {
    if (input.trim().length > 0) {
      const newTasks = [
        ...tasks,
        { id: Date.now().toString(), title: input, completed: false },
      ];
      setTasks(newTasks);
      saveData(`tasks-${listId}`, newTasks);
      setInput("");
      Keyboard.dismiss();
    }
  };

  const toggleTask = (id) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveData(`tasks-${listId}`, newTasks);
  };

  const deleteTask = (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            const newTasks = tasks.filter((task) => task.id !== id);
            setTasks(newTasks);
            saveData(`tasks-${listId}`, newTasks);
          },
          style: "destructive"
        }
      ]
    );
  };

  const clearCompleted = () => {
    if (tasks.some(task => task.completed)) {
      Alert.alert(
        "Clear Completed",
        "Are you sure you want to clear all completed tasks?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Clear", 
            onPress: () => {
              const newTasks = tasks.filter((task) => !task.completed);
              setTasks(newTasks);
              saveData(`tasks-${listId}`, newTasks);
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  const completedCount = tasks.filter(task => task.completed).length;

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} • {completedCount} completed
        </Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a new task..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity 
          style={[styles.addButton, !input.trim() && styles.addButtonDisabled]} 
          onPress={addTask}
          disabled={!input.trim()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={() => toggleTask(item.id)}
              onDelete={() => deleteTask(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-done-outline" size={64} color={Colors.primary} />
          <Text style={styles.emptyStateText}>No tasks yet</Text>
          <Text style={styles.emptyStateSubtext}>Add your first task to get started</Text>
        </View>
      )}

      {completedCount > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={clearCompleted}
        >
          <Text style={styles.clearButtonText}>Clear Completed</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.background, 
    padding: 20 
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: "#777",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: Colors.danger,
    fontWeight: '600',
  },
});