import React, { useState } from 'react'
import {StyleSheet,Text,View,TextInput,Image,Alert,Platform,TouchableOpacity, ScrollView} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000' // adjust if needed

const ReportIssue = () => {
  const navigation = useNavigation()
  const [cameraImage, setCameraImage] = useState(null)
  const [galleryImage, setGalleryImage] = useState(null)
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [landmark, setLandmark] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTakePhoto = () => {
    launchCamera({ mediaType: 'photo', saveToPhotos: true }, resp => {
      if (resp.didCancel || !resp.assets) return
      setCameraImage(resp.assets[0].uri)
      setGalleryImage(null)
    })
  }

  const handleUploadPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, resp => {
      if (resp.didCancel || !resp.assets) return
      setGalleryImage(resp.assets[0].uri)
      setCameraImage(null)
    })
  }

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim()) {
      Alert.alert('Validation', 'Please enter title and location.')
      return
    }

    setLoading(true)
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (!userInfoString) {
        Alert.alert('Authentication Error', 'You must be logged in to submit a report.');
        setLoading(false);
        return;
      }
      const userInfo = JSON.parse(userInfoString);
      const token = userInfo.token;

      const data = new FormData()
      data.append('title', title)
      data.append('location', location)
      data.append('landmark', landmark)
      data.append('description', description)

      const imageUri = cameraImage || galleryImage
      if (imageUri) {
        // on Android the uri may start with file:// - include name + type
        const filename = imageUri.split('/').pop()
        // try to determine MIME type from extension (simple)
        const ext = filename.split('.').pop()
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`

        data.append('image', {
          uri: imageUri,
          name: filename,
          type: mimeType
        })
      }

      const res = await fetch(`${SERVER_BASE}/api/reports`, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json',
          // NOTE: do NOT set Content-Type; fetch will set boundary for multipart
          'Authorization': `Bearer ${token}`,
        }
      })

      const json = await res.json()
      if (!res.ok) {
        console.warn(json)
        Alert.alert('Upload error', json.message || 'Failed to submit')
      } else {
        Alert.alert('Success', 'Report submitted')
        // After successful submit, navigate to PendingReports (which will fetch list)
        // reset form
        setTitle(''); setLocation(''); setLandmark(''); setDescription(''); setCameraImage(null); setGalleryImage(null)
      }
    } catch (err) {
      console.error(err)
      Alert.alert('Error', 'Something went wrong while submitting')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.body}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.photoBox} onPress={handleTakePhoto}>
          {cameraImage ? (
            <Image source={{ uri: cameraImage }} style={styles.imagePreview} />
          ) : (
            <>
              <MaterialIcons name="add-a-photo" size={60} />
              <Text style={styles.photoBoxText}>Take Photo</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.photoBox} onPress={handleUploadPhoto}>
          {galleryImage ? (
            <Image source={{ uri: galleryImage }} style={styles.imagePreview} />
          ) : (
            <>
              <MaterialIcons name="add-photo-alternate" size={60} />
              <Text style={styles.photoBoxText}>Upload Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View>
        <Text style={styles.labels}>Title</Text>
        <TextInput style={styles.inputBox} value={title} onChangeText={setTitle} placeholder="Enter Title" />
      </View>

      <View>
        <Text style={styles.labels}>Area / Road / Locality</Text>
        <TextInput style={styles.inputBox} value={location} onChangeText={setLocation} placeholder="Enter location" />
      </View>

      <View>
        <Text style={styles.labels}>Landmark</Text>
        <TextInput style={styles.inputBox} value={landmark} onChangeText={setLandmark} placeholder="Enter nearby location" />
      </View>

      <View>
        <Text style={styles.labels}>Description (optional)</Text>
        <TextInput style={styles.descriptionBox} value={description} onChangeText={setDescription} placeholder="Describe your issue" multiline />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Submitting...' : 'Submit'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default ReportIssue

const styles = StyleSheet.create({
  body: { paddingHorizontal: 20 , paddingTop:20 },
  container: { flexDirection: 'row', gap: 20, marginBottom: 35 },
  photoBox: {
    borderColor: '#155DA4',
    borderWidth: 2,
    backgroundColor: '#ffffffff',
    width: '48%',
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    borderRadius: 10,
  },
  photoBoxText: { fontSize: 18, fontWeight: '700' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 8 },
  labels: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  inputBox: { borderWidth: 1, borderColor: '#155DA4', borderRadius: 10, marginBottom: 20, fontSize: 18, paddingHorizontal: 10, paddingVertical: 6, },
  descriptionBox: { minHeight: 100, borderWidth: 1, borderColor: '#155DA4', borderRadius: 10, marginBottom: 20, textAlignVertical: 'top', fontSize: 18, paddingHorizontal: 10, paddingVertical: 8 },
  submitBtn: { backgroundColor: '#155DA4', padding: 12, borderRadius: 8, marginBottom: 40 },
  btnText: { color: 'white', textAlign: 'center', fontSize: 18, fontWeight: '600' },
  
})
