import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate } from '../../utils/formatters';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import PriceBreakdown from '../../components/checkout/PriceBreakdown';
import Icon from '../../components/common/Icon';
import { useCart } from '../../hooks/useCart';
import { useAppSelector } from '../../hooks/useAppSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderReview'>;

export const OrderReviewScreen: React.FC<Props> = ({ navigation }) => {
  const { items, summary } = useCart();
  const selectedAddress = useAppSelector(state => state.location.selectedAddress);
  const pickupSlot = useAppSelector(state => state.order.pickupSlot);
  const deliverySlot = useAppSelector(state => state.order.deliverySlot);

  return (
    <View style={styles.container}>
      <AppHeader title="Review Order" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pickup Address Card */}
        <AppCard style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText variant="h4" color={colors.text} bold>
              Pickup Address
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('AddressSelection', { isCheckoutFlow: true })}>
              <AppText variant="label" color={colors.primary} bold>
                Change
              </AppText>
            </TouchableOpacity>
          </View>
          <View style={styles.detailRow}>
            <Icon name="location-outline" size={18} color={colors.primary} />
            <AppText variant="bodySmall" color={colors.text} style={styles.detailText}>
              {selectedAddress
                ? `${selectedAddress.fullName} • ${selectedAddress.houseFlat}, ${selectedAddress.building}, ${selectedAddress.area}`
                : 'No address selected'}
            </AppText>
          </View>
        </AppCard>

        {/* Pickup & Delivery Slots */}
        <AppCard style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText variant="h4" color={colors.text} bold>
              Pickup & Delivery Schedule
            </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('PickupSlot')}>
              <AppText variant="label" color={colors.primary} bold>
                Change
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Icon name="time-outline" size={18} color={colors.primary} />
            <View style={styles.slotTextGroup}>
              <AppText variant="bodySmall" color={colors.text} semiBold>
                Pickup: {formatDate(pickupSlot?.date || '')} ({pickupSlot?.timeRange})
              </AppText>
              <AppText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 2 }}>
                Delivery: {formatDate(deliverySlot?.date || '')} ({deliverySlot?.timeRange})
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Services Summary */}
        <AppCard style={styles.card}>
          <AppText variant="h4" color={colors.text} bold style={styles.cardHeaderTitle}>
            Services ({items.length})
          </AppText>
          {items.map(item => (
            <View key={item.service.id} style={styles.itemRow}>
              <AppText variant="bodySmall" color={colors.text} semiBold style={styles.itemName}>
                {item.service.name} x {item.quantity} {item.service.unit}
              </AppText>
              <AppText variant="bodySmall" color={colors.text} bold>
                {formatCurrency(item.service.price * item.quantity)}
              </AppText>
            </View>
          ))}
        </AppCard>

        {/* Price breakdown */}
        <PriceBreakdown summary={summary} />

        {/* Cancellation & Refund Policy */}
        <View style={styles.policyCard}>
          <Icon name="shield-checkmark-outline" size={18} color={colors.primary} />
          <AppText variant="caption" color={colors.textSecondary} style={styles.policyText}>
            Cancellation Policy: Free cancellation until valet is dispatched for pickup. Post-pickup, minimum fee of ₹50 applies.
          </AppText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <AppText variant="caption" color={colors.textSecondary}>
            Total Payable
          </AppText>
          <AppText variant="h2" color={colors.text} bold>
            {formatCurrency(summary.total)}
          </AppText>
        </View>

        <AppButton
          title="Proceed to Payment"
          variant="primary"
          size="lg"
          fullWidth={false}
          onPress={() => navigation.navigate('Payment')}
          style={styles.paymentBtn}
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
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  cardHeaderTitle: {
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
  },
  detailText: {
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  slotTextGroup: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  itemName: {
    flex: 1,
  },
  policyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.cardRadius,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  policyText: {
    marginLeft: spacing.sm,
    flex: 1,
    lineHeight: 16,
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
  paymentBtn: {
    paddingHorizontal: spacing.xxl,
  },
});

export default OrderReviewScreen;
