import { useState } from 'react';
import { ScrollView, Text, View, StatusBar } from 'react-native';
import { Input, Logo, Card, FontSlider } from '@/components';
import ButtonSection from './_sections/buttons';

export default function Index() {
  const [inputValue, setInputValue] = useState('');

  return (
    <View className="flex-1 bg-canvas">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1">
        <View className="gap-6 p-6">
          {/* Header */}
          <View className="items-center py-8">
            <Logo className="text-ansi-orange" size={'sm'} />
            <Text className="mt-4 font-mono text-sm text-text-muted">Component Showcase</Text>
          </View>
          {/* Colors Section */}
          <Card title="COLOR PALETTE">
            <View className="gap-3">
              <View className="flex-row gap-2">
                <View className="h-12 flex-1 items-center justify-center bg-primary">
                  <Text className="font-mono text-xs text-primary-foreground">PRIMARY</Text>
                </View>
                <View className="h-12 flex-1 items-center justify-center bg-secondary">
                  <Text className="font-mono text-xs text-secondary-foreground">SECONDARY</Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <View className="h-12 flex-1 items-center justify-center bg-accent">
                  <Text className="font-mono text-xs text-accent-foreground">ACCENT</Text>
                </View>
                <View className="h-12 flex-1 items-center justify-center bg-destructive">
                  <Text className="font-mono text-xs text-destructive-foreground">DESTRUCTIVE</Text>
                </View>
              </View>
              <View className="flex-row gap-2">
                <View className="h-12 flex-1 items-center justify-center bg-success">
                  <Text className="font-mono text-xs text-success-foreground">SUCCESS</Text>
                </View>
                <View className="h-12 flex-1 items-center justify-center bg-warning">
                  <Text className="font-mono text-xs text-warning-foreground">WARNING</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Buttons Section */}
          <ButtonSection />

          {/* Input Section */}
          <Card title="INPUT FIELDS">
            <View className="gap-3">
              <Input
                placeholder="Enter your name..."
                value={inputValue}
                onChangeText={setInputValue}
              />
              <Input placeholder="Email address..." />
              <Input placeholder="Password..." secureTextEntry />
            </View>
          </Card>

          {/* Typography Section */}
          <Card title="TYPOGRAPHY">
            <View className="gap-2">
              <Text className="font-mono text-2xl font-bold text-foreground">Heading 1</Text>
              <Text className="font-mono text-xl font-bold text-foreground">Heading 2</Text>
              <Text className="font-mono text-lg font-bold text-foreground">Heading 3</Text>
              <Text className="font-mono text-base text-text">Body text with regular weight</Text>
              <Text className="font-mono text-sm text-text-muted">
                Muted text for secondary information
              </Text>
              <Text className="font-mono text-xs text-text-subtle">
                Subtle text for tertiary information
              </Text>
            </View>
          </Card>

          {/* Font Weights Section */}
          <Card title="FONT WEIGHTS">
            <FontSlider />
          </Card>

          {/* Surface Levels Section */}
          <Card title="SURFACE LEVELS">
            <View className="gap-3">
              <View className="border border-border bg-background p-4">
                <Text className="font-mono text-xs text-foreground">BACKGROUND</Text>
              </View>
              <View className="border border-border bg-canvas p-4">
                <Text className="font-mono text-xs text-foreground">CANVAS</Text>
              </View>
              <View className="border border-border bg-overlay p-4">
                <Text className="font-mono text-xs text-foreground">OVERLAY</Text>
              </View>
              <View className="border border-border bg-subtle p-4">
                <Text className="font-mono text-xs text-foreground">SUBTLE</Text>
              </View>
            </View>
          </Card>

          {/* ANSI Colors Section */}
          <Card title="ANSI COLORS">
            <View className="gap-2">
              <View className="flex-row flex-wrap gap-2">
                <View className="h-10 w-10 items-center justify-center bg-ansi-black">
                  <Text className="font-mono text-[8px] text-white">BLK</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center bg-ansi-red">
                  <Text className="font-mono text-[8px] text-black">RED</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center bg-ansi-green">
                  <Text className="font-mono text-[8px] text-black">GRN</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center bg-ansi-yellow">
                  <Text className="font-mono text-[8px] text-black">YEL</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center bg-ansi-blue">
                  <Text className="font-mono text-[8px] text-black">BLU</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center bg-ansi-magenta">
                  <Text className="font-mono text-[8px] text-black">MAG</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center bg-ansi-cyan">
                  <Text className="font-mono text-[8px] text-black">CYN</Text>
                </View>
                <View className="h-10 w-10 items-center justify-center bg-ansi-white">
                  <Text className="font-mono text-[8px] text-black">WHT</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Info Card */}
          <View className="border border-info bg-info/10 p-4">
            <Text className="font-mono text-sm text-info">
              ℹ This is a complete showcase of your design system using the global.css theme
              configuration.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
