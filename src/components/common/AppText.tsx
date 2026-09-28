import React from 'react';
import { Text as RNText, TextStyle, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export type TextVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'bodySmall'
  | 'caption'
  | 'label'
  | 'button';

export interface AppTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  align?: TextStyle['textAlign'];
  bold?: boolean;
  semiBold?: boolean;
  medium?: boolean;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = colors.text,
  align = 'left',
  bold,
  semiBold,
  medium,
  style,
  children,
  ...props
}) => {
  const getVariantStyle = (): TextStyle => {
    switch (variant) {
      case 'display':
        return {
          fontSize: typography.fontSize.display,
          lineHeight: typography.lineHeight.xxxl,
          fontWeight: typography.fontWeight.bold,
        };
      case 'h1':
        return {
          fontSize: typography.fontSize.xxxl,
          lineHeight: typography.lineHeight.xxl,
          fontWeight: typography.fontWeight.bold,
        };
      case 'h2':
        return {
          fontSize: typography.fontSize.xxl,
          lineHeight: typography.lineHeight.xl,
          fontWeight: typography.fontWeight.bold,
        };
      case 'h3':
        return {
          fontSize: typography.fontSize.xl,
          lineHeight: typography.lineHeight.lg,
          fontWeight: typography.fontWeight.semiBold,
        };
      case 'h4':
        return {
          fontSize: typography.fontSize.lg,
          lineHeight: typography.lineHeight.md,
          fontWeight: typography.fontWeight.semiBold,
        };
      case 'body':
        return {
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.md,
          fontWeight: typography.fontWeight.regular,
        };
      case 'bodySmall':
        return {
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.sm,
          fontWeight: typography.fontWeight.regular,
        };
      case 'caption':
        return {
          fontSize: typography.fontSize.xs,
          lineHeight: typography.lineHeight.xs,
          fontWeight: typography.fontWeight.regular,
        };
      case 'label':
        return {
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.sm,
          fontWeight: typography.fontWeight.medium,
        };
      case 'button':
        return {
          fontSize: typography.fontSize.md,
          lineHeight: typography.lineHeight.md,
          fontWeight: typography.fontWeight.semiBold,
        };
      default:
        return {};
    }
  };

  const weightStyle: TextStyle = {
    ...(bold && { fontWeight: typography.fontWeight.bold }),
    ...(semiBold && { fontWeight: typography.fontWeight.semiBold }),
    ...(medium && { fontWeight: typography.fontWeight.medium }),
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color, textAlign: align },
        weightStyle,
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

export default AppText;
