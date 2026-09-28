import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../types/navigation';
import { profileSchema, ProfileFormData } from '../../validation/profileSchemas';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../../components/common/AppText';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { authApi } from '../../services/api/authApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { updateUser } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'ProfileSetup'>;

export const ProfileSetupScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mobileNumber } = route.params;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'Vishal',
      lastName: 'Sharma',
      email: 'vishal.sharma@example.com',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setApiError(null);
      const updated = await authApi.completeProfile({
        ...data,
        mobileNumber,
      });
      dispatch(updateUser(updated));

      const parentNav = navigation.getParent();
      if (parentNav) {
        parentNav.reset({
          index: 0,
          routes: [{ name: 'MainTab' }],
        });
      }
    } catch (err: any) {
      setApiError(err.message || 'Failed to complete profile setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile Setup" showBack={false} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <AppText variant="h2" color={colors.text} bold style={styles.title}>
              Welcome to WashKart! 🎉
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
              Please tell us your name so we can personalize your laundry service.
            </AppText>

            <Controller
              control={control}
              name="firstName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="First Name"
                  placeholder="Vishal"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.firstName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="lastName"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Last Name"
                  placeholder="Sharma"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.lastName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Email Address"
                  placeholder="vishal.sharma@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  hint="Receipts & order invoices will be sent to this email"
                />
              )}
            />

            {apiError && (
              <AppText variant="caption" color={colors.error} style={styles.apiError}>
                {apiError}
              </AppText>
            )}
          </View>

          <View style={styles.footer}>
            <AppButton
              title="Save & Start Booking"
              variant="primary"
              size="lg"
              loading={loading}
              onPress={() => handleSubmit(onSubmit)()}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.screenPaddingHorizontal,
    justifyContent: 'space-between',
  },
  content: {
    paddingTop: spacing.lg,
  },
  title: {
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  apiError: {
    marginBottom: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});

export default ProfileSetupScreen;
