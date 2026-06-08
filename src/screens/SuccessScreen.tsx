import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { formatPrice } from '../utils/format';
import {
  BOUNCE_IN,
  FADE_IN_UP,
  ZOOM_IN,
  staggeredEntrance,
} from '../utils/animations';

export const SuccessScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const { service, paymentMethod, amount } = route.params || {
        service: { title: 'Serviço' },
        paymentMethod: 'pix',
        amount: 162.5,
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            // Auto-navega para Home após 5 segundos (opcional)
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const paymentMethodLabel = {
        pix: 'Pix',
        credit: 'Cartão de Crédito',
        debit: 'Cartão de Débito',
    }[paymentMethod as 'pix' | 'credit' | 'debit'] || 'Pix';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>
                <Animated.View entering={BOUNCE_IN} style={styles.iconContainer}>
                    <View style={styles.checkCircle}>
                        <Ionicons
                            name="checkmark"
                            size={80}
                            color={colors.surface}
                        />
                    </View>
                </Animated.View>

                <Animated.Text entering={FADE_IN_UP} style={styles.title}>
                    Pagamento Confirmado!
                </Animated.Text>

                <Animated.Text entering={staggeredEntrance(200)} style={styles.message}>
                    Sua contratação foi realizada com sucesso
                </Animated.Text>

                <Animated.View entering={staggeredEntrance(300)} style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Serviço</Text>
                        <Text style={styles.detailValue}>{service.title}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Forma de Pagamento</Text>
                        <Text style={styles.detailValue}>{paymentMethodLabel}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Valor Total</Text>
                        <Text style={styles.detailValue}>{formatPrice(amount)}</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={staggeredEntrance(500)} style={styles.infoBox}>
                    <Ionicons
                        name="information-circle"
                        size={20}
                        color={colors.primary}
                    />
                    <Text style={styles.infoText}>
                        O prestador foi notificado e em breve entrará em contato
                    </Text>
                </Animated.View>
            </View>

            <Animated.View entering={FADE_IN_UP} style={styles.buttonContainer}>
                <Pressable
                    style={styles.primaryButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.buttonText}>Voltar para Home</Text>
                </Pressable>
            </Animated.View>

            <BottomTabBar
                activeTab="home"
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
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
    },
    iconContainer: {
        marginBottom: spacing.xxl,
        marginTop: spacing.xl,
    },
    checkCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: colors.secondary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: colors.text.secondary,
        textAlign: 'center',
        marginBottom: spacing.xxl,
    },
    detailsContainer: {
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 12,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.xl,
        marginBottom: spacing.xxl,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    detailLabel: {
        fontSize: 14,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
        padding: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
        gap: spacing.md,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
    },
    buttonContainer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 3,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.surface,
    },
});
