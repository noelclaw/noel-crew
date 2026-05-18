# Noelclaw Research

> Crypto AI agent skill — live signals, whale tracking, autonomous research, and Base DeFi tools

**16 tools** · Market Data · Trading Signals · Whale Alerts · Autonomous Research · Base DeFi · Automations

---

## Install

```bash
npx @noelclaw/research
```

**Hermes:**
```bash
hermes mcp add noelclaw --command npx --args @noelclaw/research
```

**Claude Code:**
```bash
claude mcp add noelclaw -- npx @noelclaw/research
```

**Claude Desktop / Cursor / Windsurf** — add to your MCP config:
```json
{
  "mcpServers": {
    "noelclaw": {
      "command": "npx",
      "args": ["@noelclaw/research"]
    }
  }
}
```

---

## Tools

### Market Data & Research (11)

| Tool | Description |
|------|-------------|
| `get_market_data` | Live top-20 coins by market cap, trending tokens, and BTC/ETH/SOL prices |
| `get_token_data` | Price, 24h change, market cap, and volume for any token |
| `get_latest_signal` | Latest BTC and/or ETH 1H trading signals — entry, TP, SL, confidence |
| `get_signal_history` | Signal history with win/loss record and winrate stats |
| `get_daily_recap` | Daily trading performance recap with AI review |
| `get_whale_alerts` | Large wallet movements, smart money flows, and CEX inflow/outflow alerts |
| `research` | On-demand AI research on any crypto topic — like Perplexity for crypto |
| `ask_noel` | Chat with Noel DeFi AI — market outlook, trade ideas, live context |
| `create_automation` | Create DCA, price alerts, or conditional trades in plain English |
| `list_automations` | List all automations — active, paused, completed — with status and next run |
| `pause_automation` | Pause or resume an automation by ID |

### Wallet & DeFi (4)

| Tool | Description |
|------|-------------|
| `get_portfolio` | Base wallet balances and total USD value — auto-creates wallet on first use |
| `swap_tokens` | Swap ETH, USDC, USDT, DAI, WETH on Base via 0x Permit2 |
| `send_token` | Send ETH or ERC-20 tokens to any address on Base mainnet |
| `delete_automation` | Permanently delete an automation |

### Configuration (1)

| Tool | Description |
|------|-------------|
| `set_telegram` | Configure a personal Telegram bot for signals, whale alerts, and research reports |

---

## Example Usage

```
# Get live market data
get_market_data

# Ask Noel a question
ask_noel(question: "Is ETH breaking out on the 1H?")

# Get latest BTC signal
get_latest_signal(token: "BTC")

# Check whale activity
get_whale_alerts(hours: 6)

# Research any topic
research(query: "Ethereum ETF approval impact on Base ecosystem")

# Create a DCA automation
create_automation(userId: "your-id", rawInput: "Buy $50 of ETH daily. Stop after spending $500")

# Get your portfolio
get_portfolio(userId: "your-id")

# Swap on Base
swap_tokens(userId: "your-id", fromToken: "ETH", toToken: "USDC", amount: "100000000000000000")
```

---

## Telegram Delivery

All market data, research, and signals can be sent directly to a personal Telegram bot.

```
set_telegram(userId: "your-id", telegramBotToken: "...", telegramChatId: "...")
```

Reports are delivered at **2.5h, 5h, and 8h** intervals when running an autonomous research shift.

---

## Links

- **npm:** [npmjs.com/package/@noelclaw/research](https://npmjs.com/package/@noelclaw/research)
- **docs:** [docs.noelclaw.fun](https://docs.noelclaw.fun)
- **github:** [github.com/noelclaw/noelmcp](https://github.com/noelclaw/noelmcp)
- **web:** [noelclaw.fun](https://noelclaw.fun)

---

## Author

**noelclaw** · Base Mainnet · Powered by Convex + Privy
