import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ServiceCategory } from '../../types/service';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import Icon, { IconName } from '../common/Icon';

export interface CategoryCardProps {
  category: ServiceCategory;
  onPress: () => void;
  layout?: 'horizontal' | 'grid';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  layout = 'horizontal',
}) => {
  if (layout === 'grid') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={styles.gridContainer}>
        <View style={styles.iconCircle}>
          <Icon name={category.iconName as IconName} size={28} color={colors.primary} />
        </View>
        <AppText
          variant="bodySmall"
          color={colors.text}
          semiBold
          align="center"
          numberOfLines={2}
          style={styles.gridTitle}>
          {category.name}
        </AppText>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.horizontalContainer}>
      <View style={styles.horizontalCard}>
        <Image
          source={{ uri: category.imageUrl }}
          style={styles.horizontalImage}
          resizeMode="cover"
        />
        <View style={styles.horizontalOverlay}>
          <Icon name={category.iconName as IconName} size={22} color={colors.surface} />
          <AppText
            variant="label"
            color={colors.surface}
            bold
            style={styles.horizontalText}
            numberOfLines={1}>
            {category.name}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    width: '23%',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  gridTitle: {
    fontSize: 12,
  },
  horizontalContainer: {
    marginRight: spacing.md,
  },
  horizontalCard: {
    width: 120,
    height: 100,
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    backgroundColor: colors.inputBg,
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  horizontalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    padding: spacing.sm,
    justifyContent: 'flex-end',
  },
  horizontalText: {
    marginTop: spacing.xs,
  },
});

export default CategoryCard;
