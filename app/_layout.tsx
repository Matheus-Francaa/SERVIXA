import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/src/contexts/AuthContext';

import { AppNavigator } from '@/src/navigation/AppNavigator';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
