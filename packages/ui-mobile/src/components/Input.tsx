import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '@hms/design-tokens/native';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helper?: string;
  variant?: 'default' | 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  variant = 'default',
  size = 'md',
  style,
  inputStyle,
  labelStyle,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      <TextInput
        style={[
          styles.input,
          styles[variant],
          styles[size],
          isFocused ? styles.focused : null,
          error ? styles.error : null,
          inputStyle,
        ]}
        placeholderTextColor={theme.colors.semantic.textMuted}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      
      {(error || helper) && (
        <Text style={[
          styles.helper,
          error ? styles.errorText : null,
        ]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  
  label: {
    fontSize: theme.typography.textStyles.label.fontSize,
    fontWeight: theme.typography.textStyles.label.fontWeight,
    color: theme.colors.semantic.text,
    marginBottom: theme.spacing[2],
  },
  
  input: {
    backgroundColor: theme.colors.semantic.background,
    borderRadius: theme.borders.radius.md,
    color: theme.colors.semantic.text,
    fontSize: theme.typography.textStyles.input.fontSize,
    paddingHorizontal: theme.spacing.semantic.componentPadding.md,
    minHeight: theme.spacing.semantic.touchTarget.minimum,
    textAlignVertical: 'center',
  },
  
  // Variants
  default: {
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.semantic.border,
  },
  
  filled: {
    backgroundColor: theme.colors.semantic.surface,
    borderWidth: 0,
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.medium,
    borderColor: theme.colors.semantic.border,
  },
  
  // Sizes
  sm: {
    paddingVertical: theme.spacing[2],
    fontSize: theme.typography.fontSize.sm,
    minHeight: theme.spacing[10],
  },
  
  md: {
    paddingVertical: theme.spacing[3],
    fontSize: theme.typography.fontSize.base,
  },
  
  lg: {
    paddingVertical: theme.spacing[4],
    fontSize: theme.typography.fontSize.lg,
    minHeight: theme.spacing[12],
  },
  
  // States
  focused: {
    borderColor: theme.colors.semantic.borderFocus,
    borderWidth: theme.borders.width.medium,
  },
  
  error: {
    borderColor: theme.colors.semantic.error,
  },
  
  helper: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.semantic.textMuted,
    marginTop: theme.spacing[1],
    paddingHorizontal: theme.spacing[1],
  },
  
  errorText: {
    color: theme.colors.semantic.error,
  },
});