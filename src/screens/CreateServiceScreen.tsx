import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
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

export const CreateServiceScreen: React.FC<{ navigation: any }> = ({
    navigation,
}) => {
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [pricePerHour, setPricePerHour] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const categories = [
        { id: '1', label: 'Limpeza' },
        { id: '2', label: 'Encanamento' },
        { id: '3', label: 'Elétrica' },
    ];

    const handleCreateService = () => {
        // Validar campos
        if (!serviceName.trim()) {
            Alert.alert('Erro', 'Nome do serviço é obrigatório');
            return;
        }
        if (!description.trim()) {
            Alert.alert('Erro', 'Descrição é obrigatória');
            return;
        }
        if (!pricePerHour.trim()) {
            Alert.alert('Erro', 'Preço por hora é obrigatório');
            return;
        }

        // Validar preço
        const price = parseFloat(pricePerHour);
        if (isNaN(price) || price <= 0) {
            Alert.alert('Erro', 'Preço inválido');
            return;
        }

        // Simular criação do serviço
        Alert.alert(
            'Sucesso!',
            `Serviço "${serviceName}" criado com sucesso!\n\nVocê pode acompanhar seus serviços no perfil.`,
            [
                {
                    text: 'Voltar para Home',
                    onPress: () => {
                        navigation.navigate('Home');
                    },
                },
            ]
        );
    };

    const handleSelectCategory = () => {
        const categoryOptions = [
            { text: 'Limpeza', onPress: () => setSelectedCategory('1') },
            { text: 'Encanamento', onPress: () => setSelectedCategory('2') },
            { text: 'Elétrica', onPress: () => setSelectedCategory('3') },
            { text: 'Cancelar', onPress: () => { }, style: 'cancel' as const },
        ];
        Alert.alert('Selecione uma categoria', '', categoryOptions);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar
                barStyle="dark-content"
                backgroundColor={colors.background}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={colors.text.primary}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Serviço</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Form Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                {/* Service Name */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nome do Serviço *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Limpeza Residencial"
                        value={serviceName}
                        onChangeText={setServiceName}
                        placeholderTextColor={colors.text.secondary}
                    />
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.label}>Descrição *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Descreva detalhes do seu serviço..."
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={5}
                        placeholderTextColor={colors.text.secondary}
                        textAlignVertical="top"
                    />
                </View>

                {/* Category */}
                <View style={styles.section}>
                    <Text style={styles.label}>Categoria *</Text>
                    <TouchableOpacity
                        style={styles.categoryButton}
                        onPress={handleSelectCategory}
                    >
                        <Text style={styles.categoryButtonText}>
                            {categories.find((c) => c.id === selectedCategory)
                                ?.label || 'Selecionar categoria'}
                        </Text>
                        <Ionicons
                            name="chevron-down"
                            size={20}
                            color={colors.text.secondary}
                        />
                    </TouchableOpacity>
                </View>

                {/* Price Per Hour */}
                <View style={styles.section}>
                    <Text style={styles.label}>Preço por Hora (R$) *</Text>
                    <View style={styles.priceInputContainer}>
                        <Text style={styles.currencySymbol}>R$</Text>
                        <TextInput
                            style={styles.priceInput}
                            placeholder="0,00"
                            value={pricePerHour}
                            onChangeText={setPricePerHour}
                            keyboardType="decimal-pad"
                            placeholderTextColor={colors.text.secondary}
                        />
                    </View>
                </View>

                {/* Image URL (Optional) */}
                <View style={styles.section}>
                    <Text style={styles.label}>URL da Imagem (Opcional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="https://picsum.photos/seed/service/400/300"
                        value={imageUrl}
                        onChangeText={setImageUrl}
                        placeholderTextColor={colors.text.secondary}
                    />
                    <Text style={styles.helperText}>
                        Você pode usar URLs de imagens externas ou deixar em branco
                    </Text>
                </View>

                {/* Spacer */}
                <View style={{ height: spacing.lg }} />

                {/* Create Button */}
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateService}
                >
                    <Ionicons
                        name="add-circle"
                        size={20}
                        color={colors.surface}
                        style={{ marginRight: spacing.sm }}
                    />
                    <Text style={styles.createButtonText}>
                        Cadastrar Serviço
                    </Text>
                </TouchableOpacity>

                {/* Cancel Button */}
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <View style={{ height: spacing.xxl }} />
            </ScrollView>

            {/* Bottom Tab Bar */}
            <BottomTabBar
                activeTab="announce"
                onTabPress={(tab) => {
                    if (tab === 'home') {
                        navigation.navigate('Home');
                    } else if (tab === 'search') {
                        navigation.navigate('Announcement');
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
        fontWeight: '600',
        color: colors.text.primary,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },
    section: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        fontSize: 14,
        color: colors.text.primary,
        backgroundColor: colors.surface,
    },
    textArea: {
        minHeight: 120,
        paddingTop: spacing.md,
    },
    categoryButton: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    categoryButtonText: {
        fontSize: 14,
        color: colors.text.primary,
        flex: 1,
    },
    priceInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
    },
    currencySymbol: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.secondary,
        marginRight: spacing.sm,
    },
    priceInput: {
        flex: 1,
        paddingVertical: spacing.md,
        fontSize: 14,
        color: colors.text.primary,
    },
    helperText: {
        fontSize: 12,
        color: colors.text.secondary,
        marginTop: spacing.sm,
    },
    createButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.surface,
    },
    cancelButton: {
        paddingVertical: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
    },
});
