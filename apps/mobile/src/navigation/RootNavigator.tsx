import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationLightTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { BrandModelsScreen } from '../screens/BrandModelsScreen';
import { CompatibilityScreen } from '../screens/CompatibilityScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ModelDetailsScreen } from '../screens/ModelDetailsScreen';
import { PartDetailsScreen } from '../screens/PartDetailsScreen';
import { SearchResultsScreen } from '../screens/SearchResultsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { getPartTypeLabel } from '@mpf/shared';
import { useTheme } from '../theme/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { colors, isDark } = useTheme();
  const baseTheme = isDark ? NavigationDarkTheme : NavigationLightTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.background,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: '700', color: colors.text },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          statusBarStyle: isDark ? 'light' : 'dark',
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false, statusBarStyle: 'light' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false, statusBarStyle: 'light' }}
        />
        <Stack.Screen
          name="SearchResults"
          component={SearchResultsScreen}
          options={{ title: 'Search results' }}
        />
        <Stack.Screen
          name="ModelDetails"
          component={ModelDetailsScreen}
          options={{ title: 'Model details' }}
        />
        <Stack.Screen
          name="Compatibility"
          component={CompatibilityScreen}
          options={({ route }) => ({
            title: getPartTypeLabel(route.params.partType),
          })}
        />
        <Stack.Screen
          name="PartDetails"
          component={PartDetailsScreen}
          options={{ title: 'Part details' }}
        />
        <Stack.Screen
          name="BrandModels"
          component={BrandModelsScreen}
          options={({ route }) => ({ title: route.params.brandName })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
