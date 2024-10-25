import 'react-native-get-random-values';
import * as CryptoJS from 'crypto-js';
import crc from 'crc';

// Function to generate a secure random key (pseudorandom generating key)
const generateSecureKey = (length: number = 16): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Generate and reuse a secure key (symmetric encryption)
const secretKey = generateSecureKey(16);

// Encryption function using crypto-js
export const encryptMessage = (plainText: string): string => {
  try {
    // Calculate CRC-16 checksum and append it to the message
    const crc16Checksum = crc.crc16(plainText).toString(16).padStart(4, '0');
    const encrypted = CryptoJS.Blowfish.encrypt(plainText + crc16Checksum, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Directly convert the CipherParams to Base64 string without specifying the encoding explicitly
    const base64EncodedMessage = encrypted.toString(); // Default is Base64 for toString() on CipherParams
    return base64EncodedMessage;
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
};

// Decryption function using crypto-js
export const decryptMessage = (encryptedBase64: string): string => {
  try {
    const decrypted = CryptoJS.Blowfish.decrypt(encryptedBase64, secretKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    // Convert decrypted data to Utf8 string
    const decryptedText = CryptoJS.enc.Utf8.stringify(decrypted);

    // Extract original message and checksum
    const originalMessage = decryptedText.slice(0, -4);
    const receivedChecksum = decryptedText.slice(-4);
    const computedChecksum = crc.crc16(originalMessage).toString(16).padStart(4, '0');

    // Verify the checksum to ensure integrity
    if (computedChecksum !== receivedChecksum) {
      throw new Error('Integrity check failed!');
    }

    return originalMessage;
  } catch (error) {
    console.error('Decryption error:', error);
    return 'Decryption failed';
  }
};
