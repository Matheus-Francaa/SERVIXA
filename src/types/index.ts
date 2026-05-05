// Tipos e Interfaces utilizadas no projeto SERVIXA

export interface Service {
    id: string;
    title: string;
    price: string;
    location: string;
    imageUrl: string;
    description?: string;
    prestador?: string;
    avaliacao?: string;
    avaliacoes?: string;
    data?: string;
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

export interface CheckoutData {
    serviceId: string;
    paymentMethod: PaymentMethod['id'];
    amount: number;
    serviceFee: number;
    total: number;
}

export interface RootStackParamList {
    Home: undefined;
    ServiceDetail: {
        service: Service;
    };
    Checkout: {
        service: Service;
    };
    [key: string]: undefined | any;
}

export interface NavigationProps {
    navigation: any;
    route: any;
}
