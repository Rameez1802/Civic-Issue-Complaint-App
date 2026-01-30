import { StyleSheet, Text, View,Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProfilePage = ({navigation}) => {
  const [userName, setUserName] = useState('User Name');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userInfoString = await AsyncStorage.getItem('userInfo');
        if (userInfoString) {
          const userInfo = JSON.parse(userInfoString);
          setUserName(userInfo.fullName);
        }
      } catch (error) {
        console.error("Failed to fetch user's name from storage", error);
      }
    };
    fetchUserName();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.removeItem('userInfo');
            navigation.replace('Auth');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.body}>
      <View>
        <Image style={styles.profile} source={require('../images/profile.jpg')}></Image>
        <Text style={styles.name}>{userName}</Text>
      </View>
      <TouchableOpacity style={styles.card}>
        <FeatherIcon style={styles.Icon} name="info" size={40}/>
        <Text style={styles.cardtxt}>My Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate('Notifications')}>
        <Ionicons style={styles.Icon} name="notifications" size={40}/>
        <Text style={styles.cardtxt}>Notifications</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate('Change Password')}>
        <EntypoIcon style={styles.Icon} name="key" size={40}/>
        <Text style={styles.cardtxt}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={()=> navigation.navigate('Help')}>
        <EntypoIcon style={styles.Icon} name="help" size={40}/>
        <Text style={styles.cardtxt}>Help & Support</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={styles.card}>
        <MaterialIcons style={styles.Icon} name="logout" size={40} color={"red"}/>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ProfilePage

const styles = StyleSheet.create({
  body:{
    paddingTop:50,
    paddingHorizontal:10
  },
  profile:{
    width:150,
    height:150,
    borderRadius:200,
    alignSelf:"center",
    marginBottom:20,
    borderColor:"grey",
    borderWidth:1
  },
  name:{
    fontSize:30,
    textAlign:"center",
    fontWeight:"500",
    marginBottom:50
  },
  card:{
    paddingVertical:10,
    paddingHorizontal:10,
    borderColor:"#ffffffff",
    borderWidth:1,
    borderRadius:10,
    backgroundColor:"#ffffffff",
    flexDirection:"row",
    gap:20,
    marginBottom:10,
    paddingLeft:20,
    alignItems:"center"
  },
  cardtxt:{
    fontSize:24,
    fontWeight:"500"
  },
  logoutText:{
    fontSize:24,
    fontWeight:"500",
    color:"red"
  }
});