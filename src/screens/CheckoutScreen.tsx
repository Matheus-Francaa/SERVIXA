import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import { PaymentOption } from '../components/PaymentOption';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type PaymentIconType = keyof typeof MaterialCommunityIcons.glyphMap;

export const CheckoutScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const { service } = route.params || {
        service: {
            id: '1',
            title: 'Serviço de Encanamento',
            prestador: 'Lorem Ipsum',
            avaliacao: '4.9',
            avaliacoes: '128',
            imageUrl: 'https://picsum.photos/seed/prestador/100/100',
            data: '15 de outubro de 2026',
        },
    };

    const [selectedPayment, setSelectedPayment] = useState('pix');

    const serviceValue = 150.0;
    const serviceFee = 12.5;
    const totalValue = serviceValue + serviceFee;

    const paymentOptions: Array<{
        id: string;
        label: string;
        description: string;
        icon: PaymentIconType;
        iconColor: string;
    }> = [
            {
                id: 'pix',
                label: 'Pix',
                description: 'Liberação imediata • Sem taxas adicionais',
                icon: 'qrcode-scan',
                iconColor: '#FF6B35',
            },
            {
                id: 'credit',
                label: 'Cartão de crédito',
                description: 'Até 12x • Parcela mínima R$ 13,54',
                icon: 'credit-card',
                iconColor: colors.primary,
            },
            {
                id: 'debit',
                label: 'Cartão de débito',
                description: 'Sem cobranças adicionais',
                icon: 'credit-card-outline',
                iconColor: colors.secondary,
            },
        ];

    const handlePayment = () => {
        navigation.navigate('Success', {
            service,
            paymentMethod: selectedPayment,
            amount: totalValue,
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
                <View style={{ width: 28 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
            >
                {/* Título */}
                <Text style={styles.title}>Finalizar Pagamento</Text>

                {/* Card do Serviço */}
                <View style={styles.serviceCard}>
                    <Image
                        source={{ uri: service.imageUrl }}
                        style={styles.serviceThumbnail}
                    />
                    <View style={styles.serviceInfo}>
                        <Text style={styles.serviceTitle}>{service.title}</Text>
                        <Text style={styles.prestadorName}>Prestador: {service.prestador}</Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.star}>⭐</Text>
                            <Text style={styles.rating}>
                                {service.avaliacao} • {service.avaliacoes} avaliações
                            </Text>
                        </View>
                        <Text style={styles.dataText}>Data: {service.data}</Text>
                    </View>
                </View>

                {/* Seção: Escolha a forma de pagamento */}
                <View style={styles.paymentSection}>
                    <Text style={styles.sectionTitle}>Escolha a forma de pagamento</Text>
                    {paymentOptions.map((option) => (
                        <PaymentOption
                            key={option.id}
                            id={option.id}
                            label={option.label}
                            description={option.description}
                            icon={option.icon}
                            iconColor={option.iconColor}
                            selected={selectedPayment === option.id}
                            onPress={() => setSelectedPayment(option.id)}
                        />
                    ))}
                </View>

                {/* Resumo de Valores */}
                <View style={styles.summaryContainer}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Serviço</Text>
                        <Text style={styles.summaryValue}>R$ {serviceValue.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Taxa de serviço</Text>
                        <Text style={styles.summaryValue}>R$ {serviceFee.toFixed(2)}</Text>
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total a Pagar</Text>
                        <Text style={styles.totalValue}>R$ {totalValue.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Texto de Segurança */}
                <View style={styles.securityContainer}>
                    <Text style={styles.securityText}>
                        🛡 Pagamento 100% seguro • Garantia Servixa
                    </Text>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Botão Pagar Fixo */}
            <View style={styles.paymentButtonContainer}>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={handlePayment}
                >
                    <Text style={styles.payButtonText}>
                        Pagar R$ {totalValue.toFixed(2)} agora
                    </Text>
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        marginBottom: spacing.xl,
    },
    serviceCard: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        marginHorizontal: spacing.lg,
        padding: spacing.lg,
        borderRadius: 12,
        marginBottom: spacing.xl,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    serviceThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#E0E0E0',
        marginRight: spacing.lg,
    },
    serviceInfo: {
        flex: 1,
    },
    serviceTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    prestadorName: {
        fontSize: 12,
        color: colors.text.secondary,
        marginBottom: spacing.sm,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    star: {
        fontSize: 14,
    },
    rating: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    dataText: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    paymentSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.lg,
    },
    summaryContainer: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.lg,
        padding: spacing.lg,
        borderRadius: 12,
        marginBottom: spacing.xl,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    summaryLabel: {
        fontSize: 13,
        color: colors.text.secondary,
    },
    summaryValue: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.text.primary,
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        marginVertical: spacing.md,
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
    },
    securityContainer: {
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    securityText: {
        fontSize: 13,
        color: colors.secondary,
        fontWeight: '500',
        textAlign: 'center',
    },
    paymentButtonContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    payButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonText: {
        color: colors.surface,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
