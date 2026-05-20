# Noelclaw Architecture

Comprehensive reference for building a multi-agent swarm on top of the Noelclaw platform. Covers all systems, data models, and integration points.

---

## 1. Folder Structure

```
noelapp/
├── app/                          # Full-stack Convex application
│   ├── convex/                   # Backend — all server-side logic
│   │   ├── schema.ts             # Convex schema: 36 table definitions
│   │   ├── crons.ts              # All scheduled jobs (8 cron entries)
│   │   ├── http.ts               # HTTP router: REST + webhook endpoints
│   │   │
│   │   ├── _bankrAgent.ts        # Shared Bankr Agent API helper (callBankr)
│   │   │
│   │   ├── auth.ts               # Email auth: register, login, OTP, sessions
│   │   ├── wallets.ts            # Custodial wallet CRUD (wallets table)
│   │   ├── users.ts              # User profile mutations/queries
│   │   │
│   │   ├── chat.ts               # LLM chat handler: routes agentId → model + prompt
│   │   ├── signalEngine.ts       # BTC/ETH 1H signal generation (Bankr Agent)
│   │   ├── signalDb.ts           # Signal DB mutations: save, mark sent, resolve
│   │   ├── outcomeTracker.ts     # Track TP/SL hits every 2h
│   │   ├── whaleTracker.ts       # Smart money / micro-cap accumulation alerts
│   │   ├── newsScraper.ts        # RSS scrape + news analysis via Bankr
│   │   ├── dailyRecap.ts         # Daily win/loss recap with AI review
│   │   ├── weeklyRecap.ts        # Weekly signal log + AI review (Sundays)
│   │   │
│   │   ├── automationEngine.ts   # Evaluator: trigger check → swap/send/alert
│   │   ├── automations.ts        # Automation CRUD mutations/queries
│   │   │
│   │   ├── researchEngine.ts     # 8h shift research: collect every 5m, report
│   │   ├── researchDb.ts         # Research job/datapoint/report DB ops
│   │   │
│   │   ├── defi.ts               # On-chain: createWallet, executeSwap, sendToken
│   │   ├── defiDb.ts             # mcpWallets DB queries
│   │   │
│   │   ├── telegramNotify.ts     # Per-user Telegram notification action
│   │   ├── market.ts             # CoinGecko market data queries
│   │   ├── transactions.ts       # Credit transaction ledger
│   │   └── ...                   # gitlawb, games, x402 payment, custom agents
│   │
│   └── src/                      # Frontend (React + Vite)
│       ├── hooks/
│       │   ├── useTradeAgent.ts  # NL→trade parser, routes to signAndSendTransaction
│       │   ├── usePrivyAuth.ts   # Privy/OKX auth context wrapper
│       │   └── useAuthStore.ts   # Zustand store: Noelclaw email session + me.walletAddress
│       ├── components/           # UI components
│       └── ...
│
├── cloudflare-api-proxy/         # Cloudflare Worker: api.noelclaw.xyz → Convex
│   ├── worker.js                 # Rate limit (100/min/IP) + CORS + header proxy
│   └── wrangler.toml             # Route: api.noelclaw.xyz/* → noelclaw-api-proxy
│
└── mcp-server/                   # MCP server — npm: @noelclaw/research
    ├── src/
    │   ├── index.ts              # Entrypoint (~15 lines)
    │   ├── server.ts             # Server wiring, composes all tool handlers
    │   ├── convex.ts             # callConvex: retry/backoff + BYOK headers
    │   ├── wallet.ts             # Wallet creation, RPC, signAndBroadcast
    │   ├── types.ts              # ToolResult interface
    │   └── tools/
    │       ├── market.ts         # 6 tools: market, signals, whale alerts, recap
    │       ├── research.ts       # 1 tool: research
    │       ├── insight.ts        # 2 tools: get_insight, ask_noel
    │       ├── defi.ts           # 3 tools: portfolio, swap, send
    │       ├── automation.ts     # 4 tools: create/list/pause/delete automation
    │       └── swarm.ts          # 6 tools: swarm start/stop/status/memory/scores
    └── package.json              # name: @noelclaw/research, v1.9.0
```

