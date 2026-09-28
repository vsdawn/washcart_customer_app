import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import { GARMENT_GROUPS, GarmentGroupId, getPricedService } from '../../constants/pricing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import EmptyState from '../../components/states/EmptyState';
import Toast, { useToast } from '../../components/common/Toast';

type Props = NativeStackScreenProps<RootStackParamList, 'PricingDetails'>;

const FOOTER_HEIGHT = 80;

export const PricingDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { bottom } = useSafeAreaInsets();
  const service = getPricedService(route.params.serviceId);
  const [group, setGroup] = useState<GarmentGroupId>('WEARABLE');
  const toast = useToast();

  if (!service) {
    return (
      <View style={styles.container}>
        <AppHeader title="Pricing" />
        <EmptyState
          iconName="alert-circle-outline"
          title="Service not found"
          message="This service is no longer available."
          buttonTitle="Back to Pricing"
          onButtonPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader title={service.name} subtitle={service.tagline} />

      <View style={styles.tabs}>
        {GARMENT_GROUPS.map(g => {
          const isActive = g.id === group;
          return (
            <TouchableOpacity
              key={g.id}
              onPress={() => setGroup(g.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              style={[styles.tab, isActive && styles.tabActive]}>
              <AppText variant="label" color={isActive ? colors.textWhite : colors.textSecondary} bold>
                {g.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: FOOTER_HEIGHT + bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}>
        <View style={styles.legendRow}>
          <AppText variant="caption" color={colors.textSecondary} style={styles.legendSpacer}>
            PRICE PER PIECE
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} align="center" style={styles.priceCol}>
            STANDARD
          </AppText>
          <AppText variant="caption" color={colors.textSecondary} align="center" style={styles.priceCol}>
            EXPRESS
          </AppText>
        </View>

        {service.groups[group].map(tier => (
          <TouchableOpacity
            key={tier.weight}
            activeOpacity={0.8}
            onPress={() => toast.show('Tap "Schedule Now" to book a pickup')}
            style={styles.tierCard}>
            <View style={styles.tierInfo}>
              <AppText variant="h4" color={colors.text} bold>
                {tier.weight}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary} style={styles.examples}>
                {tier.examples}
              </AppText>
            </View>
            <AppText variant="h4" color={colors.primary} bold align="center" style={styles.priceCol}>
              {formatCurrency(tier.standard)}
            </AppText>
            <AppText variant="h4" color={colors.text} bold align="center" style={styles.priceCol}>
              {formatCurrency(tier.express)}
            </AppText>
          </TouchableOpacity>
        ))}

        <View style={styles.noteBox}>
          <Icon name="time-outline" size={18} color={colors.info} />
          <AppText variant="caption" color={colors.textSecondary} style={styles.noteText}>
            Standard delivery within 24 hours. Express delivery within 4 hours. Final price is
            confirmed after your clothes are counted at pickup.
          </AppText>
        </View>
      </ScrollView>

      <Toast message={toast.message} style={{ bottom: FOOTER_HEIGHT + bottom + spacing.sm }} />

      <View style={[styles.footer, { paddingBottom: spacing.md + bottom }]}>
        <AppButton
          title="Schedule Now"
          size="lg"
          onPress={() => navigation.navigate('SchedulePickup', { serviceName: service.name })}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: spacing.buttonRadius,
    padding: spacing.xs,
    margin: spacing.screenPaddingHorizontal,
    marginBottom: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.buttonRadius - 2,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  list: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  legendSpacer: {
    flex: 1,
    letterSpacing: 0.5,
  },
  priceCol: {
    width: 76,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  tierInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  examples: {
    marginTop: 2,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.infoBg,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  noteText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});

export default PricingDetailsScreen;
