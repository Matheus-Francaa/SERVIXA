import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { SPRING_CONFIG, TIMING_CONFIG } from '../utils/animations';

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
    const scale = useSharedValue(1);
    const underlineWidth = useSharedValue(selected ? 0.8 : 0);

    React.useEffect(() => {
        underlineWidth.value = withTiming(selected ? 0.8 : 0, TIMING_CONFIG);
    }, [selected]);

    const animatedScale = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedUnderline = useAnimatedStyle(() => ({
        width: `${underlineWidth.value * 100}%` as any,
        opacity: underlineWidth.value > 0 ? 1 : 0,
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.92, SPRING_CONFIG);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING_CONFIG);
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            <Animated.View style={[styles.container, animatedScale]}>
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
                <Animated.View style={[styles.underline, animatedUnderline]} />
            </Animated.View>
        </Pressable>
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
