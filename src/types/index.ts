// Tipos e Interfaces utilizadas no projeto SERVIXA

export interface Service {
    id: string;
    title: string;
    price: number;
    location: string;
    imageUrl: string;
    description?: string;
    prestador?: string;
    avaliacao?: string;
    avaliacoes?: string;
    data?: string;
    userId?: string;
    categoryId?: number;
    latitude?: number;
    longitude?: number;
}

export interface Category {
    id: string;
    label: string;
}

export interface PaymentMethod {
    id: 'pix' | 'credit' | 'debit';
    label: string;
    description: string;
    icon: string;
    iconColor: string;
}

export interface Prestador {
    id: string;
    name: string;
    image: string;
}

export interface CheckoutData {
    serviceId: string;
    paymentMethod: PaymentMethod['id'];
    amount: number;
    serviceFee: number;
    total: number;
}

export interface RootStackParamList {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Announcement: undefined;
    ServiceDetail: {
        service: Service;
    };
    Checkout: {
        service: Service;
    };
    Success: {
        service: Service;
        paymentMethod: 'pix' | 'credit' | 'debit';
        amount: number;
    };
    ChatList: undefined;
    Chat: {
        prestador: Prestador;
        conversationId: string;
    };
    Settings: undefined;
    CreateService: undefined;
    [key: string]: undefined | any;
}

export interface NavigationProps {
    navigation: any;
    route: any;
}
