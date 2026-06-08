import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface ServiceMapProps {
  latitude?: number;
  longitude?: number;
  title?: string;
  style?: object;
}

const leafletHTML = (lat: number, lng: number, label: string) => `
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
  var map = L.map('map', {
    center: [${lat}, ${lng}],
    zoom: 15,
    zoomControl: false,
    scrollWheelZoom: false,
    dragging: false
  });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  L.marker([${lat}, ${lng}]).addTo(map)
    .bindPopup('${label}');
</script>
</body>
</html>`;

export const ServiceMap: React.FC<ServiceMapProps> = ({
  latitude,
  longitude,
  title,
  style,
}) => {
  if (latitude == null || longitude == null) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <WebView
        style={styles.map}
        source={{ html: leafletHTML(latitude, longitude, title || '') }}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={['*']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
