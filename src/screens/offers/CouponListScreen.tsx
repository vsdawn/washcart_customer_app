import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import CouponCard from '../../components/cards/CouponCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import EmptyState from '../../components/states/EmptyState';
import { couponApi } from '../../services/api/couponApi';
import { Coupon } from '../../types/coupon';
import { useCart } from '../../hooks/useCart';

type Props = NativeStackScreenProps<RootStackParamList, 'CouponList'>;

export const CouponListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { isSelectionMode } = route.params || {};
  const { coupon: activeCoupon, summary, applyPromoCoupon, removePromoCoupon } = useCart();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const list = await couponApi.getCoupons();
      setCoupons(list);
    } catch (err) {
      console.warn('Error fetching coupons', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (c: Coupon) => {
    applyPromoCoupon(c);
    if (isSelectionMode) {
      navigation.navigate('Cart');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Apply Coupon Code" />

      {loading ? (
        <SkeletonLoader count={4} />
      ) : (
        <FlatList
          data={coupons}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <CouponCard
              coupon={item}
              isApplied={activeCoupon?.id === item.id}
              onApply={() => handleApply(item)}
              onRemove={removePromoCoupon}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              iconName="pricetag-outline"
              title="No Coupons Available"
              message="Check back soon for new discounts and seasonal promotional offers."
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
  },
});

export default CouponListScreen;
