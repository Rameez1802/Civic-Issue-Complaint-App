import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, FlatList, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SERVER_BASE = 'https://civic-issue-complaint-app.onrender.com/'

const ResolvedReports = () => {
  const [reports, setReports] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch only the reports with "Resolved" status
  const fetchResolvedReports = async () => {
    try {
      // Get the stored user info
      const userInfoString = await AsyncStorage.getItem('userInfo');
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const token = userInfo.token;
      const res = await fetch(`${SERVER_BASE}/api/reports?status=Resolved`,{
        headers: {
            'Authorization': `Bearer ${token}`, // <-- Send the token
          },
        });
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error('Fetch resolved reports error', err);
    }
  };

  // Use useFocusEffect to refresh when the screen is viewed
  useFocusEffect(
    useCallback(() => {
      fetchResolvedReports();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResolvedReports();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const imageSource = item.imageUrl ? { uri: item.imageUrl } : require('../images/noImage.jpg');
    return (
      <View style={styles.card}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.location}>Location: {item.location}</Text>
          {item.landmark ? <Text style={styles.location}>{item.landmark}</Text> : null}
          <View style={[styles.statusBadge, styles.resolved]}>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom:12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No resolved reports</Text>}
      />
    </View>
  );
};

export default ResolvedReports;

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
    marginBottom: 5,
    justifyContent:"center",
    alignItems:"center"
  },
  image: { width: 110, height: 110, borderRadius: 10, backgroundColor: '#dfefff', marginLeft: 5 },
  content: { flex: 1, padding: 8 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  location: { fontSize: 15},
  statusBadge: { alignSelf: 'flex-end',paddingVertical: 5, paddingHorizontal: 12, borderRadius: 20 },
  resolved: { backgroundColor: 'green' },
  status: { color: 'white', fontWeight: '700' },
  emptyText: {textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
});