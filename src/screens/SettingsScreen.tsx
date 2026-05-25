import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
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
import { useAuth } from '../contexts/AuthContext';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { user, signOut } = useAuth();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

    const handleSignOut = () => {
        Alert.alert('Sair da Conta', 'Tem certeza que deseja sair?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Sair',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Configurações</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Conta</Text>
                    <View style={styles.sectionContainer}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingContent}>
                                <Ionicons name="person" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>{user?.name || 'Meu Perfil'}</Text>
                                    <Text style={styles.settingSubtitle}>{user?.email || ''}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons name="lock-closed" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Alterar Senha</Text>
                                    <Text style={styles.settingSubtitle}>Atualize sua senha</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notificações</Text>
                    <View style={styles.sectionContainer}>
                        <View style={styles.settingItem}>
                            <View style={styles.settingContent}>
                                <Ionicons name="notifications" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Notificações</Text>
                                    <Text style={styles.settingSubtitle}>Receba alertas de novas mensagens</Text>
                                </View>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: colors.border, true: colors.secondary }}
                                thumbColor={notificationsEnabled ? colors.secondary : colors.text.secondary}
                            />
                        </View>
                        <View style={styles.settingItem}>
                            <View style={styles.settingContent}>
                                <Ionicons name="moon" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Modo Noturno</Text>
                                    <Text style={styles.settingSubtitle}>Ativar tema escuro</Text>
                                </View>
                            </View>
                            <Switch
                                value={darkModeEnabled}
                                onValueChange={setDarkModeEnabled}
                                trackColor={{ false: colors.border, true: colors.secondary }}
                                thumbColor={darkModeEnabled ? colors.secondary : colors.text.secondary}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Aplicativo</Text>
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Privacidade e Segurança</Text>
                                    <Text style={styles.settingSubtitle}>Gerenciar permissões</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons name="help-circle" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Centro de Ajuda</Text>
                                    <Text style={styles.settingSubtitle}>Dúvidas frequentes e suporte</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons name="document-text" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Termos de Serviço</Text>
                                    <Text style={styles.settingSubtitle}>Leia nossos termos</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons name="information-circle" size={24} color={colors.primary} />
                                <View style={styles.settingInfo}>
                                    <Text style={styles.settingTitle}>Sobre</Text>
                                    <Text style={styles.settingSubtitle}>Versão 1.0.0</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Zona de Perigo</Text>
                    <View style={styles.sectionContainer}>
                        <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleSignOut} activeOpacity={0.7}>
                            <View style={styles.settingContent}>
                                <Ionicons name="exit" size={24} color={colors.error} />
                                <View style={styles.settingInfo}>
                                    <Text style={[styles.settingTitle, { color: colors.error }]}>Sair da Conta</Text>
                                    <Text style={styles.settingSubtitle}>Desconectar desta conta</Text>
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.error} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            <BottomTabBar
                activeTab="menu"
                onTabPress={(tab) => {
                    if (tab === 'home') navigation.navigate('Home');
                    else if (tab === 'search') navigation.navigate('Announcement');
                    else if (tab === 'chat') navigation.navigate('ChatList');
                    else if (tab === 'announce') navigation.navigate('CreateService');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollView: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary },
    scrollContent: { paddingVertical: spacing.lg, paddingBottom: spacing.xl },
    section: { marginBottom: spacing.xxl },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: colors.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
    sectionContainer: { backgroundColor: colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
    settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
    settingContent: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: spacing.lg },
    settingInfo: { flex: 1 },
    settingTitle: { fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm },
    settingSubtitle: { fontSize: 12, color: colors.text.secondary },
    dangerItem: { borderBottomWidth: 0 },
});
