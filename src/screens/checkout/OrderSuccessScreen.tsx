import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatDate } from '../../utils/formatters';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import { orderApi } from '../../services/api/orderApi';
import { Order } from '../../types/order';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderSuccess'>;

export const OrderSuccessScreen: React.FC<Props> = ({ route, navigation }) => {
  const { top } = useSafeAreaInsets();
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const details = await orderApi.getOrderById(orderId);
      setOrder(details);
    } catch (err) {
      console.warn('Error fetching order details for success screen', err);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.successIconCircle}>
          <Icon name="check-circle" size={64} color={colors.surface} />
        </View>

        <AppText variant="h1" color={colors.text} bold align="center" style={styles.title}>
          Order Placed Successfully!
        </AppText>

        <AppText variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
          Thank you for trusting WashKart! Our valet will pick up your clothes as per schedule.
        </AppText>

        {order && (
          <AppCard style={styles.card}>
            <View style={styles.row}>
              <AppText variant="caption" color={colors.textSecondary}>
                Order Reference
              </AppText>
              <AppText variant="label" color={colors.primary} bold>
                {order.orderNumber}
              </AppText>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.col}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Scheduled Pickup
                </AppText>
                <AppText variant="label" color={colors.text} bold style={styles.slotText}>
                  {formatDate(order.pickupSlot.date)}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {order.pickupSlot.timeRange}
                </AppText>
              </View>

              <View style={styles.col}>
                <AppText variant="caption" color={colors.textSecondary}>
                  Expected Delivery
                </AppText>
                <AppText variant="label" color={colors.text} bold style={styles.slotText}>
                  {formatDate(order.deliverySlot.date)}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {order.deliverySlot.timeRange}
                </AppText>
              </View>
            </View>
          </AppCard>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Track Order Status"
          variant="primary"
          size="lg"
          onPress={() => navigation.navigate('OrderTracking', { orderId })}
          style={styles.trackBtn}
        />

        <AppButton
          title="Back to Home"
          variant="outline"
          size="lg"
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTab' }],
            })
          }
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
    paddingTop: spacing.xxxl,
    alignItems: 'center',
  },
  successIconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    elevation: 4,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  card: {
    width: '100%',
    marginVertical: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  col: {
    flex: 1,
  },
  slotText: {
    marginTop: 2,
  },
  footer: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
  },
  trackBtn: {
    marginBottom: spacing.md,
  },
});

export default OrderSuccessScreen;
