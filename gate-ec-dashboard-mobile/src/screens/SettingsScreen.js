import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { storage } from '../utils/storage';
import { COLORS } from '../styles/colors';
import { generateQRData } from '../utils/qrSync';

export default function SettingsScreen() {
  const [showQR, setShowQR] = useState(false);
  const [qrData, setQrData] = useState(null);

  const handleExport = async () => {
    const data = await storage.exportAll();
    const filename = `gate_backup_${new Date().toISOString().split('T')[0]}.json`;
    
    // Share JSON file
    try {
      await Share.share({
        message: data,
        title: filename,
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const handleGenerateQR = async () => {
    const data = await generateQRData();
    setQrData(data);
    setShowQR(true);
  };

  const handleReset = () => {
    if (confirm('This will delete ALL your data. Are you sure?')) {
      storage.set('tasks', []);
      storage.set('pyqLog', []);
      storage.set('mocks', []);
      storage.set('formulas', []);
      storage.set('errors', []);
      storage.set('mastery', {});
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data & Backup</Text>
        
        <SettingButton 
          title="📤 Export Data"
          description="Save as JSON file"
          onPress={handleExport}
        />
        
        <SettingButton 
          title="🔲 Generate QR Code"
          description="Scan from Ubuntu app"
          onPress={handleGenerateQR}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Danger Zone</Text>
        
        <SettingButton 
          title="🗑 Reset All Data"
          description="Permanently delete everything"
          onPress={handleReset}
          danger
        />
      </View>

      {/* QR Modal */}
      {showQR && qrData && (
        <View style={styles.qrModal}>
          <Text style={styles.qrTitle}>Sync with Ubuntu</Text>
          <Text style={styles.qrSubtext}>Show this QR to your Ubuntu app</Text>
          {/* QR code here */}
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowQR(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function SettingButton({ title, description, onPress, danger }) {
  return (
    <TouchableOpacity 
      style={[styles.button, danger && styles.dangerButton]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonTitle, danger && styles.dangerText]}>{title}</Text>
        <Text style={styles.buttonDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
    padding: 16
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12
  },
  button: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 8
  },
  dangerButton: {
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent.danger
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary
  },
  dangerText: {
    color: COLORS.accent.danger
  },
  buttonDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 4
  },
  qrModal: {
    backgroundColor: COLORS.overlay,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 8
  },
  qrSubtext: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 16
  },
  closeButton: {
    backgroundColor: COLORS.accent.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24
  },
  closeButtonText: {
    color: COLORS.text.primary,
    fontWeight: '600'
  }
});