---

## 2. Data Models

All tables are defined in [app/convex/schema.ts](app/convex/schema.ts).

### Auth & Identity

| Table | Key Fields | Indexes |
|-------|-----------|---------|
| `users` | email, username, passwordHash, walletAddress (via wallets), telegramId, xUsername, usdcBalance | by_email, by_username, by_x_username, by_telegram_id |
| `sessions` | userId, token, expiresAt | by_token, by_user |
| `otps` | email, code, expiresAt, used | by_email |
| `pendingUsers` | email, firstName, username, passwordHash | by_email |
| `telegramLinkTokens` | userId, token, expiresAt, used | by_token, by_user |

### Wallets

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `wallets` | userId, address, encryptedPrivateKey | Noelclaw custodial wallets (AES-256-CBC) |
| `mcpWallets` | userId, address, encryptedPrivateKey, network | MCP-created wallets (auto-provisioned) |
| `connectedWallets` | userId, privyWalletId, address, network | Privy/OKX linked wallets (identity only) |

### Trading Signals

| Table | Key Fields | Status Values |
|-------|-----------|---------------|
| `tradingSignals` | token, signalType, entryPrice, target1, target2, stopLoss, confidence, reasoning, timeframe, status, outcomePrice, pnlPercent, isWin, telegramSent | `active` / `hit_tp1` / `hit_tp2` / `hit_sl` / `expired` |
| `whaleAlerts` | token, direction, amountUsd, significance, description, implication, detectedAt, telegramSent | |
| `newsItems` | headlines[], overallSentiment, summary, affectedTokens[], source, publishedAt, telegramSent | |
| `dailyRecaps` | date, btcSignals/Wins/Losses/Winrate/BestPnl/WorstPnl (same for eth), totalWinrate, avgPnl, aiReview, telegramSent | |
| `weeklyRecaps` | weekStart, weekEnd, signals[], totalWins, totalLosses, winrate, bestPnl, worstPnl, avgPnl, aiReview, telegramSent | |

### Automations

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `automations` | userId, name, rawInput, triggerType, intervalMinutes, priceToken, priceThreshold, priceBaselineUsd, actionType, fromToken, toToken, amountUsd, amountPct, toAddress, alertMessage, maxRuns, maxSpendUsd, expiresAt, status, totalRuns, totalSpentUsd, lastRunAt, nextRunAt | Trigger + action config |
| `automationRuns` | automationId, userId, triggeredAt, actionType, status, txHash, amountUsd, error | Execution log |

Trigger types: `schedule` | `price_drop_pct` | `price_rise_pct` | `price_below` | `price_above` | `dominance_below` | `dominance_above`

Action types: `swap` | `send` | `alert`

### Research System

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `researchJobs` | userId, token, status, startedAt, stopsAt, lastCollectedAt, interimReportsCount, finalReportSent, telegramChatId | 8h autonomous research shifts |
| `researchDataPoints` | jobId, userId, collectedAt, trending, topMovers, marketDataRaw, grokSentiment, bankrAnalysis | Collected every 5 min |
| `researchReports` | jobId, userId, type (interim/final), generatedAt, result, telegramSent | Sent at 2.5h, 5h, 8h |
| `researchCache` | userId, key, data, expiresAt | General-purpose cache |

