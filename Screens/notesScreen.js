import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function NotesScreen({ navigation }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [entryValue, setEntryValue] = useState("");

  const handleSave = async () => {
    if (!day || !month || !year || !entryValue) {
      Alert.alert("Error", "Por favor llena todos los campos");
      return;
    }

    try {
      // Obtenemos el usuario que tiene sesión activa
      const currentUser = await AsyncStorage.getItem("currentUser");

      const newEntry = {
        id: Date.now().toString(),
        title: `${day}/${month}/${year}`,
        body: entryValue,
        author: currentUser, // ¡Asociamos la nota al usuario!
      };

      const existingEntries = await AsyncStorage.getItem("diary_entries");
      let entriesArray = existingEntries ? JSON.parse(existingEntries) : [];

      entriesArray.unshift(newEntry);

      await AsyncStorage.setItem("diary_entries", JSON.stringify(entriesArray));

      Alert.alert("Éxito", "Entrada guardada correctamente");

      setDay("");
      setMonth("");
      setYear("");
      setEntryValue("");
      navigation.navigate("History");
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al guardar la entrada");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topDecoration} />
      <Text style={styles.title}>Entradas</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Fecha</Text>
        <View style={styles.dateContainer}>
          <TextInput
            style={styles.dateInput}
            placeholder="DD"
            value={day}
            onChangeText={setDay}
            maxLength={2}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.dateInput}
            placeholder="MM"
            value={month}
            onChangeText={setMonth}
            maxLength={2}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.dateInput}
            placeholder="YYYY"
            value={year}
            onChangeText={setYear}
            maxLength={4}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.label}>Entradas del diario</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Escribe aquí tu nota..."
          value={entryValue}
          onChangeText={setEntryValue}
          multiline={true}
          textAlignVertical="top"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar entradas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={{ color: "#eda2d9", textDecorationLine: "underline" }}>
            Ver Historial
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomDecoration} />
    </SafeAreaView>
  );
}

// Mantén aquí EXACTAMENTE tus mismos estilos de notesScreen.js originales
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", alignItems: "center" },
  topDecoration: {
    position: "absolute",
    top: -120,
    left: -50,
    width: "150%",
    height: 300,
    backgroundColor: "#fae1fa",
    transform: [{ rotate: "-12deg" }],
    zIndex: -1,
  },
  bottomDecoration: {
    position: "absolute",
    bottom: -100,
    right: -50,
    width: "150%",
    height: 250,
    backgroundColor: "#fae1fa",
    transform: [{ rotate: "-12deg" }],
    zIndex: -1,
  },
  title: {
    color: "#0f0f0f",
    fontSize: 45,
    marginTop: 80,
    marginBottom: 30,
    fontFamily: "serif",
  },
  formContainer: { width: "85%", alignItems: "center" },
  label: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    fontWeight: "500",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    width: "30%",
    textAlign: "center",
    backgroundColor: "#fff",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    width: "100%",
    height: 200,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#fae1fa",
    borderWidth: 1,
    borderColor: "#eda2d9",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    width: "100%",
    alignItems: "center",
  },
  saveButtonText: { color: "#333", fontSize: 16, fontWeight: "bold" },
});
