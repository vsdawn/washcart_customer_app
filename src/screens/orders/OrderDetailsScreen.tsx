import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS_CONFIG } from '../../constants/orderStatusConfig';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import PriceBreakdown from '../../components/checkout/PriceBreakdown';
import StatusTimeline from '../../components/orders/StatusTimeline';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import Icon from '../../components/common/Icon';
import { orderApi } from '../../services/api/orderApi';
import { Order } from '../../types/order';
import { useCart } from '../../hooks/useCart';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;

export const OrderDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const { addItem } = useCart();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await orderApi.getOrderById(orderId);
      setOrder(res);
    } catch (err) {
      console.warn('Error fetching order details', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setCancelling(true);
      const updated = await orderApi.cancelOrder(order.id, 'User requested cancellation');
      setOrder(updated);
      setShowCancelModal(false);
    } catch (err: any) {
      Alert.alert('Cancellation Error', err.message || 'Unable to cancel order.');
    } finally {
      setCancelling(false);
    }
  };

  const handleRepeatOrder = () => {
    if (!order) return;
    order.items.forEach(it => {
      if (it.serviceDetails) {
        addItem(it.serviceDetails, it.quantity);
      }
    });
    navigation.navigate('Cart');
  };

  if (loading || !order) {
    return (
      <View style={styles.container}>
        <AppHeader title="Order Details" />
        <SkeletonLoader count={4} />
      </View>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.ORDER_PLACED;
  const canCancel = order.status === 'ORDER_PLACED' || order.status === 'PICKUP_ASSIGNED';

  return (
    <View style={styles.container}>
      <AppHeader title={`Order #${order.orderNumber}`} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Status Badge Banner */}
        <AppCard style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusTextGroup}>
              <AppText variant="caption" color={colors.textSecondary}>
                Current Order Status
              </AppText>
              <AppText variant="h3" color={statusConfig.color} bold style={styles.statusTitle}>
                {statusConfig.label}
              </AppText>
              <AppText variant="bodySmall" color={colors.textSecondary}>
                {statusConfig.subtext}
              </AppText>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusConfig.badgeBg }]}>
              <AppText variant="caption" color={statusConfig.color} bold>
                {statusConfig.label.toUpperCase()}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Live Tracking CTA */}
        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
          <AppButton
            title="Open Live Order Tracking"
            variant="primary"
            size="lg"
            icon={<Icon name="truck-outline" size={20} color={colors.textWhite} />}
            onPress={() => navigation.navigate('OrderTracking', { orderId: order.id })}
            style={styles.trackBtn}
          />
        )}

        {/* Garments Breakdown (if available) */}
        {order.garmentsSummary && (
          <AppCard style={styles.card}>
            <AppText variant="h4" color={colors.text} bold style={styles.cardTitle}>
              Garment Verification Tagging ({order.garmentsSummary.totalItemsReceived} Items)
            </AppText>
            <View style={styles.garmentGrid}>
              {order.garmentsSummary.breakdown.map((g, idx) => (
                <View key={idx} style={styles.garmentChip}>
                  <AppText variant="bodySmall" color={colors.text} semiBold>
                    {g.name}: {g.count}
                  </AppText>
                </View>
              ))}
            </View>
          </AppCard>
        )}

        {/* Schedule & Address */}
        <AppCard style={styles.card}>
          <AppText variant="h4" color={colors.text} bold style={styles.cardTitle}>
            Pickup & Delivery Details
          </AppText>

          <View style={styles.infoRow}>
            <Icon name="location-outline" size={18} color={colors.primary} />
            <View style={styles.infoTextGroup}>
              <AppText variant="caption" color={colors.textSecondary}>
                Pickup & Delivery Address
              </AppText>
              <AppText variant="bodySmall" color={colors.text} semiBold>
                {order.pickupAddress.fullName} • {order.pickupAddress.houseFlat},{' '}
                {order.pickupAddress.area}
              </AppText>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Icon name="time-outline" size={18} color={colors.primary} />
            <View style={styles.infoTextGroup}>
              <AppText variant="caption" color={colors.textSecondary}>
                Pickup Window
              </AppText>
              <AppText variant="bodySmall" color={colors.text} semiBold>
                {formatDate(order.pickupSlot.date)} ({order.pickupSlot.timeRange})
              </AppText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="truck-outline" size={18} color={colors.primary} />
            <View style={styles.infoTextGroup}>
              <AppText variant="caption" color={colors.textSecondary}>
                Delivery Window
              </AppText>
              <AppText variant="bodySmall" color={colors.text} semiBold>
                {formatDate(order.deliverySlot.date)} ({order.deliverySlot.timeRange})
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Partner & Valet information */}
        {order.deliveryPartner && (
          <AppCard style={styles.card}>
            <AppText variant="h4" color={colors.text} bold style={styles.cardTitle}>
              Delivery Valet Information
            </AppText>
            <View style={styles.valetRow}>
              <View style={styles.valetAvatar}>
                <Icon name="person-outline" size={24} color={colors.primary} />
              </View>
              <View style={styles.valetInfo}>
                <AppText variant="label" color={colors.text} bold>
                  {order.deliveryPartner.name}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  Vehicle: {order.deliveryPartner.vehicleNumber} • Rating: ⭐{' '}
                  {order.deliveryPartner.rating}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert('Call Valet', `Calling ${order.deliveryPartner?.phone}`)}
                style={styles.callValetBtn}>
                <Icon name="headset-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </AppCard>
        )}

        {/* Order Items */}
        <AppCard style={styles.card}>
          <AppText variant="h4" color={colors.text} bold style={styles.cardTitle}>
            Booked Services
          </AppText>
          {order.items.map(it => (
            <View key={it.serviceId} style={styles.itemRow}>
              <AppText variant="bodySmall" color={colors.text} semiBold style={styles.itemName}>
                {it.serviceName} ({it.quantity} {it.unit})
              </AppText>
              <AppText variant="bodySmall" color={colors.text} bold>
                {formatCurrency(it.totalPrice)}
              </AppText>
            </View>
          ))}
        </AppCard>

        {/* Bill summary */}
        <PriceBreakdown
          summary={{
            subtotal: order.subtotal,
            discount: order.discount,
            deliveryFee: order.deliveryFee,
            tax: order.tax,
            total: order.total,
            coupon: null,
            itemsCount: order.items.reduce((acc, i) => acc + i.quantity, 0),
          }}
        />

        {/* Support & Actions */}
        <View style={styles.supportSection}>
          <AppButton
            title="Raise Complaint / Support Ticket"
            variant="outline"
            icon={<Icon name="help-circle-outline" size={18} color={colors.primary} />}
            onPress={() => navigation.navigate('Complaint', { orderId: order.id })}
            style={styles.actionMargin}
          />

          {canCancel && (
            <AppButton
              title="Cancel Order"
              variant="danger"
              onPress={() => setShowCancelModal(true)}
              style={styles.actionMargin}
            />
          )}

          {order.status === 'DELIVERED' && (
            <AppButton
              title="Order Again"
              variant="secondary"
              onPress={handleRepeatOrder}
              style={styles.actionMargin}
            />
          )}
        </View>
      </ScrollView>

      {/* Confirmation modal for cancellation */}
      <ConfirmationModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order?"
        message="Are you sure you want to cancel this laundry order? Free cancellation is allowed before valet pickup."
        confirmTitle="Yes, Cancel Order"
        cancelTitle="Keep Order"
        isDanger
        loading={cancelling}
        onConfirm={handleCancelOrder}
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
  statusCard: {
    marginVertical: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statusTextGroup: {
    flex: 1,
  },
  statusTitle: {
    marginTop: 2,
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  trackBtn: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  garmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  garmentChip: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 8,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  infoTextGroup: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  valetRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valetAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  valetInfo: {
    flex: 1,
  },
  callValetBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
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
  supportSection: {
    marginTop: spacing.md,
  },
  actionMargin: {
    marginBottom: spacing.md,
  },
});

export default OrderDetailsScreen;
