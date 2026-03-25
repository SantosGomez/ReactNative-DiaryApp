import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HistoryScreen({ navigation }) {
  const [entries, setEntries] = useState([]);
  const [currentUser, setCurrentUser] = useState("");

  // Estados para el Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados temporales para la edición
  const [editTitle, setEditTitle] = useState("");
  const [editBody, setEditBody] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, []),
  );

  const loadEntries = async () => {
    try {
      const loggedUser = await AsyncStorage.getItem("currentUser");
      setCurrentUser(loggedUser);

      const savedEntries = await AsyncStorage.getItem("diary_entries");
      if (savedEntries !== null) {
        const allEntries = JSON.parse(savedEntries);
        const userEntries = allEntries.filter(
          (entry) => entry.author === loggedUser,
        );
        setEntries(userEntries);
      }
    } catch (error) {
      console.error("Error cargando el historial", error);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("currentUser");
    navigation.replace("Login");
  };

  // Abrir el modal y cargar los datos de la nota seleccionada
  const openModal = (item) => {
    setSelectedEntry(item);
    setEditTitle(item.title);
    setEditBody(item.body);
    setIsEditing(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedEntry(null);
    setIsEditing(false);
  };

  // Función para borrar la nota
  const handleDelete = async () => {
    Alert.alert(
      "Eliminar Nota",
      "¿Estás seguro de que deseas borrar esta nota?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            try {
              // 1. Obtenemos TODAS las notas (incluyendo las de otros usuarios)
              const savedEntries = await AsyncStorage.getItem("diary_entries");
              let allEntries = savedEntries ? JSON.parse(savedEntries) : [];

              // 2. Filtramos para quitar la nota seleccionada
              allEntries = allEntries.filter((e) => e.id !== selectedEntry.id);

              // 3. Guardamos el nuevo arreglo
              await AsyncStorage.setItem(
                "diary_entries",
                JSON.stringify(allEntries),
              );

              // 4. Actualizamos la vista y cerramos el modal
              closeModal();
              loadEntries();
              Alert.alert("Éxito", "Nota eliminada");
            } catch (error) {
              console.error("Error al borrar", error);
            }
          },
        },
      ],
    );
  };

  // Función para guardar los cambios al editar
  const handleSaveEdit = async () => {
    if (!editTitle || !editBody) {
      Alert.alert("Error", "Los campos no pueden estar vacíos");
      return;
    }

    try {
      const savedEntries = await AsyncStorage.getItem("diary_entries");
      let allEntries = savedEntries ? JSON.parse(savedEntries) : [];

      // Encontramos el índice de la nota a editar y actualizamos sus valores
      const entryIndex = allEntries.findIndex((e) => e.id === selectedEntry.id);
      if (entryIndex !== -1) {
        allEntries[entryIndex].title = editTitle;
        allEntries[entryIndex].body = editBody;

        await AsyncStorage.setItem("diary_entries", JSON.stringify(allEntries));

        closeModal();
        loadEntries(); // Recargamos para ver los cambios
        Alert.alert("Éxito", "Nota actualizada");
      }
    } catch (error) {
      console.error("Error al editar", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialIcons name="info-outline" size={24} color="#000" />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>
      <Text style={styles.cardBody} numberOfLines={2}>
        {item.body}
      </Text>
      <TouchableOpacity
        style={styles.verButton}
        activeOpacity={0.7}
        onPress={() => openModal(item)}
      >
        <Text style={styles.verButtonText}>Ver</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.topDecoration} />

      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Text style={{ marginBottom: 10, color: "#333" }}>
        Usuario: {currentUser}
      </Text>

      {entries.length === 0 ? (
        <Text style={{ marginTop: 50, color: "#777" }}>
          No hay notas aún. ¡Agrega una!
        </Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addNoteButton}
        onPress={() => navigation.navigate("Notes")}
      >
        <MaterialIcons name="add" size={30} color="#333" />
        <Text style={styles.addNoteText}>Nueva Nota</Text>
      </TouchableOpacity>

      {/* MODAL PARA VER, EDITAR Y BORRAR */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {isEditing ? (
              // VISTA DE EDICIÓN
              <>
                <Text style={styles.modalLabel}>Fecha / Título</Text>
                <TextInput
                  style={styles.editInput}
                  value={editTitle}
                  onChangeText={setEditTitle}
                />
                <Text style={styles.modalLabel}>Contenido</Text>
                <TextInput
                  style={[styles.editInput, styles.editTextArea]}
                  value={editBody}
                  onChangeText={setEditBody}
                  multiline={true}
                  textAlignVertical="top"
                />
                <View style={styles.modalButtonsRow}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: "#ccc" }]}
                    onPress={() => setIsEditing(false)}
                  >
                    <Text style={styles.modalBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: "#eda2d9" }]}
                    onPress={handleSaveEdit}
                  >
                    <Text style={styles.modalBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // VISTA DE LECTURA
              <>
                <Text style={styles.modalTitle}>{selectedEntry?.title}</Text>
                <View style={styles.modalBodyContainer}>
                  <Text style={styles.modalBodyText}>
                    {selectedEntry?.body}
                  </Text>
                </View>

                <View style={styles.modalActionButtons}>
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => setIsEditing(true)}
                  >
                    <MaterialIcons name="edit" size={24} color="#333" />
                    <Text style={styles.actionBtnText}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={handleDelete}
                  >
                    <MaterialIcons name="delete" size={24} color="#d9534f" />
                    <Text style={[styles.actionBtnText, { color: "#d9534f" }]}>
                      Borrar
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.closeModalBtn}
                  onPress={closeModal}
                >
                  <Text style={styles.closeModalBtnText}>Cerrar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  // TUS ESTILOS EXISTENTES
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 80,
    marginBottom: 10,
  },
  title: { color: "#0f0f0f", fontSize: 45, fontFamily: "serif" },
  logoutButton: { padding: 10, backgroundColor: "#eda2d9", borderRadius: 20 },
  listContainer: { paddingBottom: 100, width: "100%", alignItems: "center" },
  card: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  cardBody: { fontSize: 14, color: "#777", lineHeight: 20, marginBottom: 15 },
  verButton: {
    backgroundColor: "#fae1fa",
    borderWidth: 1,
    borderColor: "#eda2d9",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignSelf: "flex-start",
  },
  verButtonText: { color: "#333", fontSize: 14, fontWeight: "500" },
  addNoteButton: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "#eda2d9",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addNoteText: {
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 5,
    color: "#333",
  },

  // NUEVOS ESTILOS PARA EL MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
    textAlign: "center",
  },
  modalBodyContainer: {
    maxHeight: 300,
    marginBottom: 20,
  },
  modalBodyText: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  modalActionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  actionBtn: {
    alignItems: "center",
  },
  actionBtnText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  closeModalBtn: {
    backgroundColor: "#fae1fa",
    borderWidth: 1,
    borderColor: "#eda2d9",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeModalBtnText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 5,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  editTextArea: {
    height: 150,
  },
  modalButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalBtnText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
});
