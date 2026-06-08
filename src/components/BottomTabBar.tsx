import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { SPRING_CONFIG } from '../utils/animations';

interface BottomTabBarProps {
    activeTab: string;
    onTabPress: (tab: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
    activeTab,
    onTabPress,
}) => {
    const tabs = [
        { id: 'home', icon: 'home', label: 'Home' },
        { id: 'search', icon: 'search', label: 'Buscar' },
        { id: 'announce', icon: 'add-circle', label: 'Anunciar' },
        { id: 'chat', icon: 'chatbubble', label: 'Chat' },
        { id: 'menu', icon: 'menu', label: 'Menu' },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isAnnounce = tab.id === 'announce';

                return (
                    <TabItem
                        key={tab.id}
                        tab={tab}
                        isActive={isActive}
                        isAnnounce={isAnnounce}
                        onPress={() => onTabPress(tab.id)}
                    />
                );
            })}
        </View>
    );
};

interface TabItemProps {
    tab: { id: string; icon: string; label: string };
    isActive: boolean;
    isAnnounce: boolean;
    onPress: () => void;
}

const TabItem: React.FC<TabItemProps> = React.memo(({ tab, isActive, isAnnounce, onPress }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
        scale.value = withSpring(isAnnounce ? 0.95 : 0.85, SPRING_CONFIG);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1, SPRING_CONFIG);
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.tab, isAnnounce && styles.announceTab]}
        >
            <Animated.View style={animatedStyle}>
                <Ionicons
                    name={tab.icon as any}
                    size={isAnnounce ? 40 : 24}
                    color={
                        isAnnounce
                            ? colors.surface
                            : isActive
                                ? colors.primary
                                : colors.text.secondary
                    }
                />
            </Animated.View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: spacing.md,
        paddingTop: spacing.md,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: -2 },
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
    },
    announceTab: {
        backgroundColor: colors.primary,
        borderRadius: 25,
        marginHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
});
