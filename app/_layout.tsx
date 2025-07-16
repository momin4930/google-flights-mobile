import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: 'fade', // Subtle fade animation for all transitions
        }}
      >
        <Stack.Screen name="screens/Onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Signin" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Signup" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Home" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Flights" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Settings" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
