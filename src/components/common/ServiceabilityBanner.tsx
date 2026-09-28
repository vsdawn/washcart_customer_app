import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { SERVICE_AREA_NAMES, SERVICE_RADIUS_KM, ServiceabilityResult } from '../../constants/serviceAreas';
import AppText from './AppText';
import Icon from './Icon';

export interface ServiceabilityBannerProps {
  /** null means the address has no coordinates, so it could not be checked */
  result: ServiceabilityResult | null;
  style?: ViewStyle;
}

export const ServiceabilityBanner: React.FC<ServiceabilityBannerProps> = ({ result, style }) => {
  if (result?.isServiceable) {
    return (
      <View style={[styles.banner, styles.success, style]}>
        <Icon name="check-circle" size={20} color={colors.success} />
        <View style={styles.text}>
          <AppText variant="label" color={colors.success} bold>
            We serve this location
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            {result.distanceKm.toFixed(1)} km from our {result.nearestArea.name} hub
          </AppText>
        </View>
      </View>
    );
  }

  if (result) {
    return (
      <View style={[styles.banner, styles.error, style]} accessibilityRole="alert">
        <Icon name="alert-circle-outline" size={20} color={colors.error} />
        <View style={styles.text}>
          <AppText variant="label" color={colors.error} bold>
            Sorry, we don't serve this location yet
          </AppText>
          <AppText variant="caption" color={colors.textSecondary}>
            It is {result.distanceKm.toFixed(1)} km from our nearest hub ({result.nearestArea.name}). We
            currently serve within {SERVICE_RADIUS_KM} km of {SERVICE_AREA_NAMES}.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.banner, styles.warning, style]}>
      <Icon name="location-outline" size={20} color={colors.warning} />
      <View style={styles.text}>
        <AppText variant="label" color={colors.text} bold>
          Location not verified
        </AppText>
        <AppText variant="caption" color={colors.textSecondary}>
          Edit this address and save it again so we can check if we serve it.
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    padding: spacing.md,
  },
  success: {
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
  },
  error: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
  },
  warning: {
    backgroundColor: colors.warningBg,
    borderColor: colors.warningBorder,
  },
  text: {
    flex: 1,
    marginLeft: spacing.sm,
  },
});

export default ServiceabilityBanner;
