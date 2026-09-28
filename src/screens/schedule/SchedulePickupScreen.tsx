import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  ScrollViewInstance,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../../types/navigation';
import { DeliveryTypeId, ItemRangeId, PickupSchedule, TimeSlotId } from '../../types/schedule';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import {
  DELIVERY_TYPES,
  ITEM_RANGES,
  SCHEDULE_TIME_SLOTS,
  getScheduleDates,
} from '../../constants/scheduleConfig';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppButton from '../../components/common/AppButton';
import AppCard from '../../components/common/AppCard';
import Icon from '../../components/common/Icon';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useCart } from '../../hooks/useCart';
import { addSchedule, selectScheduleById, updateSchedule } from '../../store/slices/scheduleSlice';
import { getAddressServiceability } from '../../constants/serviceAreas';
import ServiceabilityBanner from '../../components/common/ServiceabilityBanner';

type Props = NativeStackScreenProps<RootStackParamList, 'SchedulePickup'>;

const INSTRUCTIONS_MAX = 250;

const generateScheduleId = () => String(Date.now()).slice(-6);

export const SchedulePickupScreen: React.FC<Props> = ({ route, navigation }) => {
  const { scheduleId, serviceName, fromCart } = route.params ?? {};
  const { bottom } = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const cart = useCart();
  const selectedAddress = useAppSelector(state => state.location.selectedAddress);
  const existing = useAppSelector(state => (scheduleId ? selectScheduleById(state, scheduleId) : undefined));
  const scrollRef = useRef<ScrollViewInstance>(null);

  const dates = useMemo(() => getScheduleDates(), []);
  // Tomorrow is the default; a rescheduled pickup keeps its date if it is still bookable
  const initialDate =
    existing && dates.some(d => d.dateString === existing.pickupDate) ? existing.pickupDate : dates[0].dateString;

  const [itemRange, setItemRange] = useState<ItemRangeId | null>(existing?.itemRange ?? null);
  const [pickupDate, setPickupDate] = useState(initialDate);
  const [timeSlot, setTimeSlot] = useState<TimeSlotId | null>(existing?.timeSlot ?? null);
  const [deliveryType, setDeliveryType] = useState<DeliveryTypeId>(existing?.deliveryType ?? 'STANDARD');
  const [showInstructions, setShowInstructions] = useState(Boolean(existing?.instructions));
  const [instructions, setInstructions] = useState(existing?.instructions ?? '');

  const isModifying = Boolean(existing);
  // A booked pickup keeps its original address; new bookings must be inside a service area
  const serviceability = selectedAddress ? getAddressServiceability(selectedAddress) : null;
  const isAddressServiceable = isModifying || Boolean(selectedAddress && serviceability?.isServiceable);
  const canConfirm = itemRange !== null && timeSlot !== null && isAddressServiceable;

  const revealNextStep = () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 150);

  const addressText = selectedAddress
    ? `${selectedAddress.houseFlat}, ${selectedAddress.area}, ${selectedAddress.city}`
    : 'Add a pickup address';

  const handleConfirm = () => {
    if (!itemRange || !timeSlot || !isAddressServiceable) {
      return;
    }

    const details = {
      itemRange,
      pickupDate,
      timeSlot,
      deliveryType,
      instructions: instructions.trim(),
      address: existing?.address ?? addressText,
    };

    if (existing) {
      dispatch(updateSchedule({ id: existing.id, ...details }));
      navigation.popTo('ScheduleDetails', { scheduleId: existing.id, justBooked: true });
      return;
    }

    const now = new Date().toISOString();
    const schedule: PickupSchedule = {
      id: generateScheduleId(),
      serviceName: fromCart
        ? cart.items.map(i => i.service.name).join(', ') || 'Laundry Pickup'
        : serviceName ?? 'Laundry Pickup',
      items: fromCart
        ? cart.items.map(i => ({ name: i.service.name, quantity: i.quantity, unit: i.service.unit }))
        : [],
      status: 'SCHEDULED',
      createdAt: now,
      updatedAt: now,
      ...details,
    };

    dispatch(addSchedule(schedule));
    if (fromCart) {
      cart.clear();
    }

    navigation.reset({
      index: 1,
      routes: [
        { name: 'MainTab', params: { screen: 'Home' } },
        { name: 'ScheduleDetails', params: { scheduleId: schedule.id, justBooked: true } },
      ],
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <AppHeader
        title={isModifying ? 'Modify Pickup' : 'Schedule Pickup'}
        subtitle={existing?.serviceName ?? serviceName}
      />

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.content, { paddingBottom: 110 + bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <AppCard style={styles.addressCard}>
          <View style={styles.row}>
            <Icon name="location-outline" size={20} color={colors.primary} />
            <View style={styles.addressText}>
              <AppText variant="caption" color={colors.textSecondary}>
                Pickup Address
              </AppText>
              <AppText variant="label" color={colors.text} bold numberOfLines={1}>
                {existing?.address ?? addressText}
              </AppText>
            </View>
            {!isModifying && (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Change pickup address"
                onPress={() =>
                  selectedAddress
                    ? navigation.navigate('AddressSelection', { isCheckoutFlow: false })
                    : navigation.navigate('AddAddress', {})
                }
                style={styles.changeBtn}>
                <AppText variant="label" color={colors.primary} bold>
                  {selectedAddress ? 'Change' : 'Add'}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </AppCard>

        {!isModifying && selectedAddress && !serviceability?.isServiceable && (
          <ServiceabilityBanner result={serviceability} style={styles.serviceabilityBanner} />
        )}

        {/* Step 1: how many clothes */}
        <AppText variant="h4" color={colors.text} bold style={styles.stepTitle}>
          How many clothes?
        </AppText>
        <AppText variant="caption" color={colors.textSecondary} style={styles.stepCaption}>
          An estimate is fine. We count every piece at pickup.
        </AppText>

        <View style={styles.rangeGrid}>
          {ITEM_RANGES.map(range => {
            const isSelected = range.id === itemRange;
            return (
              <TouchableOpacity
                key={range.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  if (!itemRange) {
                    revealNextStep();
                  }
                  setItemRange(range.id);
                }}
                style={[styles.rangeCard, isSelected && styles.optionSelected]}>
                <AppText variant="h4" color={isSelected ? colors.primary : colors.text} bold>
                  {range.label}
                </AppText>
                <AppText variant="caption" color={colors.textSecondary}>
                  {range.caption}
                </AppText>
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Icon name="checkmark" size={14} color={colors.textWhite} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Step 2: pickup date and time */}
        {itemRange && (
          <>
            <AppText variant="h4" color={colors.text} bold style={styles.stepTitle}>
              Pickup date
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateRow}>
              {dates.map(d => {
                const isSelected = d.dateString === pickupDate;
                const textColor = isSelected ? colors.textWhite : colors.text;
                return (
                  <TouchableOpacity
                    key={d.dateString}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={`${d.weekday} ${d.day} ${d.month}`}
                    onPress={() => setPickupDate(d.dateString)}
                    style={[styles.dateChip, isSelected && styles.dateChipSelected]}>
                    <AppText variant="caption" color={isSelected ? colors.textWhite : colors.textSecondary}>
                      {d.weekday}
                    </AppText>
                    <AppText variant="h3" color={textColor} bold>
                      {d.day}
                    </AppText>
                    <AppText variant="caption" color={textColor}>
                      {d.month}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <AppText variant="h4" color={colors.text} bold style={styles.stepTitle}>
              Pickup time
            </AppText>
            {SCHEDULE_TIME_SLOTS.map(slot => {
              const isSelected = slot.id === timeSlot;
              return (
                <TouchableOpacity
                  key={slot.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    if (!timeSlot) {
                      revealNextStep();
                    }
                    setTimeSlot(slot.id);
                  }}
                  style={[styles.optionRow, isSelected && styles.optionSelected]}>
                  <Icon name="time-outline" size={20} color={isSelected ? colors.primary : colors.textSecondary} />
                  <AppText variant="body" color={colors.text} semiBold={isSelected} style={styles.optionLabel}>
                    {slot.label}
                  </AppText>
                  <Icon
                    name={isSelected ? 'radio-on' : 'radio-off'}
                    size={22}
                    color={isSelected ? colors.primary : colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* Step 3: instructions and delivery speed */}
        {itemRange && timeSlot && (
          <>
            {showInstructions ? (
              <View style={styles.instructionsBox}>
                <AppText variant="label" color={colors.text} bold>
                  Instructions
                </AppText>
                <TextInput
                  value={instructions}
                  onChangeText={setInstructions}
                  placeholder="e.g. Ring the bell twice, handle silk sarees with care"
                  placeholderTextColor={colors.textMuted}
                  maxLength={INSTRUCTIONS_MAX}
                  multiline
                  style={styles.instructionsInput}
                />
                <AppText variant="caption" color={colors.textMuted} align="right">
                  {instructions.length}/{INSTRUCTIONS_MAX}
                </AppText>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowInstructions(true)}
                accessibilityRole="button"
                style={styles.addInstructions}>
                <Icon name="document-text-outline" size={20} color={colors.primary} />
                <AppText variant="label" color={colors.primary} bold style={styles.optionLabel}>
                  Add instructions
                </AppText>
                <Icon name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}

            <AppText variant="h4" color={colors.text} bold style={styles.stepTitle}>
              Delivery type
            </AppText>
            {DELIVERY_TYPES.map(type => {
              const isSelected = type.id === deliveryType;
              return (
                <TouchableOpacity
                  key={type.id}
                  disabled={!type.available}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected, disabled: !type.available }}
                  onPress={() => setDeliveryType(type.id)}
                  style={[
                    styles.optionRow,
                    isSelected && styles.optionSelected,
                    !type.available && styles.optionDisabled,
                  ]}>
                  <Icon
                    name="truck-outline"
                    size={20}
                    color={type.available ? colors.primary : colors.disabledText}
                  />
                  <View style={styles.optionLabel}>
                    <AppText variant="body" color={type.available ? colors.text : colors.disabledText} semiBold>
                      {type.label}
                    </AppText>
                    <AppText variant="caption" color={type.available ? colors.textSecondary : colors.disabledText}>
                      {type.caption}
                    </AppText>
                  </View>
                  {type.available ? (
                    <Icon
                      name={isSelected ? 'radio-on' : 'radio-off'}
                      size={22}
                      color={isSelected ? colors.primary : colors.textMuted}
                    />
                  ) : (
                    <View style={styles.slotFullBadge}>
                      <AppText variant="caption" color={colors.error} bold>
                        Slot Full
                      </AppText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: spacing.md + bottom }]}>
        <AppButton
          title={isModifying ? 'Save Changes' : 'Confirm Schedule'}
          size="lg"
          disabled={!canConfirm}
          onPress={handleConfirm}
        />
      </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressCard: {
    marginBottom: spacing.sm,
  },
  addressText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  changeBtn: {
    paddingVertical: spacing.xs,
    paddingLeft: spacing.md,
  },
  serviceabilityBanner: {
    marginTop: spacing.xs,
  },
  stepTitle: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  stepCaption: {
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
  },
  rangeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rangeCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    minHeight: 76,
  },
  checkBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  optionDisabled: {
    backgroundColor: colors.divider,
  },
  dateRow: {
    paddingVertical: spacing.xs,
  },
  dateChip: {
    width: 64,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dateChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
  },
  optionLabel: {
    flex: 1,
    marginLeft: spacing.md,
  },
  slotFullBadge: {
    backgroundColor: colors.errorBg,
    borderColor: colors.errorBorder,
    borderWidth: 1,
    borderRadius: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  addInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: spacing.buttonRadius,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primaryLight,
    backgroundColor: colors.surface,
  },
  instructionsBox: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: spacing.cardRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  instructionsInput: {
    minHeight: 80,
    marginTop: spacing.sm,
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
});

export default SchedulePickupScreen;
