import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { CategoryChip } from '../components/CategoryChip';
import { ServiceCard } from '../components/ServiceCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Service } from '../types';
import { api } from '../services/api';
import { FADE_IN_DOWN } from '../utils/animations';

const multiMapHTML = (markers: { lat: number; lng: number; title: string; location: string }[]) => {
  const markersJS = markers.map(m =>
    `{ lat: ${m.lat}, lng: ${m.lng}, title: '${m.title.replace(/'/g, "\\'")}', loc: '${m.location.replace(/'/g, "\\'")}' }`
  ).join(',\n    ');
  return `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  * { margin: 0; padding: 0; }
  html, body, #map { width: 100%; height: 100%; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var data = [${markersJS}];
  var bounds = [];
  var map = L.map('map', { zoomControl: false });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap'
  }).addTo(map);
  data.forEach(function(m) {
    var mk = L.marker([m.lat, m.lng]).addTo(map).bindPopup('<b>' + m.title + '</b><br/>' + m.loc);
    bounds.push(mk.getLatLng());
  });
  map.fitBounds(bounds, { padding: [30, 30] });
</script>
</body>
</html>`;
};

export const AnnouncementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [categories, setCategories] = useState<any[]>([]);
    const [allServices, setAllServices] = useState<Service[]>([]);
    const [showMap, setShowMap] = useState(false);

    useEffect(() => {
        api.categories.list().then(setCategories).catch(() => {});
        api.services.list().then(setAllServices).catch(() => {});
    }, []);

    const filteredServices = selectedCategory === 'all'
        ? allServices
        : allServices.filter((s: any) => String(s.categoryId) === selectedCategory);

    const servicesWithCoords = filteredServices.filter(
      (s) => s.latitude != null && s.longitude != null,
    );

    const handleServicePress = (service: Service) => {
        navigation.navigate('ServiceDetail', { service });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Anúncios</Text>
                <TouchableOpacity onPress={() => setShowMap(!showMap)}>
                    <Ionicons
                        name={showMap ? 'list' : 'map'}
                        size={24}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>

            <FlatList
                horizontal
                data={[{ id: 'all', label: 'Todos' }, ...categories]}
                renderItem={({ item }) => (
                    <CategoryChip
                        id={String(item.id)}
                        label={item.label}
                        selected={selectedCategory === String(item.id)}
                        onPress={() => setSelectedCategory(String(item.id))}
                    />
                )}
                keyExtractor={(item) => String(item.id)}
                contentContainerStyle={styles.categoryContainer}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
            />

            {showMap && servicesWithCoords.length > 0 && (
              <Animated.View entering={FADE_IN_DOWN} style={styles.mapContainer}>
                <WebView
                  style={styles.map}
                  source={{ html: multiMapHTML(servicesWithCoords.map(s => ({
                    lat: s.latitude!,
                    lng: s.longitude!,
                    title: s.title,
                    location: s.location,
                  }))) }}
                  scrollEnabled={false}
                  bounces={false}
                  overScrollMode="never"
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  originWhitelist={['*']}
                />
              </Animated.View>
            )}

            <FlatList
                data={filteredServices}
                renderItem={({ item }) => (
                    <View style={styles.serviceWrapper}>
                        <ServiceCard
                            id={item.id}
                            title={item.title}
                            price={item.price}
                            location={item.location}
                            imageUrl={item.imageUrl}
                            onPress={() => handleServicePress(item)}
                        />
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                scrollEnabled={true}
                nestedScrollEnabled={true}
            />

            <BottomTabBar
                activeTab="search"
                onTabPress={(tab) => {
                    if (tab === 'home') {
                        navigation.navigate('Home');
                    } else if (tab === 'chat') {
                        navigation.navigate('ChatList');
                    } else if (tab === 'announce') {
                        navigation.navigate('CreateService');
                    } else if (tab === 'menu') {
                        navigation.navigate('Settings');
                    }
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text.primary },
    categoryContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md },
    listContent: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.lg, paddingBottom: spacing.xxl + 80 },
    serviceWrapper: { marginBottom: spacing.md },
    mapContainer: { height: 250, marginHorizontal: spacing.lg, borderRadius: 12, overflow: 'hidden', marginBottom: spacing.md },
    map: { flex: 1 },
});