### Transactions & Credit System

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `transactions` | userId, type (deposit/deduction/refund), amount, model, tokensUsed, txHash, agentId, metadata | Credit ledger |
| `trades` | userId, walletAddress, action, fromToken, toToken, amount, rawInput, parsedConfidence, status, txHash, source (web/x/telegram), xMentionId, tweetId | All swap executions |
| `activities` | userId, type, description, agentName, tokenName, credits, txHash, timestamp | Realtime activity feed |
| `userSettings` | userId, telegramChatId, bankrApiKey, useOwnKey, signalEnabled, whaleAlertEnabled, newsEnabled | Per-user config |
| `agentRuns` | userId, skillName, trigger, status, tokensUsed, cost, result, error, startedAt, finishedAt | Skill execution log |

### Other Systems

| Table | Key Fields |
|-------|-----------|
| `xMentions` | tweetId, authorHandle, text, status (pending/processed/failed/ignored), tradeId |
| `gameScores` | userId, gameType (nightfall/uppy/taevaria/pokemonAutoChess), score, kills, levelReached, creditsEarned |
| `gameProfiles` | userId, totalGames, totalScore, totalKills, totalCredits, bestNightfall/Uppy/Taevaria/Pac |
| `customAgents` | userId, name, description, systemPrompt, modelId, pricingType, isPublished, rating, runs |
| `notifications` | userId, message, priority (low/medium/high/urgent), data, read |
| `gitlawbRepos`, `gitlawbCommits`, `gitlawbPRs`, `gitlawbUCANs` | On-chain Git with DID + UCAN auth |
| `memoryRefs` | userId, cid, tags — IPFS memory references |
| `userSkillConfig` | userId, skillName, config, enabled |

---

## 3. Agent System

### Chat Agent (`app/convex/chat.ts`)

Entry point for all LLM conversations. Routes by `agentId`.

```typescript
// Model routing — only noel-default currently active
const AGENT_MODEL_DEFAULTS: Record<string, string> = {};
// Falls back to 'gpt-5-nano' for all agents

// CoinGecko context injection — agents that receive live market data
const COINGECKO_CONTEXT_AGENTS = new Set(['noel-default']);
```

**Flow:**
1. `POST /chat` receives `{ agentId, question, messages, userId, token }`
2. Resolves user from session token (Noelclaw) or Privy token
3. If `agentId` is in `COINGECKO_CONTEXT_AGENTS`, prepends live market data to system prompt
4. Calls Bankr LLM Gateway (`llm.bankr.bot/v1/chat/completions`) with OpenAI-compatible format
5. Deducts credits from user's transaction ledger
6. Returns `{ answer, tokensUsed, cost }`

### Signal Engine (`app/convex/signalEngine.ts`)

Generates BTC and ETH 1H trading signals via Bankr Agent API.

**Output format parsed from Bankr response:**
```
SIGNAL: BUY | SELL | HOLD
ENTRY: $X
TARGET_1: $X (+X%)
TARGET_2: $X (+X%)  [optional]
STOP_LOSS: $X (-X%)
TIMEFRAME: 1H
CONFIDENCE: X%
REASONING: [3 sentences]
```

**Function:** `generateSignals` (internalAction) → `parseSignal()` → `saveSignal()` → `sendTelegram()`

### Smart Money Tracker (`app/convex/whaleTracker.ts`)

Detects micro-cap accumulation and insider wallet activity via Bankr Agent API.

**Output format:**
```
SMART_MONEY_ALERT: [description]
TOKEN: [symbol]
CHAIN: Base | Solana | ETH
MCAP: $X
DIRECTION: Accumulating | Distributing
WALLETS: [count]
SIGNIFICANCE: HIGH | MEDIUM | LOW
ALPHA: [one sentence]
```

Only HIGH or MEDIUM significance alerts are saved/sent.

**Function:** `checkWhales` (internalAction)

### News Analyzer (`app/convex/newsScraper.ts`)

Fetches RSS from CoinDesk and CoinTelegraph, analyzes via Bankr Agent.

**RSS sources:**
- `https://www.coindesk.com/arc/outboundfeeds/rss/`
- `https://cointelegraph.com/rss`

