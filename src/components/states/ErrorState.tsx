import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';
import Icon from '../common/Icon';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Icon name="alert-circle-outline" size={44} color={colors.error} />
      </View>

      <AppText variant="h3" color={colors.text} bold align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText variant="bodySmall" color={colors.textSecondary} align="center" style={styles.message}>
        {message}
      </AppText>

      {onRetry && (
        <AppButton
          title="Try Again"
          variant="outline"
          fullWidth={false}
          onPress={onRetry}
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.errorBg,
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

export default ErrorState;
