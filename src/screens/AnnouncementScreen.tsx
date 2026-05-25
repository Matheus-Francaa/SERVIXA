import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { CategoryChip } from '../components/CategoryChip';
import { ServiceCard } from '../components/ServiceCard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Service } from '../types';
import { api } from '../services/api';

export const AnnouncementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [categories, setCategories] = useState<any[]>([]);
    const [allServices, setAllServices] = useState<Service[]>([]);

    useEffect(() => {
        api.categories.list().then(setCategories).catch(() => {});
        api.services.list().then(setAllServices).catch(() => {});
    }, []);

    const filteredServices = selectedCategory === 'all'
        ? allServices
        : allServices.filter((s: any) => String(s.categoryId) === selectedCategory);

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
                <View style={{ width: 28 }} />
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
});
