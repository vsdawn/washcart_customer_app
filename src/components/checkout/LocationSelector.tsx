import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Address } from '../../types/address';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import Icon from '../common/Icon';

export interface LocationSelectorProps {
  address: Address | null;
  onPressLocation: () => void;
  onPressNotification?: () => void;
  unreadNotificationCount?: number;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  address,
  onPressLocation,
  onPressNotification,
  unreadNotificationCount = 0,
}) => {
  const addressType = address ? address.addressType : 'Select Location';
  const addressSummary = address
    ? `${address.building || address.houseFlat}, ${address.area}`
    : 'Tap to add or select pickup address';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPressLocation}
        style={styles.locationGroup}>
        <View style={styles.iconCircle}>
          <Icon name="location-outline" size={20} color={colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <AppText variant="label" color={colors.text} bold>
              {addressType}
            </AppText>
            <Icon name="chevron-down" size={18} color={colors.textSecondary} />
          </View>
          <AppText
            variant="caption"
            color={colors.textSecondary}
            numberOfLines={1}
            style={styles.summaryText}>
            {addressSummary}
          </AppText>
        </View>
      </TouchableOpacity>

      {onPressNotification && (
        <TouchableOpacity onPress={onPressNotification} style={styles.notificationBtn}>
          <Icon name="notifications-outline" size={24} color={colors.text} />
          {unreadNotificationCount > 0 && (
            <View style={styles.notifBadge}>
              <AppText variant="caption" color={colors.textWhite} bold style={styles.notifCount}>
                {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
              </AppText>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
  },
  locationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryText: {
    marginTop: 1,
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  notifCount: {
    fontSize: 9,
    lineHeight: 11,
  },
});

export default LocationSelector;
