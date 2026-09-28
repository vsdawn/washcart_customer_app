import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import OrderCard from '../../components/cards/OrderCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import EmptyState from '../../components/states/EmptyState';
import { orderApi } from '../../services/api/orderApi';
import { Order } from '../../types/order';
import { useCart } from '../../hooks/useCart';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Orders'>,
  NativeStackScreenProps<RootStackParamList>
>;

type FilterTab = 'Active' | 'Completed' | 'Cancelled';

export const OrdersScreen: React.FC<Props> = ({ navigation }) => {
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState<FilterTab>('Active');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const list = await orderApi.getOrders(activeTab);
      setOrders(list);
    } catch (err) {
      console.warn('Error loading orders', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleRepeatOrder = (order: Order) => {
    order.items.forEach(it => {
      if (it.serviceDetails) {
        addItem(it.serviceDetails, it.quantity);
      }
    });
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.container}>
      <AppHeader title="My Laundry Orders" showBack={false} />

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {(['Active', 'Completed', 'Cancelled'] as FilterTab[]).map(tab => {
          const isSelected = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabBtn, isSelected && styles.tabBtnActive]}>
              <AppText
                variant="label"
                color={isSelected ? colors.primary : colors.textSecondary}
                bold={isSelected}>
                {tab}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <SkeletonLoader count={3} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => navigation.navigate('OrderDetails', { orderId: item.id })}
              onTrackOrder={() => navigation.navigate('OrderTracking', { orderId: item.id })}
              onRepeatOrder={() => handleRepeatOrder(item)}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              iconName="receipt-outline"
              title={`No ${activeTab} Orders`}
              message={`You do not have any ${activeTab.toLowerCase()} orders at the moment.`}
              buttonTitle="Book New Laundry Order"
              onButtonPress={() => navigation.navigate('Home')}
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPaddingHorizontal,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  listContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
  },
});

export default OrdersScreen;
