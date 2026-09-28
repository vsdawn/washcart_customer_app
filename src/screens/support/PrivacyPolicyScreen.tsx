import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';

export const PrivacyPolicyScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppHeader title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppCard style={styles.card}>
          <AppText variant="h3" color={colors.text} bold style={styles.title}>
            WashKart Privacy & Data Protection Policy
          </AppText>
          <AppText variant="caption" color={colors.textMuted} style={styles.date}>
            Last updated: September 2026
          </AppText>

          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.paragraph}>
            We collect personal details such as your mobile number, name, email address, and delivery coordinates strictly to fulfill your laundry pickup and delivery requests.
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.paragraph}>
            We do NOT store credit/debit card credentials, CVV codes, or bank passwords on our servers. All online payments are handled securely through PCI-DSS compliant payment gateways.
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.paragraph}>
            Your location data is used exclusively for dispatching valets and displaying local service availability.
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

export default PrivacyPolicyScreen;