**Output format parsed per headline:**
```
HEADLINE: [shortened title]
IMPACT: HIGH | MEDIUM | LOW | NEUTRAL
TOKENS: [BTC, ETH, SOL...]
DIRECTION: bullish | bearish | neutral
REASON: [one sentence]

OVERALL_SENTIMENT: bullish | bearish | neutral
SUMMARY: [2 sentences]
```

Only runs if at least one HIGH or MEDIUM impact headline is found.

**Function:** `scrapeAndAnalyze` (internalAction)

### Outcome Tracker (`app/convex/outcomeTracker.ts`)

Checks all active signals every 2 hours for TP/SL hits.

- Expires signals older than 6 hours (`SIGNAL_EXPIRY_MS = 6 * 60 * 60 * 1000`)
- Fetches current price via Bankr Agent prompt: `"What is the current price of {TOKEN} in USD? Respond with just the number..."`
- BUY signal: TP1 hit if `currentPrice >= target1`, SL hit if `currentPrice <= stopLoss`
- SELL signal: TP1 hit if `currentPrice <= target1`, SL hit if `currentPrice >= stopLoss`
- Checks TP2 if already past TP1

**Function:** `trackAll` (internalAction)

### Recap Agents

**Daily** (`app/convex/dailyRecap.ts`): `generate` (internalAction)
- Queries `getTodayResolvedSignals` since UTC midnight
- Calculates BTC/ETH win/loss stats
- Asks Bankr for 5-sentence AI review
- Saves to `dailyRecaps`, sends Telegram

**Weekly** (`app/convex/weeklyRecap.ts`): `generate` (internalAction)
- Queries `getSignalsInRange` for Mon–Sun window
- Builds per-day BTC/ETH signal log
- Asks Bankr for 6-sentence AI weekly review
- Saves to `weeklyRecaps`, sends Telegram (runs Sunday 23:55 UTC)

### Research Engine (`app/convex/researchEngine.ts`)

8-hour autonomous research shifts.

**Collect phase** (every 5 min): `checkAndCollect` (internalAction)
- Finds active `researchJobs` where `lastCollectedAt` > 5 min ago
- Fetches CoinGecko trending + top movers
- Calls Bankr for market analysis and Grok for sentiment
- Saves to `researchDataPoints`

**Report phase** (every 5 min): `checkAndReport` (internalAction)
- Sends interim reports at 2.5h and 5h marks
- Sends final report at 8h (marks job `completed`)
- Aggregates all data points, calls Bankr for synthesis
- Sends via per-user Telegram bot

---

## 4. Skill / Tool Routing

### Bankr Shared Helper (`app/convex/_bankrAgent.ts`)

All Bankr Agent API calls go through this single shared function:

```typescript
export async function callBankr(apiKey: string, prompt: string): Promise<string>
```

**Protocol:**
1. `POST https://api.bankr.bot/agent/prompt` with `{ prompt }` and `X-API-Key` header
2. Receive `{ jobId }`
3. Poll `GET https://api.bankr.bot/agent/job/{jobId}` every 2 seconds
4. Return `result.response ?? result.result ?? result.output` on `status === "completed"`
5. Timeout after 120 seconds (60 × 2s polls)

**Used by:** signalEngine, whaleTracker, newsScraper, outcomeTracker, dailyRecap, weeklyRecap, researchEngine

### LLM Gateway (Chat)

For chat/Q&A (not async jobs):
```
POST https://llm.bankr.bot/v1/chat/completions
```
OpenAI-compatible format. Used by `chat.ts` for all conversational agents.

### CoinGecko Integration (`app/convex/automationEngine.ts`, `market.ts`)

```
GET https://api.coingecko.com/api/v3/simple/price?ids={ids}&vs_currencies=usd
GET https://api.coingecko.com/api/v3/global   (BTC dominance)
GET https://api.coingecko.com/api/v3/search/trending
GET https://api.coingecko.com/api/v3/coins/markets
```

