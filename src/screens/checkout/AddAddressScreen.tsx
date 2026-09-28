import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootStackParamList } from '../../types/navigation';
import { addressSchema, AddressFormData, AddressFormInput } from '../../validation/addressSchemas';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppInput from '../../components/common/AppInput';
import AppButton from '../../components/common/AppButton';
import Icon from '../../components/common/Icon';
import { addressApi } from '../../services/api/addressApi';
import LocationService, { LocationError } from '../../services/location/locationService';
import { checkServiceability, getAddressServiceability, ServiceabilityResult } from '../../constants/serviceAreas';
import { LocationCoordinates } from '../../types/address';
import ServiceabilityBanner from '../../components/common/ServiceabilityBanner';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addAddressSuccess } from '../../store/slices/locationSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'AddAddress'>;

export const AddAddressScreen: React.FC<Props> = ({ route, navigation }) => {
  const { addressToEdit } = route.params || {};
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  // undefined = not checked yet, null = could not be located
  const [serviceability, setServiceability] = useState<ServiceabilityResult | null | undefined>(
    addressToEdit ? getAddressServiceability(addressToEdit) : undefined
  );
  // Coordinates we already know, and the area/pincode they belong to. If the user edits either
  // field afterwards, the address is geocoded again on save.
  const [knownLocation, setKnownLocation] = useState<{
    coords: LocationCoordinates;
    area: string;
    pincode: string;
  } | null>(
    addressToEdit?.latitude != null && addressToEdit.longitude != null
      ? {
          coords: { latitude: addressToEdit.latitude, longitude: addressToEdit.longitude },
          area: addressToEdit.area,
          pincode: addressToEdit.pincode,
        }
      : null
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormInput, unknown, AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: addressToEdit?.fullName || 'Vishal Singh',
      mobileNumber: addressToEdit?.mobileNumber || '9876543210',
      houseFlat: addressToEdit?.houseFlat || 'Flat 1202, Tower 4',
      building: addressToEdit?.building || 'Prestige Lakeside Habitat',
      street: addressToEdit?.street || 'Varthur Main Road',
      area: addressToEdit?.area || 'Whitefield',
      city: addressToEdit?.city || 'Bengaluru',
      state: addressToEdit?.state || 'Karnataka',
      pincode: addressToEdit?.pincode || '560087',
      landmark: addressToEdit?.landmark || 'Near Lake Signal',
      addressType: addressToEdit?.addressType || 'Home',
      isDefault: addressToEdit?.isDefault || false,
    },
  });

  const selectedType = watch('addressType');

  const handleFetchCurrentLocation = async () => {
    try {
      setGpsLoading(true);
      setApiError(null);
      const coords = await LocationService.getCurrentLocation();
      setServiceability(checkServiceability(coords));

      const parts = await LocationService.reverseGeocode(coords).catch(() => null);
      if (parts) {
        // Overwrite every field so nothing stale is left from a previous location; blanks are
        // flagged by validation for the user to fill in
        (['street', 'area', 'city', 'state', 'pincode'] as const).forEach(field => {
          setValue(field, parts[field], { shouldValidate: true });
        });
      }
      setKnownLocation({ coords, area: parts?.area ?? watch('area'), pincode: parts?.pincode ?? watch('pincode') });
    } catch (err) {
      setApiError(
        err instanceof LocationError
          ? err.code === 'PERMISSION_DENIED'
            ? 'Location permission is off. Allow it in Settings, or type your address below.'
            : err.message
          : 'Could not get your location. Please type your address below.'
      );
    } finally {
      setGpsLoading(false);
    }
  };

  const resolveCoordinates = async (data: AddressFormData): Promise<LocationCoordinates | null> => {
    if (knownLocation && knownLocation.area === data.area && knownLocation.pincode === data.pincode) {
      return knownLocation.coords;
    }
    return LocationService.geocodeAddress(data);
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      setLoading(true);
      setApiError(null);

      let coords: LocationCoordinates | null;
      try {
        coords = await resolveCoordinates(data);
      } catch {
        setApiError('Could not check your location. Check your internet connection and try again.');
        return;
      }
      if (!coords) {
        setServiceability(undefined);
        setApiError("We couldn't find this address on the map. Check the area and pincode, or use your current location.");
        return;
      }

      const result = checkServiceability(coords);
      setServiceability(result);
      setKnownLocation({ coords, area: data.area, pincode: data.pincode });
      if (!result.isServiceable) {
        setApiError('This address is outside our service area, so it cannot be saved.');
        return;
      }

      const location = { latitude: coords.latitude, longitude: coords.longitude };
      if (addressToEdit) {
        const updated = await addressApi.updateAddress(addressToEdit.id, { ...data, ...location });
        dispatch(addAddressSuccess(updated));
      } else {
        const created = await addressApi.addAddress({
          ...data,
          ...location,
          userId: 'usr_101',
        });
        dispatch(addAddressSuccess(created));
      }
      navigation.goBack();
    } catch (err: any) {
      setApiError(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={addressToEdit ? 'Edit Address' : 'Add New Address'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={handleFetchCurrentLocation}
            disabled={gpsLoading}
            style={styles.gpsBanner}>
            <Icon name="location-outline" size={20} color={colors.primary} />
            <AppText variant="label" color={colors.primary} bold style={styles.gpsText}>
              {gpsLoading ? 'Detecting current location...' : 'Use Current Location'}
            </AppText>
          </TouchableOpacity>

          {serviceability !== undefined && (
            <ServiceabilityBanner result={serviceability} style={styles.serviceability} />
          )}

          <Controller
            control={control}
            name="fullName"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Full Name"
                placeholder="Vishal Singh"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.fullName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="mobileNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Contact Mobile Number"
                placeholder="98765 43210"
                keyboardType="phone-pad"
                maxLength={10}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.mobileNumber?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="houseFlat"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="House / Flat / Door Number"
                placeholder="Flat 1202, Tower 4"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.houseFlat?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="building"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Building / Apartment / Villa Name"
                placeholder="Prestige Lakeside Habitat"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.building?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="street"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Street / Locality"
                placeholder="Varthur Main Road"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.street?.message}
              />
            )}
          />

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Controller
                control={control}
                name="area"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Area"
                    placeholder="Whitefield"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.area?.message}
                  />
                )}
              />
            </View>

            <View style={styles.halfInput}>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="City"
                    placeholder="Bengaluru"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.city?.message}
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="State"
                    placeholder="Karnataka"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.state?.message}
                  />
                )}
              />
            </View>

            <View style={styles.halfInput}>
              <Controller
                control={control}
                name="pincode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    label="Pincode"
                    placeholder="560087"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.pincode?.message}
                  />
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="landmark"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Landmark (Optional)"
                placeholder="Near Varthur Lake Signal"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <AppText variant="label" color={colors.text} style={styles.typeLabel}>
            Save Address As
          </AppText>

          <View style={styles.typeRow}>
            {(['Home', 'Work', 'Other'] as const).map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => setValue('addressType', type)}
                style={[
                  styles.typePill,
                  selectedType === type && styles.typePillSelected,
                ]}>
                <AppText
                  variant="label"
                  color={selectedType === type ? colors.textWhite : colors.text}
                  bold={selectedType === type}>
                  {type}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {apiError && (
            <AppText variant="caption" color={colors.error} style={styles.apiError}>
              {apiError}
            </AppText>
          )}

          <AppButton
            title="Save Address"
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
    paddingBottom: spacing.xxl,
  },
  gpsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryBg,
    padding: spacing.md,
    borderRadius: spacing.buttonRadius,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  gpsText: {
    marginLeft: spacing.xs,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  typeLabel: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  typePill: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.buttonRadius,
    backgroundColor: colors.inputBg,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  typePillSelected: {
    backgroundColor: colors.primary,
  },
  apiError: {
    marginBottom: spacing.sm,
  },
  serviceability: {
    marginBottom: spacing.md,
  },
  saveBtn: {
    marginTop: spacing.md,
  },
});

export default AddAddressScreen;
