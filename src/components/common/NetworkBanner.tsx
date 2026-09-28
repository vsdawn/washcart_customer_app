import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from './AppText';
import Icon from './Icon';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

export const NetworkBanner: React.FC = () => {
  const { isConnected } = useNetworkStatus();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Icon name="alert-circle-outline" size={18} color={colors.textWhite} />
      <AppText variant="bodySmall" color={colors.textWhite} semiBold style={styles.text}>
        No Internet Connection. Showing offline cached data.
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.warning,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  text: {
    marginLeft: spacing.xs,
  },
});

export default NetworkBanner;
