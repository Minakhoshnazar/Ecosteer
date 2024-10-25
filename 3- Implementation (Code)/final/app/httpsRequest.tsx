import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const fetchProxyInfo = async () => {
  try {
    const response = await axios.get('https://sub.es-dev.org:3000/DOP_PROXY_INFO', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching proxy info:', error);
    throw error;
  }
};

const ProxyInfoComponent = () => {
  
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchProxyInfo();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
        setData('Error fetching data'); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data ? (
        <Text style={styles.text}>{typeof data === 'string' ? data : JSON.stringify(data, null, 2)}</Text>
      ) : (
        <Text style={styles.text}>No data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProxyInfoComponent;
