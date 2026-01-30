import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../config/api'; // ✅ IMPORT CENTRAL API

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    try {
      const response = await fetch(API.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Store token / user info
        await AsyncStorage.setItem('userInfo', JSON.stringify(data));
        console.log('Login successful');

        navigation.replace('Main');
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Error', 'Server not reachable');
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.heading}>Welcome Back,</Text>

      <Image
        source={require('../images/appLogo.png')}
        style={styles.appLogo}
      />

      <Text style={styles.appName}>Seva Setu</Text>

      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter email"
          style={styles.inputBox}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.container}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          secureTextEntry
          placeholder="Enter password"
          style={styles.inputBox}
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.forgotPass}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin} style={styles.loginBtn}>
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.Footer}>
        <Text style={styles.FooterTxt}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signupTxt}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;


const styles = StyleSheet.create({
    // Your existing styles...
     body: {
        paddingHorizontal: 20,
        paddingVertical: 60,
        flex: 1
    },
    heading: {
        fontSize: 35,
        color: "#155DA4",
        fontWeight: "bold",
        fontStyle: "italic"
    },
    appName: {
        fontSize: 30,
        textAlign: "center",
        fontWeight: "bold",
        fontStyle: "italic",
        marginBottom: 50
    },
    appLogo: {
        width: 200,
        height: 200,
        alignSelf: "center",
    },
    container: {
        gap: 10
    },
    label: {
        fontSize: 23,
        fontWeight: "500"
    },
    inputBox: {
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    forgotPass: {
        fontSize: 15,
        color: "#155DA4",
        textAlign: "right",
        marginBottom: 30
    },
    loginBtn: {
        backgroundColor: "#155DA4",
        borderRadius: 50,
        padding: 10,
        marginBottom: 20,
    },
    btnText: {
        fontSize: 25,
        color: "white",
        textAlign: "center",
        fontWeight: "500"
    },
    Footer: {
        alignSelf: "center",
        gap: 5,
        flexDirection: "row"
    },
    FooterTxt: {
        fontSize: 18
    },
    signupTxt: {
        fontSize: 18,
        color: "#155DA4"
    }
});