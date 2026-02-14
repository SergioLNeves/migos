# Docker Setup - Migos Project

Este documento descreve a configuração Docker do projeto Migos (backend Go + frontend Expo).

## Estrutura dos Containers

```
┌─────────────────────────────────┐
│  migos-expo (Frontend)          │
│  Node 20 + pnpm + Expo          │
│  Portas: 8081, 19000-19002      │
└────────────┬────────────────────┘
             │
             │ HTTP via hostname "api"
             │
┌────────────▼────────────────────┐
│  migos-api (Backend)            │
│  Go 1.25.7 + Echo + SQLite      │
│  Porta: 8080                    │
│  Volume: sqlite_data:/app/data  │
└─────────────────────────────────┘
```

## Quick Start

### Primeira execução

```bash
cd /home/sergiolnrodrigues/Documentos/MobileAnima/migos

# Build das imagens
make build

# Iniciar serviços
make up

# Ver logs (opcional)
make logs
```

### Acesso aos serviços

- **Backend API**: http://localhost:8080
- **Expo DevTools**: http://localhost:19000
- **Metro Bundler**: http://localhost:8081

### Verificar saúde do backend

```bash
curl http://localhost:8080/health
```

## Comandos Disponíveis (Makefile)

| Comando        | Descrição                                              |
|----------------|--------------------------------------------------------|
| `make help`    | Lista todos os comandos disponíveis                    |
| `make build`   | Build das imagens Docker                               |
| `make up`      | Iniciar serviços em background                         |
| `make down`    | Parar serviços                                         |
| `make logs`    | Ver logs de todos os serviços (follow mode)            |
| `make logs-api`| Ver apenas logs do backend                             |
| `make logs-expo`| Ver apenas logs do frontend                           |
| `make restart` | Reiniciar serviços                                     |
| `make ps`      | Mostrar status dos serviços                            |
| `make rebuild` | Rebuild completo sem cache e reiniciar                 |
| `make clean`   | ⚠️ Remover containers, networks e volumes (DESTRUTIVO)|

## Detalhes Técnicos

### Backend (migos-api)

**Dockerfile**: Multi-stage build
- **Stage 1 (builder)**: Compila binário Go com CGO habilitado (necessário para SQLite)
- **Stage 2 (runtime)**: Imagem Alpine mínima com o binário

**Características**:
- Gera chaves RSA automaticamente durante o build
- Executa como usuário não-root (appuser:1000)
- Health check nativo (intervalo de 30s)
- Volume persistente para SQLite em `/app/data`

**Portas expostas**: 8080

### Frontend (migos-expo)

**Dockerfile**: Node.js 20 Alpine + pnpm

**Características**:
- Instala dependências com `pnpm install --frozen-lockfile`
- Configura `EXPO_PUBLIC_API_URL=http://api:8080` (hostname interno do Docker)
- Expo dev server escutando em `0.0.0.0` para acesso externo ao container
- stdin_open + tty habilitados para interatividade

**Portas expostas**:
- 8081: Metro bundler
- 19000: Expo DevTools
- 19001: Debugger
- 19002: Manifest server

### Networking

- **Network**: `migos_network` (bridge driver)
- **Comunicação interna**: Frontend acessa backend via `http://api:8080`
- **DNS interno**: Docker resolve hostname `api` para o IP do container do backend
- **Dependência**: Frontend só inicia após backend passar no health check (`depends_on.condition: service_healthy`)

### Persistência

- **Volume**: `sqlite_data` (driver local)
- **Montagem**: `/app/data` no container do backend
- **Conteúdo**: Banco de dados SQLite (`auth-session.db`)
- **Persistência**: Dados sobrevivem a restarts do container
- ⚠️ **Atenção**: `make clean` remove o volume e todos os dados

## Verificação End-to-End

### 1. Build e inicialização

```bash
docker-compose build
docker-compose up -d
docker-compose ps
```

**Esperado**: Ambos serviços com status `Up` e `healthy` (backend)

### 2. Health check do backend

```bash
curl http://localhost:8080/health
```

**Esperado**: Resposta JSON com status ok

### 3. Verificar comunicação interna

```bash
docker-compose exec expo wget -qO- http://api:8080/health
```

**Esperado**: Resposta do health check (confirma que frontend alcança backend)

### 4. Verificar persistência do SQLite

```bash
docker-compose exec api ls -la /app/data/
```

**Esperado**: Arquivo `auth-session.db` presente

### 5. Testar Expo DevTools

Abrir navegador: http://localhost:19000

