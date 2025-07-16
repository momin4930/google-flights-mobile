import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function SigninScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const passwordRef = useRef<TextInput>(null);

  let lottieSource;
  try {
    lottieSource = require('@/assets/images/loader-lottie.json');
  } catch (e) {
    lottieSource = null;
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and password are required.');
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        const user = await AsyncStorage.getItem(`user:${email}`);
        if (!user) {
          Alert.alert('Error', 'User not found. Please sign up.');
          setLoading(false);
          return;
        }
        const parsed = JSON.parse(user);
        if (parsed.password !== password) {
          Alert.alert('Error', 'Incorrect password.');
          setLoading(false);
          return;
        }
        await AsyncStorage.setItem('signedInUser', email);
        router.replace('/screens/Home');
      } catch (e) {
        Alert.alert('Error', 'Failed to sign in.');
      } finally {
        setLoading(false);
      }
    }, 100); // Give the UI time to show the modal
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Sign In</Text>
              <Text style={styles.subheader}>Welcome back! Please sign in to continue.</Text>
            </View>
            <View style={styles.form}>
              <TextInput
                style={[
                  styles.input,
                  focusedInput === 'email' && styles.inputFocused
                ]}
                placeholder="Email"
                placeholderTextColor="#7a8fa6"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                accessibilityLabel="Email"
                accessibilityHint="Enter your email address"
              />
              <View style={{ position: 'relative' }}>
                <TextInput
                  ref={passwordRef}
                  style={[
                    styles.input,
                    focusedInput === 'password' && styles.inputFocused,
                    { paddingRight: 48 }
                  ]}
                  placeholder="Password"
                  placeholderTextColor="#7a8fa6"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  returnKeyType="done"
                  onSubmitEditing={handleSignIn}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your password"
                />
                <TouchableOpacity
                  style={styles.showHideButton}
                  onPress={() => setShowPassword((v) => !v)}
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                  accessibilityRole="button"
                >
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#7a8fa6"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading} accessibilityRole="button">
                <Text style={styles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.replace('/screens/Signup')} style={styles.linkContainer} accessibilityRole="button">
                <Text style={styles.linkText}>Don't have an account? <Text style={styles.link}>Sign Up</Text></Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      {/* Loader Overlay */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          {lottieSource && (
            <LottieView
              source={lottieSource}
              autoPlay
              loop
              style={styles.loaderLottie}
            />
          )}
          <Text style={styles.loaderText}>Signing you in...</Text>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: -65, 
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e6f0fa',
    marginBottom: 8,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subheader: {
    fontSize: 16,
    color: '#b0c4de',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  form: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'rgba(20,34,54,0.97)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  input: {
    height: 48,
    borderColor: '#334e68',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#22334d',
    fontSize: 16,
    color: '#e6f0fa',
  },
  inputFocused: {
    borderColor: '#5dade2',
    backgroundColor: '#2c3e5c',
    shadowColor: '#5dade2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  showHideButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
    zIndex: 2,
  },
  button: {
    backgroundColor: '#1e3c72',
    paddingVertical: 14,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    shadowColor: '#203a43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#e6f0fa',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  linkContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  linkText: {
    color: '#b0c4de',
    fontSize: 15,
  },
  link: {
    color: '#5dade2',
    fontWeight: 'bold',
  },
  loaderOverlay: {
    flex: 1,
    backgroundColor: 'rgba(20,34,54,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderLottie: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  loaderText: {
    color: '#e6f0fa',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
}); 