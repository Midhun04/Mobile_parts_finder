import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getPopularBrands, getRecentlyAddedModels } from '../api/compatibilityApi';
import { ModelCard } from '../components/ModelCard';
import { ErrorState, LoadingState } from '../components/QueryState';
import { SearchBar } from '../components/SearchBar';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const brandsQuery = useQuery({
    queryKey: ['brands', 'popular'],
    queryFn: getPopularBrands,
  });

  const recentQuery = useQuery({
    queryKey: ['mobile-models', 'recent'],
    queryFn: getRecentlyAddedModels,
  });

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigation.navigate('SearchResults', { query: trimmed });
  };

  if (brandsQuery.isLoading || recentQuery.isLoading) {
    return <LoadingState />;
  }

  if (brandsQuery.isError || recentQuery.isError) {
    return (
      <ErrorState
        message={
          brandsQuery.error?.message ||
          recentQuery.error?.message ||
          'Unable to reach the API.'
        }
      />
    );
  }

  const popularBrands = brandsQuery.data ?? [];
  const recentModels = recentQuery.data ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandRowHeader}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="cover"
            accessibilityLabel="Parts Finder"
          />
          <View style={styles.brandText}>
            <Text style={styles.brandName}>
              <Text style={styles.brandParts}>PARTS</Text>
              <Text style={styles.brandFinder}> FINDER</Text>
            </Text>
            <Text style={styles.brandTagline}>Find. Match. Repair.</Text>
          </View>
        </View>

        <Text style={styles.heading}>Find compatible{'\n'}spare parts</Text>
        <Text style={styles.lede}>
          Search by phone model or part number — works both ways.
        </Text>

        <View style={styles.searchBlock}>
          <SearchBar value={query} onChangeText={setQuery} onSubmit={handleSearch} />
        </View>

        <Text style={styles.sectionTitle}>Popular brands</Text>
        <View style={styles.brandRow}>
          {popularBrands.map((brand) => (
            <Pressable
              key={brand.id}
              onPress={() =>
                navigation.navigate('BrandModels', {
                  brandId: brand.id,
                  brandName: brand.name,
                })
              }
              style={({ pressed }) => [styles.brandChip, pressed && styles.pressed]}
            >
              <Text style={styles.brandChipText}>{brand.name}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recently added</Text>
        {recentModels.map((model) => (
          <ModelCard
            key={model.id}
            model={model}
            onPress={() => navigation.navigate('ModelDetails', { modelId: model.id })}
          />
        ))}

        <View style={styles.tip}>
          <Text style={styles.tipTitle}>Two-way search</Text>
          <Text style={styles.tipBody}>
            Try “A50” for models, or “BN-59” for a battery and its compatible phones.
          </Text>
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
  },
  brandRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
  },
  brandText: {
    flex: 1,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  brandParts: {
    color: colors.brandBlue,
  },
  brandFinder: {
    color: colors.brandGreen,
  },
  brandTagline: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 38,
  },
  lede: {
    marginTop: 8,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  searchBlock: {
    marginTop: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  brandRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 28,
  },
  brandChip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  brandChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  tip: {
    marginTop: 12,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
  },
  tipTitle: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 6,
  },
  tipBody: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    lineHeight: 20,
  },
});
