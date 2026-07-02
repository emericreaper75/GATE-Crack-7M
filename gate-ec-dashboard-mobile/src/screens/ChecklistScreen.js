import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useStorage } from '../hooks/useStorage';
import { COLORS } from '../styles/colors';

export default function ChecklistScreen() {
  const { data: tasks, add, update, remove } = useStorage('tasks');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskSubject, setNewTaskSubject] = useState('Networks');

  const today = new Date().toDateString();
  const todaysTasks = (tasks || []).filter(t => t.date === today);
  const pending = todaysTasks.filter(t => !t.completed);
  const completed = todaysTasks.filter(t => t.completed);

  const handleAddTask = async () => {
    if (!newTaskName.trim()) return;
    await add({
      name: newTaskName,
      subject: newTaskSubject,
      completed: false,
      date: today,
      createdAt: new Date().toISOString()
    });
    setNewTaskName('');
    setShowAddModal(false);
  };

  const handleToggleTask = async (task) => {
    await update(task.id, { completed: !task.completed });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.list}>
        {/* Pending Tasks */}
        <Text style={styles.sectionTitle}>Pending ({pending.length})</Text>
        <FlatList
          data={pending}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TaskItem 
              task={item} 
              onToggle={() => handleToggleTask(item)}
              onDelete={() => remove(item.id)}
            />
          )}
        />

        {/* Completed Tasks */}
        {completed.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed ({completed.length})</Text>
            <FlatList
              data={completed}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TaskItem 
                  task={item} 
                  completed
                  onToggle={() => handleToggleTask(item)}
                  onDelete={() => remove(item.id)}
                />
              )}
            />
          </>
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      {showAddModal && (
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task name"
              placeholderTextColor={COLORS.text.muted}
              value={newTaskName}
              onChangeText={setNewTaskName}
            />
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleAddTask}
            >
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

function TaskItem({ task, completed, onToggle, onDelete }) {
  return (
    <View style={[styles.taskItem, completed && styles.taskItemCompleted]}>
      <TouchableOpacity onPress={onToggle} style={styles.checkbox}>
        <Text style={styles.checkboxText}>{completed ? '✓' : '○'}</Text>
      </TouchableOpacity>
      <View style={styles.taskContent}>
        <Text style={[styles.taskName, completed && styles.taskNameCompleted]}>
          {task.name}
        </Text>
        <Text style={styles.taskSubject}>{task.subject}</Text>
      </View>
      <TouchableOpacity onPress={onDelete}>
        <Text style={styles.deleteButton}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary
  },
  list: {
    flex: 1,
    padding: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginVertical: 12
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8
  },
  taskItemCompleted: {
    opacity: 0.6
  },
  checkbox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxText: {
    fontSize: 20,
    color: COLORS.accent.primary
  },
  taskContent: {
    flex: 1,
    marginLeft: 12
  },
  taskName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary
  },
  taskNameCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.text.secondary
  },
  taskSubject: {
    fontSize: 12,
    color: COLORS.text.secondary,
    marginTop: 2
  },
  deleteButton: {
    fontSize: 18,
    color: COLORS.accent.danger,
    marginLeft: 8
  },
  addButton: {
    backgroundColor: COLORS.accent.primary,
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center'
  },
  addButtonText: {
    color: COLORS.text.primary,
    fontWeight: '600',
    fontSize: 16
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: COLORS.bg.elevated,
    borderRadius: 16,
    padding: 20,
    width: '80%'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 16
  },
  input: {
    backgroundColor: COLORS.bg.secondary,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text.primary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  modalButton: {
    backgroundColor: COLORS.accent.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8
  },
  modalButtonText: {
    color: COLORS.text.primary,
    fontWeight: '600'
  },
  cancelButton: {
    color: COLORS.text.secondary,
    textAlign: 'center',
    padding: 12,
    fontSize: 14
  }
});
