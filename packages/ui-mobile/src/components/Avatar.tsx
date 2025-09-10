import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { theme } from '@hms/design-tokens/native';

export interface AvatarProps {
  source?: { uri: string } | number;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded' | 'square';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  fallbackStyle?: TextStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  fallback,
  size = 'md',
  variant = 'circle',
  style,
  imageStyle,
  fallbackStyle,
}) => {
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    setHasError(true);
  };

  const sizeStyle = styles[size];
  const variantStyle = styles[variant];

  return (
    <View style={[styles.container, sizeStyle, variantStyle, style]}>
      {source && !hasError ? (
        <Image
          source={source}
          style={[styles.image, sizeStyle, variantStyle, imageStyle]}
          onError={handleError}
        />
      ) : (
        <View style={[styles.fallbackContainer, sizeStyle, variantStyle]}>
          <Text style={[styles.fallbackText, styles[`${size}Text` as keyof typeof styles], fallbackStyle]}>
            {fallback || '?'}
          </Text>
        </View>
      )}
    </View>
  );
};

const avatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondary[100],
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  image: {
    width: '100%',
    height: '100%',
  },
  
  fallbackContainer: {
    backgroundColor: theme.colors.secondary[200],
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  
  fallbackText: {
    color: theme.colors.secondary[700],
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  
  // Sizes
  xs: {
    width: avatarSizes.xs,
    height: avatarSizes.xs,
  },
  
  sm: {
    width: avatarSizes.sm,
    height: avatarSizes.sm,
  },
  
  md: {
    width: avatarSizes.md,
    height: avatarSizes.md,
  },
  
  lg: {
    width: avatarSizes.lg,
    height: avatarSizes.lg,
  },
  
  xl: {
    width: avatarSizes.xl,
    height: avatarSizes.xl,
  },
  
  // Text sizes
  xsText: {
    fontSize: 10,
  },
  
  smText: {
    fontSize: 12,
  },
  
  mdText: {
    fontSize: 14,
  },
  
  lgText: {
    fontSize: 18,
  },
  
  xlText: {
    fontSize: 24,
  },
  
  // Variants
  circle: {
    borderRadius: 9999,
  },
  
  rounded: {
    borderRadius: theme.borders.radius.md,
  },
  
  square: {
    borderRadius: 0,
  },
});