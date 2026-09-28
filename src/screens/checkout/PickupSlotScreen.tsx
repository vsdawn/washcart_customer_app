import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { generatePickupDates, getPickupSlotsForDate } from '../../utils/dateUtils';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppButton from '../../components/common/AppButton';
import SlotSelector from '../../components/checkout/SlotSelector';
import Icon from '../../components/common/Icon';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setPickupSlot } from '../../store/slices/orderSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'PickupSlot'>;

export const PickupSlotScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(state => state.location.selectedAddress);

  const dates = generatePickupDates();
  const [selectedDateStr, setSelectedDateStr] = useState(dates[0].dateString);

  const slots = getPickupSlotsForDate(selectedDateStr);
  const [selectedTimeRange, setSelectedTimeRange] = useState(slots[0]?.timeRange || '05:00 PM - 07:00 PM');

  const handleContinue = () => {
    dispatch(
      setPickupSlot({
        date: selectedDateStr,
        timeRange: selectedTimeRange,
      })
    );
    navigation.navigate('DeliverySlot');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Select Pickup Slot" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Selected Address Display Banner */}
        <AppCard style={styles.addressCard}>
          <View style={styles.addressRow}>
            <Icon name="location-outline" size={20} color={colors.primary} />
            <View style={styles.addressTextGroup}>
              <AppText variant="caption" color={colors.textSecondary}>
                Pickup Address
              </AppText>
              <AppText variant="label" color={colors.text} bold numberOfLines={1}>
                {selectedAddress ? `${selectedAddress.addressType}: ${selectedAddress.houseFlat}, ${selectedAddress.area}` : 'Home Address'}
              </AppText>
            </View>
          </View>
        </AppCard>

        {/* Slot selector */}
        <SlotSelector
          dates={dates}
          selectedDateStr={selectedDateStr}
          onSelectDate={d => {
            setSelectedDateStr(d);
            const newSlots = getPickupSlotsForDate(d);
            if (newSlots.length > 0) {
              setSelectedTimeRange(newSlots[0].timeRange);
            }
          }}
          slots={slots}
          selectedTimeRange={selectedTimeRange}
          onSelectTimeRange={setSelectedTimeRange}
        />

        <View style={styles.noteBox}>
          <Icon name="shield-checkmark-outline" size={20} color={colors.info} />
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.noteText}>
            Our delivery valet will call you 15 minutes before arrival for doorstep garment pickup.
          </AppText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton
          title="Continue to Delivery Slot"
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
  addressCard: {
    marginVertical: spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTextGroup: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.infoBg,
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

export default PickupSlotScreen;
