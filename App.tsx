import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { useAppFonts } from './src/theme/fonts';
import { colors } from './src/theme/tokens';
import { StoreProvider } from './src/state/store';
import { RootView } from './src/RootView';

export default function App() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StoreProvider>
          <StatusBar style="dark" />
          <RootView />
        </StoreProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
