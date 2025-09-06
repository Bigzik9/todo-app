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
import ListItem from "../components/ListItem";
import { loadData, saveData } from "../storage";

export default function ListsScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const savedLists = await loadData("lists");
      if (savedLists) setLists(savedLists);
    };
    fetchData();
  }, []);

  const addList = () => {
    if (input.trim().length > 0) {
      const newLists = [...lists, { 
        id: Date.now().toString(), 
        title: input,
        taskCount: 0
      }];
      setLists(newLists);
      saveData("lists", newLists);
      setInput("");
      Keyboard.dismiss();
    }
  };

  const deleteList = (id) => {
    Alert.alert(
      "Delete List",
      "Are you sure you want to delete this list?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            const newLists = lists.filter((list) => list.id !== id);
            setLists(newLists);
            saveData("lists", newLists);
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Lists</Text>
        <Text style={styles.subtitle}>Organize your tasks</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Create a new list..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={addList}
        />
        <TouchableOpacity 
          style={[styles.addButton, !input.trim() && styles.addButtonDisabled]} 
          onPress={addList}
          disabled={!input.trim()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {lists.length > 0 ? (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              taskCount={item.taskCount || 0}
              onPress={() => navigation.navigate("Tasks", { 
                listId: item.id, 
                listTitle: item.title 
              })}
              onDelete={() => deleteList(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="list-outline" size={64} color={Colors.primary} />
          <Text style={styles.emptyStateText}>No lists yet</Text>
          <Text style={styles.emptyStateSubtext}>Create your first list to get started</Text>
        </View>
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
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
});