
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read blob as Base64 string.'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- SOVEREIGN ENCRYPTION UTILS V2 ---
// Uses Base64 and string reversal for improved client-side obfuscation.
const SECRET_SALT = "ZOOKA_OS_ENCRYPTION_KEY_v999";

export function encryptData(text: string): string {
    if (!text) return '';
    try {
        return btoa(text + SECRET_SALT).split('').reverse().join('');
    } catch (e) {
        console.error("Encryption failed", e);
        return '';
    }
}

export function decryptData(encoded: string): string {
    if (!encoded) return '';
    try {
        const reversed = encoded.split('').reverse().join('');
        const decoded = atob(reversed);
        if (decoded.endsWith(SECRET_SALT)) {
            return decoded.slice(0, -SECRET_SALT.length);
        }
        return ''; // Invalid data if salt is missing
    } catch (e) {
        console.error("Decryption failed", e);
        return '';
    }
}


// Functions for Live API audio processing
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
