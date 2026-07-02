import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons as Icon } from '@expo/vector-icons';

// Screens
import DashboardScreen from './src/screens/DashboardScreen';
import ChecklistScreen from './src/screens/ChecklistScreen';
import SubjectTrackerScreen from './src/screens/SubjectTrackerScreen';
import PYQLogScreen from './src/screens/PYQLogScreen';
import MockAnalyzerScreen from './src/screens/MockAnalyzerScreen';
import FormulaSheetScreen from './src/screens/FormulaSheetScreen';
import ErrorJournalScreen from './src/screens/ErrorJournalScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import MoreMenuScreen from './src/screens/MoreMenuScreen';

// Utils
import { initializeDefaults } from './src/utils/storage';
import { COLORS } from './src/styles/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bg.primary },
        headerTintColor: COLORS.text.primary,
        headerTitleStyle: { fontWeight: '600' },
        cardStyle: { backgroundColor: COLORS.bg.primary }
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'GATE EC 2027' }}
      />
    </Stack.Navigator>
  );
}

function ChecklistStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bg.primary },
        headerTintColor: COLORS.text.primary,
        cardStyle: { backgroundColor: COLORS.bg.primary }
      }}
    >
      <Stack.Screen 
        name="Checklist" 
        component={ChecklistScreen}
        options={{ title: 'Daily Checklist' }}
      />
    </Stack.Navigator>
  );
}

function SubjectStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bg.primary },
        headerTintColor: COLORS.text.primary,
        cardStyle: { backgroundColor: COLORS.bg.primary }
      }}
    >
      <Stack.Screen 
        name="SubjectTracker" 
        component={SubjectTrackerScreen}
        options={{ title: 'Subject Tracker' }}
      />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.bg.primary },
        headerTintColor: COLORS.text.primary,
        cardStyle: { backgroundColor: COLORS.bg.primary }
      }}
    >
      <Stack.Screen 
        name="MoreMenu" 
        component={MoreMenuScreen}
        options={{ title: 'More' }}
      />
      <Stack.Screen name="PYQLog" component={PYQLogScreen} />
      <Stack.Screen name="ErrorJournal" component={ErrorJournalScreen} />
      <Stack.Screen name="FormulaSheet" component={FormulaSheetScreen} />
      <Stack.Screen name="MockAnalyzer" component={MockAnalyzerScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const isInit = await AsyncStorage.getItem('app:initialized');
        if (!isInit) {
          await initializeDefaults();
          await AsyncStorage.setItem('app:initialized', 'true');
        }
        setInitialized(true);
      } catch (error) {
        console.error('Initialization error:', error);
        setInitialized(true); // Proceed anyway
      }
    };
    init();
  }, []);

  if (!initialized) {
    return null; // Show splash screen
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.accent.primary,
          tabBarInactiveTintColor: COLORS.text.secondary,
          tabBarStyle: {
            backgroundColor: COLORS.bg.elevated,
            borderTopColor: COLORS.border,
            borderTopWidth: 0.5,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8
          }
        }}
      >
        <Tab.Screen 
          name="DashboardStack" 
          component={DashboardStack}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <Icon name="home" color={color} size={24} />
          }}
        />
        <Tab.Screen 
          name="ChecklistStack" 
          component={ChecklistStack}
          options={{
            tabBarLabel: 'Tasks',
            tabBarIcon: ({ color }) => <Icon name="list" color={color} size={24} />
          }}
        />
        <Tab.Screen 
          name="SubjectStack" 
          component={SubjectStack}
          options={{
            tabBarLabel: 'Subjects',
            tabBarIcon: ({ color }) => <Icon name="book" color={color} size={24} />
          }}
        />
        <Tab.Screen 
          name="MoreStack" 
          component={MoreStack}
          options={{
            tabBarLabel: 'More',
            tabBarIcon: ({ color }) => <Icon name="menu" color={color} size={24} />
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