Token ID mapping is defined in `automationEngine.ts` as `COINGECKO_IDS`.

---

## 5. Automation / Scheduling System

### Cron Schedule (`app/convex/crons.ts`)

| Job Name | Schedule | Handler | Purpose |
|----------|----------|---------|---------|
| `collect-research-data` | every 5 min | `researchEngine.checkAndCollect` | Research shift data collection |
| `send-research-reports` | every 5 min | `researchEngine.checkAndReport` | Research interim/final reports |
| `btc-eth-signal` | `0 8 * * *` (08:00 UTC daily) | `signalEngine.generateSignals` | BTC + ETH 1H signal |
| `whale-alert` | `0 */6 * * *` (every 6h) | `whaleTracker.checkWhales` | Smart money alerts |
| `news-digest` | `0 */12 * * *` (every 12h) | `newsScraper.scrapeAndAnalyze` | Crypto news digest |
| `track-outcomes` | every 2h | `outcomeTracker.trackAll` | TP/SL hit detection |
| `weekly-recap` | `55 23 * * 0` (Sun 23:55 UTC) | `weeklyRecap.generate` | Weekly performance report |
| `automation-evaluator` | every 1 min | `automationEngine.evaluate` | User automation execution |

### Automation Engine (`app/convex/automationEngine.ts`)

The `evaluate` internalAction runs every minute and processes all `active` automations.

**Evaluation flow:**
1. Fetch all active automations via `automations.getActive`
2. Batch-fetch all needed token prices from CoinGecko (single request)
3. Fetch BTC dominance if any automation uses dominance triggers
4. For each automation, call `processOne(ctx, auto, now, prices, btcDominance)`

**Trigger logic in `processOne`:**

```typescript
switch (auto.triggerType) {
  case "schedule":     triggered = !!auto.nextRunAt && now >= auto.nextRunAt;
  case "price_drop_pct": triggered = (baseline - cur) / baseline * 100 >= threshold;
  case "price_rise_pct": triggered = (cur - baseline) / baseline * 100 >= threshold;
  case "price_below":  triggered = cur <= threshold;
  case "price_above":  triggered = cur >= threshold;
  case "dominance_below": triggered = btcDominance <= threshold;
  case "dominance_above": triggered = btcDominance >= threshold;
}
```

**Deduplication:** Skips if `lastRunAt` < 65 seconds ago (cron fires every 60s).

**Stop conditions (checked atomically before execution):**
- `maxRuns` reached → status = `completed`
- `maxSpendUsd` reached → status = `completed`
- `expiresAt` passed → status = `completed`

**Action execution:**
- `swap`: calls `internal.defi.executeSwap` with `usdToSmallestUnit()` conversion
- `send`: calls `internal.defi.sendToken`
- `alert`: calls `internal.telegramNotify.sendNotification` with formatted message

**Swap limits:** `MAX_AMOUNT_USD = 500`, `MIN_AMOUNT_USD = 1`

---

## 6. Bankr Integration

### Two Separate APIs

| API | URL | Usage | Protocol |
|-----|-----|-------|----------|
| LLM Gateway | `https://llm.bankr.bot/v1/chat/completions` | Chat, Q&A | Synchronous, OpenAI-compatible |
| Agent API | `https://api.bankr.bot/agent/prompt` | Analysis, signals, research | Async job polling |

### Agent API Flow

```
POST /agent/prompt
  X-API-Key: {BANKR_API_KEY}
  Body: { prompt }
  → { jobId }

Poll GET /agent/job/{jobId}
  X-API-Key: {BANKR_API_KEY}
  → { status: "pending" | "running" | "completed" | "failed",
      response: "...", result: "...", output: "..." }
```

All agents pass `"Respond in English only."` as the first line of every prompt to prevent multilingual responses.

### API Key Sources

- **System key:** `process.env.BANKR_API_KEY` — used for all system crons (signals, news, whales, recaps)
- **User key:** `userSettings.bankrApiKey` — used when `useOwnKey = true` in user settings

