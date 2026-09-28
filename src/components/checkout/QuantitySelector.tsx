import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import Icon from '../common/Icon';

export interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  minQuantity?: number;
  maxQuantity?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  minQuantity = 0,
  maxQuantity = 99,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrease}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        disabled={quantity <= minQuantity}
        style={[styles.button, quantity <= minQuantity && styles.buttonDisabled]}>
        <Icon name="remove" size={16} color={colors.primary} />
      </TouchableOpacity>

      <AppText variant="label" color={colors.primary} bold style={styles.countText}>
        {quantity}
      </AppText>

      <TouchableOpacity
        onPress={onIncrease}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        disabled={quantity >= maxQuantity}
        style={[styles.button, quantity >= maxQuantity && styles.buttonDisabled]}>
        <Icon name="add" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  button: {
    padding: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  countText: {
    minWidth: 24,
    textAlign: 'center',
    marginHorizontal: spacing.xs,
  },
});

export default QuantitySelector;
