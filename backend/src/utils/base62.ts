// Base62 encoding/decoding for short URL generation

const BASE62_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Encode a number to Base62 string
 * This is used to generate short codes from sequential IDs
 */
export const encodeBase62 = (num: number): string => {
  if (num === 0) return BASE62_CHARS[0];

  let encoded = '';
  while (num > 0) {
    encoded = BASE62_CHARS[num % 62] + encoded;
    num = Math.floor(num / 62);
  }

  return encoded;
};

/**
 * Decode Base62 string to number
 */
export const decodeBase62 = (str: string): number => {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    decoded = decoded * 62 + BASE62_CHARS.indexOf(str[i]);
  }
  return decoded;
};

/**
 * Generate a random Base62 string of specified length
 * Used as fallback for random short codes
 */
export const generateRandomBase62 = (length: number = 8): string => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS.charAt(Math.floor(Math.random() * 62));
  }
  return result;
};
