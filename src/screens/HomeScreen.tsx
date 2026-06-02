import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { CategoryChip } from '../components/CategoryChip';
import { ServiceCard } from '../components/ServiceCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { user, signOut } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        api.categories.list().then(setCategories).catch(() => {});
    }, []);

    useEffect(() => {
        api.services.list(selectedCategory === '1' ? undefined : selectedCategory)
            .then(setServices)
            .catch(() => {});
    }, [selectedCategory]);

    const filteredServices = searchQuery.trim()
        ? services.filter((s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : services;

    const handleServicePress = (service: any) => {
        navigation.navigate('ServiceDetail', { service });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                <View style={styles.header}>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location" size={18} color={colors.text.secondary} />
                        <Text style={styles.locationText}>St. N QNN 31 31 – 72225-310 ▸</Text>
                    </View>
                    <View style={styles.headerRight}>
                        {user && <Text style={styles.userName}>{user.name}</Text>}
                        <TouchableOpacity>
                            <Ionicons name="notifications" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bannerContainer}>
                    <Image
                        source={{ uri: 'https://picsum.photos/seed/banner/600/250' }}
                        style={styles.bannerImage}
                    />
                    <View style={styles.bannerOverlay}>
                        <Text style={styles.bannerTitle}>Serviço em Destaque</Text>
                        <Text style={styles.bannerSubtitle}>
                            Encontre os melhores prestadores perto de você
                        </Text>
                    </View>
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons
                        name="search"
                        size={20}
                        color={colors.text.secondary}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Procurar Serviço"
                        placeholderTextColor={colors.text.secondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.categoriesContainer}>
                    <FlatList
                        data={categories}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <CategoryChip
                                id={String(item.id)}
                                label={item.label}
                                selected={selectedCategory === String(item.id)}
                                onPress={() => setSelectedCategory(String(item.id))}
                            />
                        )}
                        keyExtractor={(item) => String(item.id)}
                        scrollEventThrottle={16}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Serviços mais procurados este mês</Text>
                    <FlatList
                        data={filteredServices}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ServiceCard
                                id={item.id}
                                title={item.title}
                                price={item.price}
                                location={item.location}
                                imageUrl={item.imageUrl}
                                onPress={() => handleServicePress(item)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        scrollEventThrottle={16}
                    />
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Ofertas Especiais</Text>
                    <FlatList
                        data={filteredServices.slice(2)}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <ServiceCard
                                id={item.id}
                                title={item.title}
                                price={item.price}
                                location={item.location}
                                imageUrl={item.imageUrl}
                                onPress={() => handleServicePress(item)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        scrollEventThrottle={16}
                    />
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <BottomTabBar
                activeTab="home"
                onTabPress={(tab) => {
                    if (tab === 'search') {
                        navigation.navigate('Announcement');
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
    scrollView: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    userName: { fontSize: 13, color: colors.text.secondary, fontWeight: '500' },
    locationContainer: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    locationText: { fontSize: 13, color: colors.text.secondary, fontWeight: '500' },
    bannerContainer: {
        height: 200,
        marginHorizontal: spacing.lg,
        borderRadius: 12,
        overflow: 'hidden',
        marginVertical: spacing.md,
        position: 'relative',
    },
    bannerImage: { width: '100%', height: '100%' },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    bannerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.surface, marginBottom: spacing.sm },
    bannerSubtitle: { fontSize: 13, color: colors.surface },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        marginVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: 25,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: { marginRight: spacing.md },
    searchInput: { flex: 1, height: 44, fontSize: 14, color: colors.text.primary },
    categoriesContainer: { paddingHorizontal: spacing.lg, marginVertical: spacing.md },
    sectionContainer: { marginVertical: spacing.xl },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
});