---

## 7. Telegram Delivery Pipeline

### System Broadcasts (Cron-Driven)

All system-level alerts use a single shared bot:
- `TELEGRAM_BOT_TOKEN` (env) — the Noelclaw system bot
- `TELEGRAM_CHAT_ID` (env) — the broadcast channel/group

Each file has its own inline `sendTelegram(chatId, text, botToken)`:
```typescript
async function sendTelegram(chatId, text, botToken): Promise<void> {
  await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
    signal: AbortSignal.timeout(15000),
  });
}
```

After sending, the item is marked in DB via `markXxxTelegramSent` mutation (prevents resends on restart).

### Per-User Notifications (MCP / Research)

`app/convex/telegramNotify.ts` → `sendNotification` (internalAction):
- Looks up `userSettings` by `userId` to get `telegramChatId`
- User must have configured their own bot token in `userSettings.bankrApiKey` (the bot token field)
- Falls back with `{ sent: false, reason: "no_config" }` if not set

**HTTP endpoint:** `POST /user/telegram/notify` → calls `telegramNotify.sendNotification`

### Telegram Bot Integration

The Noelclaw Telegram bot (`noelclaw-tele/`) handles:
- Trade commands from Telegram users
- `POST /telegram/connect` — links Telegram account to Noelclaw user via one-time `linkToken`
- `GET /telegram/wallet?telegramId=XXX` — resolves linked wallet address

**Link flow:**
1. User generates link token in-app
2. User sends token to Noelclaw Telegram bot
3. Bot POSTs to `/telegram/connect` with `{ linkToken, telegramId }`
4. Convex validates token, links `telegramId` to user, returns wallet address

---

## 8. Auth + Wallet Flow

### Dual Auth System

| System | Store | Token Source | Wallet |
|--------|-------|-------------|--------|
| Noelclaw email/password | Zustand `useAuthStore` | JWT from `sessions` table | `wallets` table — AES-256-CBC encrypted private key |
| Privy / OKX | `usePrivyAuth` context | Privy JWT | `connectedWallets` table — identity only, never used for execution |

### Critical Rule

**All DeFi execution uses the Noelclaw custodial wallet, never the Privy/OKX wallet.**

In `app/src/hooks/useTradeAgent.ts`:
```typescript
// walletAddress always comes from Noelclaw store
const { me: noelMe, token: noelToken } = useAuthStore();
const { token: privyToken } = usePrivyAuth();
const walletAddress: string | null = noelMe?.walletAddress ?? null;
const token: string | null = noelToken ?? privyToken ?? null;
```

### Session-Based Execution (`app/convex/wallets.ts`)

`signAndSendTransaction` internalAction:
1. Receives session `token` from client
2. Resolves `userId` via `sessions` table lookup
3. Fetches `wallets` record for user
4. Decrypts private key: `AES-256-CBC` with `WALLET_ENCRYPTION_KEY` env var
5. Creates `ethers.Wallet` with Base mainnet RPC
6. Signs and broadcasts transaction
7. Returns `txHash`

This is the execution path for web UI swaps (via `useTradeAgent.ts`).

### MCP Wallet Flow (`app/convex/defi.ts`)

MCP users get a separate wallet in `mcpWallets` table (provisioned on first use):
```typescript
createWallet: internalAction  // creates ethers.Wallet.createRandom(), encrypts, stores
executeSwap: internalAction   // 0x Permit2 quote + approve + swap on Base (chainId 8453)
sendToken: internalAction     // ERC-20 transfer to any address
getPortfolio: internalAction  // Alchemy balance lookup
```

**0x Integration:**
```
GET https://api.0x.org/swap/permit2/quote?chainId=8453&sellToken=...&buyToken=...&sellAmount=...&taker=...
Headers: 0x-api-key, 0x-version: v2
```

