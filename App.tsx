/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { setupPlayer } from './src/services/PlaybackService';
import TrackPlayerTestScreen from './src/screens/TrackPlayerTestScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    setupPlayer();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {paddingTop: safeAreaInsets.top, paddingBottom: safeAreaInsets.bottom},
      ]}>
      <TrackPlayerTestScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
