import React from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle, StyleProp, TouchableOpacityProps } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export interface AppCardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  outlined?: boolean;
  elevated?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  children,
  style,
  onPress,
  outlined = false,
  elevated = true,
  ...props
}) => {
  const cardStyle: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: spacing.cardRadius,
    padding: spacing.lg,
    ...(outlined && { borderWidth: 1, borderColor: colors.border }),
    ...(elevated && !outlined && shadows.subtle),
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={[cardStyle, style]}
        {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

export default AppCard;
