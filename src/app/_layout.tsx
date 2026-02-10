import '../styles/global.css';

import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView className="bg-canvas flex-1">
      <Slot />
    </SafeAreaView>
  );
}
