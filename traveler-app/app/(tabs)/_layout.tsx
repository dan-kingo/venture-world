import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/authStore';
import { colors } from '../../src/theme/theme';
import { Platform, StatusBar } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  return (
    <>
      {/* Top Status Bar Color */}
      <ExpoStatusBar style="light" backgroundColor={colors.surface} translucent={false} />

      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'index') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'explore') {
              iconName = focused ? 'compass' : 'compass-outline';
            } else if (route.name === 'bookings') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'profile') {
              iconName = focused ? 'person' : 'person-outline';
            } else {
              iconName = 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 90 : 70,
            position: 'absolute',
            bottom: 45,
            left: 20,
            right: 20,
            borderRadius: 20,
            marginHorizontal: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 5,
          },
          tabBarLabelStyle: {
            fontFamily: 'Poppins-Regular',
            fontSize: 12,
            marginBottom: Platform.OS === 'ios' ? 0 : 4,
          },
          headerShown: false,
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
          }}
        />
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
          }}
        />
      </Tabs>
    </>
  );
}
