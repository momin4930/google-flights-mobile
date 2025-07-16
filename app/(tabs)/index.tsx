// import { LinearGradient } from 'expo-linear-gradient';
// import { useRouter } from 'expo-router';
// import React from 'react';
// import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// export default function OnboardingScreen() {
//   const router = useRouter();

//   return (
//     <LinearGradient
//       colors={["#0f2027", "#203a43", "#2c5364"]}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={styles.gradient}
//     >
//       <View style={styles.container}>
//         <Text style={styles.title}>Welcome to Google Flights Mobile!</Text>
//         <Text style={styles.subtitle}>
//           Find the best flights, compare prices, and book your next trip with ease.
//         </Text>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => router.replace('/screens/Signin')}
//         >
//           <Text style={styles.buttonText}>Get Started</Text>
//         </TouchableOpacity>
//       </View>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   gradient: {
//     flex: 1,
//   },
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 24,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#e6f0fa',
//     marginBottom: 24,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0,0,0,0.4)',
//     textShadowOffset: { width: 0, height: 2 },
//     textShadowRadius: 6,
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#b0c4de',
//     marginBottom: 40,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0,0,0,0.2)',
//     textShadowOffset: { width: 0, height: 1 },
//     textShadowRadius: 3,
//   },
//   button: {
//     backgroundColor: '#1e3c72',
//     paddingVertical: 16,
//     paddingHorizontal: 48,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#203a43',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   buttonText: {
//     color: '#e6f0fa',
//     fontSize: 20,
//     fontWeight: 'bold',
//     letterSpacing: 1,
//   },
// }); 


import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
