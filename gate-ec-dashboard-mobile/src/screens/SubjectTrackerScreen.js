import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';

export default function SubjectTrackerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Subject Tracker placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: COLORS.text.primary,
    fontSize: 16
  }
});
