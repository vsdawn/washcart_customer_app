import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';

export interface DateOption {
  dateString: string;
  label: string;
}

export interface SlotOption {
  date: string;
  timeRange: string;
  isAvailable?: boolean;
}

export interface SlotSelectorProps {
  dates: DateOption[];
  selectedDateStr: string;
  onSelectDate: (dateStr: string) => void;
  slots: SlotOption[];
  selectedTimeRange: string;
  onSelectTimeRange: (timeRange: string) => void;
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({
  dates,
  selectedDateStr,
  onSelectDate,
  slots,
  selectedTimeRange,
  onSelectTimeRange,
}) => {
  return (
    <View style={styles.container}>
      <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
        SELECT DATE
      </AppText>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
        {dates.map(d => {
          const isSelected = d.dateString === selectedDateStr;
          return (
            <TouchableOpacity
              key={d.dateString}
              onPress={() => onSelectDate(d.dateString)}
              style={[
                styles.dateTab,
                isSelected && styles.dateTabSelected,
              ]}>
              <AppText
                variant="label"
                color={isSelected ? colors.textWhite : colors.text}
                bold={isSelected}>
                {d.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <AppText variant="label" color={colors.textSecondary} style={styles.sectionHeader}>
        SELECT TIME WINDOW
      </AppText>

      <View style={styles.slotsGrid}>
        {slots.map(s => {
          const isSelected = s.timeRange === selectedTimeRange;
          const isDisabled = s.isAvailable === false;

          return (
            <TouchableOpacity
              key={s.timeRange}
              disabled={isDisabled}
              onPress={() => onSelectTimeRange(s.timeRange)}
              style={[
                styles.slotPill,
                isSelected && styles.slotPillSelected,
                isDisabled && styles.slotPillDisabled,
              ]}>
              <AppText
                variant="bodySmall"
                color={
                  isDisabled
                    ? colors.disabledText
                    : isSelected
                    ? colors.textWhite
                    : colors.text
                }
                semiBold={isSelected}>
                {s.timeRange}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
  },
  dateScroll: {
    marginBottom: spacing.lg,
  },
  dateTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.md,
    minWidth: 100,
    alignItems: 'center',
  },
  dateTabSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotPill: {
    width: '48%',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  slotPillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotPillDisabled: {
    backgroundColor: colors.disabledBg,
    borderColor: colors.border,
  },
});

export default SlotSelector;
