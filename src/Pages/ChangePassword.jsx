import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// IMPORTANT: Use your computer's IP address
const API_URL = 'http://10.0.2.2:5000/api/users'; // Example IP

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [isOtpSent, setIsOtpSent] = useState(false); // Controls which part of the form is shown
    const [isLoading, setIsLoading] = useState(false); // Shows a loading indicator

    // --- Function to handle sending the OTP ---
    const handleSendOtp = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'An OTP has been sent to your email.');
                setIsOtpSent(true); // Show the OTP input field
            } else {
                Alert.alert('Error', data.message || 'Failed to send OTP.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- Function to handle resetting the password ---
    const handleResetPassword = async () => {
        if (!otp || !newPassword) {
            Alert.alert('Error', 'Please enter the OTP and your new password.');
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Your password has been changed successfully.');
                navigation.navigate('Profile');
            } else {
                Alert.alert('Error', data.message || 'Failed to reset password.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not connect to the server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.body}>
            <Text style={styles.heading}>Change Password</Text>
            <Text style={styles.subHeading}>
                {isOtpSent 
                    ? 'An OTP has been sent. Please check your email.' 
                    : 'Enter your email to receive an OTP.'}
            </Text>

            {/* Email Input */}
            <View style={styles.container}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    placeholder='Enter registered email'
                    style={[styles.inputBox, isOtpSent && styles.disabledInput]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType='email-address'
                    autoCapitalize='none'
                    editable={!isOtpSent} // Disable editing after OTP is sent
                />
            </View>

            {/* Conditionally render OTP and Password fields */}
            {isOtpSent && (
                <>
                    <View style={styles.container}>
                        <Text style={styles.label}>OTP</Text>
                        <TextInput
                            placeholder='Enter 6-digit OTP'
                            style={styles.inputBox}
                            value={otp}
                            onChangeText={setOtp}
                            keyboardType='number-pad'
                            maxLength={6}
                        />
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            placeholder='Enter new password'
                            style={styles.inputBox}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                    </View>
                </>
            )}

            {/* Conditionally render the correct button */}
            <TouchableOpacity 
                style={styles.actionBtn} 
                onPress={isOtpSent ? handleResetPassword : handleSendOtp}
                disabled={isLoading}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.btnText}>
                        {isOtpSent ? 'Reset Password' : 'Send OTP'}
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.backTxt}>Back to Profile</Text>
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