import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen({ navigation }) {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      // Buscar la lista de usuarios
      const existingUsers = await AsyncStorage.getItem("users");
      const usersArray = existingUsers ? JSON.parse(existingUsers) : [];

      // Validar credenciales
      const validUser = usersArray.find(
        (u) => u.username === username && u.password === password,
      );

      if (validUser) {
        setError("");
        // Guardamos la "sesión" del usuario actual
        await AsyncStorage.setItem("currentUser", username);
        // Lo mandamos al Historial para que vea sus notas previas
        navigation.replace("History");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Hubo un error al iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Mi diario</Text>
      <Text style={styles.subtitle}>
        ¡Bienvenido! Por favor Inicia Sesión para continuar
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={username}
        onChangeText={setUsername}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <MaterialIcons
            name={showPassword ? "visibility-off" : "visibility"}
            size={24}
            color="#eda2d9"
          />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        activeOpacity={0.7}
      >
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.loginButtonText}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Mantén aquí EXACTAMENTE tus mismos estilos de loginScreen.js originales
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
  },
  title: { color: "#0f0f0f", fontSize: 50, marginBottom: 5 },
  subtitle: {
    fontSize: 20,
    color: "#0f0f0f",
    marginBottom: 20,
    textAlign: "center",
  },
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 280,
    backgroundColor: "#fae1fa",
    borderRadius: 10,
    marginBottom: 5,
    paddingRight: 10,
    borderWidth: 2,
    borderColor: "#eda2d9",
  },
  passwordInput: { flex: 1, padding: 12, height: 50 },
  iconContainer: { padding: 5 },
  error: { color: "red", marginBottom: 10, fontSize: 13, alignSelf: "center" },
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
