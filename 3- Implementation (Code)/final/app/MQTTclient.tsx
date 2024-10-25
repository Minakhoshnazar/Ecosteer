import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { connect } from 'mqtt';
import 'react-native-url-polyfill/auto';
import { Buffer } from 'buffer'; //mqtt depends on buffer for communication
global.Buffer = Buffer;
import process from 'process'; //holds node.js process status
global.process = process;

import 'react-native-get-random-values';
import { encryptMessage, decryptMessage } from './Encryption';

const MQTTClient = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [client, setClient] = useState<any>(null); //holds the mqtt client
  const [receivedEncryptedMessage, setReceivedEncryptedMessage] = useState<string | null>(null);
  const [displayedEncryptedMessage, setDisplayedEncryptedMessage] = useState<string | null>(null); 

  useEffect(() => {
    const mqttClient = connect('wss://sub.es-dev.org:8084/mqtt', {
      reconnectPeriod: 1000,
    });

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      mqttClient.subscribe('topic', (err) => {
        if (err) {
          console.error('Subscription error:', err);
        } else {
          console.log('Subscribed to topic');
        }
      });
    });

    mqttClient.on('message', (topic, payload) => {
      const encryptedMessage = payload.toString();
      console.log(`Encrypted message received on ${topic}: ${encryptedMessage}`);
      setReceivedEncryptedMessage(encryptedMessage);
    });

    mqttClient.on('error', (error) => {
      console.error('Connection error:', error);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient.connected) {
        mqttClient.end(true);
      }
    };
  }, []);

  const publishMessage = async () => {
  if (!client || !client.connected) {
    console.log('MQTT client not connected.');
    return;
  }

  if (!inputMessage.trim()) {
    console.log('No message entered to encrypt.');
    return; // Exit if inputMessage is empty or only whitespace
  }

  try {
    const encryptedMessage = encryptMessage(inputMessage); // Encrypt message
    setDisplayedEncryptedMessage(encryptedMessage); // Update state to display the encrypted message in the app
    console.log(`Encrypted message: ${encryptedMessage}`);
    client.publish('topic', encryptedMessage, { qos: 0, retain: false }, (error: unknown) => {
      if (error) {
        console.error('Publish error:', error);
      } else {
        console.log(`Encrypted message published successfully: ${encryptedMessage}`);
        setInputMessage(''); // Clear the input field
      }
    });
  } catch (error) {
    console.error('Encryption error:', error);
  }
};


  const handleDecryptMessage = () => {
    if (receivedEncryptedMessage) {
      try {
        const decryptedMessage = decryptMessage(receivedEncryptedMessage); // Decrypt the message
        setMessage(decryptedMessage); // Display the decrypted message
        console.log(`Decrypted message: ${decryptedMessage}`);
      } catch (error) {
        console.error('Decryption error:', error);
        setMessage('Failed to decrypt message');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MQTT Test Message</Text>
      <Text style={styles.message}>
        Encrypted Message: {displayedEncryptedMessage || 'No encrypted message to display'} {/* Display encrypted message */}
      </Text>
      <Text style={styles.message}>
        Decrypted Message: {message || 'No decrypted message received'} {/* Display decrypted message */}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter message to publish"
        value={inputMessage}
        onChangeText={setInputMessage}
      />
      <Button title="Encrypt & Publish Message" onPress={publishMessage} />
      <Button title="Decrypt Received Message" onPress={handleDecryptMessage} disabled={!receivedEncryptedMessage} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginVertical: 10,
    width: '80%',
  },
});

export default MQTTClient;
