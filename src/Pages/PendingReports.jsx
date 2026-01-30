import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, FlatList, RefreshControl } from 'react-native'; // Removed TouchableOpacity and Alert
import { useFocusEffect } from '@react-navigation/native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SERVER_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const PendingReports = () => {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // This function fetches ONLY reports with the status "Pending"
  const fetchPendingReports = async () => {
    try {
      // Get the stored user info
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const token = userInfo.token;
        const res = await fetch(`${SERVER_BASE}/api/reports?status=Pending`,{
          headers: {
            'Authorization': `Bearer ${token}`, // <-- Send the token
          },
        });
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Fetch pending reports error', err);
    }
  };

  // This hook re-fetches data every time the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPendingReports();
    }, [])
  );

  // This function handles the "pull-to-refresh" action
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPendingReports();
    setRefreshing(false);
  };

  // REMOVED: The handleMarkAsResolved function is no longer needed.

  const renderItem = ({ item }) => {
    const imageSource = item.imageUrl ? { uri: item.imageUrl } : require('../images/noImage.jpg');

    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.location}>Location: {item.location}</Text>
          {item.landmark ? <Text style={styles.location}>{item.landmark}</Text> : null}
          <View style={[styles.statusBadge, styles.pending]}>
            <Text style={styles.status}>{item.status}</Text>
          </View>
          {/* REMOVED: The TouchableOpacity button for resolving the report is gone. */}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={r => r._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' }}>No pending reports.</Text>}
      />
    </View>
  );
};

export default PendingReports;

// The styles have been reverted to the original version without the button styles.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  card: {
    borderColor: '#d5d5d5ff',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffffff',
    flexDirection: 'row',
    gap: 10,
    alignItems:"center",
    justifyContent:"center",
    marginBottom: 5,
  },
  image: { width: 110, height: 110, borderRadius: 10, backgroundColor: '#dfefff', marginLeft: 5 },
  content: { flex: 1, padding: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  location: { fontSize: 15},
  statusBadge: { alignSelf: 'flex-end', paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  pending: { backgroundColor: 'red' },
  status: { color: 'white', fontWeight: '700' },
});