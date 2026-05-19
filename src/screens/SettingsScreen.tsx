import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface SettingItem {
    id: string;
    icon: string;
    title: string;
    subtitle?: string;
    type: 'toggle' | 'action';
    value?: boolean;
}

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

    const settings: SettingItem[] = [
        {
            id: '1',
            icon: 'bell',
            title: 'Notificações',
            subtitle: 'Receba alertas de novas mensagens',
            type: 'toggle',
            value: notificationsEnabled,
        },
        {
            id: '2',
            icon: 'moon',
            title: 'Modo Noturno',
            subtitle: 'Ativar tema escuro',
            type: 'toggle',
            value: darkModeEnabled,
        },
        {
            id: '3',
            icon: 'shield-checkmark',
            title: 'Privacidade e Segurança',
            subtitle: 'Gerenciar permissões',
            type: 'action',
        },
        {
            id: '4',
            icon: 'help-circle',
            title: 'Centro de Ajuda',
            subtitle: 'Dúvidas frequentes e suporte',
            type: 'action',
        },
        {
            id: '5',
            icon: 'document-text',
            title: 'Termos de Serviço',
            subtitle: 'Leia nossos termos',
            type: 'action',
        },
        {
            id: '6',
            icon: 'information-circle',
            title: 'Sobre',
            subtitle: 'Versão 1.0.0',
            type: 'action',
        },
    ];

    const handleToggle = (id: string) => {
        if (id === '1') {
            setNotificationsEnabled(!notificationsEnabled);
        } else if (id === '2') {
            setDarkModeEnabled(!darkModeEnabled);
        }
    };

    const handleSettingPress = (id: string) => {
        if (id === '3') {
            // Navegar para Privacidade
        } else if (id === '4') {
            // Navegar para Ajuda
        } else if (id === '5') {
            // Navegar para Termos
        } else if (id === '6') {
            // Navegar para Sobre
        }
    };

    const renderSettingItem = (item: SettingItem) => {
        if (item.type === 'toggle') {
            return (
                <TouchableOpacity
                    key={item.id}
                    style={styles.settingItem}
                    activeOpacity={0.7}
                >
                    <View style={styles.settingContent}>
                        <Ionicons
                            name={item.icon as any}
                            size={24}
                            color={colors.primary}
                        />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>{item.title}</Text>
                            {item.subtitle && (
                                <Text style={styles.settingSubtitle}>
                                    {item.subtitle}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Switch
                        value={item.value || false}
                        onValueChange={() => handleToggle(item.id)}
                        trackColor={{
                            false: colors.border,
                            true: colors.secondary,
                        }}
                        thumbColor={item.value ? colors.secondary : colors.text.secondary}
                    />
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity
                    key={item.id}
                    style={styles.settingItem}
                    onPress={() => handleSettingPress(item.id)}
                    activeOpacity={0.7}
                >
                    <View style={styles.settingContent}>
                        <Ionicons
                            name={item.icon as any}
                            size={24}
                            color={colors.primary}
                        />
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>{item.title}</Text>
                            {item.subtitle && (
                                <Text style={styles.settingSubtitle}>
                                    {item.subtitle}
                                </Text>
                            )}
                        </View>
                    </View>
                    <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.text.secondary}
                    />
                </TouchableOpacity>
            );
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configurações</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Settings Content */}
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Conta Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Conta</Text>
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons
                                    name="person"
                                    size={24}
                                    color={colors.primary}
                                />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Meu Perfil</Text>
                                    <Text style={styles.settingSubtitle}>
                                        Ver e editar meus dados
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.text.secondary}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons
                                    name="lock-closed"
                                    size={24}
                                    color={colors.primary}
                                />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Alterar Senha</Text>
                                    <Text style={styles.settingSubtitle}>
                                        Atualize sua senha
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.text.secondary}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Notifications Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificações</Text>
                    <View style={styles.sectionContainer}>
                        {settings
                            .filter((s) => s.id === '1' || s.id === '2')
                            .map((setting) => renderSettingItem(setting))}
                    </View>
                </View>

                {/* Aplicativo Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Aplicativo</Text>
                    <View style={styles.sectionContainer}>
                        {settings
                            .filter(
                                (s) =>
                                    s.id === '3' ||
                                    s.id === '4' ||
                                    s.id === '5' ||
                                    s.id === '6'
                            )
                            .map((setting) => renderSettingItem(setting))}
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Zona de Perigo</Text>
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity
                            style={[styles.settingItem, styles.dangerItem]}
                            activeOpacity={0.7}
                        >
                            <View style={styles.settingContent}>
                                <Ionicons
                                    name="exit"
                                    size={24}
                                    color={colors.error}
                                />
                                <View style={styles.settingInfo}>
                                    <Text style={[styles.settingTitle, { color: colors.error }]}>
                                        Sair da Conta
                                    </Text>
                                    <Text style={styles.settingSubtitle}>
                                        Desconectar desta conta
                                    </Text>
                                </View>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={20}
                                color={colors.error}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Tab Bar */}
            <BottomTabBar
                activeTab="menu"
                onTabPress={(tab) => {
                    if (tab === 'home') {
                        navigation.navigate('Home');
                    } else if (tab === 'search') {
                        navigation.navigate('Announcement');
                    } else if (tab === 'chat') {
                        navigation.navigate('ChatList');
                    } else if (tab === 'announce') {
                        navigation.navigate('CreateService');
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
        backgroundColor: colors.surface,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingVertical: spacing.lg,
        paddingBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xxl,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    sectionContainer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.border,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    settingContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: spacing.lg,
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    settingSubtitle: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    dangerItem: {
        borderBottomWidth: 0,
    },
});
