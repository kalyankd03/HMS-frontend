import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@hms/design-tokens/native';

interface SafeAreaValues {
  top: number;
  bottom: number;
  left: number;
  right: number;
  paddingTop: number;
  paddingBottom: number;
  paddingLeft: number;
  paddingRight: number;
}

export const useSafeArea = (): SafeAreaValues => {
  const insets = useSafeAreaInsets();
  
  return {
    top: insets.top,
    bottom: insets.bottom,
    left: insets.left,
    right: insets.right,
    paddingTop: Math.max(insets.top, theme.spacing.semantic.safeArea.top),
    paddingBottom: Math.max(insets.bottom, theme.spacing.semantic.safeArea.bottom),
    paddingLeft: Math.max(insets.left, theme.spacing.semantic.safeArea.left),
    paddingRight: Math.max(insets.right, theme.spacing.semantic.safeArea.right),
  };
};