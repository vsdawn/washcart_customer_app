import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthStackParamList } from '../../types/navigation';
import { otpSchema, OTPFormData } from '../../validation/authSchemas';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatPhone } from '../../utils/formatters';
import AppText from '../../components/common/AppText';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import { authApi } from '../../services/api/authApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { loginSuccess } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<AuthStackParamList, 'OTPVerification'>;

export const OTPVerificationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { mobileNumber } = route.params;
  const dispatch = useAppDispatch();

  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '123456', // Pre-filled default OTP for seamless demo execution
    },
  });

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      setResending(true);
      setApiError(null);
      await authApi.sendOTP(mobileNumber);
      setTimer(30);
    } catch (err: any) {
      setApiError(err.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: OTPFormData) => {
    try {
      setLoading(true);
      setApiError(null);
      const res = await authApi.verifyOTP(mobileNumber, data.otp);
      dispatch(loginSuccess({ user: res.user, token: res.token }));

      if (!res.user.isProfileComplete) {
        navigation.navigate('ProfileSetup', { mobileNumber });
      } else {
        // Reset root stack to MainTab
        const parentNav = navigation.getParent();
        if (parentNav) {
          parentNav.reset({
            index: 0,
            routes: [{ name: 'MainTab' }],
          });
        }
      }
    } catch (err: any) {
      setApiError(err.message || 'Invalid OTP. Please enter 123456');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="OTP Verification" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <AppText variant="h2" color={colors.text} bold style={styles.title}>
              Verify Mobile Number
            </AppText>

            <View style={styles.mobileRow}>
              <AppText variant="body" color={colors.textSecondary}>
                Enter 6-digit code sent to{' '}
                <AppText variant="body" color={colors.text} bold>
                  {formatPhone(mobileNumber)}
                </AppText>
              </AppText>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.changeBtn}>
                <AppText variant="label" color={colors.primary} bold>
                  Change
                </AppText>
              </TouchableOpacity>
            </View>

            <Controller
              control={control}
              name="otp"
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label="6-Digit OTP"
                  placeholder="1 2 3 4 5 6"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.otp?.message}
                  hint="Demo OTP: 123456"
                />
              )}
            />

            {apiError && (
              <AppText variant="caption" color={colors.error} style={styles.apiError}>
                {apiError}
              </AppText>
            )}

            <View style={styles.timerRow}>
              {timer > 0 ? (
                <AppText variant="bodySmall" color={colors.textSecondary}>
                  Resend OTP in{' '}
                  <AppText variant="bodySmall" color={colors.primary} bold>
                    00:{timer < 10 ? `0${timer}` : timer}
                  </AppText>
                </AppText>
              ) : (
                <TouchableOpacity disabled={resending} onPress={handleResend}>
                  <AppText variant="label" color={colors.primary} bold>
                    {resending ? 'Sending...' : 'Resend OTP'}
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <AppButton
              title="Verify & Continue"
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
  mobileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  changeBtn: {
    marginLeft: spacing.xs,
  },
  timerRow: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  apiError: {
    marginBottom: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});

export default OTPVerificationScreen;
