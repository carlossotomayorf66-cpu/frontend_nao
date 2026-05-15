import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProductFormScreen } from '../screens/ProductFormScreen';
import { ClientScreen } from '../screens/ClientScreen';
import { ClientFormScreen } from '../screens/ClientFormScreen';
import { theme } from '../theme/index';
import { ShoppingBag, Users } from 'lucide-react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textLight,
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
        paddingTop: 10,
      },
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Productos') return <ShoppingBag size={size} color={color} />;
        if (route.name === 'Clientes') return <Users size={size} color={color} />;
        return null;
      },
    })}
  >
    <Tab.Screen name="Productos" component={HomeScreen} />
    <Tab.Screen name="Clientes" component={ClientScreen} />
  </Tab.Navigator>
);

export const AppNavigator = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="ProductForm" component={ProductFormScreen} />
            <Stack.Screen name="ClientForm" component={ClientFormScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
