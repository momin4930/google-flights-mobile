import BottomNavBar from '@/components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLoader } from '../(tabs)/_layout';

const AVATAR_OPTIONS = [
  require('@/assets/images/react-logo.png'),
];

export default function SettingsScreen() {
  const router = useRouter();
  const { hide } = useLoader();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  let lottieSource;
  try {
    lottieSource = require('@/assets/images/loader-lottie.json');
  } catch (e) {
    lottieSource = null;
  }

  useEffect(() => {
    const loadUser = async () => {
      const signedInEmail = await AsyncStorage.getItem('signedInUser');
      if (!signedInEmail) {
        router.replace('/screens/Signin');
        return;
      }
      setEmail(signedInEmail);
      const user = await AsyncStorage.getItem(`user:${signedInEmail}`);
      if (user) {
        const parsed = JSON.parse(user);
        setName(parsed.name || '');
        setPassword(parsed.password || '');
        setAvatarIdx(parsed.avatarIdx || 0);
        setAvatarUri(parsed.avatarUri || null);
      }
      hide(); // Hide global loader when loaded
    };
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!email) return;
    setSaving(true);
    try {
      await AsyncStorage.setItem(
        `user:${email}`,
        JSON.stringify({ email, name, password, avatarIdx, avatarUri })
      );
      Alert.alert('Success', 'Profile updated!');
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Please allow access to your gallery.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
      setAvatarIdx(-1); // Custom avatar
    }
  };

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Settings</Text>
        <Text style={styles.label}>Avatar</Text>
        <View style={styles.avatarRow}>
          {AVATAR_OPTIONS.map((img, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => { setAvatarIdx(idx); setAvatarUri(null); }}
              style={[styles.avatarOption, avatarIdx === idx && styles.avatarSelected]}
            >
              <Image source={img} style={styles.avatarImg} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.avatarOption, avatarIdx === -1 && styles.avatarSelected]}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
            ) : (
              <View style={[styles.avatarImg, styles.addAvatar]}>
                <Text style={{ color: '#888', fontSize: 24 }}>+</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          placeholderTextColor="#7a8fa6"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          placeholderTextColor="#7a8fa6"
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
          <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavBar />
      {/* Loader Overlay for saving only */}
      <Modal visible={saving} transparent animationType="fade">
        <View style={styles.loaderOverlay}>
          {lottieSource && (
            <LottieView
              source={lottieSource}
              autoPlay
              loop
              style={styles.loaderLottie}
            />
          )}
          <Text style={styles.loaderText}>Saving...</Text>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e6f0fa',
    marginBottom: 24,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  label: {
    color: '#b0c4de',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginTop: 16,
    marginBottom: 4,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  avatarOption: {
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 32,
    padding: 4,
  },
  avatarSelected: {
    borderColor: '#5dade2',
    backgroundColor: '#22334d',
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
    backgroundColor: '#fff',
  },
  addAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  input: {
    height: 48,
    borderColor: '#334e68',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#22334d',
    fontSize: 16,
    color: '#e6f0fa',
    width: '100%',
    maxWidth: 350,
  },
  button: {
    backgroundColor: '#1e3c72',
    paddingVertical: 14,
    borderRadius: 32,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    shadowColor: '#203a43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
    maxWidth: 350,
  },
  buttonText: {
    color: '#e6f0fa',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
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