import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Terms'>;

export const TermsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="Terms & Conditions" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppCard style={styles.card}>
          <AppText variant="h3" color={colors.text} bold style={styles.title}>
            WashKart Customer Terms of Service
          </AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.date}>
            Last updated: September 2026
          </AppText>

          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.paragraph}>
            1. Services Overview: WashKart provides doorstep laundry pickup, washing, dry cleaning, steam ironing, and delivery marketplace services.
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.paragraph}>
            2. Minimum Order Value: The minimum order threshold for free doorstep pickup is ₹199. Standard pickup charges apply on orders below this threshold.
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.paragraph}>
            3. Garment Care & Liability: All garments are inspected upon arrival at our processing facility. WashKart accepts liability up to 10x the service charge for lost or damaged items caused directly by process failure.
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.paragraph}>
            4. Cancellation Policy: Free cancellation is allowed before valet dispatch. Post-dispatch cancellations incur a nominal ₹50 fee.
          </AppText>
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
  title: {
    marginBottom: 4,
  },
  date: {
    marginBottom: spacing.md,
  },
  paragraph: {
    lineHeight: 22,
    marginBottom: spacing.md,
  },
});

export default TermsScreen;
