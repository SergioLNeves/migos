import { View, Text } from 'react-native';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <View className={`border border-border bg-card p-4 ${className || ''}`}>
      {title && (
        <Text className="mb-3 font-mono text-base font-bold text-card-foreground">{title}</Text>
      )}
      {children}
    </View>
  );
}
