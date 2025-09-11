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
import { theme, semanticColors, semanticSpacing, componentShadows } from '@hms/design-tokens/native';

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
          color={variant === 'primary' ? semanticColors.background : semanticColors.primary}
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
    minHeight: semanticSpacing.touchTarget.minimum,
  },
  
  // Variants
  primary: {
    backgroundColor: semanticColors.primary,
    ...componentShadows.button,
  },
  
  secondary: {
    backgroundColor: semanticColors.surface,
    borderWidth: theme.borders.width.thin,
    borderColor: semanticColors.border,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.thin,
    borderColor: semanticColors.primary,
  },
  
  ghost: {
    backgroundColor: 'transparent',
  },
  
  destructive: {
    backgroundColor: semanticColors.error,
    ...componentShadows.button,
  },
  
  // Sizes
  sm: {
    paddingHorizontal: semanticSpacing.buttonPadding.sm.horizontal,
    paddingVertical: semanticSpacing.buttonPadding.sm.vertical,
    minHeight: theme.spacing[10],
  },
  
  md: {
    paddingHorizontal: semanticSpacing.buttonPadding.md.horizontal,
    paddingVertical: semanticSpacing.buttonPadding.md.vertical,
  },
  
  lg: {
    paddingHorizontal: semanticSpacing.buttonPadding.lg.horizontal,
    paddingVertical: semanticSpacing.buttonPadding.lg.vertical,
    minHeight: theme.spacing[12],
  },
  
  // Text styles
  text: {
    fontWeight: theme.typography.textStyles.button.fontWeight,
    textAlign: 'center',
  },
  
  primaryText: {
    color: semanticColors.background,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  secondaryText: {
    color: semanticColors.text,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  outlineText: {
    color: semanticColors.primary,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  ghostText: {
    color: semanticColors.text,
    fontSize: theme.typography.textStyles.button.fontSize,
  },
  
  destructiveText: {
    color: semanticColors.background,
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