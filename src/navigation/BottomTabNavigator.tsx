import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import Icon from '../components/common/Icon';
import AppText from '../components/common/AppText';

import HomeScreen from '../screens/home/HomeScreen';
import PricingScreen from '../screens/pricing/PricingScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OffersScreen from '../screens/offers/OffersScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  // Android draws edge-to-edge, so the tab bar must clear the gesture/navigation bar
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.divider,
          height: 60 + bottom,
          paddingBottom: spacing.xs + 2 + bottom,
          paddingTop: spacing.xs,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName: any = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          if (route.name === 'Pricing') iconName = 'rupee-outline';
          if (route.name === 'Orders') iconName = 'receipt-outline';
          if (route.name === 'Offers') iconName = 'pricetag-outline';
          if (route.name === 'Profile') iconName = 'person-outline';

          return <Icon name={iconName} size={22} color={color} />;
        },
        tabBarLabel: ({ color, focused }) => (
          <AppText
            variant="caption"
            color={color}
            bold={focused}
            style={styles.label}>
            {route.name}
          </AppText>
        ),
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Pricing" component={PricingScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Offers" component={OffersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    marginTop: -2,
  },
});

export default BottomTabNavigator;
