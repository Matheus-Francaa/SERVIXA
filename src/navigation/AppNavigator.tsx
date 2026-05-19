import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { AnnouncementScreen } from '../screens/AnnouncementScreen';
import { ChatListScreen } from '../screens/ChatListScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { CheckoutScreen } from '../screens/CheckoutScreen';
import { CreateServiceScreen } from '../screens/CreateServiceScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ServiceDetailScreen } from '../screens/ServiceDetailScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SuccessScreen } from '../screens/SuccessScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#F9FAFB' },
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Announcement" component={AnnouncementScreen} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
            <Stack.Screen name="ChatList" component={ChatListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="CreateService" component={CreateServiceScreen} />
        </Stack.Navigator>
    );
};
