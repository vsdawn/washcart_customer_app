import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import SplashScreen from '../screens/SplashScreen';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';

import CategoryDetailsScreen from '../screens/services/CategoryDetailsScreen';
import ServiceDetailsScreen from '../screens/services/ServiceDetailsScreen';

import CartScreen from '../screens/cart/CartScreen';
import AddressSelectionScreen from '../screens/checkout/AddressSelectionScreen';
import AddAddressScreen from '../screens/checkout/AddAddressScreen';
import PickupSlotScreen from '../screens/checkout/PickupSlotScreen';
import DeliverySlotScreen from '../screens/checkout/DeliverySlotScreen';
import OrderReviewScreen from '../screens/checkout/OrderReviewScreen';
import PaymentScreen from '../screens/checkout/PaymentScreen';
import OrderSuccessScreen from '../screens/checkout/OrderSuccessScreen';

import PricingDetailsScreen from '../screens/pricing/PricingDetailsScreen';
import SchedulePickupScreen from '../screens/schedule/SchedulePickupScreen';
import ScheduleDetailsScreen from '../screens/schedule/ScheduleDetailsScreen';
import CancelScheduleScreen from '../screens/schedule/CancelScheduleScreen';

import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import OrderTrackingScreen from '../screens/orders/OrderTrackingScreen';

import CouponListScreen from '../screens/offers/CouponListScreen';
import SubscriptionPlansScreen from '../screens/subscription/SubscriptionPlansScreen';
import SubscriptionDetailsScreen from '../screens/subscription/SubscriptionDetailsScreen';

import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SavedAddressesScreen from '../screens/profile/SavedAddressesScreen';
import PaymentMethodsScreen from '../screens/profile/PaymentMethodsScreen';
import NotificationsScreen from '../screens/profile/NotificationsScreen';
import ReferralScreen from '../screens/profile/ReferralScreen';
import ReviewsScreen from '../screens/profile/ReviewsScreen';

import SupportScreen from '../screens/support/SupportScreen';
import ComplaintScreen from '../screens/support/ComplaintScreen';
import FAQScreen from '../screens/support/FAQScreen';
import TermsScreen from '../screens/support/TermsScreen';
import PrivacyPolicyScreen from '../screens/support/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AuthStack" component={AuthNavigator} />
      <Stack.Screen name="MainTab" component={BottomTabNavigator} />

      {/* Services */}
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
      <Stack.Screen name="ServiceDetails" component={ServiceDetailsScreen} />

      {/* Cart & Checkout */}
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
      <Stack.Screen name="AddAddress" component={AddAddressScreen} />
      <Stack.Screen name="PickupSlot" component={PickupSlotScreen} />
      <Stack.Screen name="DeliverySlot" component={DeliverySlotScreen} />
      <Stack.Screen name="OrderReview" component={OrderReviewScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />

      {/* Pricing & Pickup Scheduling */}
      <Stack.Screen name="PricingDetails" component={PricingDetailsScreen} />
      <Stack.Screen name="SchedulePickup" component={SchedulePickupScreen} />
      <Stack.Screen name="ScheduleDetails" component={ScheduleDetailsScreen} />
      <Stack.Screen name="CancelSchedule" component={CancelScheduleScreen} />

      {/* Orders */}
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />

      {/* Offers & Subscriptions */}
      <Stack.Screen name="CouponList" component={CouponListScreen} />
      <Stack.Screen name="SubscriptionPlans" component={SubscriptionPlansScreen} />
      <Stack.Screen name="SubscriptionDetails" component={SubscriptionDetailsScreen} />

      {/* Profile */}
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="SavedAddresses" component={SavedAddressesScreen} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Referral" component={ReferralScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />

      {/* Support */}
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="Complaint" component={ComplaintScreen} />
      <Stack.Screen name="FAQ" component={FAQScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
