import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Order } from '../../types/order';
import { ORDER_STATUS_CONFIG } from '../../constants/orderStatusConfig';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency, formatDate } from '../../utils/formatters';
import AppText from '../common/AppText';
import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';
import Icon from '../common/Icon';

export interface OrderCardProps {
  order: Order;
  onPress: () => void;
  onTrackOrder?: () => void;
  onRepeatOrder?: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onPress,
  onTrackOrder,
  onRepeatOrder,
}) => {
  const statusDetails = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG.ORDER_PLACED;
  const itemsText = order.items.map(i => `${i.serviceName} (${i.quantity}${i.unit})`).join(', ');

  return (
    <AppCard onPress={onPress} style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.orderIdGroup}>
          <AppText variant="label" color={colors.text} bold>
            {order.orderNumber}
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {formatDate(order.createdAt)}
          </AppText>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: statusDetails.badgeBg }]}>
          <AppText variant="caption" color={statusDetails.color} bold>
            {statusDetails.label.toUpperCase()}
          </AppText>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.servicesRow}>
        <Icon name="shirt-outline" size={20} color={colors.primary} />
        <AppText
          variant="bodySmall"
          color={colors.text}
          numberOfLines={2}
          style={styles.servicesText}>
          {itemsText}
        </AppText>
      </View>

      <View style={styles.footerRow}>
        <View>
          <AppText variant="caption" color={colors.textSecondary}>
            Total Amount
          </AppText>
          <AppText variant="h4" color={colors.text} bold>
            {formatCurrency(order.total)}
          </AppText>
        </View>

        <View style={styles.actionsGroup}>
          {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' ? (
            <AppButton
              title="Track Order"
              variant="primary"
              size="sm"
              fullWidth={false}
              icon={<Icon name="truck-outline" size={16} color={colors.textWhite} />}
              onPress={onTrackOrder || onPress}
            />
          ) : (
            <AppButton
              title="Order Again"
              variant="secondary"
              size="sm"
              fullWidth={false}
              onPress={onRepeatOrder}
            />
          )}
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderIdGroup: {
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
    marginLeft: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm + 2,
  },
  servicesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  servicesText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionsGroup: {
    flexDirection: 'row',
  },
});

export default OrderCard;
