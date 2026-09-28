import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { generateDeliveryDates, getDeliverySlotsForDate } from '../../utils/dateUtils';
import { formatDate } from '../../utils/formatters';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import SlotSelector from '../../components/checkout/SlotSelector';
import Icon from '../../components/common/Icon';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setDeliverySlot } from '../../store/slices/orderSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'DeliverySlot'>;

export const DeliverySlotScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const pickupSlot = useAppSelector(state => state.order.pickupSlot);

  const dates = generateDeliveryDates(pickupSlot?.date || new Date().toISOString());
  const [selectedDateStr, setSelectedDateStr] = useState(dates[0].dateString);

  const slots = getDeliverySlotsForDate(selectedDateStr);
  const [selectedTimeRange, setSelectedTimeRange] = useState(slots[0]?.timeRange || '05:00 PM - 07:00 PM');

  const handleContinue = () => {
    dispatch(
      setDeliverySlot({
        date: selectedDateStr,
        timeRange: selectedTimeRange,
      })
    );
    navigation.navigate('OrderReview');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Select Delivery Slot" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pickup summary card */}
        <AppCard style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Icon name="check-circle" size={20} color={colors.success} />
            <View style={styles.summaryTextGroup}>
              <AppText variant="caption" color={colors.textSecondary}>
                Pickup Date & Time
              </AppText>
              <AppText variant="label" color={colors.text} bold>
                {formatDate(pickupSlot?.date || '')} • {pickupSlot?.timeRange}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Delivery Slot selector */}
        <SlotSelector
          dates={dates}
          selectedDateStr={selectedDateStr}
          onSelectDate={d => {
            setSelectedDateStr(d);
            const newSlots = getDeliverySlotsForDate(d);
            if (newSlots.length > 0) {
              setSelectedTimeRange(newSlots[0].timeRange);
            }
          }}
          slots={slots}
          selectedTimeRange={selectedTimeRange}
          onSelectTimeRange={setSelectedTimeRange}
        />

        <View style={styles.processingNote}>
          <Icon name="time-outline" size={20} color={colors.primary} />
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.noteText}>
            Clean clothes require 24-48 hours processing for washing, drying, steam ironing & quality checks.
          </AppText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Review Order"
          variant="primary"
          size="lg"
          onPress={handleContinue}
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
  scrollContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: 100,
  },
  summaryCard: {
    marginVertical: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTextGroup: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  processingNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    padding: spacing.md,
    borderRadius: spacing.cardRadius,
    marginTop: spacing.md,
  },
  noteText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});

export default DeliverySlotScreen;
