import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Address } from '../../types/address';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatAddressSummary } from '../../utils/formatters';
import { getAddressServiceability } from '../../constants/serviceAreas';
import AppText from '../common/AppText';
import AppCard from '../common/AppCard';
import Icon from '../common/Icon';

export interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isSelected = false,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const serviceability = getAddressServiceability(address);

  return (
    <AppCard
      onPress={onSelect}
      outlined={isSelected}
      style={[
        styles.card,
        isSelected ? { borderColor: colors.primary, backgroundColor: colors.primaryBg } : undefined,
      ]}>
      <View style={styles.headerRow}>
        <View style={styles.tagGroup}>
          <View style={styles.typeBadge}>
            <AppText variant="caption" color={colors.primary} bold>
              {address.addressType.toUpperCase()}
            </AppText>
          </View>
          {address.isDefault && (
            <View style={styles.defaultBadge}>
              <AppText variant="caption" color={colors.textSecondary}>
                DEFAULT
              </AppText>
            </View>
          )}
          {!serviceability?.isServiceable && (
            <View style={[styles.defaultBadge, serviceability ? styles.outOfAreaBadge : styles.unverifiedBadge]}>
              <AppText variant="caption" color={serviceability ? colors.error : colors.warning} bold>
                {serviceability ? 'NOT SERVICEABLE' : 'UNVERIFIED'}
              </AppText>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.iconBtn}>
              <Icon name="pencil-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.iconBtn}>
              <Icon name="trash-outline" size={18} color={colors.error} />
            </TouchableOpacity>
          )}
          {isSelected && <Icon name="check-circle" size={22} color={colors.primary} />}
        </View>
      </View>

      <AppText variant="label" color={colors.text} bold style={styles.name}>
        {address.fullName} • {address.mobileNumber}
      </AppText>

      <AppText variant="bodySmall" color={colors.textSecondary} style={styles.addressText}>
        {formatAddressSummary(address)}
      </AppText>
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
    marginBottom: spacing.xs,
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  defaultBadge: {
    backgroundColor: colors.inputBg,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: 4,
  },
  outOfAreaBadge: {
    backgroundColor: colors.errorBg,
    marginLeft: spacing.xs,
  },
  unverifiedBadge: {
    backgroundColor: colors.warningBg,
    marginLeft: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  name: {
    marginTop: spacing.xs,
  },
  addressText: {
    marginTop: 2,
    lineHeight: 18,
  },
});

export default AddressCard;
