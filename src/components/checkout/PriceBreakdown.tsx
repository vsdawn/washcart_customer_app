import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CartSummary } from '../../types/cart';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import AppText from '../common/AppText';
import AppCard from '../common/AppCard';

export interface PriceBreakdownProps {
  summary: CartSummary;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({ summary }) => {
  return (
    <AppCard style={styles.card}>
      <AppText variant="h4" color={colors.text} bold style={styles.title}>
        Bill Summary
      </AppText>

      <View style={styles.row}>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Item Total ({summary.itemsCount} items)
        </AppText>
        <AppText variant="bodySmall" color={colors.text} semiBold>
          {formatCurrency(summary.subtotal)}
        </AppText>
      </View>

      {summary.discount > 0 && (
        <View style={styles.row}>
          <AppText variant="bodySmall" color={colors.success}>
            Coupon Discount {summary.coupon ? `(${summary.coupon.code})` : ''}
          </AppText>
          <AppText variant="bodySmall" color={colors.success} semiBold>
            -{formatCurrency(summary.discount)}
          </AppText>
        </View>
      )}

      <View style={styles.row}>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Pickup & Delivery Fee
        </AppText>
        <AppText
          variant="bodySmall"
          color={summary.deliveryFee === 0 ? colors.success : colors.text}
          semiBold>
          {summary.deliveryFee === 0 ? 'FREE' : formatCurrency(summary.deliveryFee)}
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText variant="bodySmall" color={colors.textSecondary}>
          Taxes & Govt Charges (18% GST)
        </AppText>
        <AppText variant="bodySmall" color={colors.text} semiBold>
          {formatCurrency(summary.tax)}
        </AppText>
      </View>

      <View style={styles.divider} />

      <View style={styles.totalRow}>
        <AppText variant="h3" color={colors.text} bold>
          To Pay
        </AppText>
        <AppText variant="h2" color={colors.primary} bold>
          {formatCurrency(summary.total)}
        </AppText>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default PriceBreakdown;
