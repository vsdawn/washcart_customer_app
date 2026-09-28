import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import SubscriptionCard from '../../components/cards/SubscriptionCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import AppCard from '../../components/common/AppCard';
import Icon from '../../components/common/Icon';
import { subscriptionApi } from '../../services/api/subscriptionApi';
import { SubscriptionPlan, UserSubscription } from '../../types/subscription';

type Props = NativeStackScreenProps<RootStackParamList, 'SubscriptionPlans'>;

export const SubscriptionPlansScreen: React.FC<Props> = ({ navigation }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSub, setUserSub] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [pList, uSub] = await Promise.all([
        subscriptionApi.getPlans(),
        subscriptionApi.getUserSubscription(),
      ]);
      setPlans(pList);
      setUserSub(uSub);
    } catch (err) {
      console.warn('Error fetching subscription data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      const active = await subscriptionApi.subscribe(plan.id);
      setUserSub(active);
      Alert.alert('Subscription Activated! 🎉', `You have successfully subscribed to ${plan.name}`);
    } catch (err: any) {
      Alert.alert('Subscription Error', err.message || 'Failed to subscribe');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="WashKart Pass & Subscriptions" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Active subscription banner if present */}
        {userSub && userSub.status === 'ACTIVE' && (
          <AppCard style={styles.activeCard}>
            <View style={styles.activeRow}>
              <Icon name="star" size={24} color={colors.warning} />
              <View style={styles.activeTextGroup}>
                <AppText variant="label" color={colors.text} bold>
                  Active Plan: {userSub.planName}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {userSub.remainingPickups} pickups remaining • Valid until {userSub.endDate}
                </AppText>
              </View>
            </View>
          </AppCard>
        )}

        <View style={styles.titleHeader}>
          <AppText variant="h2" color={colors.text} bold align="center">
            Zero Delivery Fees. Maximum Savings.
          </AppText>
          <AppText
            variant="body"
            color={colors.textSecondary}
            align="center"
            style={styles.subtext}>
            Choose a plan tailored for your household garment care needs.
          </AppText>
        </View>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          plans.map(plan => (
            <SubscriptionCard
              key={plan.id}
              plan={plan}
              isSubscribed={userSub?.planId === plan.id && userSub?.status === 'ACTIVE'}
              onSubscribe={() => handleSubscribe(plan)}
            />
          ))
        )}
      </ScrollView>
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
  activeCard: {
    marginVertical: spacing.md,
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
    borderWidth: 1,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTextGroup: {
    marginLeft: spacing.md,
    flex: 1,
  },
  titleHeader: {
    marginVertical: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  subtext: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
});

export default SubscriptionPlansScreen;
