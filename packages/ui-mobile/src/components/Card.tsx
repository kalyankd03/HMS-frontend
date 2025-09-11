import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { theme, semanticColors, semanticSpacing, componentShadows } from '@hms/design-tokens/native';

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
    backgroundColor: semanticColors.background,
    borderRadius: theme.borders.radius.lg,
    ...componentShadows.card,
  },
  
  // Variants
  default: {
    // Default shadow already applied above
  },
  
  outlined: {
    borderWidth: theme.borders.width.thin,
    borderColor: semanticColors.border,
    shadowOpacity: 0, // Remove shadow for outlined variant
    elevation: 0,
  },
  
  elevated: {
    ...componentShadows.cardHover,
  },
  
  // Sizes
  sm: {
    padding: semanticSpacing.cardPadding.sm,
  },
  
  md: {
    padding: semanticSpacing.cardPadding.md,
  },
  
  lg: {
    padding: semanticSpacing.cardPadding.lg,
  },
  
  // Card sections
  header: {
    marginBottom: theme.spacing[4],
  },
  
  title: {
    fontSize: theme.typography.textStyles.h4.fontSize,
    fontWeight: theme.typography.textStyles.h4.fontWeight,
    color: semanticColors.text,
    marginBottom: theme.spacing[2],
  },
  
  description: {
    fontSize: theme.typography.textStyles.bodySmall.fontSize,
    color: semanticColors.textMuted,
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