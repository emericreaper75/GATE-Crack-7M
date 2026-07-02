import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../styles/colors';

export default function MoreMenuScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <MenuItem title="PYQ Log" onPress={() => navigation.navigate('PYQLog')} />
      <MenuItem title="Error Journal" onPress={() => navigation.navigate('ErrorJournal')} />
      <MenuItem title="Formula Sheet" onPress={() => navigation.navigate('FormulaSheet')} />
      <MenuItem title="Mock Analyzer" onPress={() => navigation.navigate('MockAnalyzer')} />
      <MenuItem title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}

function MenuItem({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
    padding: 16
  },
  menuItem: {
    backgroundColor: COLORS.bg.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8
  },
  menuText: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: '500'
  }
});
