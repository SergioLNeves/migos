# Melhorias Identificadas

Revisao completa do projeto realizada em 2026-02-10.

---

## 1. Bugs e Problemas Reais

### 1.1 `export default` contradiz CLAUDE.md

- **Arquivos:** `src/app/index.tsx`, `src/app/_layout.tsx`, todos os `_layout.tsx` e telas
- **Problema:** CLAUDE.md define "Named exports only (no default exports)", mas Expo Router exige `export default` para rotas.
- **Solucao:** Adicionar excecao explicita no CLAUDE.md para arquivos de rota do Expo Router.

### 1.2 `api-client.ts:37` - Cast `undefined as T` inseguro

- **Arquivo:** `src/lib/api-client.ts:37`
- **Problema:** O retorno `undefined as T` para respostas 204 e um hack de tipo. O chamador pode assumir que `T` e definido.
- **Solucao:** Usar overload de funcao ou tipo de retorno `Promise<T | undefined>` explicito.

### 1.3 `response.json()` no tratamento de erro pode falhar

- **Arquivo:** `src/lib/api-client.ts:31-33`
- **Problema:** Se o servidor retornar erro com corpo nao-JSON (ex: 502 Bad Gateway com HTML), `await response.json()` lanca excecao nao tratada.
- **Solucao:** Envolver em try/catch com fallback para `ProblemDetails` generico.

### 1.4 `userInterfaceStyle: "light"` conflita com tema dark

- **Arquivo:** `app.json:22`
- **Problema:** O app usa tema dark (cores escuras no tailwind.config.js), mas app.json define `userInterfaceStyle: "light"` e `splash.backgroundColor: "#ffffff"`. Causa status bar clara e splash branca.
- **Solucao:** Alterar para `"dark"` e ajustar `splash.backgroundColor` para a cor de fundo do tema.

### 1.5 Fontes carregam sem controle de loading

- **Arquivo:** `src/app/_layout.tsx:11-20`
- **Problema:** `useFonts` retorna `[fontsLoaded, fontError]` mas o resultado e ignorado. O app renderiza antes das fontes carregarem, causando flash de fonte padrao.
- **Solucao:** Condicionar renderizacao ao `fontsLoaded` e integrar com `expo-splash-screen` (`SplashScreen.preventAutoHideAsync()`).

---

## 2. Seguranca

### 2.1 Sem refresh token automatico

- **Contexto:** Quando o access_token expira durante uso, o usuario e silenciosamente deslogado.
- **Solucao:** Implementar interceptor que use o refresh_token para renovar o access_token automaticamente antes de expirar.

### 2.2 Autenticacao via Cookie header manual

- **Arquivo:** `src/services/auth.ts:43`
- **Problema:** O logout monta o cookie manualmente como string concatenada. Fragil e nao segue padrao de autenticacao por headers (`Authorization: Bearer`).
- **Solucao:** Adotar header `Authorization` ou usar `credentials: 'include'` no fetch.

### 2.3 `.env` pode vazar para o repositorio

- **Problema:** `.env` contem `EXPO_PUBLIC_API_URL=http://192.168.0.108:8080`. Variaveis `EXPO_PUBLIC_*` sao embutidas no bundle e expostas ao cliente.
- **Solucao:** Verificar `.gitignore` exclui `.env`. Criar `.env.example` sem valores reais. Nunca commitar `.env`.

### 2.4 API so aceita `application/x-www-form-urlencoded`

- **Arquivo:** `src/lib/api-client.ts:18`
- **Problema:** Todas as requisicoes usam URL-encoded. Para APIs modernas, `application/json` e mais seguro (menos suscetivel a CSRF) e flexivel.
- **Solucao:** Migrar para `Content-Type: application/json` com `JSON.stringify(body)`.

---

## 3. Arquitetura e Estrutura

### 3.1 API client muito limitado

