import '../styles/global.css';

import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { AuthProvider, useAuth } from '@/providers/auth-context';

function AuthGate() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-canvas">
        <ActivityIndicator color="hsl(24, 100%, 50%)" size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function Layout() {
  useFonts({
    'JetBrainsMono-Thin': require('../../assets/fonts/ttf/JetBrainsMono-Thin.ttf'),
    'JetBrainsMono-ExtraLight': require('../../assets/fonts/ttf/JetBrainsMono-ExtraLight.ttf'),
    'JetBrainsMono-Light': require('../../assets/fonts/ttf/JetBrainsMono-Light.ttf'),
    'JetBrainsMono-Regular': require('../../assets/fonts/ttf/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Medium': require('../../assets/fonts/ttf/JetBrainsMono-Medium.ttf'),
    'JetBrainsMono-SemiBold': require('../../assets/fonts/ttf/JetBrainsMono-SemiBold.ttf'),
    'JetBrainsMono-Bold': require('../../assets/fonts/ttf/JetBrainsMono-Bold.ttf'),
    'JetBrainsMono-ExtraBold': require('../../assets/fonts/ttf/JetBrainsMono-ExtraBold.ttf'),
  });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaView className="flex-1 bg-canvas">
          <AuthGate />
        </SafeAreaView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
