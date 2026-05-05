import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

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
                    <TouchableOpacity
                        key={tab.id}
                        style={[
                            styles.tab,
                            isAnnounce && styles.announceTab,
                        ]}
                        onPress={() => onTabPress(tab.id)}
                    >
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
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

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
