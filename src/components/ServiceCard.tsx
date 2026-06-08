import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { formatPrice } from '../utils/format';
import { FADE_IN_UP, SPRING_CONFIG } from '../utils/animations';

interface ServiceCardProps {
    id: string;
    title: string;
    price: number;
    location: string;
    imageUrl: string;
    onPress: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
    id,
    title,
    price,
    location,
    imageUrl,
    onPress,
}) => {
    const scale = useSharedValue(1);
    const formattedPrice = formatPrice(price);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(0.95, SPRING_CONFIG);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING_CONFIG);
    };

    return (
        <Animated.View entering={FADE_IN_UP}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
            >
                <Animated.View style={[styles.container, animatedStyle]}>
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                    <View style={styles.content}>
                        <Text style={styles.title} numberOfLines={2}>
                            {title}
                        </Text>
                        <Text style={styles.price}>{formattedPrice}</Text>
                        <Text style={styles.location}>{location}</Text>
                    </View>
                </Animated.View>
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 160,
        marginRight: spacing.md,
        borderRadius: 12,
        backgroundColor: colors.surface,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: '100%',
        height: 120,
        backgroundColor: '#E0E0E0',
    },
    content: {
        padding: spacing.md,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: spacing.sm,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: spacing.xs,
    },
    location: {
        fontSize: 12,
        color: colors.text.secondary,
    },
});
