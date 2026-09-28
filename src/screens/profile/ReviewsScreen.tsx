import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootStackParamList } from '../../types/navigation';
import { reviewSchema, ReviewFormData } from '../../validation/reviewSchemas';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import RatingStars from '../../components/common/RatingStars';
import { reviewApi } from '../../services/api/reviewApi';

type Props = NativeStackScreenProps<RootStackParamList, 'Reviews'>;

export const ReviewsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId = 'ord_1002' } = route.params || {};
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 5,
      laundryQualityRating: 5,
      pickupExperienceRating: 5,
      deliveryExperienceRating: 5,
      comment: 'Excellent washing quality and crisp steam ironing! Very punctual delivery.',
    },
  });

  const ratingVal = watch('rating');
  const qualityVal = watch('laundryQualityRating');
  const pickupVal = watch('pickupExperienceRating');
  const deliveryVal = watch('deliveryExperienceRating');

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setSubmitting(true);
      await reviewApi.submitReview({
        orderId,
        ...data,
      });
      Alert.alert('Review Submitted ⭐', 'Thank you for rating your WashKart experience!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Order Experience & Review" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppCard style={styles.card}>
          <AppText variant="h2" color={colors.text} bold align="center">
            How was your laundry experience?
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} align="center" style={styles.subtitle}>
            Rate your order experience to help us improve service quality.
          </AppText>

          {/* Overall Rating */}
          <View style={styles.ratingBox}>
            <AppText variant="h3" color={colors.text} bold style={styles.boxTitle}>
              Overall Rating
            </AppText>
            <RatingStars
              rating={ratingVal}
              size={32}
              interactive
              onRatingSelect={val => setValue('rating', val)}
            />
          </View>

          {/* Laundry Quality */}
          <View style={styles.categoryRatingRow}>
            <AppText variant="label" color={colors.text} semiBold>
              Laundry & Cleaning Quality
            </AppText>
            <RatingStars
              rating={qualityVal}
              size={22}
              interactive
              onRatingSelect={val => setValue('laundryQualityRating', val)}
            />
          </View>

          {/* Pickup Experience */}
          <View style={styles.categoryRatingRow}>
            <AppText variant="label" color={colors.text} semiBold>
              Pickup Experience
            </AppText>
            <RatingStars
              rating={pickupVal}
              size={22}
              interactive
              onRatingSelect={val => setValue('pickupExperienceRating', val)}
            />
          </View>

          {/* Delivery Experience */}
          <View style={styles.categoryRatingRow}>
            <AppText variant="label" color={colors.text} semiBold>
              Delivery Experience
            </AppText>
            <RatingStars
              rating={deliveryVal}
              size={22}
              interactive
              onRatingSelect={val => setValue('deliveryExperienceRating', val)}
            />
          </View>

          {/* Comment */}
          <Controller
            control={control}
            name="comment"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Your Feedback & Comments"
                placeholder="Share your thoughts about freshness, pressing quality, or valet behavior..."
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                inputStyle={styles.commentInput}
              />
            )}
          />

          <AppButton
            title="Submit Review"
            variant="primary"
            size="lg"
            loading={submitting}
            onPress={() => handleSubmit(onSubmit)()}
            style={styles.submitBtn}
          />
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
  },
  card: {
    marginVertical: spacing.md,
  },
  subtitle: {
    marginVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  ratingBox: {
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    padding: spacing.lg,
    borderRadius: spacing.cardRadius,
    marginBottom: spacing.lg,
  },
  boxTitle: {
    marginBottom: spacing.sm,
  },
  categoryRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  commentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    marginTop: spacing.md,
  },
});

export default ReviewsScreen;
