import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import CouponCard from '../../components/cards/CouponCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import AppCard from '../../components/common/AppCard';
import Icon from '../../components/common/Icon';
import { couponApi } from '../../services/api/couponApi';
import { Coupon } from '../../types/coupon';
import { useCart } from '../../hooks/useCart';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Offers'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const OffersScreen: React.FC<Props> = ({ navigation }) => {
  const { coupon: activeCoupon, applyPromoCoupon, removePromoCoupon } = useCart();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const list = await couponApi.getCoupons();
      setCoupons(list);
    } catch (err) {
      console.warn('Error fetching offers', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Offers & Promotions" showBack={false} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Subscription banner */}
        <AppCard
          onPress={() => navigation.navigate('SubscriptionPlans')}
          style={styles.subBannerCard}>
          <View style={styles.bannerRow}>
            <View style={styles.iconCircle}>
              <Icon name="sparkles-outline" size={24} color={colors.surface} />
            </View>

            <View style={styles.bannerTextGroup}>
              <AppText variant="h3" color={colors.surface} bold>
                WashKart Laundry Pass
              </AppText>
              <AppText variant="bodySmall" color="rgba(255,255,255,0.9)">
                Save up to 30% monthly with free unlimited pickup & express care.
              </AppText>
            </View>

            <Icon name="chevron-forward" size={20} color={colors.surface} />
          </View>
        </AppCard>

        {/* Refer & Earn Banner */}
        <AppCard
          onPress={() => navigation.navigate('Referral')}
          style={styles.referralCard}>
          <View style={styles.referralRow}>
            <Icon name="share-social-outline" size={24} color={colors.primary} />
            <View style={styles.referralText}>
              <AppText variant="label" color={colors.text} bold>
                Refer Friends & Earn ₹100
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Get ₹100 in your WashKart wallet when your friend places their 1st order.
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Available Promo Coupons */}
        <AppText variant="h3" color={colors.text} bold style={styles.sectionHeader}>
          Available Promo Coupons
        </AppText>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : (
          coupons.map(item => (
            <CouponCard
              key={item.id}
              coupon={item}
              isApplied={activeCoupon?.id === item.id}
              onApply={() => {
                applyPromoCoupon(item);
                navigation.navigate('Cart');
              }}
              onRemove={removePromoCoupon}
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
  subBannerCard: {
    backgroundColor: colors.primary,
    marginVertical: spacing.md,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  bannerTextGroup: {
    flex: 1,
  },
  referralCard: {
    marginBottom: spacing.lg,
  },
  referralRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
});

export default OffersScreen;
