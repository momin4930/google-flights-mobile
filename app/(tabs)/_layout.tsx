import { Tabs } from 'expo-router';
import React, { createContext, useContext, useState } from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import LottieView from 'lottie-react-native';

// Loader context
const LoaderContext = createContext({ show: () => {}, hide: () => {} });
export const useLoader = () => useContext(LoaderContext);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(false);
  let lottieSource;
  try {
    lottieSource = require('@/assets/images/loader-lottie.json');
  } catch (e) {
    lottieSource = null;
  }

  const show = () => setLoading(true);
  const hide = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ show, hide }}>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: Platform.select({
              ios: {
                // Use a transparent background on iOS to show the blur effect
                position: 'absolute',
              },
              default: {},
            }),
          }}
        >
          <Tabs.Screen
            name="index"
            listeners={{
              tabPress: () => show(),
            }}
            options={{
              title: 'Home',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />, 
            }}
          />
          <Tabs.Screen
            name="explore"
            listeners={{
              tabPress: () => show(),
            }}
            options={{
              title: 'Explore',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />, 
            }}
          />
          <Tabs.Screen
            name="flights"
            listeners={{
              tabPress: () => show(),
            }}
            options={{
              title: 'Flights',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="airplane" color={color} />, 
            }}
          />
          <Tabs.Screen
            name="settings"
            listeners={{
              tabPress: () => show(),
            }}
            options={{
              title: 'Settings',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />, 
            }}
          />
        </Tabs>
        {/* Global Loader Overlay */}
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
            <Text style={styles.loaderText}>Loading...</Text>
          </View>
        </Modal>
      </View>
    </LoaderContext.Provider>
  );
}

const styles = StyleSheet.create({
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
