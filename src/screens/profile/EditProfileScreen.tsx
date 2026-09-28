import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootStackParamList } from '../../types/navigation';
import { profileSchema, ProfileFormData } from '../../validation/profileSchemas';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import AppText from '../../components/common/AppText';
import { userApi } from '../../services/api/userApi';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { updateUser } from '../../store/slices/authSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'EditProfile'>;

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || 'Vishal',
      lastName: user?.lastName || 'Sharma',
      email: user?.email || 'vishal.sharma@example.com',
      dateOfBirth: user?.dateOfBirth || '1995-08-15',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setLoading(true);
      setApiError(null);
      const updated = await userApi.updateProfile(data);
      dispatch(updateUser(updated));
      navigation.goBack();
    } catch (err: any) {
      setApiError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Edit Profile" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="First Name"
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
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
              />
            )}
          />

          <AppInput
            label="Mobile Number"
            value={user?.mobileNumber || '9876543210'}
            editable={false}
            hint="Mobile number cannot be edited directly"
          />

          {apiError && (
            <AppText variant="caption" color={colors.error} style={styles.apiError}>
              {apiError}
            </AppText>
          )}

          <AppButton
            title="Save Profile Changes"
            variant="primary"
            size="lg"
            loading={loading}
            onPress={() => handleSubmit(onSubmit)()}
            style={styles.saveBtn}
          />
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
    padding: spacing.screenPaddingHorizontal,
    paddingTop: spacing.lg,
  },
  apiError: {
    marginBottom: spacing.sm,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});

export default EditProfileScreen;
