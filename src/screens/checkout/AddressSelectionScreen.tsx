import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppButton from '../../components/common/AppButton';
import AddressCard from '../../components/cards/AddressCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import EmptyState from '../../components/states/EmptyState';
import Icon from '../../components/common/Icon';
import { addressApi } from '../../services/api/addressApi';
import { Address } from '../../types/address';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { setSelectedAddress, setSavedAddresses } from '../../store/slices/locationSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'AddressSelection'>;

export const AddressSelectionScreen: React.FC<Props> = ({ route, navigation }) => {
  const isCheckoutFlow = route.params?.isCheckoutFlow ?? false;

  const dispatch = useAppDispatch();
  const selectedAddress = useAppSelector(state => state.location.selectedAddress);
  const addresses = useAppSelector(state => state.location.savedAddresses);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const list = await addressApi.getAddresses();
      dispatch(setSavedAddresses(list));
    } catch (err) {
      console.warn('Error fetching addresses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (addr: Address) => {
    dispatch(setSelectedAddress(addr));
    if (isCheckoutFlow) {
      navigation.navigate('PickupSlot');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={isCheckoutFlow ? 'Select Pickup Address' : 'Saved Addresses'} />

      {loading ? (
        <SkeletonLoader count={3} />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AddressCard
              address={item}
              isSelected={selectedAddress?.id === item.id}
              onSelect={() => handleSelect(item)}
              onEdit={() => navigation.navigate('AddAddress', { addressToEdit: item })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              iconName="location-outline"
              title="No Saved Addresses"
              message="Please add a pickup address to continue with your laundry booking."
              buttonTitle="Add New Address"
              onButtonPress={() => navigation.navigate('AddAddress', {})}
            />
          }
        />
      )}

      <View style={styles.footer}>
        <AppButton
          title="Add New Address"
          variant="outline"
          size="lg"
          icon={<Icon name="add" size={20} color={colors.primary} />}
          onPress={() => navigation.navigate('AddAddress', {})}
          style={styles.addBtn}
        />

        {isCheckoutFlow && selectedAddress && (
          <AppButton
            title="Deliver to Selected Address"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('PickupSlot')}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: 120,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    padding: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  addBtn: {
    marginBottom: spacing.sm,
  },
});

export default AddressSelectionScreen;
