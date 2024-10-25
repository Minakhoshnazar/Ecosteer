import React from 'react';
import { View, StyleSheet } from 'react-native';
import MQTTClient from './MQTTclient';
import ProxyInfoComponent from './httpsRequest'; 

const App = () => {
  return (
    <View style={styles.container}>
      <MQTTClient />
      <ProxyInfoComponent /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
});

export default App;
