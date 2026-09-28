import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatPhone } from '../../utils/formatters';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import Icon, { IconName } from '../../components/common/Icon';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { authApi } from '../../services/api/authApi';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

interface MenuItem {
  id: string;
  title: string;
  iconName: IconName;
  screenName?: keyof RootStackParamList;
  isLogout?: boolean;
}

export const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'orders', title: 'My Laundry Orders', iconName: 'receipt-outline', screenName: 'Orders' as any },
    { id: 'addresses', title: 'Saved Addresses', iconName: 'location-outline', screenName: 'SavedAddresses' },
    { id: 'payments', title: 'Payment Methods', iconName: 'card-outline', screenName: 'PaymentMethods' },
    { id: 'subscriptions', title: 'WashKart Pass Subscriptions', iconName: 'sparkles-outline', screenName: 'SubscriptionPlans' },
    { id: 'notifications', title: 'Notifications & Alerts', iconName: 'notifications-outline', screenName: 'Notifications' },
    { id: 'coupons', title: 'Offers & Coupons', iconName: 'pricetag-outline', screenName: 'CouponList' },
    { id: 'referral', title: 'Refer & Earn Rewards', iconName: 'share-social-outline', screenName: 'Referral' },
    { id: 'reviews', title: 'My Reviews & Ratings', iconName: 'star-outline', screenName: 'Reviews' },
    { id: 'support', title: 'Help & Customer Support', iconName: 'headset-outline', screenName: 'Support' },
    { id: 'faq', title: 'Frequently Asked Questions', iconName: 'help-circle-outline', screenName: 'FAQ' },
    { id: 'terms', title: 'Terms & Conditions', iconName: 'shield-checkmark-outline', screenName: 'Terms' },
    { id: 'privacy', title: 'Privacy Policy', iconName: 'shield-checkmark-outline', screenName: 'PrivacyPolicy' },
    { id: 'logout', title: 'Log Out', iconName: 'log-out-outline', isLogout: true },
  ];

  const handleLogout = async () => {
    try {
      await authApi.logout();
      dispatch(logout());
      setShowLogoutModal(false);
      const parent = navigation.getParent();
      if (parent) {
        parent.reset({
          index: 0,
          routes: [{ name: 'AuthStack', params: { screen: 'Welcome' } }],
        });
      }
    } catch (err) {
      console.warn('Logout error', err);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Account & Profile" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info Header Card */}
        <AppCard style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              {user?.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Icon name="person-outline" size={32} color={colors.primary} />
              )}
            </View>

            <View style={styles.userInfo}>
              <AppText variant="h2" color={colors.text} bold>
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </AppText>
              <AppText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 2 }}>
                {user ? formatPhone(user.mobileNumber) : ''}
              </AppText>
              {user?.email ? (
                <AppText variant="caption" color={colors.textMuted} style={{ marginTop: 2 }}>
                  {user.email}
                </AppText>
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.editBtn}>
              <Icon name="pencil-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </AppCard>

        {/* Menu list */}
        <AppCard style={styles.menuCard}>
          {menuItems.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                if (item.isLogout) {
                  setShowLogoutModal(true);
                } else if (item.screenName) {
                  navigation.navigate(item.screenName as any);
                }
              }}
              style={[
                styles.menuItem,
                idx === menuItems.length - 1 && { borderBottomWidth: 0 },
              ]}>
              <View style={styles.menuLeft}>
                <Icon
                  name={item.iconName}
                  size={20}
                  color={item.isLogout ? colors.error : colors.text}
                />
                <AppText
                  variant="body"
                  color={item.isLogout ? colors.error : colors.text}
                  semiBold={item.isLogout}
                  style={styles.menuTitle}>
                  {item.title}
                </AppText>
              </View>
              {!item.isLogout && (
                <Icon name="chevron-forward" size={18} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </AppCard>

        <AppText variant="caption" color={colors.textMuted} align="center" style={styles.versionText}>
          WashKart App Version 1.0.0 (Build 2026.09)
        </AppText>
      </ScrollView>

      {/* Logout confirmation modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log Out of WashKart?"
        message="Are you sure you want to log out of your account?"
        confirmTitle="Log Out"
        cancelTitle="Cancel"
        isDanger
        onConfirm={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    marginVertical: spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    flex: 1,
  },
  editBtn: {
    padding: spacing.xs,
  },
  menuCard: {
    padding: 0,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    marginLeft: spacing.md,
  },
  versionText: {
    marginBottom: spacing.xl,
  },
});

export default ProfileScreen;
