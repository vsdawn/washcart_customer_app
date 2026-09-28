import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { PickupSchedule } from '../../types/schedule';
import { formatScheduleDate, getScheduleDates, getTimeSlot, SCHEDULE_TIME_SLOTS } from '../../constants/scheduleConfig';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';
import Icon, { IconName } from '../common/Icon';

const PROGRESS_ICONS: IconName[] = ['calendar-outline', 'bag-outline', 'package-outline', 'truck-outline', 'check-circle'];

export const ScheduledPickupCard: React.FC<{ schedule: PickupSchedule; onView: () => void }> = ({
  schedule,
  onView,
}) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onView} style={styles.card}>
    <View style={styles.mainCol}>
      <AppText variant="h4" color={colors.text} bold>
        Pickup Scheduled
      </AppText>
      <AppText variant="bodySmall" color={colors.textSecondary} numberOfLines={1} style={styles.subtitle}>
        {schedule.serviceName} : #{schedule.id}
      </AppText>
      <View style={styles.progressRow}>
        {PROGRESS_ICONS.map((icon, index) => (
          <React.Fragment key={icon}>
            {index > 0 && <View style={styles.progressLine} />}
            <View style={[styles.progressDot, index === 0 && styles.progressDotActive]}>
              <Icon name={icon} size={12} color={index === 0 ? colors.textWhite : colors.textSecondary} />
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>

    <View style={styles.sideCol}>
      <TouchableOpacity onPress={onView} accessibilityRole="button" style={styles.viewBtn}>
        <AppText variant="label" color={colors.primary} bold>
          View
        </AppText>
      </TouchableOpacity>
      <AppText variant="caption" color={colors.primary} align="center" style={styles.slotText}>
        {formatScheduleDate(schedule.pickupDate)}
        {'\n'}
        {getTimeSlot(schedule.timeSlot).shortLabel}
      </AppText>
    </View>
  </TouchableOpacity>
);

export const NextSlotCard: React.FC<{ onSchedule: () => void }> = ({ onSchedule }) => {
  const nextDate = getScheduleDates(new Date(), 1)[0].dateString;
  return (
    <View style={[styles.card, styles.nextSlotCard]}>
      <View style={styles.mainCol}>
        <AppText variant="h4" color={colors.text} bold>
          Next Available Slot
        </AppText>
        <View style={styles.nextSlotRow}>
          <Icon name="calendar-outline" size={16} color={colors.primary} />
          <AppText variant="label" color={colors.primary} bold style={styles.nextSlotText}>
            {formatScheduleDate(nextDate)} • {SCHEDULE_TIME_SLOTS[0].shortLabel}
          </AppText>
        </View>
      </View>
      <AppButton title="Schedule Now" size="sm" fullWidth={false} onPress={onSchedule} style={styles.scheduleBtn} />
    </View>
  );
};

export const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.dividerRow}>
    <View style={styles.dividerLine} />
    <AppText variant="caption" color={colors.textSecondary} bold style={styles.dividerLabel}>
      {label}
    </AppText>
    <View style={styles.dividerLine} />
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.subtle,
  },
  nextSlotCard: {
    justifyContent: 'space-between',
  },
  mainCol: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressDotActive: {
    backgroundColor: colors.primary,
  },
  progressLine: {
    width: 12,
    height: 2,
    backgroundColor: colors.border,
  },
  sideCol: {
    alignItems: 'center',
    paddingLeft: spacing.md,
    marginLeft: spacing.md,
    borderLeftWidth: 1,
    borderLeftColor: colors.divider,
  },
  viewBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xs + 2,
  },
  slotText: {
    marginTop: spacing.sm,
  },
  nextSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  nextSlotText: {
    marginLeft: spacing.xs,
  },
  scheduleBtn: {
    marginLeft: spacing.md,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    marginHorizontal: spacing.md,
    letterSpacing: 1.5,
  },
});
