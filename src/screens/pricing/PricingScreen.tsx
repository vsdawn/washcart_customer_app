import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import { PRICED_SERVICES, getStartingPrice } from '../../constants/pricing';
import AppText from '../../components/common/AppText';
import Icon from '../../components/common/Icon';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Pricing'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const PricingScreen: React.FC<Props> = ({ navigation }) => {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: top + spacing.xl }]}
      showsVerticalScrollIndicator={false}>
      <AppText variant="h1" color={colors.primaryDark} align="center">
        Explore our pricing
      </AppText>
      <AppText variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
        Select an option to see pricing
      </AppText>

      {PRICED_SERVICES.map(service => (
        <TouchableOpacity
          key={service.id}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`${service.name} pricing`}
          onPress={() => navigation.navigate('PricingDetails', { serviceId: service.id })}
          style={styles.card}>
          {service.isPopular && (
            <View style={styles.popularBadge}>
              <AppText variant="caption" color={colors.textWhite} bold>
                Most Popular
              </AppText>
            </View>
          )}

          <View style={styles.iconTile}>
            <Icon name={service.icon} size={34} color={colors.primary} />
          </View>

          <View style={styles.cardBody}>
            <AppText variant="h4" color={colors.text} bold>
              {service.name}
            </AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              {service.tagline}
            </AppText>
            <View style={styles.priceChip}>
              <AppText variant="caption" color={colors.primaryDark} bold style={styles.priceChipLabel}>
                STARTING AT
              </AppText>
              <AppText variant="label" color={colors.primaryDark} bold>
                {formatCurrency(getStartingPrice(service))}
              </AppText>
            </View>
          </View>

          <Icon name="arrow-forward" size={22} color={colors.primaryDark} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.huge,
  },
  subtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius + 4,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderBottomRightRadius: spacing.buttonRadius,
  },
  iconTile: {
    width: 64,
    height: 64,
    borderRadius: spacing.cardRadius,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  cardBody: {
    flex: 1,
    marginRight: spacing.sm,
  },
  priceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryBg,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    marginTop: spacing.sm,
  },
  priceChipLabel: {
    letterSpacing: 0.8,
    marginRight: spacing.xs,
  },
});

export default PricingScreen;
