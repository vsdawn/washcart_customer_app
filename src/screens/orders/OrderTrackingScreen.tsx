import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getOrderStatusProgress } from '../../constants/orderStatusConfig';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import StatusTimeline from '../../components/orders/StatusTimeline';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import Icon from '../../components/common/Icon';
import { orderApi } from '../../services/api/orderApi';
import { Order } from '../../types/order';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderTracking'>;

export const OrderTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getOrderById(orderId);
      setOrder(res);
    } catch (err) {
      console.warn('Error fetching order for tracking', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <View style={styles.container}>
        <AppHeader title="Live Order Tracking" />
        <SkeletonLoader count={4} />
      </View>
    );
  }

  const progressPercent = getOrderStatusProgress(order.status);
  const isOutForDelivery = order.status === 'OUT_FOR_DELIVERY';

  return (
    <View style={styles.container}>
      <AppHeader title={`Track Order #${order.orderNumber}`} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* OUT_FOR_DELIVERY Map / Driver Banner */}
        {isOutForDelivery && (
          <AppCard style={styles.deliveryMapCard}>
            <View style={styles.mapPlaceholder}>
              <Icon name="truck-outline" size={48} color={colors.primary} />
              <AppText variant="h3" color={colors.text} bold style={styles.mapTitle}>
                Delivery Valet On The Way 🚚
              </AppText>
              <AppText variant="bodySmall" color={colors.primary} bold style={styles.etaText}>
                Arriving in approximately {order.deliveryPartner?.etaMinutes || 18} minutes
              </AppText>
            </View>

            {order.deliveryPartner && (
              <View style={styles.driverInfoRow}>
                <View style={styles.driverAvatar}>
                  <Icon name="person-outline" size={24} color={colors.primary} />
                </View>

                <View style={styles.driverText}>
                  <AppText variant="label" color={colors.text} bold>
                    {order.deliveryPartner.name}
                  </AppText>
                  <AppText variant="caption" color={colors.textSecondary}>
                    {order.deliveryPartner.vehicleNumber} • ⭐ {order.deliveryPartner.rating}
                  </AppText>
                </View>

                <TouchableOpacity
                  onPress={() => Alert.alert('Call Valet', `Calling ${order.deliveryPartner?.phone}`)}
                  style={styles.callValetBtn}>
                  <Icon name="headset-outline" size={20} color={colors.textWhite} />
                </TouchableOpacity>
              </View>
            )}
          </AppCard>
        )}

        {/* Progress Bar Header */}
        <AppCard style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <AppText variant="h4" color={colors.text} bold>
              Overall Progress
            </AppText>
            <AppText variant="label" color={colors.primary} bold>
              {progressPercent}%
            </AppText>
          </View>

          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </AppCard>

        {/* Status Timeline */}
        <AppCard style={styles.timelineCard}>
          <AppText variant="h3" color={colors.text} bold style={styles.timelineTitle}>
            Garment Care Journey
          </AppText>
          <StatusTimeline currentStatus={order.status} />
        </AppCard>
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
  deliveryMapCard: {
    marginVertical: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    backgroundColor: colors.primaryBg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapTitle: {
    marginTop: spacing.sm,
  },
  etaText: {
    marginTop: spacing.xs,
  },
  driverInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  driverAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  driverText: {
    flex: 1,
  },
  callValetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    marginVertical: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inputBg,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  timelineCard: {
    marginBottom: spacing.lg,
  },
  timelineTitle: {
    marginBottom: spacing.sm,
  },
});

export default OrderTrackingScreen;
