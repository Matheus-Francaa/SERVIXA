import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
    FlatList,
    Image,
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
import { api } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';

interface Conversation {
    id: string;
    userId: string;
    prestadorId: string;
    lastMessage: string | null;
    lastMessageAt: string | null;
}

export const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useFocusEffect(
        useCallback(() => {
            api.conversations.list().then(setConversations).catch(() => {});
        }, [])
    );

    const handleConversationPress = async (conv: Conversation) => {
        try {
            const prestador = await api.prestadores.get(conv.prestadorId);
            navigation.navigate('Chat', {
                prestador: { id: prestador.id, name: prestador.name, image: prestador.image },
                conversationId: conv.id,
            });
        } catch {
            navigation.navigate('Chat', {
                prestador: { id: conv.prestadorId, name: 'Prestador', image: '' },
                conversationId: conv.id,
            });
        }
    };

    const renderConversationItem = ({ item }: { item: Conversation }) => (
        <TouchableOpacity style={styles.conversationCard} onPress={() => handleConversationPress(item)}>
            <View style={styles.prestadorImagePlaceholder}>
                <Ionicons name="person" size={28} color={colors.text.secondary} />
            </View>
            <View style={styles.conversationInfo}>
                <View style={styles.nameRow}>
                    <Text style={styles.prestadorName}>Prestador</Text>
                    {item.lastMessageAt && (
                        <Text style={styles.timestamp}>
                            {new Date(item.lastMessageAt).toLocaleDateString('pt-BR')}
                        </Text>
                    )}
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage || 'Nenhuma mensagem ainda'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mensagens</Text>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={conversations}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Nenhuma conversa ainda</Text>
                    </View>
                }
            />
            <BottomTabBar
                activeTab="chat"
                onTabPress={(tab) => {
                    if (tab === 'home') navigation.navigate('Home');
                    else if (tab === 'search') navigation.navigate('Announcement');
                    else if (tab === 'announce') navigation.navigate('CreateService');
                    else if (tab === 'menu') navigation.navigate('Settings');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text.primary },
    listContent: { paddingVertical: spacing.md, paddingBottom: spacing.xxl + 80 },
    conversationCard: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: '#EEEEEE', alignItems: 'center', backgroundColor: colors.surface },
    prestadorImagePlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.border, marginRight: spacing.lg, justifyContent: 'center', alignItems: 'center' },
    conversationInfo: { flex: 1 },
    nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    prestadorName: { fontSize: 14, fontWeight: 'bold', color: colors.text.primary },
    timestamp: { fontSize: 12, color: colors.text.secondary },
    lastMessage: { fontSize: 13, color: colors.text.secondary },
    emptyContainer: { padding: spacing.xxl * 2, alignItems: 'center' },
    emptyText: { fontSize: 14, color: colors.text.secondary },
});