- **Arquivo:** `src/lib/api-client.ts`
- **Problema:** So tem metodo `post`. Falta `get`, `put`, `patch`, `delete`.
- **Solucao:** Criar client completo com:
  - Todos os metodos HTTP
  - Interceptor para injetar token de autorizacao automaticamente
  - Tratamento de timeout
  - Cancelamento de requests (AbortController)

### 3.2 Sem tratamento global de erros de rede

- **Problema:** Nenhum ponto do app captura erros de conectividade (sem internet, timeout, servidor fora). O usuario ve apenas `error.message` generico.
- **Solucao:** Adicionar error boundary global ou listener de conectividade com feedback ao usuario.

### 3.3 Sem state management global alem de auth

- **Problema:** `QueryClient` esta configurado mas nao ha queries (so mutations). Sem estrategia de cache/invalidacao.
- **Solucao:** Planejar estrategia de queries conforme features forem adicionadas.

### 3.4 Componentes nao utilizados exportados

- **Arquivos:** `src/components/organisms/card.tsx`, `src/components/organisms/fontSlider.tsx`, `src/components/index.ts`
- **Problema:** `Card` e `FontSlider` sao exportados mas nao usados em nenhuma tela. Restos do template.
- **Solucao:** Remover ou manter se houver plano de uso futuro.

### 3.5 Sem navegacao tipada

- **Problema:** Hrefs sao strings literais (`"/(private)/dashboard"`, `"/(public)/login"`). Propenso a erros de digitacao.
- **Solucao:** Usar rotas tipadas do Expo Router para validacao em compile-time.

---

## 4. UX e Interface

### 4.1 Feedback de loading insuficiente nas telas de auth

- **Arquivos:** `src/app/(public)/login.tsx`, `src/app/(public)/create-account.tsx`
- **Problema:** So muda o texto do botao ("Signing in..."). Falta indicador visual mais claro.
- **Solucao:** Adicionar spinner inline no botao ou overlay de loading.

### 4.2 Sem validacao de email

- **Arquivos:** `src/app/(public)/login.tsx:52`, `src/app/(public)/create-account.tsx:64`
- **Problema:** Unica validacao e campo nao vazio. Sem feedback visual de formato invalido.
- **Solucao:** Adicionar validacao basica de formato de email com feedback visual.

### 4.3 Input sem border-radius

- **Arquivo:** `src/components/molecules/input.tsx:12`
- **Problema:** Input nao tem `rounded-*`, ficando com cantos retos, enquanto Button tem `rounded-lg`.
- **Solucao:** Adicionar `rounded-lg` ao Input para consistencia visual.

### 4.4 Sem animacao de transicao entre telas

- **Problema:** Redirects sao instantaneos entre login e dashboard.
- **Solucao:** Implementar transicoes suaves usando Stack ou configuracao de animacao do Expo Router.

### 4.5 Dashboard vazio

- **Arquivo:** `src/app/(private)/dashboard.tsx`
- **Problema:** So mostra email e botao de logout. E o ponto de entrada principal sem conteudo real.
- **Solucao:** Planejar e implementar conteudo da tela principal.

### 4.6 Logo hardcoded como ASCII art

- **Arquivo:** `src/components/molecules/logo.tsx`
- **Problema:** Logo "MIGOS" e texto ASCII. Para producao, uma imagem seria mais adequada.
- **Solucao:** Substituir por SVG/PNG quando o branding estiver definido.

### 4.7 Cores hardcoded em componentes

- **Arquivos:**
  - `src/components/molecules/input.tsx:15` — `placeholderTextColor` usa HSL literal
  - `src/app/index.tsx:11` — ActivityIndicator usa `"hsl(24, 100%, 50%)"` literal
- **Problema:** Cores fora do sistema de design tokens, dificultando manutencao do tema.
- **Solucao:** Referenciar tokens do Tailwind ou criar constantes centralizadas.

---

## 5. Qualidade de Codigo

