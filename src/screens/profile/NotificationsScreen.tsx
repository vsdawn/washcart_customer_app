import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { formatDate } from '../../utils/formatters';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import EmptyState from '../../components/states/EmptyState';
import Icon from '../../components/common/Icon';
import { notificationApi } from '../../services/api/notificationApi';
import { AppNotification } from '../../types/notification';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { markNotificationRead, markAllNotificationsRead, setNotifications } from '../../store/slices/notificationSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [notificationsList, setNotificationsList] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const list = await notificationApi.getNotifications();
      setNotificationsList(list);
      dispatch(setNotifications(list));
    } catch (err) {
      console.warn('Error fetching notifications', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAll = async () => {
    await notificationApi.markAllAsRead();
    dispatch(markAllNotificationsRead());
    setNotificationsList(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationPress = async (item: AppNotification) => {
    if (!item.isRead) {
      await notificationApi.markAsRead(item.id);
      dispatch(markNotificationRead(item.id));
      setNotificationsList(prev =>
        prev.map(n => (n.id === item.id ? { ...n, isRead: true } : n))
      );
    }

    if (item.orderId) {
      navigation.navigate('OrderDetails', { orderId: item.orderId });
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        title="Notification Center"
        rightAction={
          <TouchableOpacity onPress={handleMarkAll}>
            <AppText variant="label" color={colors.primary} bold>
              Mark All Read
            </AppText>
          </TouchableOpacity>
        }
      />

      {loading ? (
        <SkeletonLoader count={4} />
      ) : (
        <FlatList
          data={notificationsList}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <AppCard
              onPress={() => handleNotificationPress(item)}
              outlined={!item.isRead}
              style={[
                styles.card,
                !item.isRead ? { backgroundColor: colors.primaryBg, borderColor: colors.primaryLight } : undefined,
              ]}>
              <View style={styles.row}>
                <View style={styles.iconCircle}>
                  <Icon
                    name={
                      item.category === 'Order'
                        ? 'truck-outline'
                        : item.category === 'Payment'
                        ? 'card-outline'
                        : 'pricetag-outline'
                    }
                    size={20}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.textGroup}>
                  <View style={styles.titleRow}>
                    <AppText variant="label" color={colors.text} bold style={styles.title}>
                      {item.title}
                    </AppText>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>
                  <AppText variant="bodySmall" color={colors.textSecondary} style={styles.body}>
                    {item.body}
                  </AppText>
                  <AppText variant="caption" color={colors.textMuted} style={styles.date}>
                    {formatDate(item.createdAt)}
                  </AppText>
                </View>
              </View>
            </AppCard>
          )}
          ListEmptyComponent={
            <EmptyState
              iconName="notifications-outline"
              title="No Notifications"
              message="You have no notifications or order updates at this time."
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
  listContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  textGroup: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: spacing.xs,
  },
  body: {
    marginVertical: 4,
    lineHeight: 18,
  },
  date: {
    marginTop: 2,
  },
});

export default NotificationsScreen;