Handles allowance approval automatically before swap.

**Token addresses on Base (chainId 8453):**
```
ETH:  0xEeee...EEEE (native)
USDC: 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
USDT: 0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2
DAI:  0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb
WETH: 0x4200000000000000000000000000000000000006
```

### Registration Flow

1. `POST /auth/register` → creates `pendingUsers` record, sends OTP email via Resend
2. `POST /auth/verify-otp` → validates OTP, creates `users` + `wallets` (auto-generated custodial) + `sessions`
3. Returns session token + wallet address to client

---

## 9. MCP Tools

**Package:** `@noelclaw/research` v1.9.0
**Install:** `npx @noelclaw/research@latest`
**Transport:** stdio
**Source:** `mcp-server/src/` (11 modules)

All tools proxy to `https://api.noelclaw.xyz` (Cloudflare Worker → Convex) via `callConvex(path, method, body?)`.

**callConvex behavior:**
- Retries on 429/500/502/503/504 — 3 attempts at 500ms/1s/2s
- Forwards BYOK headers from local env: `X-User-Grok-Key`, `X-User-Bankr-Key`, `X-User-Telegram-Token`, `X-User-Telegram-Chat`
- Falls back to wallet-native auth if no `NOELCLAW_API_KEY` is set

Sensitive request guard: if args contain "private key", "seed phrase", "mnemonic" → returns vault message.

**22 tools total:** 6 market/signals, 3 research/AI, 3 DeFi, 4 automations, 6 swarm.

### Market Data Tools

| Tool | Endpoint | Description |
|------|----------|-------------|
| `get_market_data` | `GET /mcp/market[?token=X]` | Top 20 by mcap, trending, key prices. Sends to Telegram if userId given. |
| `get_token_data` | `POST /mcp/chat` (coingecko-default) | Specific token lookup via natural language |

### Signal Tools

| Tool | Endpoint | Description |
|------|----------|-------------|
| `get_latest_signal` | `GET /signals/latest[?token=BTC]` | Latest BTC/ETH signal with TP/SL/confidence |
| `get_signal_history` | `GET /signals/history?token=X&days=7` | Win/loss history with winrate stats |
| `get_smart_money_alerts` | `GET /whales/latest?hours=24` | Smart money / micro-cap accumulation alerts |
| `get_daily_recap` | `GET /signals/recap[?date=YYYY-MM-DD]` | Daily performance recap with AI review |

### Research Tools

| Tool | Endpoint | Description |
|------|----------|-------------|
| `research` | `POST /mcp/research` | On-demand crypto research: Bankr + web search, returns structured analysis with overview, key findings, market impact, affected tokens, sentiment |

### Wallet & DeFi Tools

| Tool | Endpoint | Description |
|------|----------|-------------|
| `get_portfolio` | `POST /mcp/portfolio` | Base wallet address + all token balances with USD values. Auto-creates wallet. |
| `swap_tokens` | `POST /mcp/swap` | 0x Permit2 swap on Base. Amount in smallest unit (wei/6dec). |
| `send_token` | `POST /mcp/send` | ERC-20 transfer on Base mainnet |

### Automation Tools

| Tool | Endpoint | Description |
|------|----------|-------------|
| `create_automation` | `POST /mcp/automation` | Parse plain-English automation (Bankr NLP), save to `automations` table |
| `list_automations` | `GET /mcp/automations?userId=X` | All automations with status, run counts, nextRunAt |
| `pause_automation` | `POST /mcp/automation/toggle` | Toggle active ↔ paused |
| `delete_automation` | `DELETE /mcp/automation` | Permanent delete |

### AI & Insight Tools

| Tool | Endpoint | Description |
|------|----------|-------------|
| `ask_noel` | `POST /mcp/chat` (noel-default) | Chat with Noel AI — DeFi analysis, trade ideas, market context |
| `get_insight` | `GET /mcp/insight` | On-demand crypto + macro briefing (Grok) |

