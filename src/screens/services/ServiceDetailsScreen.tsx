import React from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import QuantitySelector from '../../components/checkout/QuantitySelector';
import { useCart } from '../../hooks/useCart';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetails'>;

export const ServiceDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { service } = route.params;
  const { addItem, updateItemQuantity, getItemQuantity } = useCart();

  const quantity = getItemQuantity(service.id);

  return (
    <View style={styles.container}>
      <AppHeader title={service.name} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: service.imageUrl }} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={styles.titleGroup}>
              <AppText variant="h2" color={colors.text} bold>
                {service.name}
              </AppText>
              <AppText variant="h3" color={colors.primary} bold style={styles.price}>
                {formatCurrency(service.price)}
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  /{service.unit}
                </AppText>
              </AppText>
            </View>

            {service.isPopular && (
              <View style={styles.popularBadge}>
                <AppText variant="caption" color={colors.primary} bold>
                  POPULAR
                </AppText>
              </View>
            )}
          </View>

          <AppText variant="body" color={colors.textSecondary} style={styles.description}>
            {service.description}
          </AppText>

          <View style={styles.turnaroundBox}>
            <Icon name="time-outline" size={20} color={colors.primary} />
            <AppText variant="bodySmall" color={colors.text} semiBold style={styles.turnaroundText}>
              Estimated Processing Time: {service.estimatedHours} hours
            </AppText>
          </View>

          {/* What's Included */}
          {service.includes && service.includes.length > 0 && (
            <AppCard style={styles.card}>
              <AppText variant="h4" color={colors.text} bold style={styles.cardTitle}>
                What's Included
              </AppText>
              {service.includes.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Icon name="check-circle" size={18} color={colors.success} />
                  <AppText variant="bodySmall" color={colors.text} style={styles.listText}>
                    {item}
                  </AppText>
                </View>
              ))}
            </AppCard>
          )}

          {/* What's Excluded */}
          {service.excludes && service.excludes.length > 0 && (
            <AppCard style={styles.card}>
              <AppText variant="h4" color={colors.text} bold style={styles.cardTitle}>
                What's Not Included
              </AppText>
              {service.excludes.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Icon name="close" size={18} color={colors.error} />
                  <AppText variant="bodySmall" color={colors.textSecondary} style={styles.listText}>
                    {item}
                  </AppText>
                </View>
              ))}
            </AppCard>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {quantity > 0 ? (
          <View style={styles.footerQuantityRow}>
            <AppText variant="body" color={colors.text} bold>
              Quantity added:
            </AppText>
            <QuantitySelector
              quantity={quantity}
              onIncrease={() => updateItemQuantity(service.id, quantity + 1)}
              onDecrease={() => updateItemQuantity(service.id, quantity - 1)}
            />
          </View>
        ) : (
          <AppButton
            title="Add to Cart"
            variant="primary"
            size="lg"
            onPress={() => addItem(service)}
          />
        )}
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
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: colors.inputBg,
  },
  content: {
    padding: spacing.screenPaddingHorizontal,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.sm,
  },
  titleGroup: {
    flex: 1,
  },
  price: {
    marginTop: spacing.xs,
  },
  popularBadge: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 6,
  },
  description: {
    marginVertical: spacing.md,
    lineHeight: 22,
  },
  turnaroundBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    padding: spacing.md,
    borderRadius: spacing.buttonRadius,
    marginBottom: spacing.lg,
  },
  turnaroundText: {
    marginLeft: spacing.sm,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  listText: {
    marginLeft: spacing.sm,
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
  footerQuantityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default ServiceDetailsScreen;
