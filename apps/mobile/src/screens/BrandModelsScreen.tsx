import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModelCard } from '../components/ModelCard';
import type { RootStackParamList } from '../navigation/types';
import { getModelsByBrand } from '../services/compatibilityService';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'BrandModels'>;

export function BrandModelsScreen({ navigation, route }: Props) {
  const { brandId, brandName } = route.params;
  const models = getModelsByBrand(brandId);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{brandName} models</Text>
        {models.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No models for this brand yet.</Text>
          </View>
        ) : (
          models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onPress={() => navigation.navigate('ModelDetails', { modelId: model.id })}
            />
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
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
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
});
