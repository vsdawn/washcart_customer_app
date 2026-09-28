import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList, RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatCurrency } from '../../utils/formatters';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import LocationSelector from '../../components/checkout/LocationSelector';
import SearchBar from '../../components/common/SearchBar';
import CategoryCard from '../../components/cards/CategoryCard';
import ServiceCard from '../../components/cards/ServiceCard';
import BannerCarousel from '../../components/cards/BannerCarousel';
import OrderCard from '../../components/cards/OrderCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import NetworkBanner from '../../components/common/NetworkBanner';
import Icon from '../../components/common/Icon';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useCart } from '../../hooks/useCart';
import { serviceApi } from '../../services/api/serviceApi';
import { orderApi } from '../../services/api/orderApi';
import { ServiceCategory, LaundryService } from '../../types/service';
import { Order } from '../../types/order';
import { setOrders } from '../../store/slices/orderSlice';
import { selectUpcomingSchedules } from '../../store/slices/scheduleSlice';
import { NextSlotCard, ScheduledPickupCard, SectionDivider } from '../../components/cards/ScheduleCard';
import ServiceabilityBanner from '../../components/common/ServiceabilityBanner';
import AppButton from '../../components/common/AppButton';
import { getAddressServiceability } from '../../constants/serviceAreas';

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const selectedAddress = useAppSelector(state => state.location.selectedAddress);
  const unreadNotifs = useAppSelector(state => state.notification.unreadCount);
  const upcomingSchedules = useAppSelector(selectUpcomingSchedules);
  const addressServiceability = selectedAddress ? getAddressServiceability(selectedAddress) : null;

  const { items, summary, addItem, updateItemQuantity, getItemQuantity } = useCart();

  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [popularServices, setPopularServices] = useState<LaundryService[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [cats, popular, orders] = await Promise.all([
        serviceApi.getCategories(),
        serviceApi.getPopularServices(),
        orderApi.getOrders('Active'),
      ]);
      setCategories(cats);
      setPopularServices(popular);
      setRecentOrders(orders.slice(0, 2));
      dispatch(setOrders(orders));
    } catch (err) {
      console.warn('Error loading home data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim().length > 0) {
      navigation.navigate('CategoryDetails', {
        categorySlug: 'search',
        categoryName: `Search: "${searchQuery}"`,
      });
    }
  };

  const userFirstName = user?.firstName || 'Valued Customer';

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <NetworkBanner />

      <LocationSelector
        address={selectedAddress}
        onPressLocation={() => navigation.navigate('AddressSelection', { isCheckoutFlow: false })}
        onPressNotification={() => navigation.navigate('Notifications')}
        unreadNotificationCount={unreadNotifs}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary]} />
        }>
        {/* Greeting section */}
        <View style={styles.greetingSection}>
          <AppText variant="h2" color={colors.text} bold>
            Good morning, {userFirstName} 👋
          </AppText>
          <AppText variant="bodySmall" color={colors.textSecondary} style={styles.greetingSub}>
            Let us handle your laundry & dry cleaning today.
          </AppText>
        </View>

        {/* Search bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmit={handleSearchSubmit}
            placeholder="Search laundry, dry cleaning & more..."
          />
        </View>

        {/* Pickup scheduling */}
        <View style={styles.scheduleSection}>
          <SectionDivider label={upcomingSchedules.length > 0 ? 'UPCOMING PICKUPS' : 'SCHEDULE A PICKUP'} />
          {upcomingSchedules.length > 0 ? (
            upcomingSchedules.map(schedule => (
              <ScheduledPickupCard
                key={schedule.id}
                schedule={schedule}
                onView={() => navigation.navigate('ScheduleDetails', { scheduleId: schedule.id })}
              />
            ))
          ) : !selectedAddress || addressServiceability?.isServiceable ? (
            <NextSlotCard onSchedule={() => navigation.navigate('SchedulePickup', {})} />
          ) : (
            <>
              <ServiceabilityBanner result={addressServiceability} />
              <AppButton
                title="Change Address"
                variant="outline"
                onPress={() => navigation.navigate('AddressSelection', { isCheckoutFlow: false })}
                style={styles.changeAddressBtn}
              />
            </>
          )}
        </View>

        {loading ? (
          <SkeletonLoader count={2} />
        ) : (
          <>
            {/* Horizontal Service categories */}
            <View style={styles.sectionHeader}>
              <AppText variant="h3" color={colors.text} bold>
                Our Services
              </AppText>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}>
              {categories.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onPress={() =>
                    navigation.navigate('CategoryDetails', {
                      categorySlug: cat.slug,
                      categoryName: cat.name,
                    })
                  }
                />
              ))}
            </ScrollView>

            {/* Banner Carousel */}
            <BannerCarousel
              onBannerPress={banner => {
                navigation.navigate('CouponList', { isSelectionMode: true });
              }}
            />

            {/* Popular Services */}
            <View style={styles.sectionHeader}>
              <AppText variant="h3" color={colors.text} bold>
                Popular Services
              </AppText>
              <TouchableOpacity onPress={() => navigation.navigate('Offers')}>
                <AppText variant="label" color={colors.primary} bold>
                  Offers
                </AppText>
              </TouchableOpacity>
            </View>

            <View style={styles.popularList}>
              {popularServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  quantity={getItemQuantity(service.id)}
                  onAddToCart={() => addItem(service)}
                  onUpdateQuantity={newQty => updateItemQuantity(service.id, newQty)}
                  onPressDetails={() => navigation.navigate('ServiceDetails', { service })}
                />
              ))}
            </View>

            {/* How It Works section */}
            <View style={styles.howItWorksCard}>
              <AppText variant="h3" color={colors.text} bold align="center" style={styles.sectionTitle}>
                How WashKart Works
              </AppText>

              <View style={styles.stepsRow}>
                <View style={styles.stepCol}>
                  <View style={styles.stepCircle}>
                    <Icon name="time-outline" size={24} color={colors.primary} />
                  </View>
                  <AppText variant="label" color={colors.text} bold align="center" style={styles.stepText}>
                    1. Schedule Pickup
                  </AppText>
                </View>

                <View style={styles.stepDivider} />

                <View style={styles.stepCol}>
                  <View style={styles.stepCircle}>
                    <Icon name="water-outline" size={24} color={colors.primary} />
                  </View>
                  <AppText variant="label" color={colors.text} bold align="center" style={styles.stepText}>
                    2. We Clean
                  </AppText>
                </View>

                <View style={styles.stepDivider} />

                <View style={styles.stepCol}>
                  <View style={styles.stepCircle}>
                    <Icon name="truck-outline" size={24} color={colors.primary} />
                  </View>
                  <AppText variant="label" color={colors.text} bold align="center" style={styles.stepText}>
                    3. We Deliver
                  </AppText>
                </View>
              </View>
            </View>

            {/* Recent Orders section if available */}
            {recentOrders.length > 0 && (
              <View style={styles.recentOrdersSection}>
                <View style={styles.sectionHeader}>
                  <AppText variant="h3" color={colors.text} bold>
                    Active Orders
                  </AppText>
                  <TouchableOpacity onPress={() => navigation.navigate('Orders')}>
                    <AppText variant="label" color={colors.primary} bold>
                      View All
                    </AppText>
                  </TouchableOpacity>
                </View>

                {recentOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                    onTrackOrder={() => navigation.navigate('OrderTracking', { orderId: order.id })}
                  />
                ))}
              </View>
            )}

            {/* Trust section */}
            <AppCard style={styles.trustCard}>
              <AppText variant="h3" color={colors.text} bold style={styles.trustTitle}>
                Why Choose WashKart?
              </AppText>
              <View style={styles.trustRow}>
                <Icon name="shield-checkmark-outline" size={20} color={colors.success} />
                <AppText variant="bodySmall" color={colors.textSecondary} style={styles.trustText}>
                  Verified laundry partners & eco-friendly detergents
                </AppText>
              </View>
              <View style={styles.trustRow}>
                <Icon name="footsteps-outline" size={20} color={colors.success} />
                <AppText variant="bodySmall" color={colors.textSecondary} style={styles.trustText}>
                  Garment level tagging & digital barcode tracking
                </AppText>
              </View>
              <View style={styles.trustRow}>
                <Icon name="time-outline" size={20} color={colors.success} />
                <AppText variant="bodySmall" color={colors.textSecondary} style={styles.trustText}>
                  On-time doorstep pickup & 24hr delivery guarantee
                </AppText>
              </View>
            </AppCard>
          </>
        )}
      </ScrollView>

      {/* Floating Bottom Cart Bar */}
      {items.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('Cart')}
          style={styles.floatingCartBar}>
          <View>
            <AppText variant="label" color={colors.textWhite} bold>
              {summary.itemsCount} {summary.itemsCount === 1 ? 'ITEM' : 'ITEMS'} ADDED
            </AppText>
            <AppText variant="h3" color={colors.textWhite} bold>
              {formatCurrency(summary.total)}
            </AppText>
          </View>

          <View style={styles.cartAction}>
            <AppText variant="label" color={colors.textWhite} bold style={styles.viewCartText}>
              VIEW CART
            </AppText>
            <Icon name="chevron-forward" size={18} color={colors.textWhite} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scheduleSection: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  changeAddressBtn: {
    marginTop: spacing.sm,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  greetingSection: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    backgroundColor: colors.surface,
  },
  greetingSub: {
    marginTop: 2,
  },
  searchSection: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPaddingHorizontal,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  popularList: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
  },
  howItWorksCard: {
    marginHorizontal: spacing.screenPaddingHorizontal,
    marginVertical: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: spacing.cardRadius,
  },
  sectionTitle: {
    marginBottom: spacing.lg,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepCol: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  stepText: {
    fontSize: 11,
  },
  stepDivider: {
    width: 16,
    height: 2,
    backgroundColor: colors.border,
    marginBottom: 20,
  },
  recentOrdersSection: {
    marginBottom: spacing.md,
  },
  trustCard: {
    marginHorizontal: spacing.screenPaddingHorizontal,
    marginBottom: spacing.xl,
  },
  trustTitle: {
    marginBottom: spacing.sm,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs + 2,
  },
  trustText: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  floatingCartBar: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.screenPaddingHorizontal,
    right: spacing.screenPaddingHorizontal,
    backgroundColor: colors.primary,
    borderRadius: spacing.cardRadius,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.shadowStrong,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cartAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    marginRight: 4,
  },
});

export default HomeScreen;