### 5.1 Tipo `User` duplicado inline

- **Arquivo:** `src/providers/auth-context.tsx:8` e `:17`
- **Problema:** `{ id: string; email: string }` aparece 2x como tipo anonimo.
- **Solucao:** Criar `User` type em `src/types/auth.ts` e referenciar.

### 5.2 Re-export desnecessario de `ProblemDetails`

- **Arquivo:** `src/lib/api-client.ts:43`
- **Problema:** `type ProblemDetails` e re-exportado do api-client, mas ja e exportado de `@/types/auth`.
- **Solucao:** Remover re-export. Importar sempre de `@/types/auth`.

### 5.3 `JwtPayload` exportado de dois lugares

- **Arquivo:** `src/lib/jwt.ts:26`
- **Problema:** Exportado tanto em `jwt.ts` quanto em `@/types/auth`. Dupla fonte.
- **Solucao:** Exportar apenas de `@/types/auth`. Remover re-export de `jwt.ts`.

### 5.4 Sem testes

- **Problema:** Nenhum teste configurado. Logica de JWT, API client e auth context sao criticos.
- **Solucao:** Configurar Jest/Vitest e escrever testes unitarios para `jwt.ts`, `api-client.ts`, `auth-context.tsx`.

### 5.5 Sem lint/type-check no CI

- **Problema:** Sem configuracao de CI/CD (GitHub Actions).
- **Solucao:** Criar workflow com `pnpm run lint` e `tsc --noEmit` rodando em PRs.

---

## 6. Configuracao e Build

### 6.1 Content paths redundantes no Tailwind

- **Arquivo:** `tailwind.config.js:3`
- **Problema:** `'./App.{js,ts,tsx}'` e `'./components/**/*.{js,ts,tsx}'` sao restos do template. O app usa `src/`.
- **Solucao:** Manter apenas `'./src/**/*.{js,jsx,ts,tsx}'`.

### 6.2 `expo-splash-screen` nao configurado

- **Problema:** `expo-splash-screen` esta nas dependencias mas `SplashScreen.preventAutoHideAsync()` nao e chamado. Splash some antes das fontes e auth carregarem.
- **Solucao:** Integrar com `useFonts` e auth loading no `_layout.tsx`.

### 6.3 Nome do projeto inconsistente

- **Problema:** `package.json` e `app.json` dizem `migos`, repositorio se chama `migos`, logo e "MIGOS".
- **Solucao:** Alinhar nomenclatura em todos os arquivos de configuracao.

### 6.4 `nativewind` como `latest` no package.json

- **Problema:** Dependencia sem versao fixa pode quebrar em qualquer `pnpm install`.
- **Solucao:** Pinar versao especifica com `^` ou `~`.

---

## Prioridades

| Prioridade | Item | Impacto |
|---|---|---|
| **Alta** | 1.3 - response.json() pode falhar no erro | Crash em producao |
| **Alta** | 1.5 - Fontes sem controle de loading | Flash visual |
| **Alta** | 1.4 - userInterfaceStyle conflita com dark | UX quebrada |
| **Alta** | 2.1 - Sem refresh token automatico | Sessoes curtas |
| **Alta** | 6.4 - nativewind `latest` | Build pode quebrar |
| **Media** | 2.3 - .env exposto | Seguranca |
| **Media** | 3.1 - API client limitado | Escalabilidade |
| **Media** | 4.3 - Input sem border-radius | Consistencia visual |
| **Media** | 4.7 - Cores hardcoded | Manutencao do tema |
| **Media** | 5.1 - Tipo User duplicado | Clean code |
| **Baixa** | 3.4 - Componentes nao usados | Limpeza |
| **Baixa** | 5.4 - Sem testes | Qualidade |
| **Baixa** | 6.1 - Content paths redundantes | Limpeza |
| **Baixa** | 6.3 - Nome inconsistente | Organizacao |
