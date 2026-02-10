import { TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <TextInput
      className={`border border-input bg-background px-4 py-3 font-mono text-sm placeholder:text-muted-foreground ${className || ''}`}
      placeholderTextColor="hsl(229.412, 22.667%, 70.588%)"
      {...props}
    />
  );
}
