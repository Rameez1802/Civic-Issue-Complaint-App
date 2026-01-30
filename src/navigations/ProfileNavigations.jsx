import { StyleSheet} from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Notifications from '../Pages/Notifications'
import Help from '../Pages/Help'
import ProfilePage from '../Pages/ProfilePage';
import ChangePassword from '../Pages/ChangePassword';


const Stack = createNativeStackNavigator()
const ProfileNavigation = () => {
    return (

        <Stack.Navigator screenOptions={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#155DA4", height: 110 },
            headerTitleStyle: { fontSize: 25, color: "white" },
            headerTintColor: "white"
         }}>
            <Stack.Screen name="Profile" component={ProfilePage}/>
            <Stack.Screen name="Notifications" component={Notifications}/>
            <Stack.Screen name="Help" component={Help}/>
            <Stack.Screen name="Change Password" component={ChangePassword}/>
        </Stack.Navigator>
        
    )
}

export default ProfileNavigation

const styles = StyleSheet.create({})