**Esperado**: Interface do Expo DevTools carregada

### 6. Ver logs

```bash
# Todos os serviços
make logs

# Apenas backend
make logs-api

# Apenas frontend
make logs-expo
```

## Desenvolvimento

### Hot Reload

**Backend**:
- O Dockerfile atual é otimizado para produção (binário compilado)
- Para desenvolvimento com hot reload, pode-se criar `Dockerfile.dev` que usa Air e monta código via volume

**Frontend**:
- Expo suporta hot reload nativamente
- Metro bundler detecta mudanças automaticamente
- Para refletir mudanças de código, basta salvar os arquivos (o código não está montado via volume, então rebuild é necessário para mudanças estruturais)

### Rebuild após mudanças

Se você modificar o código e quiser refletir as mudanças:

```bash
# Rebuild completo sem cache
make rebuild

# Ou manualmente
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Acesso via dispositivos físicos

**Expo no dispositivo**:
1. Certifique-se de que o dispositivo está na mesma rede que o host
2. No Expo DevTools (http://localhost:19000), use a opção "Tunnel" ou "LAN"
3. Escaneie o QR code com o app Expo Go

**API do backend**:
- Dispositivos acessam via `http://<IP_DO_HOST>:8080`
- Exemplo: `http://192.168.1.100:8080`

## Troubleshooting

### Backend não inicia

```bash
# Ver logs detalhados
docker-compose logs api

# Verificar se porta 8080 está livre
sudo lsof -i :8080
```

### Frontend não conecta ao backend

```bash
# Verificar se variável de ambiente está correta
docker-compose exec expo env | grep EXPO_PUBLIC_API_URL

# Testar conectividade interna
docker-compose exec expo wget -qO- http://api:8080/health
```

### Volume SQLite corrompido

```bash
# Parar serviços
docker-compose down

# Remover apenas o volume
docker volume rm migos_sqlite_data

# Reiniciar (banco será recriado)
docker-compose up -d
```

### Rebuild não reflete mudanças

```bash
# Rebuild sem cache
docker-compose build --no-cache

# Ou usar make
make rebuild
```

### Porta já em uso

Se alguma porta (8080, 8081, 19000-19002) estiver ocupada:

```bash
# Verificar processos usando a porta
sudo lsof -i :8080
sudo lsof -i :8081
sudo lsof -i :19000

# Matar processo se necessário
kill -9 <PID>
```

## Arquitetura de Arquivos

```
migos/
├── docker-compose.yml          # Orquestração principal
├── Makefile                    # Comandos simplificados
├── DOCKER.md                   # Esta documentação
├── backend/
│   ├── Dockerfile              # Container do backend
│   ├── .dockerignore           # Exclusões de build do backend
│   ├── cmd/api/main.go
│   ├── go.mod
│   └── ...
└── frontend/
    ├── Dockerfile              # Container do frontend
    ├── .dockerignore           # Exclusões de build do frontend
    ├── package.json
    ├── src/
    └── ...
```

## Notas Importantes

1. **CGO_ENABLED=1**: Necessário no build do backend para suportar SQLite (driver `mattn/go-sqlite3` usa C bindings)

2. **Variáveis de ambiente**:
   - `EXPO_PUBLIC_API_URL` no frontend aponta para `http://api:8080` (hostname interno)
   - Dispositivos externos ainda acessam `http://localhost:8080`

3. **Chaves RSA**: Geradas automaticamente durante o build do backend via OpenSSL

4. **Segurança**: Container do backend executa como usuário não-root (appuser:1000)

5. **Health checks**: Apenas o backend possui health check. Frontend não precisa (é dev server)

6. **Restart policy**: `unless-stopped` garante que containers reiniciem após reboot do host

## Próximos Passos (Opcional)

### Ambiente de desenvolvimento com volumes

Criar `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  api:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev  # Com Air para hot reload
    volumes:
      - ./backend:/app  # Montar código fonte

  expo:
    volumes:
      - ./frontend:/app
      - /app/node_modules  # Evitar sobrescrever node_modules
```

Uso:
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### CI/CD

Integrar com GitHub Actions, GitLab CI ou Jenkins para:
- Build automático das imagens
- Push para registry (Docker Hub, ECR, GCR)
- Deploy automático em produção

### Produção

Para produção, considere:
- Usar PostgreSQL ao invés de SQLite
- Nginx como reverse proxy
- TLS/SSL com Let's Encrypt
- Logs centralizados (ELK, Grafana Loki)
- Monitoramento (Prometheus + Grafana)
