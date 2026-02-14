import { Text, View } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';

const logoVariants = cva('', {
  variants: {
    size: {
      sm: 'text-xs leading-[1.2]',
      md: 'text-base leading-[1.2]',
      lg: 'text-xl leading-6',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
  },
  defaultVariants: {
    size: 'md',
    align: 'center',
  },
});

const containerVariants = cva('', {
  variants: {
    spacing: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    spacing: 'none',
  },
});

interface LogoProps
  extends VariantProps<typeof logoVariants>, VariantProps<typeof containerVariants> {
  className?: string;
}

export function Logo({ size, align, spacing, className }: LogoProps) {
  return (
    <View className={containerVariants({ spacing })}>
      <Text className={`${logoVariants({ size, align })} ${className || ''}`}>
        ░█▄█░▀█▀░█▀▀░█▀█░█▀▀{'\n'}
        ░█░█░░█░░█░█░█░█░▀▀█{'\n'}
        ░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀▀▀
      </Text>
    </View>
  );
}
