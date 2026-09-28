import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import APP_CONFIG from '../../config/appConfig';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import PriceBreakdown from '../../components/checkout/PriceBreakdown';
import QuantitySelector from '../../components/checkout/QuantitySelector';
import EmptyState from '../../components/states/EmptyState';
import Icon from '../../components/common/Icon';
import { useCart } from '../../hooks/useCart';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { items, coupon, summary, updateItemQuantity, removeItem, removePromoCoupon } = useCart();

  const isBelowMinOrder = summary.subtotal > 0 && summary.subtotal < APP_CONFIG.minOrderAmount;

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <AppHeader title="Your Cart" />
        <EmptyState
          iconName="receipt-outline"
          title="Your Cart is Empty"
          message="Looks like you haven't added any laundry or dry cleaning services to your cart yet."
          buttonTitle="Explore Services"
          onButtonPress={() => navigation.navigate('MainTab', { screen: 'Home' })}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title="Your Cart" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Items List */}
        <AppText variant="h4" color={colors.text} bold style={styles.sectionHeader}>
          Selected Services ({items.length})
        </AppText>

        {items.map(item => (
          <AppCard key={item.service.id} style={styles.itemCard}>
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <AppText variant="label" color={colors.text} bold numberOfLines={1}>
                  {item.service.name}
                </AppText>
                <AppText variant="bodySmall" color={colors.textSecondary} style={styles.unitPrice}>
                  {formatCurrency(item.service.price)} / {item.service.unit}
                </AppText>
              </View>

              <View style={styles.quantityCol}>
                <QuantitySelector
                  quantity={item.quantity}
                  onIncrease={() => updateItemQuantity(item.service.id, item.quantity + 1)}
                  onDecrease={() => updateItemQuantity(item.service.id, item.quantity - 1)}
                />
                <TouchableOpacity
                  onPress={() => removeItem(item.service.id)}
                  style={styles.removeBtn}>
                  <Icon name="trash-outline" size={16} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </AppCard>
        ))}

        {/* Apply Coupon Section */}
        <AppText variant="h4" color={colors.text} bold style={styles.sectionHeader}>
          Offers & Coupons
        </AppText>

        <AppCard
          onPress={() => navigation.navigate('CouponList', { isSelectionMode: true })}
          style={styles.couponCard}>
          <View style={styles.couponRow}>
            <Icon name="pricetag-outline" size={20} color={colors.primary} />
            <View style={styles.couponTextGroup}>
              {coupon ? (
                <>
                  <AppText variant="label" color={colors.success} bold>
                    Coupon Code: {coupon.code}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {coupon.title} ({formatCurrency(summary.discount)} saved)
                  </AppText>
                </>
              ) : (
                <>
                  <AppText variant="label" color={colors.text} bold>
                    Apply Coupon Code
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    Save up to 20% on laundry orders
                  </AppText>
                </>
              )}
            </View>

            {coupon ? (
              <TouchableOpacity onPress={removePromoCoupon} style={styles.removeCouponBtn}>
                <AppText variant="label" color={colors.error} bold>
                  Remove
                </AppText>
              </TouchableOpacity>
            ) : (
              <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
            )}
          </View>
        </AppCard>

        {/* Min order warning */}
        {isBelowMinOrder && (
          <View style={styles.warningBanner}>
            <Icon name="alert-circle-outline" size={20} color={colors.warning} />
            <AppText variant="bodySmall" color={colors.warning} bold style={styles.warningText}>
              Minimum order amount for doorstep pickup is ₹{APP_CONFIG.minOrderAmount}. Please add ₹
              {APP_CONFIG.minOrderAmount - summary.subtotal} more items.
            </AppText>
          </View>
        )}

        {/* Price Breakdown */}
        <PriceBreakdown summary={summary} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <View>
          <AppText variant="caption" color={colors.textSecondary}>
            Total Amount
          </AppText>
          <AppText variant="h2" color={colors.text} bold>
            {formatCurrency(summary.total)}
          </AppText>
        </View>

        <AppButton
          title="Schedule Pickup"
          variant="primary"
          size="lg"
          fullWidth={false}
          disabled={isBelowMinOrder}
          onPress={() => navigation.navigate('SchedulePickup', { fromCart: true })}
          style={styles.checkoutBtn}
        />
      </View>
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
    paddingBottom: 100,
  },
  sectionHeader: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  itemCard: {
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  unitPrice: {
    marginTop: 2,
  },
  quantityCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeBtn: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  couponCard: {
    marginBottom: spacing.md,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  couponTextGroup: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  removeCouponBtn: {
    padding: spacing.xs,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningBg,
    padding: spacing.md,
    borderRadius: spacing.cardRadius,
    marginVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.warningBorder,
  },
  warningText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  checkoutBtn: {
    paddingHorizontal: spacing.xxl,
  },
});

export default CartScreen;
