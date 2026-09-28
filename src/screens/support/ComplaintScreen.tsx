import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootStackParamList } from '../../types/navigation';
import { complaintSchema, ComplaintFormData } from '../../validation/supportSchemas';
import { IssueType } from '../../types/support';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import { supportApi } from '../../services/api/supportApi';

type Props = NativeStackScreenProps<RootStackParamList, 'Complaint'>;

const ISSUE_TYPES: IssueType[] = [
  'Missing item',
  'Damaged item',
  'Stain',
  'Wrong item',
  'Late delivery',
  'Payment issue',
  'Other',
];

export const ComplaintScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId = 'ord_1001' } = route.params || {};
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ComplaintFormData>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      orderId,
      issueType: 'Stain',
      description: 'Stain noticed on shirt collar after steam press delivery.',
    },
  });

  const selectedIssue = watch('issueType');

  const onSubmit = async (data: ComplaintFormData) => {
    try {
      setSubmitting(true);
      const res = await supportApi.createComplaint(data);
      Alert.alert(
        'Complaint Ticket Submitted! 🎫',
        `Ticket #${res.ticketNumber} created. Our support team will investigate and call you within 2 hours.`
      );
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit complaint ticket');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Raise Complaint Ticket" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <AppCard style={styles.card}>
          <AppText variant="h3" color={colors.text} bold>
            Report an Issue with Order
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.subtitle}>
            Order ID: #{orderId}
          </AppText>

          {/* Issue Type Selector */}
          <AppText variant="label" color={colors.text} style={styles.typeLabel}>
            Select Issue Type
          </AppText>

          <View style={styles.typesGrid}>
            {ISSUE_TYPES.map(type => {
              const isSelected = selectedIssue === type;
              return (
                <TouchableOpacity
                  key={type}
                  onPress={() => setValue('issueType', type)}
                  style={[
                    styles.typeChip,
                    isSelected && styles.typeChipSelected,
                  ]}>
                  <AppText
                    variant="bodySmall"
                    color={isSelected ? colors.textWhite : colors.text}
                    bold={isSelected}>
                    {type}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Detailed Description */}
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Detailed Description"
                placeholder="Describe what went wrong with your garment or delivery..."
                multiline
                numberOfLines={4}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                inputStyle={styles.textArea}
              />
            )}
          />

          {/* Upload Image Placeholder */}
          <TouchableOpacity
            onPress={() => Alert.alert('Upload Photo', 'Simulated garment photo upload attached.')}
            style={styles.uploadBox}>
            <Icon name="pencil-outline" size={24} color={colors.primary} />
            <AppText variant="label" color={colors.primary} bold style={{ marginTop: 4 }}>
              Upload Photo of Garment / Receipt (Optional)
            </AppText>
          </TouchableOpacity>

          <AppButton
            title="Submit Complaint Ticket"
            variant="primary"
            size="lg"
            loading={submitting}
            onPress={() => handleSubmit(onSubmit)()}
            style={styles.submitBtn}
          />
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
  card: {
    marginVertical: spacing.md,
  },
  subtitle: {
    marginVertical: 4,
    marginBottom: spacing.md,
  },
  typeLabel: {
    marginBottom: spacing.sm,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  typeChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
  },
  typeChipSelected: {
    backgroundColor: colors.primary,
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
    borderStyle: 'dashed',
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.primaryBg,
    padding: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
});

export default ComplaintScreen;
