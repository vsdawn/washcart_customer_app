import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import Icon from './Icon';

export interface RatingStarsProps {
  rating: number; // 1-5
  maxStars?: number;
  size?: number;
  interactive?: boolean;
  onRatingSelect?: (rating: number) => void;
  starColor?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxStars = 5,
  size = 20,
  interactive = false,
  onRatingSelect,
  starColor = '#F59E0B',
}) => {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {stars.map(star => {
        const isFilled = star <= rating;
        return (
          <TouchableOpacity
            key={star}
            disabled={!interactive}
            onPress={() => onRatingSelect && onRatingSelect(star)}
            style={styles.starTouch}>
            <Icon
              name={isFilled ? 'star' : 'star-outline'}
              size={size}
              color={isFilled ? starColor : colors.textMuted}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starTouch: {
    padding: 2,
  },
});

export default RatingStars;
