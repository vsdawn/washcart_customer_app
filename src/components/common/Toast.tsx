import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import AppText from './AppText';

const VISIBLE_MS = 2200;

/** Holds the current toast message and clears it after a short delay */
export const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((text: string) => {
    clearTimeout(timer.current);
    setMessage(text);
    timer.current = setTimeout(() => setMessage(null), VISIBLE_MS);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { message, show };
};

export interface ToastProps {
  message: string | null;
  style?: ViewStyle;
}

export const Toast: React.FC<ToastProps> = ({ message, style }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const [text, setText] = useState(message);

  useEffect(() => {
    if (message) {
      setText(message);
    }
    Animated.timing(opacity, {
      toValue: message ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [message, opacity]);

  if (!text) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[styles.toast, { opacity }, style]}>
      <AppText variant="bodySmall" color={colors.textWhite} align="center" semiBold>
        {text}
      </AppText>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.text,
    borderRadius: spacing.buttonRadius,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    ...shadows.medium,
  },
});

export default Toast;