### Swarm Tools

| Tool | Endpoint | Description |
|------|----------|-------------|
| `start_swarm` | `POST /swarm/start` | Start multi-agent swarm |
| `stop_swarm` | `POST /swarm/stop` | Stop swarm |
| `get_swarm_status` | `GET /swarm/status` | Active agents, memory, scores |
| `write_swarm_memory` | `POST /swarm/memory/write` | Write key-value to shared memory |
| `get_swarm_memory` | `GET /swarm/memory?key=X` | Read shared memory by key |
| `get_execution_scores` | `GET /swarm/scores` | Skill performance metrics |

---

## 10. Environment Variables

### Required (Core)

| Variable | Used By | Purpose |
|----------|---------|---------|
| `BANKR_API_KEY` | All Bankr Agent callers | Auth for `api.bankr.bot` (async jobs) |
| `BANKR_PRIVATE_KEY` | chat.ts (LLM gateway) | Auth for `llm.bankr.bot` |
| `WALLET_ENCRYPTION_KEY` | wallets.ts, defi.ts | AES-256-CBC key for private key encryption |
| `TELEGRAM_BOT_TOKEN` | All cron senders | System broadcast bot |
| `TELEGRAM_CHAT_ID` | All cron senders | Broadcast channel/group ID |

### Required (DeFi)

| Variable | Used By | Purpose |
|----------|---------|---------|
| `ZX_API_KEY` | defi.ts | 0x Protocol v2 quote API |
| `BASE_RPC_URL` | defi.ts | Base mainnet RPC (defaults to `https://mainnet.base.org`) |
| `ALCHEMY_API_KEY` | defi.ts (getPortfolio) | Token balance lookups via Alchemy |
| `NOEL_WALLET_ADDRESS` | wallets.ts | Pre-funded Noelclaw custodial wallet address |

### Optional

| Variable | Used By | Purpose |
|----------|---------|---------|
| `COINGECKO_API_KEY` | market.ts | CoinGecko Pro API (rate limit upgrade) |
| `RESEND_API_KEY` | auth.ts | Email delivery for OTPs |
| `LLM_ENDPOINT` | chat.ts | Override Bankr LLM endpoint |
| `NOELCLAW_CONVEX_URL` | mcp-server | Override API proxy URL (default: `https://api.noelclaw.xyz`) |

### Convex Deployment

| Resource | Value |
|----------|-------|
| Public API | `https://api.noelclaw.xyz` (Cloudflare proxy) |
| Deploy command | `npx convex deploy` (from `app/` directory) |

---

## Extension Points for Multi-Agent Swarm

The following hooks are designed for external agent integration:

1. **MCP server** — 22 tools across 6 domain modules; add new tools by adding to the relevant `tools/*.ts` file (add to `TOOLS` array + handler switch) and importing in `server.ts`

2. **`callBankr` helper** — any new Convex internalAction can import `callBankr` from `./_bankrAgent` to access the async Bankr Agent API

3. **Automation system** — new trigger types and action types can be added to `automationEngine.ts` `processOne()` and `automations` schema without touching cron logic

4. **Research jobs** — start a new `researchJob` via `researchDb.createJob` mutation; the cron engine (`researchEngine.checkAndCollect` + `checkAndReport`) picks it up automatically

5. **Telegram per-user routing** — any agent can call `internal.telegramNotify.sendNotification({ userId, message })` to deliver to a user's configured Telegram

6. **HTTP webhooks** — add new routes in `http.ts`; they're served on `https://valuable-fish-533.convex.site/{path}`

7. **`agentRuns` table** — log any agent execution with `skillName`, `trigger`, `status`, `tokensUsed` for observability

8. **`userSettings` table** — per-user feature flags (`signalEnabled`, `whaleAlertEnabled`, `newsEnabled`) and BYOK support (`useOwnKey`, `bankrApiKey`)
