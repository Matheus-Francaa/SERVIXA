import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface CategoryChipProps {
    id: string;
    label: string;
    selected: boolean;
    onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
    id,
    label,
    selected,
    onPress,
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons
                    name="star"
                    size={24}
                    color={selected ? colors.primary : colors.text.secondary}
                />
                <Text
                    style={[
                        styles.label,
                        selected && { color: colors.primary, fontWeight: 'bold' },
                    ]}
                >
                    {label}
                </Text>
            </View>
            {selected && <View style={styles.underline} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        marginRight: spacing.lg,
    },
    content: {
        alignItems: 'center',
        gap: spacing.sm,
    },
    label: {
        fontSize: 12,
        color: colors.text.secondary,
        fontWeight: '500',
    },
    underline: {
        height: 3,
        backgroundColor: colors.primary,
        marginTop: spacing.sm,
        width: '80%',
        alignSelf: 'center',
        borderRadius: 1.5,
    },
});
