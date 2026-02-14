import { useState } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { fontFamily } from '@/styles/styles';

const weights = [
  { key: 'thin', label: 'Thin (100)', font: fontFamily.thin },
  { key: 'extraLight', label: 'ExtraLight (200)', font: fontFamily.extraLight },
  { key: 'light', label: 'Light (300)', font: fontFamily.light },
  { key: 'regular', label: 'Regular (400)', font: fontFamily.regular },
  { key: 'medium', label: 'Medium (500)', font: fontFamily.medium },
  { key: 'semiBold', label: 'SemiBold (600)', font: fontFamily.semiBold },
  { key: 'bold', label: 'Bold (700)', font: fontFamily.bold },
  { key: 'extraBold', label: 'ExtraBold (800)', font: fontFamily.extraBold },
];

export function FontSlider() {
  const [selectedIndex, setSelectedIndex] = useState(3);

  const currentWeight = weights[selectedIndex];

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="font-mono text-sm text-text-muted">{currentWeight.label}</Text>
        <Text style={{ fontFamily: currentWeight.font }} className="text-2xl text-foreground">
          The quick brown fox jumps over the lazy dog
        </Text>
        <Text style={{ fontFamily: currentWeight.font }} className="text-base text-text-muted">
          0123456789 !@#$%^&*()
        </Text>
      </View>

      <View className="gap-2">
        <Slider
          minimumValue={0}
          maximumValue={weights.length - 1}
          step={1}
          value={selectedIndex}
          onValueChange={setSelectedIndex}
          minimumTrackTintColor="#6BA4FF"
          maximumTrackTintColor="#3C4057"
          thumbTintColor="#6BA4FF"
        />
        <View className="flex-row justify-between px-1">
          <Text className="font-mono text-xs text-text-subtle">Thin</Text>
          <Text className="font-mono text-xs text-text-subtle">ExtraBold</Text>
        </View>
      </View>
    </View>
  );
}
