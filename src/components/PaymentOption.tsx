import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type PaymentIconType = keyof typeof MaterialCommunityIcons.glyphMap;

interface PaymentOptionProps {
    id: string;
    label: string;
    description: string;
    icon: PaymentIconType;
    iconColor: string;
    selected: boolean;
    onPress: () => void;
}

export const PaymentOption: React.FC<PaymentOptionProps> = ({
    id,
    label,
    description,
    icon,
    iconColor,
    selected,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.container,
                selected && styles.selectedContainer,
            ]}
        >
            <View style={styles.radioButton}>
                {selected && <View style={styles.radioButtonInner} />}
            </View>

            <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                    name={icon}
                    size={28}
                    color={iconColor}
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        marginVertical: spacing.md,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    selectedContainer: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.primary,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F0F9FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    description: {
        fontSize: 12,
        color: colors.text.secondary,
    },
});
