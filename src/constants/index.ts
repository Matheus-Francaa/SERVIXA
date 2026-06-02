// Dados e constantes do projeto

export const MOCK_SERVICES = [
    {
        id: '1',
        title: 'Limpeza Residencial Completa',
        price: 250,
        location: 'Centro · São Paulo',
        imageUrl: 'https://picsum.photos/seed/service1/400/300',
        description:
            'Limpeza profissional completa de residências incluindo todos os cômodos, sanitização e organização. Contamos com equipe treinada e produtos de qualidade.',
        prestador: 'João Silva',
        avaliacao: '4.8',
        avaliacoes: '156',
        data: '15 de outubro de 2026',
    },
    {
        id: '2',
        title: 'Serviço de Encanamento Urgente',
        price: 150,
        location: 'Vila Madalena · São Paulo',
        imageUrl: 'https://picsum.photos/seed/service2/400/300',
        description:
            'Atendimento rápido para vazamentos, destupição e consertos hidráulicos. Disponível 24 horas com profissionais experientes.',
        prestador: 'Carlos Mendes',
        avaliacao: '4.9',
        avaliacoes: '203',
        data: '16 de outubro de 2026',
    },
    {
        id: '3',
        title: 'Instalação Elétrica Residencial',
        price: 320,
        location: 'Pinheiros · São Paulo',
        imageUrl: 'https://picsum.photos/seed/service3/400/300',
        description:
            'Serviços de instalação, manutenção e reparo de sistemas elétricos residenciais. Atendemos também para reforma e ampliação de redes.',
        prestador: 'Roberto Dias',
        avaliacao: '4.7',
        avaliacoes: '89',
        data: '17 de outubro de 2026',
    },
    {
        id: '4',
        title: 'Reparo em Vazamentos',
        price: 180,
        location: 'Consolação · São Paulo',
        imageUrl: 'https://picsum.photos/seed/service4/400/300',
        description:
            'Identificação e reparo de todos os tipos de vazamentos em sistemas hidráulicos residenciais e comerciais.',
        prestador: 'Pedro Costa',
        avaliacao: '4.9',
        avaliacoes: '128',
        data: '18 de outubro de 2026',
    },
];

export const MOCK_CATEGORIES = [
    { id: '1', label: 'Limpeza' },
    { id: '2', label: 'Encanamento' },
    { id: '3', label: 'Elétrica' },
];

export const PAYMENT_METHODS = [
    {
        id: 'pix' as const,
        label: 'Pix',
        description: 'Liberação imediata • Sem taxas adicionais',
        icon: 'qrcode-scan',
        iconColor: '#FF6B35',
    },
    {
        id: 'credit' as const,
        label: 'Cartão de crédito',
        description: 'Até 12x • Parcela mínima R$ 13,54',
        icon: 'credit-card',
        iconColor: '#2563EB',
    },
    {
        id: 'debit' as const,
        label: 'Cartão de débito',
        description: 'Sem cobranças adicionais',
        icon: 'credit-card-outline',
        iconColor: '#10B981',
    },
];

export const COLORS = {
    primary: '#2563EB',
    secondary: '#10B981',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: {
        primary: '#111827',
        secondary: '#6B7280',
    },
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    star: '#FBBF24',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
};

// Constantes de preços
export const PRICING = {
    SERVICE_VALUE: 150.0,
    SERVICE_FEE_PERCENTAGE: 0.0833, // ~8.33%
    calculateServiceFee: (value: number) => value * 0.0833,
};
