import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from '../Pages/HomePage'
import ReportIssue from '../Pages/ReportIssue'

const Stack = createNativeStackNavigator()
const Navigation = () => {
   return (
      
         <Stack.Navigator screenOptions={{
            headerTitleAlign: "center",
            headerStyle: { backgroundColor: "#155DA4", height: 110 },
            headerTitleStyle: { fontSize: 25, color: "white" },
            headerTintColor: "white"
         }}>
            <Stack.Screen name="Home" component={HomePage}/>
            <Stack.Screen name="ReportIssue" component={ReportIssue} options={{ headerTitle: "Report Issue"}} />

         </Stack.Navigator>
      
   )
}

export default Navigation

const styles = StyleSheet.create({})