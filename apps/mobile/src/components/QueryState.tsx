import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { API_BASE_URL } from '../api/client';

type Props = {
  message?: string;
};

export function LoadingState({ message = 'Loading…' }: Props) {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

export function ErrorState({ message }: Props) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Couldn’t load data</Text>
      <Text style={styles.message}>
        {message ?? 'Check that the API is running and reachable.'}
      </Text>
      <Text style={styles.meta}>API: {API_BASE_URL}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  meta: {
    marginTop: 12,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
