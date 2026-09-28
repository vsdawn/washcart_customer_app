import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';

type Props = NativeStackScreenProps<RootStackParamList, 'SubscriptionDetails'>;

export const SubscriptionDetailsScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <AppHeader title="Subscription Details" />
      <ScrollView contentContainerStyle={styles.content}>
        <AppCard style={styles.card}>
          <AppText variant="h3" color={colors.text} bold>
            WashKart Pass Benefits
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={{ marginTop: 8 }}>
            With WashKart Pass, you enjoy zero doorstep delivery charges, priority facility processing, and exclusive discounts on dry cleaning.
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
  content: {
    padding: spacing.screenPaddingHorizontal,
  },
  card: {
    marginVertical: spacing.md,
  },
});

export default SubscriptionDetailsScreen;
