import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import {
  SCHEDULE_TIMELINE,
  formatScheduleDate,
  getDeliveryType,
  getEstimatedDelivery,
  getItemRangeLabel,
  getTimeSlot,
} from '../../constants/scheduleConfig';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import Icon, { IconName } from '../../components/common/Icon';
import EmptyState from '../../components/states/EmptyState';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectScheduleById } from '../../store/slices/scheduleSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'ScheduleDetails'>;

const TIMELINE_ICONS: IconName[] = ['calendar-outline', 'bag-outline', 'package-outline', 'truck-outline', 'check-circle'];

// Pickups only reach the first step until order tracking is wired to the backend
const CURRENT_STEP = 0;

const DetailRow: React.FC<{ label: string; value: string; last?: boolean }> = ({ label, value, last }) => (
  <View style={[styles.detailRow, !last && styles.detailDivider]}>
    <AppText variant="bodySmall" color={colors.textSecondary}>
      {label}
    </AppText>
    <AppText variant="bodySmall" color={colors.text} semiBold align="right" style={styles.detailValue}>
      {value}
    </AppText>
  </View>
);

export const ScheduleDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { scheduleId, justBooked } = route.params;
  const { bottom } = useSafeAreaInsets();
  const schedule = useAppSelector(state => selectScheduleById(state, scheduleId));

  if (!schedule) {
    return (
      <View style={styles.container}>
        <AppHeader title="Pickup Details" />
        <EmptyState
          iconName="calendar-outline"
          title="Pickup not found"
          message="This pickup may have been removed."
          buttonTitle="Go Home"
          onButtonPress={() => navigation.navigate('MainTab', { screen: 'Home' })}
        />
      </View>
    );
  }

  const isCancelled = schedule.status === 'CANCELLED';
  const slot = getTimeSlot(schedule.timeSlot);
  const wasRescheduled = schedule.updatedAt !== schedule.createdAt;

  return (
    <View style={styles.container}>
      <AppHeader title="Pickup Details" />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: (isCancelled ? spacing.xl : 110) + bottom }]}
        showsVerticalScrollIndicator={false}>
        {justBooked && !isCancelled && (
          <View style={styles.successBanner}>
            <Icon name="check-circle" size={22} color={colors.success} />
            <AppText variant="label" color={colors.success} bold style={styles.bannerText}>
              {wasRescheduled ? 'Pickup updated successfully!' : 'Pickup scheduled successfully!'}
            </AppText>
          </View>
        )}

        {isCancelled && (
          <View style={styles.cancelledBanner}>
            <Icon name="close" size={20} color={colors.error} />
            <View style={styles.bannerText}>
              <AppText variant="label" color={colors.error} bold>
                This pickup was cancelled
              </AppText>
              {schedule.cancelReason ? (
                <AppText variant="caption" color={colors.textSecondary}>
                  Reason: {schedule.cancelReason}
                </AppText>
              ) : null}
            </View>
          </View>
        )}

        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <AppText variant="h2" color={colors.text} bold>
              {isCancelled ? 'Cancelled Pickup' : 'Current Order'}
            </AppText>
            <AppText variant="bodySmall" color={colors.textSecondary}>
              Order ID : #{schedule.id}
            </AppText>
          </View>
        </View>
        <AppText variant="label" color={colors.primary} bold style={styles.serviceName}>
          {schedule.serviceName}
        </AppText>

        <AppCard style={styles.card}>
          {SCHEDULE_TIMELINE.map((step, index) => {
            const isActive = index === CURRENT_STEP && !isCancelled;
            const isLast = index === SCHEDULE_TIMELINE.length - 1;
            return (
              <View key={step.title} style={styles.stepRow}>
                <View style={styles.stepRail}>
                  <View style={[styles.stepIcon, isActive && styles.stepIconActive]}>
                    <Icon
                      name={TIMELINE_ICONS[index]}
                      size={16}
                      color={isActive ? colors.textWhite : colors.textSecondary}
                    />
                  </View>
                  {!isLast && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepText}>
                  <View style={styles.stepHeader}>
                    <AppText variant="label" color={isActive ? colors.text : colors.textSecondary} bold>
                      {step.title}
                    </AppText>
                    {index === 0 && (
                      <AppText variant="caption" color={colors.textSecondary}>
                        {formatScheduleDate(schedule.pickupDate)} | {slot.shortLabel}
                      </AppText>
                    )}
                  </View>
                  <AppText variant="caption" color={colors.textMuted}>
                    {step.caption}
                  </AppText>
                </View>
              </View>
            );
          })}
        </AppCard>

        {!isCancelled && (
          <AppCard style={styles.card}>
            <DetailRow label="Estimated delivery" value={getEstimatedDelivery(schedule)} last />
          </AppCard>
        )}

        <AppCard style={styles.card}>
          <DetailRow label="Delivery Mode" value={getDeliveryType(schedule.deliveryType).label} />
          <DetailRow label="Cloth Count" value={`${getItemRangeLabel(schedule.itemRange)} items`} />
          <DetailRow label="Pickup Address" value={schedule.address} />
          {schedule.items.length > 0 && (
            <DetailRow
              label="Services"
              value={schedule.items.map(i => `${i.name} × ${i.quantity} ${i.unit}`).join('\n')}
            />
          )}
          <DetailRow label="Instructions" value={schedule.instructions || '-'} last />
        </AppCard>
      </ScrollView>

      {!isCancelled && (
        <View style={[styles.footer, { paddingBottom: spacing.md + bottom }]}>
          <AppButton
            title="Cancel Pickup"
            variant="outline"
            size="lg"
            style={[styles.footerBtn, styles.cancelBtn]}
            textStyle={styles.cancelText}
            onPress={() => navigation.navigate('CancelSchedule', { scheduleId })}
          />
          <AppButton
            title="Modify"
            size="lg"
            style={styles.footerBtn}
            onPress={() => navigation.navigate('SchedulePickup', { scheduleId })}
          />
        </View>
      )}
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
  flex: {
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    borderColor: colors.successBorder,
    borderWidth: 1,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
    borderWidth: 1,
    borderRadius: spacing.cardRadius,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  bannerText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
  },
  stepRail: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconActive: {
    backgroundColor: colors.primary,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 18,
    backgroundColor: colors.border,
  },
  stepText: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm + 2,
  },
  detailDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  detailValue: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerBtn: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  cancelBtn: {
    borderColor: colors.error,
  },
  cancelText: {
    color: colors.error,
  },
});

export default ScheduleDetailsScreen;
