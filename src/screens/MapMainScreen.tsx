import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { BottomNavigationBar } from '../components';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
}

export const MapMainScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.5665, 
    longitude: 126.9780,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  useEffect(() => {
    (async () => {

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('위치 권한이 거부되었습니다.');
        Alert.alert(
          '위치 권한 필요',
          '지도를 사용하려면 위치 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
        return;
      }

      try {

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const newLocation: LocationData = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        setLocation(newLocation);
        setMapRegion({
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        setErrorMsg('위치를 가져오는 중 오류가 발생했습니다.');
        console.error('Location error:', error);
      }
    })();
  }, []);

  const handleNavItemPress = (itemId: string) => {
    console.log('Navigation item pressed:', itemId);

  };

  const bottomNavItems = [
    { id: 'wallet', label: 'Wallet' },
    { id: 'advertise', label: 'Advertise' },
    { id: 'map', label: '' }, 
    { id: 'notify', label: 'Notify' },
    { id: 'info', label: 'Info' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {}
      <View style={styles.statusBar}>
        <View style={styles.statusBarContent}>
          <View style={styles.timeContainer}>
            {}
          </View>
        </View>
      </View>

      {}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            onRegionChangeComplete={setMapRegion}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="현재 위치"
            />
          </MapView>
        ) : (
          <View style={styles.mapPlaceholder}>
            {}
          </View>
        )}

        {}
        <View style={styles.mapPinButton}>
          <View style={styles.mapPinIcon} />
        </View>
      </View>

      {}
      <BottomNavigationBar
        items={bottomNavItems}
        activeItemId="map"
        onItemPress={handleNavItemPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  statusBar: {
    height: 44,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 21,
  },
  statusBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {

  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  mapPinButton: {
    position: 'absolute',
    top: 61,
    right: 16,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPinIcon: {
    width: 25,
    height: 25,
    backgroundColor: 'transparent',

  },
});

