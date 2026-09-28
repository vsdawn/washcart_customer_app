import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';
import Icon, { IconName } from '../common/Icon';

export interface EmptyStateProps {
  iconName?: IconName;
  title: string;
  message: string;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName = 'receipt-outline',
  title,
  message,
  buttonTitle,
  onButtonPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name={iconName} size={48} color={colors.primary} />
      </View>

      <AppText variant="h3" color={colors.text} bold align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="bodySmall" color={colors.textSecondary} align="center" style={styles.message}>
        {message}
      </AppText>

      {buttonTitle && onButtonPress && (
        <AppButton
          title={buttonTitle}
          variant="primary"
          fullWidth={false}
          onPress={onButtonPress}
          style={styles.button}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    maxWidth: 280,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  button: {
    paddingHorizontal: spacing.xxl,
  },
});

export default EmptyState;
