import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';

export interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmTitle?: string;
  cancelTitle?: string;
  onConfirm: () => void;
  isDanger?: boolean;
  loading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  title,
  message,
  confirmTitle = 'Confirm',
  cancelTitle = 'Cancel',
  onConfirm,
  isDanger = false,
  loading = false,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.dialogContainer}>
              <AppText variant="h3" color={colors.text} bold style={styles.title}>
                {title}
              </AppText>
              <AppText variant="bodySmall" color={colors.textSecondary} style={styles.message}>
                {message}
              </AppText>

              <View style={styles.actionsRow}>
                <AppButton
                  title={cancelTitle}
                  variant="ghost"
                  size="sm"
                  fullWidth={false}
                  onPress={onClose}
                  style={styles.cancelBtn}
                />
                <AppButton
                  title={confirmTitle}
                  variant={isDanger ? 'danger' : 'primary'}
                  size="sm"
                  fullWidth={false}
                  loading={loading}
                  onPress={onConfirm}
                  style={styles.confirmBtn}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dialogContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
    padding: spacing.xl,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelBtn: {
    marginRight: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  confirmBtn: {
    paddingHorizontal: spacing.xl,
  },
});

export default ConfirmationModal;
