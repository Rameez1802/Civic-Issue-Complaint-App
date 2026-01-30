import { Pressable, StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useCallback } from 'react'; // Import hooks
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define your server URL
const SERVER_BASE = 'https://civic-issue-complaint-app.onrender.com/'

const HomePage = ({ navigation }) => {
  // State to hold the report counts, initialized to 0
  const [counts, setCounts] = useState({ total: 0, pending: 0, resolved: 0 });

  // Function to fetch the counts from our new '/stats' endpoint
  const fetchReportCounts = async () => {
    try {
      // Get the stored user info
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const token = userInfo.token;

        // Make the fetch request with the Authorization header
        const response = await fetch(`${SERVER_BASE}/api/reports/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`, // <-- Send the token
          },
        });
        const data = await response.json();
        setCounts(data);
      }
    } catch (error) {
      console.error("Failed to fetch report counts:", error);
    }
  };

  // Hook to automatically refresh data every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchReportCounts();
    }, [])
  );

  return (
    <ScrollView>
      <View>
        <Image style={styles.appLogo} source={require('../images/appLogo.png')} />
        <Text style={styles.heading}>Seva Setu</Text>
        <Text style={styles.subHeading}>Make your city better, one report at a time</Text>
      </View>
      <TouchableOpacity style={styles.complainbtn} onPress={() => navigation.navigate("ReportIssue")}>
        <View style={styles.btnContent}>
          <EntypoIcon name="plus" size={55} color="white" />
          <Text style={styles.btnText}>Report Issue</Text>
        </View>
      </TouchableOpacity>
      <View>
        <Text style={styles.yourReportsText}>Your Reports</Text>
        
        {/* Total Reports Card - Now uses state */}
        <View style={styles.card}>
          <View style={styles.firstline}>
            <Text style={styles.cardtext}>{counts.total}</Text>
            <FeatherIcon style={styles.Icon} name="camera" size={40} />
          </View>
          <Text style={styles.cardtext}>Total Reports</Text>
        </View>

        {/* Pending Reports Card - Now uses state */}
        <View style={styles.card}>
          <View style={styles.firstline}>
            <Text style={styles.cardtext}>{counts.pending}</Text>
            <FeatherIcon style={styles.Icon} name="clock" size={40} />
          </View>
          <Text style={styles.cardtext}>Pending Reports</Text>
        </View>

        {/* Resolved Reports Card - Now uses state */}
        <View style={styles.card}>
          <View style={styles.firstline}>
            <Text style={styles.cardtext}>{counts.resolved}</Text>
            <FeatherIcon style={styles.Icon} name="check-circle" size={40} />
          </View>
          <Text style={styles.cardtext}>Resolved Reports</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomePage;

// Styles are slightly adjusted for better alignment
const styles = StyleSheet.create({
    appLogo:{
        width:100, 
        height:100,
        alignSelf:"center",
        marginTop:10
    },
    heading:{
        fontSize:35,
        alignSelf:"center",
        fontWeight:"bold"
    },
    subHeading:{
        fontSize:15,
        fontStyle:"italic",
        alignSelf:"center"
    },
    complainbtn:{
        marginTop:50,
        paddingLeft:0,
        padding:15,
        width:"90%",
        alignSelf:"center",
        borderRadius:30,
        backgroundColor:"#155DA4",
        alignItems:"center"
    },
    btnContent: {
        flexDirection: 'row',
        gap: 5,
    },
    btnText:{
        fontSize:38,
        color:"white",
        fontWeight:"500",
    },
    yourReportsText:{
        fontSize:30,
        fontWeight:"bold",
        paddingTop:40,
        paddingLeft:25,
    },
    card:{
        marginTop:20,
        borderColor:"#d5d5d5ff",
        borderWidth:1,
        paddingVertical:15,
        paddingHorizontal:15,
        width:"90%",
        alignSelf:"center",
        borderRadius:20,
        backgroundColor:"#ffffffff",
    },
    cardtext:{
        fontSize:25,
        fontWeight:"400",
        color:"#736D6D"
    },
    Icon:{
        color:"grey",
    },
    firstline:{
        flexDirection:"row",
        justifyContent:"space-between"
    }
});