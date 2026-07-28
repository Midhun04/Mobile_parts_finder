import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PART_TYPE_ICONS, PART_TYPE_LABELS } from '@mpf/shared';
import { getCompatibleModelsForPart, getPartById } from '../api/compatibilityApi';
import { ModelCard } from '../components/ModelCard';
import { ErrorState, LoadingState } from '../components/QueryState';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'PartDetails'>;

export function PartDetailsScreen({ navigation, route }: Props) {
  const partId = route.params.partId;

  const partQuery = useQuery({
    queryKey: ['parts', partId],
    queryFn: () => getPartById(partId),
  });

  const modelsQuery = useQuery({
    queryKey: ['parts', partId, 'compatible-models'],
    queryFn: () => getCompatibleModelsForPart(partId),
  });

  if (partQuery.isLoading || modelsQuery.isLoading) {
    return <LoadingState />;
  }

  if (partQuery.isError || modelsQuery.isError) {
    return (
      <ErrorState message={partQuery.error?.message || modelsQuery.error?.message} />
    );
  }

  const part = partQuery.data;
  if (!part) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Part not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const rows = modelsQuery.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.icon}>{PART_TYPE_ICONS[part.type]}</Text>
          <Text style={styles.type}>{PART_TYPE_LABELS[part.type]}</Text>
          <Text style={styles.title}>{part.name}</Text>
          {part.partNumber ? (
            <Text style={styles.meta}>Part number: {part.partNumber}</Text>
          ) : null}
          {part.description ? (
            <Text style={styles.description}>{part.description}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Compatible models</Text>
        {rows.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No compatible models linked yet.</Text>
          </View>
        ) : (
          rows.map((row) => (
            <View key={row.model.id}>
              <ModelCard
                model={row.model}
                onPress={() =>
                  navigation.navigate('ModelDetails', { modelId: row.model.id })
                }
              />
              <View
                style={[
                  styles.status,
                  row.verified ? styles.verified : styles.unverified,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    row.verified ? styles.verifiedText : styles.unverifiedText,
                  ]}
                >
                  {row.verified
                    ? 'Verified compatibility'
                    : 'Unverified — review recommended'}
                  {row.notes ? ` · ${row.notes}` : ''}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 24,
  },
  icon: {
    fontSize: 28,
    marginBottom: 8,
  },
  type: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  meta: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
  },
  description: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  status: {
    marginTop: -4,
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  verified: {
    backgroundColor: colors.verifiedBg,
  },
  unverified: {
    backgroundColor: colors.unverifiedBg,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedText: {
    color: colors.verified,
  },
  unverifiedText: {
    color: colors.unverified,
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  emptyText: {
    color: colors.textSecondary,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingText: {
    color: colors.textSecondary,
  },
});
