import { TextInput, TextInputProps } from 'react-native';
import { cn } from '@/utils/cn';

interface InputProps extends TextInputProps {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'border border-input bg-background px-4 py-3 font-mono text-sm text-foreground',
        className
      )}
      placeholderTextColor="hsl(229.412, 22.667%, 70.588%)"
      {...props}
    />
  );
}
