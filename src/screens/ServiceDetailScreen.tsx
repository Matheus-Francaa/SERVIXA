import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Prestador } from '../types';

export const ServiceDetailScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const { service } = route.params || {
        service: {
            id: '1',
            title: 'Lorem ipsum dolor sit amet',
            price: 'R$ 100 – R$ 500',
            imageUrl: 'https://picsum.photos/seed/detail/600/400',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
            location: 'Centro · São Paulo',
            prestador: 'João Silva',
            avaliacao: '4.8',
            avaliacoes: '95',
            data: '15 de outubro de 2026',
        },
    };

    const prestadorInfo: Prestador = {
        id: service.id || '1',
        name: service.prestador || 'João Silva',
        image: `https://picsum.photos/seed/prestador${service.id || '1'}/100/100`,
    };

    const [isFavorite, setIsFavorite] = useState(false);

    const handleContratar = () => {
        navigation.navigate('Checkout', { service });
    };

    const handleChat = () => {
        navigation.navigate('Chat', {
            prestador: prestadorInfo,
            conversationId: `conv_${service.id}`,
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SERVIXA</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
                        <Ionicons
                            name={isFavorite ? 'heart' : 'heart-outline'}
                            size={24}
                            color={isFavorite ? colors.error : colors.text.primary}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons
                            name="share-social"
                            size={24}
                            color={colors.text.primary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                {/* Imagem Principal */}
                <Image
                    source={{ uri: service.imageUrl }}
                    style={styles.mainImage}
                />

                {/* Conteúdo */}
                <View style={styles.content}>
                    {/* Título */}
                    <Text style={styles.title}>{service.title}</Text>

                    {/* Badges */}
                    <View style={styles.badgesContainer}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeEmoji}>🛒</Text>
                            <Text style={styles.badgeText}>Pague Online</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeEmoji}>🗓</Text>
                            <Text style={styles.badgeText}>Parcelamento</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeEmoji}>🛡</Text>
                            <Text style={styles.badgeText}>Garantia</Text>
                        </View>
                    </View>

                    {/* Preço */}
                    <Text style={styles.price}>{service.price}</Text>

                    {/* Seção Descrição */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Descrição</Text>
                        <Text style={styles.descriptionText}>{service.description}</Text>
                    </View>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            {/* Botões Fixos no Rodapé */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.contratarButton}
                    onPress={handleContratar}
                >
                    <Text style={styles.contratarButtonText}>🛒 Contratar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.chatButton}
                    onPress={handleChat}
                >
                    <Text style={styles.chatButtonText}>💬 Chat</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Tab Bar */}
            <BottomTabBar
                activeTab="home"
                onTabPress={(tab) => {
                    if (tab === 'home') {
                        navigation.navigate('Home');
                    } else if (tab === 'search') {
                        navigation.navigate('Announcement');
                    } else if (tab === 'chat') {
                        handleChat();
                    } else if (tab === 'announce') {
                        navigation.navigate('Checkout', { service });
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
    scrollView: {
        flex: 1,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    headerActions: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    mainImage: {
        width: '100%',
        height: 280,
        backgroundColor: '#E0E0E0',
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    badgesContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.lg,
        flexWrap: 'wrap',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
    },
    badgeEmoji: {
        fontSize: 16,
    },
    badgeText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '500',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.xl,
    },
    descriptionSection: {
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.md,
    },
    descriptionText: {
        fontSize: 13,
        color: colors.text.secondary,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        gap: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    contratarButton: {
        flex: 1,
        backgroundColor: colors.secondary,
        paddingVertical: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contratarButtonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatButton: {
        flex: 1,
        borderWidth: 2,
        borderColor: colors.primary,
        paddingVertical: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
