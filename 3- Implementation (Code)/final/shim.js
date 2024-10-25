import { randomBytes } from 'react-native-randombytes';
import crypto from 'crypto';

Object.assign(global, {
  crypto: {
    getRandomValues: randomBytes
  }
});
