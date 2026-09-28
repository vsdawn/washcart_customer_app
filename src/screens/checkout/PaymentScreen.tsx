import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Icon, { IconName } from '../../components/common/Icon';
import PaymentService from '../../services/payment/paymentService';
import { orderApi } from '../../services/api/orderApi';
import { PaymentMode } from '../../types/payment';
import { useCart } from '../../hooks/useCart';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { addOrderSuccess } from '../../store/slices/orderSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export const PaymentScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, coupon, summary, clear } = useCart();
  const selectedAddress = useAppSelector(state => state.location.selectedAddress);
  const pickupSlot = useAppSelector(state => state.order.pickupSlot);
  const deliverySlot = useAppSelector(state => state.order.deliverySlot);

  const paymentOptions = PaymentService.getAvailablePaymentMethods();
  const [selectedMode, setSelectedMode] = useState<PaymentMode>('UPI');
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !pickupSlot || !deliverySlot) {
      setPaymentError('Missing required address or pickup schedule details.');
      return;
    }

    try {
      setLoading(true);
      setPaymentError(null);

      // 1. Process payment via payment service abstraction
      const paymentRes = await PaymentService.processPayment(
        summary.total,
        selectedMode,
        `REF_${Date.now()}`
      );

      if (!paymentRes.success) {
        setPaymentError(paymentRes.errorMessage || 'Payment could not be completed.');
        setLoading(false);
        return;
      }

      // 2. Order creation in backend
      const orderData = {
        items: items.map(it => ({
          serviceId: it.service.id,
          serviceName: it.service.name,
          unitPrice: it.service.price,
          quantity: it.quantity,
          unit: it.service.unit,
          totalPrice: it.service.price * it.quantity,
          serviceDetails: it.service,
        })),
        pickupAddress: selectedAddress,
        pickupSlot,
        deliverySlot,
        subtotal: summary.subtotal,
        discount: summary.discount,
        deliveryFee: summary.deliveryFee,
        tax: summary.tax,
        total: summary.total,
        paymentMode: selectedMode,
        couponCodeApplied: coupon?.code,
      };

      const createdOrder = await orderApi.createOrder(orderData);
      dispatch(addOrderSuccess(createdOrder));
      clear();

      navigation.reset({
        index: 0,
        routes: [
          { name: 'MainTab' },
          { name: 'OrderSuccess', params: { orderId: createdOrder.id } },
        ],
      });
    } catch (err: any) {
      setPaymentError(err.message || 'Order creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Options" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Payable Amount Banner */}
        <AppCard style={styles.amountCard}>
          <AppText variant="caption" color={colors.textSecondary}>
            Amount to Pay
          </AppText>
          <AppText variant="h1" color={colors.primary} bold style={styles.amountText}>
            {formatCurrency(summary.total)}
          </AppText>
        </AppCard>

        <AppText variant="h4" color={colors.text} bold style={styles.sectionTitle}>
          Select Payment Method
        </AppText>

        {paymentOptions.map(option => {
          const isSelected = selectedMode === option.id;
          return (
            <AppCard
              key={option.id}
              onPress={() => setSelectedMode(option.id)}
              outlined={isSelected}
              style={[
                styles.optionCard,
                isSelected ? { borderColor: colors.primary, backgroundColor: colors.primaryBg } : undefined,
              ]}>
              <View style={styles.optionRow}>
                <View style={styles.iconCircle}>
                  <Icon name={option.iconName as IconName} size={22} color={colors.primary} />
                </View>

                <View style={styles.optionTextGroup}>
                  <AppText variant="label" color={colors.text} bold>
                    {option.name}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {option.description}
                  </AppText>
                </View>

                <View style={styles.radioContainer}>
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && { borderColor: colors.primary },
                    ]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </View>
              </View>
            </AppCard>
          );
        })}

        {paymentError && (
          <View style={styles.errorBanner}>
            <Icon name="alert-circle-outline" size={20} color={colors.error} />
            <AppText variant="bodySmall" color={colors.error} style={styles.errorText}>
              {paymentError}
            </AppText>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title={selectedMode === 'COD' ? 'Place Order (Pay on Pickup)' : `Pay ${formatCurrency(summary.total)}`}
          variant="primary"
          size="lg"
          loading={loading}
          onPress={handlePlaceOrder}
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
  amountCard: {
    marginVertical: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  amountText: {
    marginTop: 2,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  optionCard: {
    marginBottom: spacing.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
  },
  optionTextGroup: {
    flex: 1,
  },
  radioContainer: {
    paddingLeft: spacing.sm,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    padding: spacing.md,
    borderRadius: spacing.cardRadius,
    marginVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  errorText: {
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
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});

export default PaymentScreen;
