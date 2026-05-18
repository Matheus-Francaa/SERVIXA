import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabBar } from '../components/BottomTabBar';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface Message {
    id: string;
    sender: 'user' | 'prestador';
    text: string;
    timestamp: string;
}

interface Prestador {
    id: string;
    name: string;
    image: string;
}

export const ChatScreen: React.FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const { prestador, conversationId } = route.params || {
        prestador: {
            id: '1',
            name: 'João Silva',
            image: 'https://picsum.photos/seed/prestador/100/100',
        },
        conversationId: '1',
    };

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'prestador',
            text: 'Olá! Tudo bem? Recebi sua solicitação!',
            timestamp: '10:30',
        },
        {
            id: '2',
            sender: 'user',
            text: 'Oi! Tudo certo! Qual é sua disponibilidade?',
            timestamp: '10:32',
        },
        {
            id: '3',
            sender: 'prestador',
            text: 'Posso ir amanhã à noite, a partir das 18h',
            timestamp: '10:33',
        },
        {
            id: '4',
            sender: 'user',
            text: 'Perfeito! Vou confirmar e envio meu endereço',
            timestamp: '10:35',
        },
        {
            id: '5',
            sender: 'prestador',
            text: 'Ótimo! Fico no aguardo 😊',
            timestamp: '10:36',
        },
    ]);

    const [inputText, setInputText] = useState('');

    const handleSendMessage = () => {
        if (inputText.trim() === '') return;

        const newMessage: Message = {
            id: String(messages.length + 1),
            sender: 'user',
            text: inputText,
            timestamp: new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };

        setMessages([...messages, newMessage]);
        setInputText('');

        // Simular resposta do prestador após 1 segundo
        setTimeout(() => {
            const responses = [
                'Entendi perfeitamente!',
                'Tudo certo, anotei!',
                'Perfeito, sem problemas!',
                'Ótimo, pode deixar comigo!',
                'Confirmado! 👍',
            ];
            const randomResponse =
                responses[Math.floor(Math.random() * responses.length)];

            const prestadorMessage: Message = {
                id: String(messages.length + 2),
                sender: 'prestador',
                text: randomResponse,
                timestamp: new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            };

            setMessages((prevMessages) => [...prevMessages, prestadorMessage]);
        }, 1000);
    };

    const renderMessageItem = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageContainer,
                item.sender === 'user' && styles.userMessageContainer,
            ]}
        >
            {item.sender === 'prestador' && (
                <Image
                    source={{ uri: prestador.image }}
                    style={styles.messageAvatar}
                />
            )}

            <View
                style={[
                    styles.messageBubble,
                    item.sender === 'user' && styles.userMessageBubble,
                ]}
            >
                <Text
                    style={[
                        styles.messageText,
                        item.sender === 'user' && styles.userMessageText,
                    ]}
                >
                    {item.text}
                </Text>
                <Text
                    style={[
                        styles.messageTime,
                        item.sender === 'user' && styles.userMessageTime,
                    ]}
                >
                    {item.timestamp}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={28} color={colors.primary} />
                </TouchableOpacity>

                <View style={styles.headerInfo}>
                    <Image
                        source={{ uri: prestador.image }}
                        style={styles.headerAvatar}
                    />
                    <View>
                        <Text style={styles.headerName}>{prestador.name}</Text>
                        <Text style={styles.headerStatus}>Online agora</Text>
                    </View>
                </View>

                <TouchableOpacity>
                    <Ionicons name="call" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            <FlatList
                data={messages}
                renderItem={renderMessageItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.messagesList}
                showsVerticalScrollIndicator={false}
                inverted
            />

            {/* Input Area */}
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escreva sua mensagem..."
                        placeholderTextColor={colors.text.secondary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={handleSendMessage}
                        disabled={inputText.trim() === ''}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={
                                inputText.trim() === ''
                                    ? colors.text.secondary
                                    : colors.primary
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>

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
        backgroundColor: colors.surface,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginHorizontal: spacing.md,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: spacing.md,
        backgroundColor: colors.border,
    },
    headerName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    headerStatus: {
        fontSize: 12,
        color: colors.secondary,
        marginTop: spacing.sm,
    },
    messagesList: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    userMessageContainer: {
        justifyContent: 'flex-end',
    },
    messageAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.border,
    },
    messageBubble: {
        maxWidth: '80%',
        backgroundColor: colors.surface,
        borderRadius: 16,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        elevation: 1,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
    },
    userMessageBubble: {
        backgroundColor: colors.primary,
    },
    messageText: {
        fontSize: 14,
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    userMessageText: {
        color: colors.surface,
    },
    messageTime: {
        fontSize: 11,
        color: colors.text.secondary,
    },
    userMessageTime: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    inputContainer: {
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: colors.background,
        borderRadius: 24,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.md,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: colors.text.primary,
        paddingVertical: spacing.sm,
        maxHeight: 80,
    },
    sendButton: {
        padding: spacing.sm,
    },
});
