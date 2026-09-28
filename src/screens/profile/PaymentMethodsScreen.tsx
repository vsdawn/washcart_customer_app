import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import Icon from '../../components/common/Icon';
import PaymentService from '../../services/payment/paymentService';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentMethods'>;

export const PaymentMethodsScreen: React.FC<Props> = () => {
  const methods = PaymentService.getAvailablePaymentMethods();

  return (
    <View style={styles.container}>
      <AppHeader title="Payment Methods" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppText variant="h4" color={colors.text} bold style={styles.sectionTitle}>
          Saved Payment Options
        </AppText>

        {methods.map(item => (
          <AppCard key={item.id} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconCircle}>
                <Icon name={item.iconName as any} size={22} color={colors.primary} />
              </View>
              <View style={styles.textGroup}>
                <AppText variant="label" color={colors.text} bold>
                  {item.name}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {item.description}
                </AppText>
              </View>
            </View>
          </AppCard>
        ))}
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
  sectionTitle: {
    marginVertical: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textGroup: {
    flex: 1,
  },
});

export default PaymentMethodsScreen;
