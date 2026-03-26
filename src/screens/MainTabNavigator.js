import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import TownMapScreen from './TownMap';
import MissionsScreen from './Missions';
import MyRoomScreen from './MyRoom';
import ShopScreen from './Shop';
import ProfileScreen from './Profile';

const Tab = createBottomTabNavigator();
const icons = { Town:'🏡', Missions:'📋', MyRoom:'🏠', Shop:'🐾', Profile:'👤' };
const labels = { Town:'마을', Missions:'미션', MyRoom:'내 방', Shop:'펫', Profile:'프로필' };

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(255,252,244,0.97)',
          borderTopColor: 'rgba(200,165,100,0.2)',
          borderTopWidth: 1.5,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabel: ({ focused }) => (
          <Text style={{
            fontSize: 10,
            fontWeight: focused ? '800' : '600',
            color: focused ? '#8B5E3C' : '#B0A090',
          }}>
            {labels[route.name]}
          </Text>
        ),
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: focused ? 26 : 22 }}>{icons[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="Town" component={TownMapScreen} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="MyRoom" component={MyRoomScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
