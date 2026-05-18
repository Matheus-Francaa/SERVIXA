import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

export const AnnouncementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('1');

    const categories = [
        { id: '1', label: 'Limpeza' },
        { id: '2', label: 'Encanamento' },
        { id: '3', label: 'Elétrica' },
    ];

    const allServices: Service[] = [
        {
            id: '1',
            title: 'Limpeza Residencial Completa',
            price: 'R$ 250',
            location: 'Centro · São Paulo',
            imageUrl: 'https://picsum.photos/seed/service1/400/300',
            description: 'Limpeza completa de toda a residência com produtos de qualidade',
            prestador: 'João Silva',
            avaliacao: '4.8',
            avaliacoes: '95',
            data: '15 de outubro de 2026',
        },
        {
            id: '2',
            title: 'Serviço de Encanamento Urgente',
            price: 'R$ 150',
            location: 'Vila Madalena · São Paulo',
            imageUrl: 'https://picsum.photos/seed/service2/400/300',
            description: 'Conserto de vazamentos e manutenção de canos',
            prestador: 'Carlos Mendes',
            avaliacao: '4.9',
            avaliacoes: '128',
            data: '18 de outubro de 2026',
        },
        {
            id: '3',
            title: 'Instalação Elétrica Residencial',
            price: 'R$ 320',
            location: 'Pinheiros · São Paulo',
            imageUrl: 'https://picsum.photos/seed/service3/400/300',
            description: 'Instalação segura de circuitos elétricos com garantia',
            prestador: 'Pedro Santos',
            avaliacao: '4.7',
            avaliacoes: '82',
            data: '20 de outubro de 2026',
        },
        {
            id: '4',
            title: 'Limpeza de Escritório',
            price: 'R$ 450',
            location: 'Consolação · São Paulo',
            imageUrl: 'https://picsum.photos/seed/service4/400/300',
            description: 'Limpeza e higienização de ambientes comerciais',
            prestador: 'Maria Costa',
            avaliacao: '4.6',
            avaliacoes: '67',
            data: '22 de outubro de 2026',
        },
        {
            id: '5',
            title: 'Reparo de Fiação Elétrica',
            price: 'R$ 200',
            location: 'Bom Retiro · São Paulo',
            imageUrl: 'https://picsum.photos/seed/service5/400/300',
            description: 'Troca de fios e disjuntores com segurança',
            prestador: 'André Oliveira',
            avaliacao: '4.8',
            avaliacoes: '54',
            data: '25 de outubro de 2026',
        },
        {
            id: '6',
            title: 'Desobstrução de Canos',
            price: 'R$ 120',
            location: 'Tatuapé · São Paulo',
            imageUrl: 'https://picsum.photos/seed/service6/400/300',
            description: 'Desobstrução profissional de tubulações',
            prestador: 'Roberto Dias',
            avaliacao: '4.9',
            avaliacoes: '91',
            data: '28 de outubro de 2026',
        },
    ];

    const categoryMap: { [key: string]: string[] } = {
        '1': ['1', '4'],
        '2': ['2', '6'],
        '3': ['3', '5'],
    };

    const filteredServices = allServices.filter((service) =>
        categoryMap[selectedCategory]?.includes(service.id)
    );

    const handleServicePress = (service: Service) => {
        navigation.navigate('ServiceDetail', { service });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Anúncios</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Category Chips */}
            <FlatList
                horizontal
                data={categories}
                renderItem={({ item }) => (
                    <CategoryChip
                        id={item.id}
                        label={item.label}
                        selected={selectedCategory === item.id}
                        onPress={() => setSelectedCategory(item.id)}
                    />
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.categoryContainer}
                showsHorizontalScrollIndicator={false}
                scrollEnabled={true}
            />

            {/* Services List */}
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

            {/* Bottom Tab Bar */}
            <BottomTabBar
                activeTab="search"
                onTabPress={(tab) => {
                    if (tab === 'home') {
                        navigation.navigate('Home');
                    } else if (tab === 'chat') {
                        navigation.navigate('ChatList');
                    } else if (tab === 'menu') {
                        navigation.navigate('Settings');
                    }
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    categoryContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.md,
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        gap: spacing.lg,
        paddingBottom: spacing.xxl + 80,
    },
    serviceWrapper: {
        marginBottom: spacing.md,
    },
});
