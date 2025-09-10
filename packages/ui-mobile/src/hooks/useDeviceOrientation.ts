import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

interface DeviceOrientation {
  isPortrait: boolean;
  isLandscape: boolean;
  width: number;
  height: number;
}

export const useDeviceOrientation = (): DeviceOrientation => {
  const [orientation, setOrientation] = useState(() => {
    const { width, height } = Dimensions.get('window');
    return {
      isPortrait: height > width,
      isLandscape: width > height,
      width,
      height,
    };
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setOrientation({
        isPortrait: window.height > window.width,
        isLandscape: window.width > window.height,
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  return orientation;
};