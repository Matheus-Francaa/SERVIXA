import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

interface Conversation {
    id: string;
    prestadorId: string;
    prestadorName: string;
    prestadorImage: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
}

export const ChatListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            prestadorId: '1',
            prestadorName: 'João Silva',
            prestadorImage: 'https://picsum.photos/seed/prestador1/100/100',
            lastMessage: 'Ótimo! Posso ir amanhã às 10h',
            timestamp: '2 min atrás',
            unreadCount: 0,
        },
        {
            id: '2',
            prestadorId: '2',
            prestadorName: 'Carlos Mendes',
            prestadorImage: 'https://picsum.photos/seed/prestador2/100/100',
            lastMessage: 'Qual é a metragem do cômodo?',
            timestamp: '1 hora atrás',
            unreadCount: 2,
        },
        {
            id: '3',
            prestadorId: '3',
            prestadorName: 'Pedro Santos',
            prestadorImage: 'https://picsum.photos/seed/prestador3/100/100',
            lastMessage: 'Agradecido pelo feedback!',
            timestamp: '5 horas atrás',
            unreadCount: 0,
        },
        {
            id: '4',
            prestadorId: '4',
            prestadorName: 'Maria Costa',
            prestadorImage: 'https://picsum.photos/seed/prestador4/100/100',
            lastMessage: 'Vou enviar o orçamento',
            timestamp: 'ontem',
            unreadCount: 1,
        },
    ]);

    const handleConversationPress = (conversation: Conversation) => {
        navigation.navigate('Chat', {
            prestador: {
                id: conversation.prestadorId,
                name: conversation.prestadorName,
                image: conversation.prestadorImage,
            },
            conversationId: conversation.id,
        });
    };

    const renderConversationItem = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
            style={styles.conversationCard}
            onPress={() => handleConversationPress(item)}
        >
            <Image
                source={{ uri: item.prestadorImage }}
                style={styles.prestadorImage}
            />

            <View style={styles.conversationInfo}>
                <View style={styles.nameRow}>
                    <Text style={styles.prestadorName}>{item.prestadorName}</Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <Text
                    style={[
                        styles.lastMessage,
                        item.unreadCount > 0 && styles.unreadMessage,
                    ]}
                    numberOfLines={1}
                >
                    {item.lastMessage}
                </Text>
            </View>

            {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mensagens</Text>
                <TouchableOpacity>
                    <Ionicons name="create-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Conversations List */}
            <FlatList
                data={conversations}
                renderItem={renderConversationItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            {/* Bottom Tab Bar */}
            <BottomTabBar
                activeTab="chat"
                onTabPress={(tab) => {
                    if (tab === 'home') {
                        navigation.navigate('Home');
                    } else if (tab === 'search') {
                        navigation.navigate('Announcement');
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
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    listContent: {
        paddingVertical: spacing.md,
        paddingBottom: spacing.xxl + 80,
    },
    conversationCard: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    prestadorImage: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: spacing.lg,
        backgroundColor: colors.border,
    },
    conversationInfo: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    prestadorName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    timestamp: {
        fontSize: 12,
        color: colors.text.secondary,
    },
    lastMessage: {
        fontSize: 13,
        color: colors.text.secondary,
    },
    unreadMessage: {
        color: colors.text.primary,
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.md,
    },
    unreadBadgeText: {
        color: colors.surface,
        fontSize: 12,
        fontWeight: 'bold',
    },
});
