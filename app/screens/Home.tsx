import BottomNavBar from '@/components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLoader } from '../(tabs)/_layout';
let LottieView: React.ComponentType<any>;
if (Platform.OS === 'web') {
  // LottieView = require('lottie-react').default;
} else {
  LottieView = require('lottie-react-native').default;
}

export default function HomeScreen() {
  const { hide } = useLoader();
  const router = useRouter();
  useEffect(() => { hide(); }, []);

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [avatarIdx, setAvatarIdx] = useState(0);
  const [firstName, setFirstName] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const email = await AsyncStorage.getItem('signedInUser');
      if (!email) return;
      const user = await AsyncStorage.getItem(`user:${email}`);
      if (user) {
        const parsed = JSON.parse(user);
        setAvatarUri(parsed.avatarUri || null);
        setAvatarIdx(parsed.avatarIdx || 0);
        const name = parsed.name || '';
        setFirstName(name.split(' ')[0] || '');
      }
    };
    fetchUser();
  }, []);

  const AVATAR_OPTIONS = [
    require('@/assets/images/react-logo.png'),
  ];

  let lottieSource;
  try {
    lottieSource = require('@/assets/images/earth-lottie.json');
  } catch (e) {
    lottieSource = null;
  }

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [depart, setDepart] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState('Economy');
  const [oneWay, setOneWay] = useState(false);

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Top bar with avatar */}
        <View style={styles.topBar}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.avatarBtn}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <Image source={AVATAR_OPTIONS[avatarIdx] || AVATAR_OPTIONS[0]} style={styles.avatar} />
            )}
          </TouchableOpacity>
        </View>
        {/* Earth Animation */}
        {lottieSource && (
          <LottieView
            source={lottieSource}
            autoPlay
            loop
            style={styles.lottie}
          />
        )}
        {/* Greeting */}
        <Text style={styles.greeting}>Hello, {firstName || 'User'} <Text style={{ fontSize: 22 }}>👋</Text></Text>
        <Text style={styles.header}>Find your next flight</Text>
        {/* Promo Banner */}
        {/* <View style={styles.promoBanner}>
          <Text style={styles.promoText}>{promo}</Text>
        </View> */}
        {/* Travel Inspiration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Travel Inspiration</Text>
          <Text style={styles.inspirationQuote}>
            "The world is a book, and those who do not travel read only one page."
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/screens/Flights')}>
            <Text style={styles.buttonText}>Explore Destinations</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Destination */}
        <View style={styles.featuredCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={{ padding: 14 }}>
            <Text style={styles.featuredTitle}>Featured: Berlin, Germany</Text>
            <Text style={styles.featuredBlurb}>
              A city of history, culture, and vibrant nightlife. Explore Berlin’s iconic landmarks and creative spirit.
            </Text>
            <TouchableOpacity
              style={styles.featuredBtn}
              onPress={() => router.push({ pathname: '/screens/Flights', params: { destinationCity: 'Berlin' } })}
            >
              <Text style={styles.featuredBtnText}>Discover</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Spacer at the bottom */}
        <View style={{ height: 32 }} />
      </ScrollView>
      <BottomNavBar />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContainer: { paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginTop:10,
    backgroundColor: '#22334d',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#203a43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  lottie: {
    width: 200,
    height: 140,
    alignSelf: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 22,
    color: '#e6f0fa',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  header: {
    fontSize: 16,
    color: '#b0c4de',
    textAlign: 'center',
    marginBottom: 36,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  promoBanner: {
    backgroundColor: '#1e3c72',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'center',
    marginBottom: 18,
    shadowColor: '#203a43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  promoText: {
    color: '#f7ca18',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'rgba(20,34,54,0.97)',
    borderRadius: 18,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    color: '#e6f0fa',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  form: {
    width: '100%',
    alignSelf: 'center',
  },
  input: {
    height: 40,
    borderColor: '#334e68',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#22334d',
    fontSize: 14,
    color: '#e6f0fa',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1e3c72',
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
    shadowColor: '#203a43',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#e6f0fa',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 18,
    gap: 12,
  },
  cardSmall: {
    flex: 1,
    backgroundColor: 'rgba(20,34,54,0.97)',
    borderRadius: 18,
    padding: 14,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  seeAll: {
    color: '#5dade2',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'right',
  },
  recentItem: {
    backgroundColor: '#22334d',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
  },
  recentText: {
    color: '#b0c4de',
    fontSize: 13,
  },
  dealItem: {
    backgroundColor: '#22334d',
    borderRadius: 10,
    padding: 8,
    marginBottom: 6,
    alignItems: 'center',
  },
  dealText: {
    color: '#e6f0fa',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dealPrice: {
    color: '#f7ca18',
    fontSize: 13,
    marginBottom: 4,
  },
  dealBtn: {
    backgroundColor: '#1e3c72',
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  dealBtnText: {
    color: '#e6f0fa',
    fontWeight: 'bold',
    fontSize: 12,
  },
  inspirationQuote: {
    color: '#b0c4de',
    fontStyle: 'italic',
    fontSize: 15,
    marginBottom: 14,
    textAlign: 'center',
  },
  featuredCard: {
    backgroundColor: 'rgba(20,34,54,0.97)',
    borderRadius: 18,
    marginHorizontal: 16,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  featuredTitle: {
    color: '#e6f0fa',
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 6,
  },
  featuredBlurb: {
    color: '#b0c4de',
    fontSize: 14,
    marginBottom: 10,
  },
  featuredBtn: {
    backgroundColor: '#1e3c72',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
  },
  featuredBtnText: {
    color: '#e6f0fa',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tipCard: {
    backgroundColor: 'rgba(20,34,54,0.97)',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipText: {
    color: '#b0c4de',
    fontSize: 14,
    flex: 1,
  },
}); 