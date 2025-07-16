import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingScreen() {
  const router = useRouter();
  let lottieSource;
  try {
    lottieSource = require('@/assets/images/plane-lottie.json');
  } catch (e) {
    lottieSource = null;
  }

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* <Image source={require('@/assets/images/react-logo.png')} style={styles.logo} /> */}
        <Text style={styles.title}>Welcome to Flights Mobile!</Text>
        {lottieSource && (
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}
        
        <Text style={styles.subtitle}>
          Find the best flights, compare prices, and plan your next trip with ease.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace('/screens/Signin')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  lottie: {
    width: 180,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e6f0fa',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 18,
    color: '#b0c4de',
    marginBottom: 40,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    backgroundColor: '#1e3c72',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 32,
    alignItems: 'center',
    shadowColor: '#203a43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#e6f0fa',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 