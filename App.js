// App.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CharacterCreateScreen from './src/screens/CharacterCreate';
import MainTabNavigator from './src/screens/MainTabNavigator';
import InteriorScreen from './src/screens/Interior';
import { useGameStore } from './src/store/gameStore';

const Stack = createStackNavigator();

export default function App() {
  const characterCreated = useGameStore(s => s.character.created);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!characterCreated ? (
              <Stack.Screen name="CharacterCreate" component={CharacterCreateScreen} />
            ) : (
              <>
                <Stack.Screen name="Main" component={MainTabNavigator} />
                <Stack.Screen
                  name="Interior"
                  component={InteriorScreen}
                  options={{ presentation: 'modal' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
