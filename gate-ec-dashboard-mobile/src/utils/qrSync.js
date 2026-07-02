import QRCode from 'react-native-qrcode-svg';
import { storage } from './storage';
import { COLORS } from '../styles/colors';

// Export data as QR code string (compressed)
export async function generateQRData() {
  const allData = await storage.exportAll();
  // Compress: remove whitespace
  return allData.replace(/\s/g, '');
}

// Import data from scanned QR
export async function importQRData(qrString) {
  try {
    const jsonString = qrString.trim();
    return await storage.importAll(jsonString);
  } catch (error) {
    console.error('QR import error:', error);
    return false;
  }
}

// Generate QR code component
export function QRCodeComponent({ data, size = 300 }) {
  return (
    <QRCode 
      value={data}
      size={size}
      color={COLORS.text.primary}
      backgroundColor={COLORS.bg.secondary}
    />
  );
}
