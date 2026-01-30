import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../LoginPages/Login'
import SignUp from '../LoginPages/SignUp'
import HomePage from '../Pages/HomePage';
import ForgotPassword from '../LoginPages/ForgotPassword';


const Stack = createNativeStackNavigator()
const SignupNavigation = () => {
    return (

        <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
            <Stack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
            <Stack.Screen name="HomePage" component={HomePage} options={{headerShown:false}}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{headerShown:false}}/>
        </Stack.Navigator>
        
    )
}

export default SignupNavigation

const styles = StyleSheet.create({})