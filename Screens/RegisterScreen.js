import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!username || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // Obtenemos los usuarios existentes
      const existingUsers = await AsyncStorage.getItem("users");
      let usersArray = existingUsers ? JSON.parse(existingUsers) : [];

      // Verificamos si el usuario ya existe
      const userExists = usersArray.some((u) => u.username === username);
      if (userExists) {
        setError("Este nombre de usuario ya está registrado");
        return;
      }

      // Registramos al nuevo usuario
      usersArray.push({ username, password });
      await AsyncStorage.setItem("users", JSON.stringify(usersArray));

      Alert.alert("Éxito", "Cuenta creada. ¡Ahora puedes iniciar sesión!");
      navigation.goBack();
    } catch (err) {
      console.error("Error al registrar", err);
      setError("Hubo un problema al registrar la cuenta");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <Text style={styles.subtitle}>Crea una cuenta para tu diario</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
        <Text style={styles.loginButtonText}>Registrarme</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.loginButtonText}>Volver al Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Reutilizamos los mismos estilos que ya tenías en LoginScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  title: { color: "#0f0f0f", fontSize: 50, marginBottom: 5 },
  subtitle: { fontSize: 20, color: "#0f0f0f", marginBottom: 20 },
  input: {
    height: 50,
    marginBottom: 15,
    padding: 10,
    width: 280,
    backgroundColor: "#fae1fa",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#eda2d9",
  },
  error: { color: "red", marginBottom: 10, fontSize: 13 },
  loginButton: {
    backgroundColor: "#fae1fa",
    width: 280,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#eda2d9",
  },
  loginButtonText: { color: "#000", fontSize: 16, fontWeight: "bold" },
  registerButton: {
    backgroundColor: "#eda2d9",
    width: 280,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#fae1fa",
  },
});
