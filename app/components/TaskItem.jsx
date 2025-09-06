import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
        onPress={onToggle}
      >
        {task.completed && (
          <Ionicons name="checkmark" size={16} color="#fff" />
        )}
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text 
          style={[
            styles.title, 
            task.completed && styles.titleCompleted
          ]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton} 
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close-outline" size={20} color="#999" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: Colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: Colors.text,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  deleteButton: {
    padding: 4,
  },
});