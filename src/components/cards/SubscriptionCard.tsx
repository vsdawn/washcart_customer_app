import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SubscriptionPlan } from '../../types/subscription';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import AppText from '../common/AppText';
import AppCard from '../common/AppCard';
import AppButton from '../common/AppButton';
import Icon from '../common/Icon';

export interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isSubscribed?: boolean;
  onSubscribe: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  plan,
  isSubscribed = false,
  onSubscribe,
}) => {
  return (
    <AppCard
      style={[
        styles.card,
        plan.isPopular ? { borderColor: colors.primary, borderWidth: 2 } : undefined,
      ]}>
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <AppText variant="caption" color={colors.textWhite} bold>
            MOST POPULAR
          </AppText>
        </View>
      )}

      <View style={styles.header}>
        <AppText variant="h2" color={colors.text} bold>
          {plan.name}
        </AppText>
        <AppText variant="h1" color={colors.primary} bold style={styles.price}>
          {formatCurrency(plan.price)}
          <AppText variant="bodySmall" color={colors.textSecondary}>
            /month
          </AppText>
        </AppText>
      </View>

      <View style={styles.benefitsList}>
        {plan.features.map((feature, idx) => (
          <View key={idx} style={styles.benefitRow}>
            <Icon name="check-circle" size={18} color={colors.success} />
            <AppText variant="bodySmall" color={colors.text} style={styles.benefitText}>
              {feature}
            </AppText>
          </View>
        ))}
      </View>

      <AppButton
        title={isSubscribed ? 'CURRENT PLAN' : 'SUBSCRIBE NOW'}
        variant={isSubscribed ? 'secondary' : plan.isPopular ? 'primary' : 'outline'}
        disabled={isSubscribed}
        onPress={onSubscribe}
        style={styles.subscribeBtn}
      />
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
    padding: spacing.xl,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  header: {
    marginBottom: spacing.md,
  },
  price: {
    marginTop: spacing.xs,
  },
  benefitsList: {
    marginVertical: spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefitText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  subscribeBtn: {
    marginTop: spacing.md,
  },
});

export default SubscriptionCard;
