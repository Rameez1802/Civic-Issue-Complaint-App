import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Help = () => {
  return (
    <ScrollView >
      <SafeAreaView style={styles.body}>
        <Text style={styles.heading}># Help & Support</Text>
      <Text style={styles.content}>Welcome to the Seva Setu Help Center! We're here to ensure you have a smooth experience reporting civic issues and helping improve your community. Find answers to common questions below.</Text>

      <Text style={styles.heading}># Frequently Asked Questions (FAQ)</Text>
      <Text style={styles.subheading}>Q: How do I reset my password if I forget it?</Text>
      <Text style={styles.content}>If you forget your password, simply tap the <Text style={styles.bold}>Forgot Password?</Text> link on the Login screen or <Text style={styles.bold}>Change Password</Text> option in Profile. You'll be asked to enter your registered email address. We will then send you a 6-digit OTP (One-Time Password) to verify your identity and help you set a new password.</Text>

      <Text style={styles.subheading}>Q: Can I change my name or mobile number after signing up?</Text>
      <Text style={styles.content}>Yes. You can view and update your personal information by navigating to the Profile tab and selecting the <Text style={styles.bold}>My Info</Text> option.</Text>

      <Text style={styles.subheading}>Q: How do I submit a new report?</Text>
      <Text style={styles.content}>To submit a new report, tap the large <Text style={styles.bold}>+</Text> button on the home screen. You will be guided to a form where you need to provide a title, location, a brief description of the issue, and an optional photo.</Text>

      <Text style={styles.heading}># Contact Us</Text>
      <Text style={styles.subheading}>Still need help?</Text>
      <Text style={styles.content}>If your question isn't answered in our FAQ, please feel free to reach out to our support team. We are happy to assist you!</Text>

      <Text style={styles.contact}><Text style={styles.bold}>Email Support: </Text>support@sevasetu.org</Text>
      <Text style={styles.contact}><Text style={styles.bold}>Contact Number: </Text>+91 11 1234 5678</Text>
      </SafeAreaView>
      
    </ScrollView>
  )
}

export default Help

const styles = StyleSheet.create({
  body:{
    paddingHorizontal:15,
  },
  heading:{
    fontSize:25,
    fontWeight:"bold",
  },
  subheading:{
    marginTop:10,
    fontSize:20,
    fontWeight:"500"
  },
  content:{
    marginTop:10,
    fontSize:20,
    fontStyle:"italic",
    marginBottom:20
  },
  bold:{
    fontWeight:"bold",
    fontStyle:"normal"
  },
  contact:{
    fontSize:20
  }
})