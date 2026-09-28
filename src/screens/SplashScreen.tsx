import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import APP_CONFIG from '../config/appConfig';
import AppText from '../components/common/AppText';
import Icon from '../components/common/Icon';
import secureStorage from '../utils/secureStorage';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loginSuccess } from '../store/slices/authSlice';
import { MOCK_USER } from '../mocks/user';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    checkInitialState();
  }, []);

  const checkInitialState = async () => {
    await new Promise<void>(res => setTimeout(res, 1400));
    const token = await secureStorage.getAuthToken();

    if (token) {
      dispatch(loginSuccess({ user: MOCK_USER, token }));
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTab' }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'AuthStack', params: { screen: 'Welcome' } }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoCircle}>
        <Icon name="shirt-outline" size={54} color={colors.surface} />
      </View>

      <AppText variant="display" color={colors.surface} bold style={styles.brandName}>
        {APP_CONFIG.name}
      </AppText>

      <AppText variant="h4" color="rgba(255, 255, 255, 0.9)" style={styles.tagline}>
        {APP_CONFIG.tagline}
      </AppText>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.surface} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  brandName: {
    letterSpacing: 1,
  },
  tagline: {
    marginTop: spacing.xs,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
  },
});

export default SplashScreen;
