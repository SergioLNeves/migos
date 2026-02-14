import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center gap-4 bg-canvas p-6">
        <Text className="font-mono text-6xl font-bold text-primary">404</Text>
        <Text className="font-mono text-lg text-text-muted">página não encontrada</Text>
        <Link href="/" className="mt-4 font-mono text-sm text-accent underline">
          voltar ao início
        </Link>
      </View>
    </>
  );
}
