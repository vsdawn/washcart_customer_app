import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import SearchBar from '../../components/common/SearchBar';
import ServiceCard from '../../components/cards/ServiceCard';
import EmptyState from '../../components/states/EmptyState';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import { serviceApi } from '../../services/api/serviceApi';
import { LaundryService } from '../../types/service';
import { useCart } from '../../hooks/useCart';

type Props = NativeStackScreenProps<RootStackParamList, 'CategoryDetails'>;

export const CategoryDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { categorySlug, categoryName } = route.params;
  const { addItem, updateItemQuantity, getItemQuantity } = useCart();

  const [services, setServices] = useState<LaundryService[]>([]);
  const [filteredServices, setFilteredServices] = useState<LaundryService[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [categorySlug]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices(services);
    } else {
      const q = searchQuery.toLowerCase().trim();
      setFilteredServices(
        services.filter(
          s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, services]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      let list: LaundryService[];
      if (categorySlug === 'search') {
        list = await serviceApi.searchServices(categoryName.replace('Search: "', '').replace('"', ''));
      } else {
        list = await serviceApi.getServicesByCategory(categorySlug);
      }
      setServices(list);
      setFilteredServices(list);
    } catch (err) {
      console.warn('Error fetching services', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={categoryName} />

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={`Filter services in ${categoryName}...`}
        />
      </View>

      {loading ? (
        <SkeletonLoader count={4} />
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ServiceCard
              service={item}
              quantity={getItemQuantity(item.id)}
              onAddToCart={() => addItem(item)}
              onUpdateQuantity={newQty => updateItemQuantity(item.id, newQty)}
              onPressDetails={() => navigation.navigate('ServiceDetails', { service: item })}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              iconName="search-outline"
              title="No services found"
              message="We couldn't find any services matching your selection."
              buttonTitle="Browse All Services"
              onButtonPress={() => navigation.goBack()}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  listContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
  },
});

export default CategoryDetailsScreen;
