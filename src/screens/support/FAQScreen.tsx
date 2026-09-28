import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import AppHeader from '../../components/common/AppHeader';
import AppText from '../../components/common/AppText';
import AppCard from '../../components/common/AppCard';
import SkeletonLoader from '../../components/states/SkeletonLoader';
import Icon from '../../components/common/Icon';
import { supportApi } from '../../services/api/supportApi';
import { FAQItem } from '../../types/support';

type Props = NativeStackScreenProps<RootStackParamList, 'FAQ'>;

export const FAQScreen: React.FC<Props> = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>('faq_1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const list = await supportApi.getFAQs();
      setFaqs(list);
    } catch (err) {
      console.warn('Error loading FAQs', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Frequently Asked Questions" />

      {loading ? (
        <SkeletonLoader count={4} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {faqs.map(item => {
            const isExpanded = expandedId === item.id;
            return (
              <AppCard key={item.id} style={styles.card}>
                <TouchableOpacity
                  onPress={() => setExpandedId(isExpanded ? null : item.id)}
                  style={styles.headerRow}>
                  <AppText variant="h4" color={colors.text} bold style={styles.question}>
                    {item.question}
                  </AppText>
                  <Icon
                    name={isExpanded ? 'chevron-down' : 'chevron-forward'}
                    size={20}
                    color={colors.primary}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.answerBox}>
                    <AppText variant="bodySmall" color={colors.textSecondary} style={styles.answerText}>
                      {item.answer}
                    </AppText>
                  </View>
                )}
              </AppCard>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.screenPaddingHorizontal,
    paddingBottom: spacing.xxl,
  },
  card: {
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    flex: 1,
    marginRight: spacing.sm,
  },
  answerBox: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  answerText: {
    lineHeight: 20,
  },
});

export default FAQScreen;
