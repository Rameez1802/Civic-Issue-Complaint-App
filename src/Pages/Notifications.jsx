import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Notifications = () => {
  return (
    <View style={{height:"100%", justifyContent:"center",alignItems:"center"}}>
      <Text style={styles.text}>No Notifications</Text>
    </View>
  )
}

export default Notifications

const styles = StyleSheet.create({
  text:{
    fontSize:20,
    textAlign:"center",
    fontWeight:"1400"
  }
})