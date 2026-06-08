import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import {
  FADE_IN_DOWN,
  FADE_IN_LEFT,
  FADE_IN_RIGHT,
  SLIDE_IN_UP,
  staggeredEntrance,
} from '../utils/animations';

interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
}

export const ChatScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const { user } = useAuth();
    const { prestador, conversationId } = route.params || {};
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    const loadMessages = useCallback(() => {
        if (conversationId) {
            api.conversations.messages.list(conversationId).then(setMessages).catch(() => {});
        }
    }, [conversationId]);

    useEffect(() => {
        loadMessages();
    }, [loadMessages]);

    const handleSendMessage = async () => {
        if (inputText.trim() === '' || !conversationId) return;

        const optimistic: Message = {
            id: String(Date.now()),
            senderId: user?.id || '',
            text: inputText,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimistic]);
        setInputText('');

        try {
            const sent = await api.conversations.messages.send(conversationId, inputText);
            setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? sent : m)));
        } catch {
            setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        }
    };

    const renderMessageItem = ({ item }: { item: Message }) => {
        const isUser = item.senderId === user?.id;
        return (
            <Animated.View
                entering={isUser ? FADE_IN_RIGHT : FADE_IN_LEFT}
                style={[styles.messageContainer, isUser && styles.userMessageContainer]}
            >
                {!isUser && prestador?.image && (
                    <Image source={{ uri: prestador.image }} style={styles.messageAvatar} />
                )}
                {!isUser && !prestador?.image && (
                    <View style={[styles.messageAvatar, { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="person" size={18} color={colors.text.secondary} />
                    </View>
                )}
                <View style={[styles.messageBubble, isUser && styles.userMessageBubble]}>
                    <Text style={[styles.messageText, isUser && styles.userMessageText]}>{item.text}</Text>
                    <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
                        {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <Animated.View entering={FADE_IN_DOWN} style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    {prestador?.image ? (
                        <Image source={{ uri: prestador.image }} style={styles.headerAvatar} />
                    ) : (
                        <View style={[styles.headerAvatar, { backgroundColor: colors.border, justifyContent: 'center', alignItems: 'center' }]}>
                            <Ionicons name="person" size={22} color={colors.text.secondary} />
                        </View>
                    )}
                    <View>
                        <Text style={styles.headerName}>{prestador?.name || 'Prestador'}</Text>
                        <Text style={styles.headerStatus}>Online agora</Text>
                    </View>
                </View>
                <TouchableOpacity>
                    <Ionicons name="call" size={24} color={colors.primary} />
                </TouchableOpacity>
            </Animated.View>

            <FlatList
                data={messages.slice().reverse()}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                inverted
            />

            <Animated.View entering={SLIDE_IN_UP} style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escreva sua mensagem..."
                        placeholderTextColor={colors.text.secondary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <Pressable
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                        disabled={inputText.trim() === ''}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={inputText.trim() === '' ? colors.text.secondary : colors.primary}
                        />
                    </Pressable>
                </View>
            </Animated.View>

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
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: colors.surface },
    headerInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: spacing.md },
    headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: spacing.md, backgroundColor: colors.border },
    headerName: { fontSize: 14, fontWeight: 'bold', color: colors.text.primary },
    headerStatus: { fontSize: 12, color: colors.secondary, marginTop: spacing.sm },
    messagesList: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexGrow: 1, justifyContent: 'flex-end' },
    messageContainer: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: spacing.md, gap: spacing.sm },
    userMessageContainer: { justifyContent: 'flex-end' },
    messageAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.border },
    messageBubble: { maxWidth: '80%', backgroundColor: colors.surface, borderRadius: 16, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, elevation: 1 },
    userMessageBubble: { backgroundColor: colors.primary },
    messageText: { fontSize: 14, color: colors.text.primary, marginBottom: spacing.sm },
    userMessageText: { color: colors.surface },
    messageTime: { fontSize: 11, color: colors.text.secondary },
    userMessageTime: { color: 'rgba(255, 255, 255, 0.7)' },
    inputContainer: { backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', backgroundColor: colors.background, borderRadius: 24, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.md },
    input: { flex: 1, fontSize: 14, color: colors.text.primary, paddingVertical: spacing.sm, maxHeight: 80 },
    sendButton: { padding: spacing.sm },
});
