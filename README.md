# SERVIXA
### Um app marketplace de serviços em react-nactive 


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
ou com ngrok e zerando o cache(pode ser necessário a depender da rede):
```bash
npx expo start -c --tunnel 
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

### ngrok local 
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

## equipe de desenvolvimento
* Gustavo de Castro - UC24200806  -- Desenvolvimento back-end/ Versionamento/ Autenticação 
* Ricardo Marques - UC24200674    -- Desenvolvimento back-end/ Banco de Dados/ Integração com front-end
* Victor Hugo - UC24200221        -- Desenvolvimento back-end/ Banco de dados/ Documentação 
* Matheus Franca - UC24100886     -- Desenvolvimento front-end/ Design e Modelagem Figma/ Versionamento  
* Daniel Cardoso - UC24200358     -- Desenvolvimento front-end/ Design e Modelagem Figma/ Refatoração 
* Kauã Kairon - UC24102957        -- Desenvolvimento front-end/ Documentação/ Animações
