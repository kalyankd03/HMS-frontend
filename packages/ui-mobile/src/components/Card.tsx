import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@hms/design-tokens/native';

export interface CardProps {
  children?: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export interface CardHeaderProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export interface CardContentProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export interface CardFooterProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  style,
}) => {
  return (
    <View
      style={[
        styles.card,
        styles[variant],
        styles[size],
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => (
  <View style={[styles.header, style]}>
    {children}
  </View>
);

export const CardTitle: React.FC<CardTitleProps> = ({ children, style }) => (
  <Text style={[styles.title, style]}>
    {children}
  </Text>
);

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, style }) => (
  <Text style={[styles.description, style]}>
    {children}
  </Text>
);

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <View style={[styles.content, style]}>
    {children}
  </View>
);

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => (
  <View style={[styles.footer, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.semantic.background,
    borderRadius: theme.borders.radius.lg,
    ...theme.shadows.component.card,
  },
  
  // Variants
  default: {
    // Default shadow already applied above
  },
  
  outlined: {
    borderWidth: theme.borders.width.thin,
    borderColor: theme.colors.semantic.border,
    shadowOpacity: 0, // Remove shadow for outlined variant
    elevation: 0,
  },
  
  elevated: {
    ...theme.shadows.component.cardHover,
  },
  
  // Sizes
  sm: {
    padding: theme.spacing.semantic.cardPadding.sm,
  },
  
  md: {
    padding: theme.spacing.semantic.cardPadding.md,
  },
  
  lg: {
    padding: theme.spacing.semantic.cardPadding.lg,
  },
  
  // Card sections
  header: {
    marginBottom: theme.spacing[4],
  },
  
  title: {
    fontSize: theme.typography.textStyles.h4.fontSize,
    fontWeight: theme.typography.textStyles.h4.fontWeight,
    color: theme.colors.semantic.text,
    marginBottom: theme.spacing[2],
  },
  
  description: {
    fontSize: theme.typography.textStyles.bodySmall.fontSize,
    color: theme.colors.semantic.textMuted,
    lineHeight: theme.typography.textStyles.bodySmall.lineHeight * theme.typography.textStyles.bodySmall.fontSize,
  },
  
  content: {
    flex: 1,
  },
  
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: theme.spacing[4],
    gap: theme.spacing[3],
  },
});