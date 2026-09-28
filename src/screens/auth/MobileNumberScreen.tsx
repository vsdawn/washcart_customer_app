import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../types/navigation';
import { mobileSchema, MobileFormData } from '../../validation/authSchemas';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppText from '../../components/common/AppText';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { authApi } from '../../services/api/authApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { setOtpSent } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'MobileNumber'>;

export const MobileNumberScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MobileFormData>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobileNumber: '9876543210', // Pre-filled default for effortless demo testing
    },
  });

  const onSubmit = async (data: MobileFormData) => {
    try {
      setLoading(true);
      setApiError(null);
      await authApi.sendOTP(data.mobileNumber);
      dispatch(setOtpSent(data.mobileNumber));
      navigation.navigate('OTPVerification', { mobileNumber: data.mobileNumber });
    } catch (err: any) {
      setApiError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Sign In or Register" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <AppText variant="h2" color={colors.text} bold style={styles.title}>
              Enter Mobile Number
            </AppText>
            <AppText variant="body" color={colors.textSecondary} style={styles.subtitle}>
              We will send a 6-digit one-time password (OTP) for verification.
            </AppText>

            <Controller
              control={control}
              name="mobileNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="Mobile Number"
                  placeholder="98765 43210"
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.mobileNumber?.message}
                  leftIcon={
                    <View style={styles.countryCode}>
                      <AppText variant="body" color={colors.text} bold>
                        🇮🇳 +91
                      </AppText>
                    </View>
                  }
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
              title="Continue"
              variant="primary"
              size="lg"
              loading={loading}
              onPress={() => handleSubmit(onSubmit)()}
            />

            <AppText variant="caption" color={colors.textMuted} align="center" style={styles.terms}>
              By continuing, you agree to WashKart's Terms of Service & Privacy Policy.
            </AppText>
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
  countryCode: {
    paddingRight: spacing.sm,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    marginRight: spacing.sm,
  },
  apiError: {
    marginBottom: spacing.md,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  terms: {
    marginTop: spacing.md,
    lineHeight: 16,
  },
});

export default MobileNumberScreen;
