#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

API_DIR="./api"
DB_FILE="$API_DIR/servixa.db"

echo "╔════════════════════════════════════════════╗"
echo "║        SERVIXA — Iniciando Demo           ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# ── Step 1: Reset database ──
echo "[1/7] Resetando banco de dados..."
rm -f "$DB_FILE"
echo "  -> OK"

# ── Step 2: Create tables ──
echo "[2/7] Criando tabelas..."
(cd "$API_DIR" && pnpm db:push 2>/dev/null)
echo "  -> OK"

# ── Step 3: Seed categories + services ──
echo "[3/7] Populando categorias e serviços..."
node --import tsx "$API_DIR/db/seed.ts"
echo "  -> OK"

# ── Step 4: Start API (uses localhost baseURL by default) ──
echo "[4/7] Iniciando API..."
node --import tsx "$API_DIR/index.ts" &
API_PID=$!
echo "  -> PID: $API_PID"

# Wait for API to be ready
for i in $(seq 1 20); do
  if curl -s http://localhost:3000/api/categories > /dev/null 2>&1; then
    echo "  -> API pronta (localhost:3000)"
    break
  fi
  if [ "$i" -eq 20 ]; then
    echo "  -> ERRO: API não iniciou a tempo"
    kill $API_PID 2>/dev/null
    exit 1
  fi
  sleep 0.5
done

# ── Step 5: Create demo + prestador users ──
echo "[5/7] Criando usuários de demonstração..."
node --import tsx "$API_DIR/db/seed-users.ts"
echo "  -> OK"

# ── Step 6: Detect ngrok URL ──
echo "[6/7] Detectando URL do ngrok..."
NGROK_URL=""
for i in $(seq 1 20); do
  TUNNELS=$(curl -s http://localhost:4040/api/tunnels 2>/dev/null || echo "")
  NGROK_URL=$(echo "$TUNNELS" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    for t in data.get('tunnels', []):
        if t.get('public_url','').startswith('https://'):
            print(t['public_url'])
            break
except: pass
" 2>/dev/null || echo "")
  if [ -n "$NGROK_URL" ]; then
    echo "  -> $NGROK_URL"
    break
  fi
  if [ "$i" -eq 20 ]; then
    echo "  -> ngrok não detectado. Verifique se está rodando: ngrok http 3000"
  fi
  sleep 0.5
done

# ── Write .env ──
echo "Configurando .env..."
if [ -n "$NGROK_URL" ]; then
  cat > .env << EOF
EXPO_PUBLIC_API_URL=$NGROK_URL/api
BASE_URL=$NGROK_URL
EOF
  echo "  -> .env atualizado com $NGROK_URL"
else
  echo "  -> .env mantido (ngrok não detectado, use localhost para web/iOS)"
fi

# ── Summary ──
echo ""
echo "╔════════════════════════════════════════════╗"
echo "║     SERVIXA — Demonstração Pronta!        ║"
echo "╠════════════════════════════════════════════╣"
echo "║                                          ║"
echo "║  📱 Login:  demo@servixa.com             ║"
echo "║  🔑 Senha:  123456                       ║"
echo "║                                          ║"
if [ -n "$NGROK_URL" ]; then
echo "║  🌐 API:    $NGROK_URL  ║"
fi
echo "║  🚀 Expo:   npx expo start               ║"
echo "║                                          ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "Pressione Ctrl+C para parar a API"

# Keep API running
wait $API_PID
