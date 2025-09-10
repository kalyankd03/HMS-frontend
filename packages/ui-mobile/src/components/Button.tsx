import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '@hms/design-tokens/native';

export interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const handlePress = (event: any) => {
    if (!disabled && !loading && onPress) {
      onPress(event);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        (disabled || loading) ? styles.disabled : null,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={disabled || loading ? 1 : 0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.semantic.background : theme.colors.semantic.primary}
        />
      ) : (
        <Text
          style={[
            styles.text,
            styles[`${variant}Text` as keyof typeof styles],
            styles[`${size}Text` as keyof typeof styles],
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borders.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: theme.spacing.semantic.touchTarget.minimum,
  },
  
  // Variants
  primary: {
    backgroundColor: theme.colors.semantic.primary,
    ...theme.shadows.component.button,
  },
  
  secondary: {
    backgroundColor: theme.colors.semantic.surface,
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.semantic.border,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.semantic.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  
  destructive: {
    backgroundColor: theme.colors.semantic.error,
    ...theme.shadows.component.button,
  },
  
  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.semantic.buttonPadding.sm.horizontal,
    paddingVertical: theme.spacing.semantic.buttonPadding.sm.vertical,
    minHeight: theme.spacing[10],
  },
  
  md: {
    paddingHorizontal: theme.spacing.semantic.buttonPadding.md.horizontal,
    paddingVertical: theme.spacing.semantic.buttonPadding.md.vertical,
  },
  
  lg: {
    paddingHorizontal: theme.spacing.semantic.buttonPadding.lg.horizontal,
    paddingVertical: theme.spacing.semantic.buttonPadding.lg.vertical,
    minHeight: theme.spacing[12],
  },
  
  // Text styles
  text: {
    fontWeight: theme.typography.textStyles.button.fontWeight,
    textAlign: 'center',
  },
  
  primaryText: {
    color: theme.colors.semantic.background,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  secondaryText: {
    color: theme.colors.semantic.text,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  outlineText: {
    color: theme.colors.semantic.primary,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  ghostText: {
    color: theme.colors.semantic.text,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  destructiveText: {
    color: theme.colors.semantic.background,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  smText: {
    fontSize: theme.typography.textStyles.buttonSmall.fontSize,
  },
  
  mdText: {
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  lgText: {
    fontSize: theme.typography.textStyles.buttonLarge.fontSize,
  },
  
  // States
  disabled: {
    opacity: 0.5,
  },
});