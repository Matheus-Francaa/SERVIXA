import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
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
import { api } from '../services/api';

export const CreateServiceScreen: React.FC<{ navigation: any }> = ({
    navigation,
}) => {
    const [serviceName, setServiceName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pricePerHour, setPricePerHour] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        api.categories.list().then(setCategories).catch(() => {});
    }, []);

    const handleCreateService = async () => {
        if (!serviceName.trim()) { Alert.alert('Erro', 'Nome do serviço é obrigatório'); return; }
        if (!description.trim()) { Alert.alert('Erro', 'Descrição é obrigatória'); return; }
        if (!pricePerHour.trim()) { Alert.alert('Erro', 'Preço por hora é obrigatório'); return; }
        if (!selectedCategory) { Alert.alert('Erro', 'Selecione uma categoria'); return; }

        const price = parseFloat(pricePerHour.replace(',', '.'));
        if (isNaN(price) || price <= 0) { Alert.alert('Erro', 'Preço inválido'); return; }

        setSubmitting(true);
        try {
            await api.services.create({
                title: serviceName,
                description,
                price,
                location: 'Centro · São Paulo',
                imageUrl: imageUrl || undefined,
                categoryId: selectedCategory,
            });
            Alert.alert('Sucesso!', `Serviço "${serviceName}" criado com sucesso!`, [
                { text: 'Voltar para Home', onPress: () => navigation.navigate('Home') },
            ]);
        } catch (err: any) {
            Alert.alert('Erro', err.message || 'Falha ao criar serviço');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSelectCategory = () => {
        const options = categories.map((c: any) => ({
            text: c.label,
            onPress: () => setSelectedCategory(String(c.id)),
        }));
        Alert.alert('Selecione uma categoria', '', [
            ...options,
            { text: 'Cancelar', onPress: () => {}, style: 'cancel' as const },
        ]);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Novo Serviço</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                    <Text style={styles.label}>Nome do Serviço *</Text>
                    <TextInput style={styles.input} placeholder="Ex: Limpeza Residencial" value={serviceName} onChangeText={setServiceName} placeholderTextColor={colors.text.secondary} />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Descrição *</Text>
                    <TextInput style={[styles.input, styles.textArea]} placeholder="Descreva detalhes do seu serviço..." value={description} onChangeText={setDescription} multiline numberOfLines={5} placeholderTextColor={colors.text.secondary} textAlignVertical="top" />
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Categoria *</Text>
                    <TouchableOpacity style={styles.categoryButton} onPress={handleSelectCategory}>
                        <Text style={styles.categoryButtonText}>
                            {categories.find((c: any) => String(c.id) === selectedCategory)?.label || 'Selecionar categoria'}
                        </Text>
                        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>Preço por Hora (R$) *</Text>
                    <View style={styles.priceInputContainer}>
                        <Text style={styles.currencySymbol}>R$</Text>
                        <TextInput style={styles.priceInput} placeholder="0,00" value={pricePerHour} onChangeText={setPricePerHour} keyboardType="decimal-pad" placeholderTextColor={colors.text.secondary} />
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.label}>URL da Imagem (Opcional)</Text>
                    <TextInput style={styles.input} placeholder="https://picsum.photos/seed/service/400/300" value={imageUrl} onChangeText={setImageUrl} placeholderTextColor={colors.text.secondary} />
                </View>

                <View style={{ height: spacing.lg }} />
                <TouchableOpacity style={[styles.createButton, submitting && { opacity: 0.6 }]} onPress={handleCreateService} disabled={submitting}>
                    <Ionicons name="add-circle" size={20} color={colors.surface} style={{ marginRight: spacing.sm }} />
                    <Text style={styles.createButtonText}>{submitting ? 'Criando...' : 'Cadastrar Serviço'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <View style={{ height: spacing.xxl }} />
            </ScrollView>

            <BottomTabBar
                activeTab="announce"
                onTabPress={(tab) => {
                    if (tab === 'home') navigation.navigate('Home');
                    else if (tab === 'search') navigation.navigate('Announcement');
                    else if (tab === 'chat') navigation.navigate('ChatList');
                    else if (tab === 'menu') navigation.navigate('Settings');
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: { fontSize: 18, fontWeight: '600', color: colors.text.primary },
    content: { flex: 1 },
    contentContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
    section: { marginBottom: spacing.lg },
    label: { fontSize: 14, fontWeight: '600', color: colors.text.primary, marginBottom: spacing.sm },
    input: { borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: 14, color: colors.text.primary, backgroundColor: colors.surface },
    textArea: { minHeight: 120, paddingTop: spacing.md },
    categoryButton: { flexDirection: 'row', borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: spacing.md, paddingVertical: spacing.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'space-between' },
    categoryButtonText: { fontSize: 14, color: colors.text.primary, flex: 1 },
    priceInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border, borderRadius: 8, backgroundColor: colors.surface, paddingHorizontal: spacing.md },
    currencySymbol: { fontSize: 16, fontWeight: '600', color: colors.text.secondary, marginRight: spacing.sm },
    priceInput: { flex: 1, paddingVertical: spacing.md, fontSize: 14, color: colors.text.primary },
    createButton: { flexDirection: 'row', backgroundColor: colors.primary, paddingVertical: spacing.md, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
    createButtonText: { fontSize: 16, fontWeight: '600', color: colors.surface },
    cancelButton: { paddingVertical: spacing.md, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.border },
    cancelButtonText: { fontSize: 16, fontWeight: '600', color: colors.text.primary },
});
