import * as React from 'react';
import { Pressable, Text, type PressableProps, type TextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'rounded-lg border border-transparent items-center justify-center flex-row web:inline-flex web:whitespace-nowrap web:transition-all web:outline-none web:select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary active:bg-primary/80',
        outline:
          'border-border bg-background active:bg-muted dark:bg-input/30 dark:border-input dark:active:bg-input/50',
        secondary: 'bg-secondary active:bg-secondary/80',
        ghost: 'active:bg-muted dark:active:bg-muted/50',
        destructive:
          'bg-destructive/10 active:bg-destructive/20 dark:bg-destructive/20 dark:active:bg-destructive/30',
        link: 'bg-transparent',
      },
      size: {
        default: 'h-10 gap-1.5 px-2.5',
        xs: 'h-6 gap-1 rounded-[10px] px-2',
        sm: 'h-8 gap-1 rounded-xl px-2.5',
        lg: 'h-11 gap-1.5 px-3',
        icon: 'h-10 w-10',
        'icon-xs': 'h-6 w-6 rounded-[10px]',
        'icon-sm': 'h-8 w-8 rounded-xl',
        'icon-lg': 'h-11 w-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const textVariants = cva('text-sm font-medium text-center', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      destructive: 'text-destructive',
      link: 'text-primary web:underline web:underline-offset-4',
    },
    size: {
      default: 'text-sm',
      xs: 'text-xs',
      sm: 'text-[13px]',
      lg: 'text-base',
      icon: 'text-sm',
      'icon-xs': 'text-xs',
      'icon-sm': 'text-xs',
      'icon-lg': 'text-base',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

interface ButtonProps
  extends Omit<PressableProps, 'children' | 'disabled'>, VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  disabled?: boolean;
}

interface ButtonTextProps extends TextProps, VariantProps<typeof textVariants> {}

function Button({
  className,
  variant = 'default',
  size = 'default',
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size }),
        disabled && 'opacity-50 web:pointer-events-none',
        className
      )}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        {
          opacity: pressed && !disabled ? 0.8 : 1,
        },
      ]}
      {...props}>
      {children}
    </Pressable>
  );
}

function ButtonText({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonTextProps) {
  return <Text className={cn(textVariants({ variant, size }), className)} {...props} />;
}

export { Button, ButtonText, buttonVariants, textVariants };
