import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useStorage } from '../hooks/useStorage';
import { COLORS } from '../styles/colors';

export default function DashboardScreen() {
  const { data: tasks } = useStorage('tasks');
  const { data: pyqLog } = useStorage('pyqLog');
  const { data: mastery } = useStorage('mastery');
  const { data: errors } = useStorage('errors');
  const [stats, setStats] = useState({});

  useEffect(() => {
    if (!tasks || !pyqLog || !mastery || !errors) return;

    const today = new Date().toDateString();
    const tasksToday = (tasks || []).filter(t => t.date === today);
    const completedToday = tasksToday.filter(t => t.completed).length;
    const pyqToday = (pyqLog || []).filter(p => new Date(p.date).toDateString() === today).length;

    setStats({
      tasksCompleted: `${completedToday}/${tasksToday.length}`,
      pyqLogged: pyqToday,
      errorsThisWeek: (errors || []).length
    });
  }, [tasks, pyqLog, mastery, errors]);

  return (
    <ScrollView style={styles.container}>
      {/* Countdown */}
      <View style={styles.countdownCard}>
        <Text style={styles.countdownText}>228 days to GATE</Text>
        <Text style={styles.countdownSubtext}>February 14, 2027</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <StatCard title="Tasks Today" value={stats.tasksCompleted} />
        <StatCard title="PYQs Logged" value={stats.pyqLogged} />
        <StatCard title="Errors Week" value={stats.errorsThisWeek} />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>+ Add Task</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>+ Log PYQ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton}>
        <Text style={styles.actionButtonText}>+ Add Error</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function StatCard({ title, value }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
    padding: 16
  },
  countdownCard: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent.primary
  },
  countdownText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.accent.primary
  },
  countdownSubtext: {
    fontSize: 14,
    color: COLORS.text.secondary,
    marginTop: 4
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center'
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginBottom: 4
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12
  },
  actionButton: {
    backgroundColor: COLORS.accent.primary,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    alignItems: 'center'
  },
  actionButtonText: {
    color: COLORS.text.primary,
    fontWeight: '600',
    fontSize: 16
  }
});
