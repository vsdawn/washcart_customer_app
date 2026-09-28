import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { LaundryService } from '../../types/service';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import AppText from '../common/AppText';
import AppCard from '../common/AppCard';
import QuantitySelector from '../checkout/QuantitySelector';
import AppButton from '../common/AppButton';

export interface ServiceCardProps {
  service: LaundryService;
  quantity?: number;
  onAddToCart?: () => void;
  onUpdateQuantity?: (newQty: number) => void;
  onPressDetails?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  quantity = 0,
  onAddToCart,
  onUpdateQuantity,
  onPressDetails,
}) => {
  return (
    <AppCard onPress={onPressDetails} style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{ uri: service.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <AppText variant="h4" color={colors.text} numberOfLines={1} style={styles.title}>
              {service.name}
            </AppText>
            {service.isPopular && (
              <View style={styles.badge}>
                <AppText variant="caption" color={colors.primary} semiBold>
                  POPULAR
                </AppText>
              </View>
            )}
          </View>

          <AppText
            variant="bodySmall"
            color={colors.textSecondary}
            numberOfLines={2}
            style={styles.description}>
            {service.description}
          </AppText>

          <View style={styles.priceRow}>
            <View>
              <AppText variant="h4" color={colors.primary} bold>
                {formatCurrency(service.price)}
                <AppText variant="caption" color={colors.textSecondary}>
                  /{service.unit}
                </AppText>
              </AppText>
              <AppText variant="caption" color={colors.textMuted}>
                ⏱ {service.estimatedHours} hrs turnaround
              </AppText>
            </View>

            <View style={styles.actionContainer}>
              {quantity > 0 && onUpdateQuantity ? (
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => onUpdateQuantity(quantity + 1)}
                  onDecrease={() => onUpdateQuantity(quantity - 1)}
                />
              ) : (
                <AppButton
                  title="ADD"
                  variant="outline"
                  size="sm"
                  fullWidth={false}
                  onPress={onAddToCart}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.inputBg,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
  },
  badge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: spacing.xs,
  },
  description: {
    marginVertical: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  actionContainer: {
    alignItems: 'flex-end',
  },
});

export default ServiceCard;
