import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { searchAll } from '../api/compatibilityApi';
import { ModelCard } from '../components/ModelCard';
import { PartCard } from '../components/PartCard';
import { ErrorState, LoadingState } from '../components/QueryState';
import { SearchBar } from '../components/SearchBar';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'SearchResults'>;

export function SearchResultsScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState(route.params.query);
  const [activeQuery, setActiveQuery] = useState(route.params.query);

  const resultsQuery = useQuery({
    queryKey: ['search', activeQuery],
    queryFn: () => searchAll(activeQuery),
    enabled: activeQuery.trim().length > 0,
  });

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setActiveQuery(trimmed);
  };

  const results = resultsQuery.data ?? { models: [], parts: [] };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <View style={styles.searchWrap}>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmit={handleSearch}
          autoFocus
        />
      </View>

      {resultsQuery.isLoading ? (
        <LoadingState />
      ) : resultsQuery.isError ? (
        <ErrorState message={resultsQuery.error.message} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.meta}>Results for “{activeQuery}”</Text>

          {results.models.length === 0 && results.parts.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>No matches found</Text>
              <Text style={styles.emptyBody}>
                Try a brand, model name, model number, or part number like BN-59.
              </Text>
            </View>
          ) : null}

          {results.models.length > 0 ? (
            <>
              <Text style={styles.sectionTitle}>Mobile models</Text>
              {results.models.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onPress={() => navigation.navigate('ModelDetails', { modelId: model.id })}
                />
              ))}
            </>
          ) : null}

          {results.parts.length > 0 ? (
            <>
              <Text style={[styles.sectionTitle, results.models.length > 0 && styles.sectionGap]}>
                Spare parts
              </Text>
              {results.parts.map((part) => (
                <PartCard
                  key={part.id}
                  part={part}
                  onPress={() => navigation.navigate('PartDetails', { partId: part.id })}
                />
              ))}
            </>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  sectionGap: {
    marginTop: 18,
  },
  empty: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
