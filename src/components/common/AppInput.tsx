import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import AppText from './AppText';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  onRightIconPress?: () => void;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  onRightIconPress,
  onFocus,
  onBlur,
  disabled,
  editable = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = (): string => {
    if (error) return colors.error;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <AppText variant="label" color={colors.text} style={styles.label}>
          {label}
        </AppText>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: editable ? colors.surface : colors.inputBg,
          },
        ]}>
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.textInput,
            leftIcon ? { paddingLeft: 0 } : undefined,
            rightIcon ? { paddingRight: 0 } : undefined,
            inputStyle,
          ]}
          placeholderTextColor={colors.textMuted}
          editable={editable && !disabled}
          onFocus={e => {
            setIsFocused(true);
            onFocus && onFocus(e);
          }}
          onBlur={e => {
            setIsFocused(false);
            onBlur && onBlur(e);
          }}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            style={styles.rightIconContainer}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <AppText variant="caption" color={colors.error} style={styles.errorText}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText variant="caption" color={colors.textSecondary} style={styles.hintText}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
    width: '100%',
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: spacing.inputRadius,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: typography.fontSize.md,
    color: colors.text,
    paddingVertical: spacing.sm + 2,
  },
  leftIconContainer: {
    marginRight: spacing.sm,
  },
  rightIconContainer: {
    marginLeft: spacing.sm,
    padding: spacing.xs,
  },
  errorText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  hintText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});

export default AppInput;
