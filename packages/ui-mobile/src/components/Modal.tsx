import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ModalProps as RNModalProps,
  ViewStyle,
  TextStyle,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { theme } from '@hms/design-tokens/native';

const { height: screenHeight } = Dimensions.get('window');

export interface ModalProps extends Omit<RNModalProps, 'children'> {
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  onClose?: () => void;
  showCloseButton?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export interface ModalHeaderProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface ModalBodyProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  title,
  size = 'md',
  onClose,
  showCloseButton = true,
  style,
  contentStyle,
  titleStyle,
  visible = false,
  animationType = 'slide',
  transparent = true,
  ...props
}) => {
  return (
    <RNModal
      visible={visible}
      animationType={animationType}
      transparent={transparent}
      {...props}
    >
      <View style={[styles.overlay, style]}>
        <SafeAreaView style={styles.container}>
          <View style={[styles.content, styles[size], contentStyle]}>
            {(title || showCloseButton) && (
              <View style={styles.header}>
                {title && (
                  <Text style={[styles.title, titleStyle]}>
                    {title}
                  </Text>
                )}
                {showCloseButton && onClose && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={styles.closeButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            <View style={styles.body}>
              {children}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </RNModal>
  );
};

export const ModalHeader: React.FC<ModalHeaderProps> = ({ children, style }) => (
  <View style={[styles.modalHeader, style]}>
    {children}
  </View>
);

export const ModalBody: React.FC<ModalBodyProps> = ({ children, style }) => (
  <View style={[styles.modalBody, style]}>
    {children}
  </View>
);

export const ModalFooter: React.FC<ModalFooterProps> = ({ children, style }) => (
  <View style={[styles.modalFooter, style]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.semantic.componentPadding.md,
  },
  
  content: {
    backgroundColor: theme.colors.semantic.background,
    borderRadius: theme.borders.radius.xl,
    maxHeight: screenHeight * 0.9,
    width: '100%',
    ...theme.shadows.component.modal,
  },
  
  // Sizes
  sm: {
    maxWidth: 320,
    padding: theme.spacing.semantic.componentPadding.sm,
  },
  
  md: {
    maxWidth: 480,
    padding: theme.spacing.semantic.componentPadding.md,
  },
  
  lg: {
    maxWidth: 640,
    padding: theme.spacing.semantic.componentPadding.lg,
  },
  
  full: {
    maxWidth: '100%',
    maxHeight: '100%',
    margin: 0,
    borderRadius: 0,
    padding: theme.spacing.semantic.componentPadding.md,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    borderBottomWidth: theme.borders.width.thin,
    borderBottomColor: theme.colors.semantic.border,
  },
  
  title: {
    fontSize: theme.typography.textStyles.h3.fontSize,
    fontWeight: theme.typography.textStyles.h3.fontWeight,
    color: theme.colors.semantic.text,
    flex: 1,
  },
  
  closeButton: {
    padding: theme.spacing[2],
    marginLeft: theme.spacing[3],
  },
  
  closeButtonText: {
    fontSize: 24,
    color: theme.colors.semantic.textMuted,
    fontWeight: theme.typography.fontWeight.normal,
  },
  
  body: {
    flex: 1,
  },
  
  // Nested component styles
  modalHeader: {
    marginBottom: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    borderBottomWidth: theme.borders.width.thin,
    borderBottomColor: theme.colors.semantic.border,
  },
  
  modalBody: {
    flex: 1,
    marginBottom: theme.spacing[4],
  },
  
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing[3],
    paddingTop: theme.spacing[3],
    borderTopWidth: theme.borders.width.thin,
    borderTopColor: theme.colors.semantic.border,
  },
});