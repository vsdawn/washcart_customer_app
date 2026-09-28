import React from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import APP_CONFIG from '../../config/appConfig';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Support'>;

export const SupportScreen: React.FC<Props> = ({ navigation }) => {
  const handleCall = () => {
    Linking.openURL(`tel:${APP_CONFIG.supportPhone}`).catch(() =>
      Alert.alert('Support Phone', `Call ${APP_CONFIG.supportPhone}`)
    );
  };

  const handleWhatsApp = () => {
    Linking.openURL(`whatsapp://send?phone=${APP_CONFIG.whatsappSupportNumber}&text=Hi WashKart Support, I need help with my order`).catch(() =>
      Alert.alert('WhatsApp Support', `WhatsApp chat at ${APP_CONFIG.whatsappSupportNumber}`)
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Customer Support" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Support Banner */}
        <AppCard style={styles.heroCard}>
          <Icon name="headset-outline" size={40} color={colors.primary} />
          <AppText variant="h2" color={colors.text} bold style={styles.heroTitle}>
            How can we help you today?
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} align="center">
            Our customer care team is available 7 days a week from 7:00 AM to 10:00 PM.
          </AppText>
        </AppCard>

        {/* Quick Contact Options */}
        <View style={styles.contactRow}>
          <TouchableOpacity onPress={handleCall} style={styles.contactBox}>
            <Icon name="headset-outline" size={28} color={colors.primary} />
            <AppText variant="label" color={colors.text} bold style={styles.boxText}>
              Call Support
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Toll Free
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleWhatsApp} style={styles.contactBox}>
            <Icon name="qr-code-outline" size={28} color={colors.success} />
            <AppText variant="label" color={colors.text} bold style={styles.boxText}>
              WhatsApp Chat
            </AppText>
            <AppText variant="caption" color={colors.textSecondary}>
              Instant Reply
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Raise Complaint Card */}
        <AppCard style={styles.complaintCard}>
          <View style={styles.complaintRow}>
            <Icon name="alert-circle-outline" size={24} color={colors.warning} />
            <View style={styles.complaintText}>
              <AppText variant="h4" color={colors.text} bold>
                Have an Issue with an Order?
              </AppText>
              <AppText variant="bodySmall" color={colors.textSecondary}>
                Missing item, stain, or damage? Submit a ticket for immediate investigation.
              </AppText>
            </View>
          </View>
          <AppButton
            title="Raise a Complaint Ticket"
            variant="warning"
            size="md"
            onPress={() => navigation.navigate('Complaint', {})}
            style={styles.complaintBtn}
          />
        </AppCard>

        {/* FAQ Navigation Card */}
        <AppCard onPress={() => navigation.navigate('FAQ')} style={styles.faqCard}>
          <View style={styles.faqRow}>
            <Icon name="help-circle-outline" size={24} color={colors.primary} />
            <View style={styles.faqText}>
              <AppText variant="label" color={colors.text} bold>
                Frequently Asked Questions (FAQ)
              </AppText>
              <AppText variant="caption" color={colors.textSecondary}>
                Find answers about pickup slots, pricing, minimum order & garment safety.
              </AppText>
            </View>
            <Icon name="chevron-forward" size={18} color={colors.textSecondary} />
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
  heroCard: {
    alignItems: 'center',
    marginVertical: spacing.md,
    padding: spacing.xl,
  },
  heroTitle: {
    marginVertical: spacing.xs,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  contactBox: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.cardRadius,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  boxText: {
    marginTop: spacing.xs,
  },
  complaintCard: {
    marginBottom: spacing.md,
  },
  complaintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  complaintText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  complaintBtn: {
    marginTop: spacing.md,
  },
  faqCard: {
    marginBottom: spacing.lg,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqText: {
    marginLeft: spacing.md,
    flex: 1,
  },
});

export default SupportScreen;
