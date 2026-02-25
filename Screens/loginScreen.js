import { StatusBar } from 'expo-status-bar';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';


export default function LoginScreen({navigation}) {
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
      if (!username || !password) {
          setError('Todos los campos son obligatorios');
          return;
        }

      if (password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres');
          return;
        }

        setError('');
        alert(`Bienvenido ${username}`);
    };

  return (

      
    <View style={styles.container}>

      

      <StatusBar style="auto" />
      
      <Text style={styles.title}>Mi diario</Text>
      <Text style={styles.subtitle}>¡Bienvenido! Por favor Inicia Sesión para continuar</Text>    

      <TextInput
        style={[
          styles.input
        ]}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder='Nombre de Usuario'
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
        {error ? <Text style={styles.error}>{error}</Text> : null}
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

      <TouchableOpacity 
        style={[
          styles.loginButton,
          (!username || !password) && { backgroundColor: '#999'}
        ]}
        onPress={handleLogin}
        disabled={!username || !password}
        activeOpacity={0.7}
      >
        <Text style={styles.loginButtonText}>
          Iniciar Sesión
        </Text>
      </TouchableOpacity>

    </View>
  );


}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
  title: {
    color: '#0f0f0f',
    fontSize: 50,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: '#0f0f0f',
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    marginBottom: 15,
    padding: 10,
    width: 280,
    backgroundColor: '#fae1fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor:'#eda2d9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 280,
    backgroundColor: '#fae1fa',
    borderRadius: 10,
    marginBottom: 5,
    paddingRight: 10,
    borderWidth: 2,
    borderColor:'#eda2d9',
  },

  passwordInput: {
    flex: 1,
    padding: 12,
    height: 50,
  },

  iconContainer: {
    padding: 5,
    
  },

  error: {
    color: 'red',
    marginBottom: 10,
    fontSize: 13,
  },
  
  toggle: {
    paddingHorizontal: 10,
    fontSize: 18,
  },
  loginButton: {
    backgroundColor: '#fae1fa',
    width: 280,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor:'#eda2d9',
  },

  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});