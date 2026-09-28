import React from 'react';
import { View, StyleSheet } from 'react-native';
import { OrderStatusType, ORDER_STATUS_CONFIG, ORDER_STATUS_TIMELINE_STEPS } from '../../constants/orderStatusConfig';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import Icon from '../common/Icon';

export interface StatusTimelineProps {
  currentStatus: OrderStatusType;
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ currentStatus }) => {
  if (currentStatus === 'CANCELLED') {
    return (
      <View style={styles.cancelledBox}>
        <Icon name="alert-circle-outline" size={24} color={colors.error} />
        <View style={styles.cancelledTextGroup}>
          <AppText variant="h4" color={colors.error} bold>
            Order Cancelled
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary}>
            This order has been cancelled and refund initiated if applicable.
          </AppText>
        </View>
      </View>
    );
  }

  const currentStepIndex = ORDER_STATUS_CONFIG[currentStatus]?.stepIndex || 1;

  return (
    <View style={styles.container}>
      {ORDER_STATUS_TIMELINE_STEPS.map((stepKey, idx) => {
        const stepDetails = ORDER_STATUS_CONFIG[stepKey];
        const isDone = stepDetails.stepIndex <= currentStepIndex;
        const isCurrent = stepDetails.stepIndex === currentStepIndex;
        const isLast = idx === ORDER_STATUS_TIMELINE_STEPS.length - 1;

        return (
          <View key={stepKey} style={styles.stepItem}>
            <View style={styles.leftCol}>
              <View
                style={[
                  styles.nodeCircle,
                  isDone && styles.nodeDone,
                  isCurrent && styles.nodeCurrent,
                ]}>
                {isDone ? (
                  <Icon name="check-circle" size={16} color={colors.textWhite} />
                ) : (
                  <View style={styles.nodeInnerCircle} />
                )}
              </View>

              {!isLast && (
                <View
                  style={[
                    styles.lineConnector,
                    isDone && stepDetails.stepIndex < currentStepIndex && styles.lineDone,
                  ]}
                />
              )}
            </View>

            <View style={styles.rightCol}>
              <AppText
                variant="label"
                color={isCurrent ? colors.primary : isDone ? colors.text : colors.textMuted}
                bold={isCurrent || isDone}>
                {stepDetails.label}
              </AppText>
              <AppText
                variant="caption"
                color={isCurrent ? colors.textSecondary : colors.textMuted}
                style={styles.subtext}>
                {stepDetails.subtext}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  cancelledBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.errorBg,
    padding: spacing.md,
    borderRadius: spacing.cardRadius,
    borderWidth: 1,
    borderColor: colors.errorBorder,
  },
  cancelledTextGroup: {
    marginLeft: spacing.md,
    flex: 1,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 48,
  },
  leftCol: {
    alignItems: 'center',
    width: 28,
  },
  nodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  nodeDone: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  nodeCurrent: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  nodeInnerCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
  },
  lineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: colors.success,
  },
  rightCol: {
    flex: 1,
    marginLeft: spacing.sm,
    paddingBottom: spacing.md,
  },
  subtext: {
    marginTop: 2,
  },
});

export default StatusTimeline;
