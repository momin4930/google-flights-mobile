import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const NAV_ITEMS = [
  { name: 'Home', icon: 'home-outline', route: '/screens/Home' },
  { name: 'Flights', icon: 'airplane-outline', route: '/screens/Flights' },
  { name: 'Settings', icon: 'settings-outline', route: '/screens/Settings' },
];

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.outerContainer} pointerEvents="box-none">
      <BlurView intensity={100} tint="dark" style={styles.blur} />
      <View style={styles.container} pointerEvents="box-none">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.route;
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.tab}
              onPress={() => router.replace(item.route as any)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon as any}
                size={28}
                color={isActive ? '#5dade2' : '#b0c4de'}
                style={isActive ? styles.activeIcon : undefined}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: Platform.OS === 'ios' ? 36 : 20,
    borderRadius: 32,
    overflow: 'hidden',
    zIndex: 100,
  },
  blur: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 34, 54, 0.55)',
    borderRadius: 32,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(90, 173, 226, 0.15)',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  activeIcon: {
    shadowColor: '#5dade2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
}); 