import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import APP_CONFIG from '../../config/appConfig';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.heroSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?q=80&w=800' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.contentCard}>
        <AppText variant="h1" color={colors.text} bold align="center" style={styles.title}>
          Clean clothes delivered to your doorstep
        </AppText>

        <AppText
          variant="body"
          color={colors.textSecondary}
          align="center"
          style={styles.subtitle}>
          Professional wash & fold, steam ironing & eco-friendly dry cleaning. Fast 24-hour pickup & delivery.
        </AppText>

        <View style={styles.featuresRow}>
          <View style={styles.featurePill}>
            <AppText variant="caption" color={colors.primary} bold>
              ⚡ 24hr Express
            </AppText>
          </View>
          <View style={styles.featurePill}>
            <AppText variant="caption" color={colors.primary} bold>
              🏷️ Free Doorstep Pickup
            </AppText>
          </View>
        </View>

        <AppButton
          title="Get Started"
          variant="primary"
          size="lg"
          onPress={() => navigation.navigate('MobileNumber')}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroSection: {
    flex: 1.2,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.25)',
  },
  contentCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    padding: spacing.xl,
    justifyContent: 'space-between',
  },
  title: {
    marginTop: spacing.sm,
  },
  subtitle: {
    marginVertical: spacing.md,
    lineHeight: 22,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  featurePill: {
    backgroundColor: colors.primaryBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    marginHorizontal: spacing.xs,
  },
  button: {
    marginBottom: spacing.md,
  },
});

export default WelcomeScreen;
