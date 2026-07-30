import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PartType } from '@mpf/shared';
import { getModelById, getPartsForModel } from '../api/compatibilityApi';
import { ErrorState, LoadingState } from '../components/QueryState';
import { PartCategoryRow } from '../components/PartCategoryRow';
import type { RootStackParamList } from '../navigation/types';
import { formatModelName } from '../utils/format';
import type { AppColors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ModelDetails'>;

export function ModelDetailsScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const modelId = route.params.modelId;

  const modelQuery = useQuery({
    queryKey: ['mobile-models', modelId],
    queryFn: () => getModelById(modelId),
  });

  const partsQuery = useQuery({
    queryKey: ['mobile-models', modelId, 'parts'],
    queryFn: () => getPartsForModel(modelId),
  });

  if (modelQuery.isLoading || partsQuery.isLoading) {
    return <LoadingState />;
  }

  if (modelQuery.isError || partsQuery.isError) {
    return (
      <ErrorState
        message={modelQuery.error?.message || partsQuery.error?.message}
      />
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

  const parts = partsQuery.data ?? [];
  const grouped = parts.reduce<Partial<Record<PartType, number>>>((acc, part) => {
    acc[part.type] = (acc[part.type] ?? 0) + 1;
    return acc;
  }, {});
  const categories = Object.entries(grouped) as [PartType, number][];

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.brand}>{model.brand.name}</Text>
          <Text style={styles.title}>{formatModelName(model)}</Text>
          {model.modelNumber ? (
            <Text style={styles.meta}>Model number: {model.modelNumber}</Text>
          ) : null}
          {model.releaseYear ? (
            <Text style={styles.meta}>Released: {model.releaseYear}</Text>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Compatible parts</Text>
        {categories.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No parts linked to this model yet.</Text>
          </View>
        ) : (
          categories.map(([type, count]) => (
            <PartCategoryRow
              key={type}
              type={type}
              count={count}
              onPress={() =>
                navigation.navigate('Compatibility', {
                  modelId: model.id,
                  partType: type,
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  hero: {
    backgroundColor: colors.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },
  brand: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 10,
  },
  meta: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
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
