import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface SkeletonLoaderProps {
  type?: 'card' | 'list' | 'banner';
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <View style={styles.container}>
      {items.map(idx => (
        <View key={idx} style={styles.cardSkeleton}>
          <View style={styles.imagePlaceholder} />
          <View style={styles.textGroup}>
            <View style={styles.lineTitle} />
            <View style={styles.lineSubtitle} />
            <View style={styles.linePrice} />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  cardSkeleton: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.inputBg,
  },
  textGroup: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  lineTitle: {
    width: '60%',
    height: 14,
    backgroundColor: colors.inputBg,
    borderRadius: 4,
    marginBottom: 8,
  },
  lineSubtitle: {
    width: '85%',
    height: 10,
    backgroundColor: colors.inputBg,
    borderRadius: 4,
    marginBottom: 8,
  },
  linePrice: {
    width: '35%',
    height: 14,
    backgroundColor: colors.inputBg,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
