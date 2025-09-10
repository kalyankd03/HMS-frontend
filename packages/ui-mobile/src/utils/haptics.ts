import { Platform } from 'react-native';

// Type definitions for haptic feedback
export type HapticFeedbackType = 
  | 'selection'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'notificationSuccess'
  | 'notificationWarning'
  | 'notificationError';

/**
 * Trigger haptic feedback on supported platforms
 */
export const hapticFeedback = {
  /**
   * Light selection feedback for UI interactions
   */
  selection: () => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').HapticFeedback;
      HapticFeedback?.selectionAsync?.();
    } else if (Platform.OS === 'android') {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      ReactNativeHapticFeedback?.trigger?.('selection');
    }
  },

  /**
   * Light impact feedback
   */
  impactLight: () => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').HapticFeedback;
      HapticFeedback?.impactAsync?.(HapticFeedback.ImpactFeedbackStyle?.Light);
    } else if (Platform.OS === 'android') {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      ReactNativeHapticFeedback?.trigger?.('impactLight');
    }
  },

  /**
   * Medium impact feedback
   */
  impactMedium: () => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').HapticFeedback;
      HapticFeedback?.impactAsync?.(HapticFeedback.ImpactFeedbackStyle?.Medium);
    } else if (Platform.OS === 'android') {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      ReactNativeHapticFeedback?.trigger?.('impactMedium');
    }
  },

  /**
   * Heavy impact feedback
   */
  impactHeavy: () => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').HapticFeedback;
      HapticFeedback?.impactAsync?.(HapticFeedback.ImpactFeedbackStyle?.Heavy);
    } else if (Platform.OS === 'android') {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      ReactNativeHapticFeedback?.trigger?.('impactHeavy');
    }
  },

  /**
   * Success notification feedback
   */
  notificationSuccess: () => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').HapticFeedback;
      HapticFeedback?.notificationAsync?.(HapticFeedback.NotificationFeedbackType?.Success);
    } else if (Platform.OS === 'android') {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      ReactNativeHapticFeedback?.trigger?.('notificationSuccess');
    }
  },

  /**
   * Warning notification feedback
   */
  notificationWarning: () => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').HapticFeedback;
      HapticFeedback?.notificationAsync?.(HapticFeedback.NotificationFeedbackType?.Warning);
    } else if (Platform.OS === 'android') {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      ReactNativeHapticFeedback?.trigger?.('notificationWarning');
    }
  },

  /**
   * Error notification feedback
   */
  notificationError: () => {
    if (Platform.OS === 'ios') {
      const HapticFeedback = require('react-native').HapticFeedback;
      HapticFeedback?.notificationAsync?.(HapticFeedback.NotificationFeedbackType?.Error);
    } else if (Platform.OS === 'android') {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback');
      ReactNativeHapticFeedback?.trigger?.('notificationError');
    }
  },
};