import type { NavigatorScreenParams } from '@react-navigation/native';
import type { PartType } from '@mpf/shared';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  SearchResults: { query: string };
  ModelDetails: { modelId: number };
  Compatibility: { modelId: number; partType: PartType };
  PartDetails: { partId: number };
  BrandModels: { brandId: number; brandName: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = {
  // placeholder for typed navigation helpers if needed later
  route: { params: RootStackParamList[T] };
};

export type AppParamList = NavigatorScreenParams<RootStackParamList>;
