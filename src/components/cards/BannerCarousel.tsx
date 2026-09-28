import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import Icon from '../common/Icon';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.screenPaddingHorizontal * 2;

export interface BannerItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  code?: string;
  bgGradient: string;
  iconName: string;
}

export const PROMO_BANNERS: BannerItem[] = [
  {
    id: 'b1',
    badge: 'EXCLUSIVE SAVINGS',
    title: 'GET 20% OFF',
    subtitle: 'On your first dry cleaning & wash order',
    code: 'Use code WASH20',
    bgGradient: colors.primary,
    iconName: 'sparkles-outline',
  },
  {
    id: 'b2',
    badge: 'NO PICKUP CHARGE',
    title: 'FREE PICKUP & DELIVERY',
    subtitle: 'On all laundry orders above ₹499',
    code: 'Auto Applied',
    bgGradient: colors.secondary,
    iconName: 'truck-outline',
  },
  {
    id: 'b3',
    badge: 'NEW CUSTOMER SPECIAL',
    title: 'FLAT ₹100 OFF',
    subtitle: 'Fresh clothes delivered in 24 hours',
    code: 'Use code WELCOME100',
    bgGradient: colors.accent,
    iconName: 'pricetag-outline',
  },
];

export interface BannerCarouselProps {
  onBannerPress?: (banner: BannerItem) => void;
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ onBannerPress }) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + spacing.md}
        contentContainerStyle={styles.scrollContent}>
        {PROMO_BANNERS.map(item => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            onPress={() => onBannerPress && onBannerPress(item)}
            style={[styles.bannerCard, { backgroundColor: item.bgGradient }]}>
            <View style={styles.contentLeft}>
              <View style={styles.badge}>
                <AppText variant="caption" color={colors.textWhite} bold>
                  {item.badge}
                </AppText>
              </View>

              <AppText variant="h2" color={colors.textWhite} bold style={styles.title}>
                {item.title}
              </AppText>

              <AppText variant="bodySmall" color="rgba(255,255,255,0.9)" style={styles.subtitle}>
                {item.subtitle}
              </AppText>

              {item.code && (
                <View style={styles.codePill}>
                  <AppText variant="caption" color={colors.textWhite} bold>
                    {item.code}
                  </AppText>
                </View>
              )}
            </View>

            <View style={styles.contentRight}>
              <Icon name={item.iconName as any} size={54} color="rgba(255,255,255,0.25)" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  bannerCard: {
    width: CARD_WIDTH,
    height: 140,
    borderRadius: spacing.cardRadius,
    marginRight: spacing.md,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  contentLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    lineHeight: 26,
  },
  subtitle: {
    marginTop: 2,
  },
  codePill: {
    marginTop: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  contentRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: spacing.sm,
  },
});

export default BannerCarousel;
