import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@hms/design-tokens/native';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
  textStyle,
}) => {
  return (
    <View
      style={[
        styles.badge,
        styles[variant],
        styles[size],
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`${variant}Text` as keyof typeof styles],
          styles[`${size}Text` as keyof typeof styles],
          textStyle,
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: theme.borders.radius.full,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 20,
  },
  
  text: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  
  // Variants
  default: {
    backgroundColor: theme.colors.semantic.primary,
  },
  
  secondary: {
    backgroundColor: theme.colors.secondary[100],
  },
  
  success: {
    backgroundColor: theme.colors.success[100],
  },
  
  warning: {
    backgroundColor: theme.colors.warning[100],
  },
  
  error: {
    backgroundColor: theme.colors.error[100],
  },
  
  info: {
    backgroundColor: theme.colors.primary[100],
  },
  
  outline: {
    backgroundColor: 'transparent',
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.semantic.border,
  },
  
  // Text colors for variants
  defaultText: {
    color: theme.colors.semantic.background,
  },
  
  secondaryText: {
    color: theme.colors.secondary[800],
  },
  
  successText: {
    color: theme.colors.success[800],
  },
  
  warningText: {
    color: theme.colors.warning[800],
  },
  
  errorText: {
    color: theme.colors.error[800],
  },
  
  infoText: {
    color: theme.colors.primary[800],
  },
  
  outlineText: {
    color: theme.colors.semantic.text,
  },
  
  // Sizes
  sm: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: 2,
    minHeight: 16,
  },
  
  md: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    minHeight: 20,
  },
  
  lg: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[2],
    minHeight: 28,
  },
  
  // Text sizes
  smText: {
    fontSize: theme.typography.fontSize.xs,
  },
  
  mdText: {
    fontSize: theme.typography.fontSize.xs,
  },
  
  lgText: {
    fontSize: theme.typography.fontSize.sm,
  },
});