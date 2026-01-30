import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API } from '../config/api'; // ✅ IMPORT API CONFIG

const ForgotPassword = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ================= SEND OTP =================
  const handleSendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'OTP sent to your email');
        setIsOtpSent(true);
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (error) {
      Alert.alert('Error', 'Server not reachable');
    } finally {
      setIsLoading(false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Alert.alert('Error', 'Please enter OTP and new password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(API.RESET_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Password reset successful');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'Server not reachable');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <Text style={styles.heading}>Forgot Password</Text>
      <Text style={styles.subHeading}>
        {isOtpSent
          ? 'Enter the OTP sent to your email'
          : 'Enter your email to receive OTP'}
      </Text>

      {/* Email */}
      <View style={styles.container}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter registered email"
          style={[styles.inputBox, isOtpSent && styles.disabledInput]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isOtpSent}
        />
      </View>

      {/* OTP + New Password */}
      {isOtpSent && (
        <>
          <View style={styles.container}>
            <Text style={styles.label}>OTP</Text>
            <TextInput
              placeholder="Enter OTP"
              style={styles.inputBox}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              placeholder="Enter new password"
              style={styles.inputBox}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />
          </View>
        </>
      )}

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={isOtpSent ? handleResetPassword : handleSendOtp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>
            {isOtpSent ? 'Reset Password' : 'Send OTP'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backTxt}>Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    heading: {
        fontSize: 32,
        color: "#155DA4",
        fontWeight: "bold",
        marginBottom: 10,
    },
    subHeading: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 40,
    },
    container: {
        gap: 10,
    },
    label: {
        fontSize: 20,
        fontWeight: "500",
    },
    inputBox: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        fontSize: 18,
        marginBottom: 20,
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    disabledInput: {
      backgroundColor: '#f0f0f0',
      color: '#a0a0a0',
    },
    actionBtn: {
        backgroundColor: "#155DA4",
        borderRadius: 50,
        padding: 15,
        marginBottom: 20,
        alignItems: 'center',
    },
    btnText: {
        fontSize: 22,
        color: "white",
        fontWeight: "500",
    },
    backTxt: {
        fontSize: 16,
        color: "#155DA4",
        textAlign: 'center',
    },
});