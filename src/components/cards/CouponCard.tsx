import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Coupon } from '../../types/coupon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatDate } from '../../utils/formatters';
import AppText from '../common/AppText';
import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';
import Icon from '../common/Icon';

export interface CouponCardProps {
  coupon: Coupon;
  isApplied?: boolean;
  onApply?: () => void;
  onRemove?: () => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  isApplied = false,
  onApply,
  onRemove,
}) => {
  return (
    <AppCard style={styles.card} outlined={isApplied}>
      <View style={styles.row}>
        <View style={styles.leftIconContainer}>
          <Icon name="pricetag-outline" size={24} color={colors.primary} />
        </View>

        <View style={styles.content}>
          <View style={styles.codeRow}>
            <View style={styles.codeBadge}>
              <AppText variant="label" color={colors.primaryDark} bold>
                {coupon.code}
              </AppText>
            </View>
            <AppText variant="h4" color={colors.text} bold style={styles.title}>
              {coupon.title}
            </AppText>
          </View>

          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.desc}>
            {coupon.description}
          </AppText>

          <AppText variant="caption" color={colors.textMuted} style={styles.expiry}>
            Min order ₹{coupon.minOrderAmount} • Valid until {formatDate(coupon.validUntil)}
          </AppText>
        </View>
      </View>

      <View style={styles.footer}>
        {isApplied ? (
          <AppButton
            title="APPLIED"
            variant="secondary"
            size="sm"
            fullWidth={false}
            icon={<Icon name="check-circle" size={16} color={colors.primary} />}
            onPress={onRemove}
          />
        ) : (
          <AppButton
            title="APPLY"
            variant="primary"
            size="sm"
            fullWidth={false}
            onPress={onApply}
            disabled={coupon.isExpired}
          />
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  leftIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  codeBadge: {
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    borderRadius: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginRight: spacing.sm,
  },
  title: {
    flex: 1,
  },
  desc: {
    marginVertical: 2,
  },
  expiry: {
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.md,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
  },
});

export default CouponCard;
