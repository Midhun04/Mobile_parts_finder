import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQueries, useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPartTypeLabel } from '@mpf/shared';
import {
  getCompatibleModelsForPart,
  getModelById,
  getPartsForModel,
} from '../api/compatibilityApi';
import { ErrorState, LoadingState } from '../components/QueryState';
import type { RootStackParamList } from '../navigation/types';
import { formatModelName } from '../utils/format';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Compatibility'>;

export function CompatibilityScreen({ navigation, route }: Props) {
  const { modelId, partType } = route.params;

  const modelQuery = useQuery({
    queryKey: ['mobile-models', modelId],
    queryFn: () => getModelById(modelId),
  });

  const partsQuery = useQuery({
    queryKey: ['mobile-models', modelId, 'parts', partType],
    queryFn: () => getPartsForModel(modelId, partType),
  });

  const parts = partsQuery.data ?? [];

  const compatibleQueries = useQueries({
    queries: parts.map((part) => ({
      queryKey: ['parts', part.id, 'compatible-models'],
      queryFn: () => getCompatibleModelsForPart(part.id),
      enabled: partsQuery.isSuccess,
    })),
  });

  const loading =
    modelQuery.isLoading ||
    partsQuery.isLoading ||
    compatibleQueries.some((q) => q.isLoading);

  if (loading) {
    return <LoadingState />;
  }

  if (modelQuery.isError || partsQuery.isError) {
    return (
      <ErrorState message={modelQuery.error?.message || partsQuery.error?.message} />
    );
  }

  const model = modelQuery.data;
  if (!model) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.missing}>
          <Text style={styles.missingText}>Model not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>{getPartTypeLabel(partType)} compatibility</Text>
        <Text style={styles.heading}>Selected: {formatModelName(model)}</Text>

        {parts.map((part, index) => {
          const compatibleModels = compatibleQueries[index]?.data ?? [];
          return (
            <View key={part.id} style={styles.card}>
              <Pressable onPress={() => navigation.navigate('PartDetails', { partId: part.id })}>
                <Text style={styles.partName}>{part.name}</Text>
                {part.partNumber ? (
                  <Text style={styles.partNumber}>Part #: {part.partNumber}</Text>
                ) : null}
              </Pressable>

              <Text style={styles.subheading}>Compatible models</Text>
              {compatibleModels.map((row) => (
                <Pressable
                  key={row.model.id}
                  onPress={() =>
                    navigation.navigate('ModelDetails', { modelId: row.model.id })
                  }
                  style={styles.modelRow}
                >
                  <Text style={styles.check}>✓</Text>
                  <View style={styles.modelInfo}>
                    <Text style={styles.modelName}>{formatModelName(row.model)}</Text>
                    {row.notes ? <Text style={styles.note}>{row.notes}</Text> : null}
                  </View>
                  <View
                    style={[
                      styles.badge,
                      row.verified ? styles.verified : styles.unverified,
                    ]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        row.verified ? styles.verifiedText : styles.unverifiedText,
                      ]}
                    >
                      {row.verified ? 'Verified' : 'Unverified'}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          );
        })}
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
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 18,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  partName: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  partNumber: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  subheading: {
    marginTop: 16,
    marginBottom: 10,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  modelRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  check: {
    color: colors.primary,
    fontWeight: '800',
    marginRight: 10,
    marginTop: 2,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  note: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  verified: {
    backgroundColor: colors.verifiedBg,
  },
  unverified: {
    backgroundColor: colors.unverifiedBg,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  verifiedText: {
    color: colors.verified,
  },
  unverifiedText: {
    color: colors.unverified,
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
