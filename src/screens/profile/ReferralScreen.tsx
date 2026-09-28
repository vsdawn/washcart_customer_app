import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Share, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import { useAppSelector } from '../../hooks/useAppSelector';

type Props = NativeStackScreenProps<RootStackParamList, 'Referral'>;

export const ReferralScreen: React.FC<Props> = () => {
  const user = useAppSelector(state => state.auth.user);
  const code = user?.referralCode || 'WASH50';

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Copied!', `Referral code ${code} copied to clipboard`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my WashKart referral code ${code} to get ₹100 OFF on your first laundry & dry cleaning order! Download app at https://washkart.com`,
      });
    } catch (error: any) {
      console.warn('Share error', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Refer & Earn Rewards" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroBox}>
          <View style={styles.iconCircle}>
            <Icon name="share-social-outline" size={48} color={colors.primary} />
          </View>
          <AppText variant="h1" color={colors.text} bold align="center">
            Earn ₹100 for Every Friend!
          </AppText>
          <AppText variant="body" color={colors.textSecondary} align="center" style={styles.subtitle}>
            Share your unique code with friends. When they place their 1st laundry order, both of you get ₹100 credit.
          </AppText>
        </View>

        {/* Code Box */}
        <AppCard style={styles.codeCard}>
          <AppText variant="caption" color={colors.textSecondary} align="center">
            YOUR UNIQUE REFERRAL CODE
          </AppText>
          <View style={styles.codeRow}>
            <AppText variant="display" color={colors.primary} bold style={styles.codeText}>
              {code}
            </AppText>
          </View>

          <View style={styles.buttonRow}>
            <AppButton
              title={copied ? 'COPIED!' : 'COPY CODE'}
              variant="outline"
              size="md"
              fullWidth={false}
              onPress={handleCopy}
              style={styles.codeBtn}
            />
            <AppButton
              title="SHARE NOW"
              variant="primary"
              size="md"
              fullWidth={false}
              icon={<Icon name="share-social-outline" size={18} color={colors.textWhite} />}
              onPress={handleShare}
              style={styles.codeBtn}
            />
          </View>
        </AppCard>

        {/* Earnings Stats */}
        <AppCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <AppText variant="h2" color={colors.primary} bold>
                {formatCurrency(200)}
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Total Rewards Earned
              </AppText>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statCol}>
              <AppText variant="h2" color={colors.text} bold>
                2
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Successful Referrals
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Referral History */}
        <AppText variant="h4" color={colors.text} bold style={styles.historyTitle}>
          Referral Activity History
        </AppText>

        <AppCard style={styles.historyCard}>
          <View style={styles.historyRow}>
            <View style={styles.historyText}>
              <AppText variant="label" color={colors.text} bold>
                Priya Sundaram
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Joined via your code • 20 Sep 2026
              </AppText>
            </View>
            <AppText variant="label" color={colors.success} bold>
              +₹100
            </AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.historyRow}>
            <View style={styles.historyText}>
              <AppText variant="label" color={colors.text} bold>
                Amit Verma
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Joined via your code • 14 Sep 2026
              </AppText>
            </View>
            <AppText variant="label" color={colors.success} bold>
              +₹100
            </AppText>
          </View>
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
  heroBox: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
    lineHeight: 22,
    maxWidth: 300,
  },
  codeCard: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  codeRow: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm,
    marginVertical: spacing.md,
  },
  codeText: {
    letterSpacing: 2,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: spacing.sm,
  },
  codeBtn: {
    marginHorizontal: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  statsCard: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statCol: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
  },
  historyTitle: {
    marginBottom: spacing.sm,
  },
  historyCard: {
    marginBottom: spacing.xl,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyText: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
});

export default ReferralScreen;
