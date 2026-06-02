# Bem-vindo ao seu app Expo 👋

Este é um projeto [Expo](https://expo.dev) criado com [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Primeiros passos

1. Instale as dependências

   ```bash
   npm install
   ```

2. Inicie o app

   ```bash
   npx expo start
   ```

Na saída, você encontrará opções para abrir o app em:

- [build de desenvolvimento](https://docs.expo.dev/develop/development-builds/introduction/)
- [emulador Android](https://docs.expo.dev/workflow/android-studio-emulator/)
- [simulador iOS](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), um sandbox limitado para experimentar o desenvolvimento de app com Expo


Marketplace de serviços domésticos.

## Stack

- **Frontend:** React Native (Expo SDK 54), React Navigation
- **Backend:** Express 5, Drizzle ORM, Better-Auth, SQLite
- **Linguagem:** TypeScript

## Setup

```bash
# Instalar dependências do frontend
pnpm install

# Instalar dependências do backend
cd api && pnpm install && cd ..
```


## Ambiente

```bash
cp .env.example .env
```

Ajuste as URLs no `.env` conforme necessário.

## Rodar a API

### Sem Docker

```bash
cd api

# Criar as tabelas no banco
pnpm db:push

# Popular com dados de demonstração
pnpm seed
pnpm seed:users

# Iniciar servidor (http://localhost:3000)
pnpm dev
```

### Com Docker

```bash
cd api

# Build e iniciar
docker compose up -d

# Ver logs
docker compose logs -f

# Parar
docker compose down
```

A API roda em `http://localhost:3000`. O banco SQLite fica em um volume Docker.


## Rodar o frontend

Com a API rodando, em outro terminal:

```bash
npx expo start
```

## Scripts da API

| Comando | Descrição |
|---|---|
| `pnpm dev` | Iniciar servidor com hot-reload |
| `pnpm start` | Iniciar servidor |
| `pnpm test` | Rodar testes |
| `pnpm typecheck` | Verificar tipos |
| `pnpm lint` | Rodar ESLint |
| `pnpm db:push` | Sincronizar schema com o banco |
| `pnpm seed` | Popular categorias e serviços |
| `pnpm seed:users` | Criar usuários de demonstração |

## ngrok

Para testar o app em um **dispositivo físico** (Android/iOS), você precisa expor a API com ngrok.

### Opção 1: ngrok local (sem Docker)

1. Instale o ngrok: [https://ngrok.com/download](https://ngrok.com/download)
2. Inicie o túnel:
   ```bash
   ngrok http 3000
   ```
3. Copie a URL HTTPS gerada (ex: `https://abc123.ngrok-free.dev`)
4. Atualize o `.env`:
   ```env
   BASE_URL=https://abc123.ngrok-free.dev
   EXPO_PUBLIC_API_URL=https://abc123.ngrok-free.dev/api
   BETTER_AUTH_TRUSTED_ORIGINS=https://abc123.ngrok-free.dev
   ```
5. Reinicie a API: `cd api && pnpm dev`

```

O frontend (Expo) lê `EXPO_PUBLIC_API_URL` do `.env` para saber para onde apontar as requisições.
>>>>>>> api
