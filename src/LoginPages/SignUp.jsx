import { StyleSheet, Text, View, Image, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

// IMPORTANT: Replace with your computer's IP address
const API_URL = 'https://civic-issue-complaint-app.onrender.com/api/users'; // Example IP

const SignUp = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = async () => {
        if (!fullName || !mobile || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, mobile, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Account created successfully! Please login.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Sign Up Failed', data.message || 'Something went wrong');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not connect to the server.');
        }
    };

    return (
        <View style={styles.body}>
            <ScrollView>
                <View style={styles.header}>
                    <Image source={require('../images/appLogo.png')} style={styles.appLogo} />
                    <Text style={styles.appName}>Seva Setu</Text>
                </View>
                <Text style={styles.heading}>Create your account</Text>

                <View style={styles.container}>
                    <Text style={styles.label}>Full Name:</Text>
                    <TextInput
                        placeholder='Enter name'
                        style={styles.inputBox}
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.label}>Mobile No.:</Text>
                    <TextInput
                        placeholder='91XXXXXXXXXX'
                        style={styles.inputBox}
                        value={mobile}
                        onChangeText={setMobile}
                        keyboardType='phone-pad'
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder='Enter email'
                        style={styles.inputBox}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType='email-address'
                        autoCapitalize='none'
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.label}>Password:</Text>
                    <TextInput
                        secureTextEntry={true}
                        placeholder='Enter password'
                        style={styles.inputBox}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View style={styles.container}>
                    <Text style={styles.label}>Confirm Password:</Text>
                    <TextInput
                        secureTextEntry={true}
                        placeholder='Confirm password'
                        style={styles.inputBox}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <TouchableOpacity onPress={handleSignUp} style={styles.signupBtn}>
                    <Text style={styles.btnText}>Sign Up</Text>
                </TouchableOpacity>

                <View style={styles.Footer}>
                    <Text style={styles.FooterTxt}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.loginTxt}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    // Your existing styles...
    body: {
        marginTop:50,
        paddingHorizontal: 20,
        flex: 1, 
    },
    header: {
        justifyContent: "center",
        alignItems: 'center', 
        marginBottom:30

    },
    heading: {
        fontSize: 30,
        color: "#155DA4",
        fontWeight: "bold",
        marginBottom: 20,
        textAlign:"center"
    },
    appName: {
        fontSize: 30,
        fontWeight: "bold",
        fontStyle: "italic",
        
    },
    appLogo: {
        width: 80,
        height: 80,
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
        marginBottom: 15, // Adjusted margin
        paddingHorizontal: 10, // Add padding
        paddingVertical: 8,
    },
    signupBtn: {
        backgroundColor: "#155DA4",
        borderRadius: 50,
        padding: 10,
        marginBottom: 20,
        marginTop: 10,
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
        flexDirection: "row",
        paddingBottom: 20, // Add padding at bottom
    },
    FooterTxt: {
        fontSize: 18
    },
    loginTxt: {
        fontSize: 18,
        color: "#155DA4"
    }
});