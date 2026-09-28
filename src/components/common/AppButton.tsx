import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: { -readonly [K in keyof ViewStyle]: ViewStyle[K] } = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: spacing.buttonRadius,
      minHeight: spacing.minTouchTarget,
    };

    if (size === 'sm') {
      base.paddingVertical = spacing.xs + 2;
      base.paddingHorizontal = spacing.md;
      base.minHeight = 38;
    } else if (size === 'lg') {
      base.paddingVertical = spacing.md + 2;
      base.paddingHorizontal = spacing.xxl;
      base.minHeight = 52;
    } else {
      base.paddingVertical = spacing.sm + 4;
      base.paddingHorizontal = spacing.lg;
      base.minHeight = 46;
    }

    switch (variant) {
      case 'primary':
        base.backgroundColor = disabled ? colors.disabledBg : colors.primary;
        break;
      case 'secondary':
        base.backgroundColor = disabled ? colors.disabledBg : colors.secondaryBg;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderWidth = 1.5;
        base.borderColor = disabled ? colors.border : colors.primary;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        break;
      case 'danger':
        base.backgroundColor = disabled ? colors.disabledBg : colors.error;
        break;
      case 'warning':
        base.backgroundColor = disabled ? colors.disabledBg : colors.warning;
        break;
    }

    if (fullWidth) {
      base.width = '100%';
    }

    return base;
  };

  const getTextColor = (): string => {
    if (disabled) return colors.disabledText;

    switch (variant) {
      case 'primary':
      case 'danger':
      case 'warning':
        return colors.textWhite;
      case 'secondary':
        return colors.primary;
      case 'outline':
      case 'ghost':
        return colors.primary;
      default:
        return colors.textWhite;
    }
  };

  const textStyleCombined: TextStyle[] = [];
  if (icon && iconPosition === 'left') {
    textStyleCombined.push({ marginLeft: spacing.xs + 2 });
  }
  if (icon && iconPosition === 'right') {
    textStyleCombined.push({ marginRight: spacing.xs + 2 });
  }
  if (textStyle) {
    if (Array.isArray(textStyle)) {
      textStyleCombined.push(...textStyle);
    } else {
      textStyleCombined.push(textStyle);
    }
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[getContainerStyle(), style]}
      {...props}>
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          {icon && iconPosition === 'left' && <>{icon}</>}
          <AppText
            variant="button"
            color={getTextColor()}
            style={textStyleCombined}>
            {title}
          </AppText>
          {icon && iconPosition === 'right' && <>{icon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;
