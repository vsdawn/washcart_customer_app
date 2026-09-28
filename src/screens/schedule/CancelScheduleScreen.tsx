import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { CANCEL_REASONS } from '../../constants/scheduleConfig';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import BottomSheet from '../../components/modals/BottomSheet';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { cancelSchedule } from '../../store/slices/scheduleSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'CancelSchedule'>;

const DETAILS_MAX = 500;

export const CancelScheduleScreen: React.FC<Props> = ({ route, navigation }) => {
  const { scheduleId } = route.params;
  const { bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const [reason, setReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleCancel = () => {
    setConfirmVisible(false);
    const fullReason = details.trim() ? `${reason} - ${details.trim()}` : reason ?? '';
    dispatch(cancelSchedule({ id: scheduleId, reason: fullReason }));
    navigation.reset({
      index: 1,
      routes: [
        { name: 'MainTab', params: { screen: 'Home' } },
        { name: 'ScheduleDetails', params: { scheduleId } },
      ],
    });
  };

  const handleReschedule = () => {
    setConfirmVisible(false);
    navigation.replace('SchedulePickup', { scheduleId });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader title="What Went Wrong?" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 110 + bottom }]}
        keyboardShouldPersistTaps="handled">
        <AppText variant="bodySmall" color={colors.textSecondary}>
          We're sorry to see you cancel.
        </AppText>
        <AppText variant="label" color={colors.text} bold style={styles.prompt}>
          Please share what made you cancel.
        </AppText>

        <View style={styles.reasonList}>
          {CANCEL_REASONS.map((r, index) => {
            const isSelected = r === reason;
            return (
              <TouchableOpacity
                key={r}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setReason(r)}
                style={[
                  styles.reasonRow,
                  index < CANCEL_REASONS.length - 1 && styles.reasonDivider,
                  isSelected && styles.reasonSelected,
                ]}>
                <AppText variant="bodySmall" color={colors.text} semiBold={isSelected} style={styles.reasonText}>
                  {r}
                </AppText>
                <Icon
                  name={isSelected ? 'radio-on' : 'radio-off'}
                  size={22}
                  color={isSelected ? colors.primary : colors.textMuted}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <AppText variant="label" color={colors.textSecondary} bold style={styles.detailsLabel}>
          ADDITIONAL DETAILS (OPTIONAL)
        </AppText>
        <View style={styles.detailsBox}>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Tell us more about your experience..."
            placeholderTextColor={colors.textMuted}
            maxLength={DETAILS_MAX}
            multiline
            style={styles.detailsInput}
          />
          <AppText variant="caption" color={colors.textMuted} align="right">
            {details.length}/{DETAILS_MAX}
          </AppText>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: spacing.md + bottom }]}>
        <AppButton
          title="Cancel Pickup"
          variant="danger"
          size="lg"
          disabled={!reason}
          onPress={() => setConfirmVisible(true)}
        />
      </View>

      <BottomSheet visible={confirmVisible} onClose={() => setConfirmVisible(false)}>
        <AppText variant="h3" color={colors.text} bold>
          Need to cancel?
        </AppText>
        <AppText variant="h4" color={colors.textSecondary} style={styles.sheetSubtitle}>
          Try rescheduling instead.
        </AppText>
        <AppText variant="bodySmall" color={colors.textSecondary} style={styles.sheetBody}>
          Choose a new slot that works better for you. It only takes a few seconds.
        </AppText>
        <View style={styles.sheetActions}>
          <AppButton
            title="Cancel Pickup"
            variant="outline"
            style={[styles.sheetBtn, styles.sheetCancelBtn]}
            textStyle={styles.sheetCancelText}
            onPress={handleCancel}
          />
          <AppButton title="Reschedule" style={styles.sheetBtn} onPress={handleReschedule} />
        </View>
      </BottomSheet>
    </KeyboardAvoidingView>
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
  prompt: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  reasonList: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md + 2,
  },
  reasonDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  reasonSelected: {
    backgroundColor: colors.primaryBg,
  },
  reasonText: {
    flex: 1,
    marginRight: spacing.md,
  },
  detailsLabel: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  detailsBox: {
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.lg,
  },
  detailsInput: {
    minHeight: 80,
    fontSize: typography.fontSize.sm,
    color: colors.text,
    textAlignVertical: 'top',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  sheetSubtitle: {
    marginTop: 2,
  },
  sheetBody: {
    marginTop: spacing.md,
  },
  sheetActions: {
    flexDirection: 'row',
    marginTop: spacing.xl,
  },
  sheetBtn: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  sheetCancelBtn: {
    borderColor: colors.error,
  },
  sheetCancelText: {
    color: colors.error,
  },
});

export default CancelScheduleScreen;
