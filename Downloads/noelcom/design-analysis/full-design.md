# Ethy AI - Full Design Document

## Pages

### 1. Terminal (Home)
- Hero section with agent orb, example commands, Deploy button
- Chat input at bottom
- Already implemented

### 2. Wallet Page
- Header: "Wallet" title
- Two cards side by side:
  - Left: Wallet Address ("Not found"), Portfolio Value $0.00, Credits: 0, Withdraw button (outlined)
  - Right: "How it works" purple gradient card with description + "Read more on our Docs"
- Tabs: Assets (active), Transactions, Credits
- "Create Automation" button (top right)
- X Integration card at bottom: X logo, "X Integration" title, description, "Coming soon" badge

### 3. Brain Page
- Terminal-style window with macOS dots (red, yellow, green)
- Title: "agent-brain" with globe icon
- Content: "$ No agent logs found"
- Star field background animation
- Header changes: "STARTER" badge + "0 credits" + "Upgrade" link

### 4. Deploy Agent (Onboarding)
- Centered modal/page without sidebar
- Logo + "Welcome to Ethy AI"
- Stepper: 1 Deploy Agent → 2 Fund Wallet → 3 Create Automation
- Features with checkmarks:
  - Autonomous Trading: description
  - 24/7 Monitoring: description  
  - Initial FREE credits: description
- "Deploying Agent..." purple button (loading)
- "Protected by Privy" text

### 5. Create Automation
- Step 3 active (green checkmarks on 1 & 2)
- "Create your first Automation" title
- "Choose from our pre-built trading strategy templates to get started quickly"
- 3 strategy cards:
  - DCA Strategy: "Buy $50 worth of ETHY every day" + Copy Automation button
  - ETHY Price Action: "Buy when price drops 5%, sell when it rises 25%" + Copy Automation
  - FACY RSI Trading: "Buy $50 of FACY when RSI drops below 30, sell when it rises above 70" + Copy Automation
- "Skip for now" link

### 6. Agents Hub & Plugins (Marketplace)
- Title: "Agents Hub & Plugins"
- Grid of cards (3 columns):
  - AIXBT (Agent | x402): Alpha, Mindshare tags
  - Gloria AI (Agent | x402): Mindshare
  - Loky (Agent | ACP): Market Insights
  - Whale Intel (Agent | MCP): Market Insights
  - Coingecko (Plugin): Market Insights
  - 0x (Plugin): Trading
  - Avantis (Plugin): Trading
  - Indexy (Plugin): Trading
  - Nansen AI (Plugin): Market Insights
- Each card: icon, name, type badge, tags, description, "Try it now" button

### 7. Subscription/Pricing
- Title: "Plans and Pricing"
- 4 tiers:
  - STARTER (pay-as-you-go): $0, No payment required, 1000 free credits, 2 automations, no social trading, 10 msg/day, $20/ref
  - PRO: $14.99, 15000 credits/mo, 10 automations, social trading, unlimited messages, $20/ref
  - EXPERT (Most Popular): $39.99, 65000 credits/mo, 25 automations, all features, $25/ref
  - WHALE: $99.99, 250000 credits/mo + bonus, 150 automations, all features, $30/ref
- Footer notes: "Each Automation execution = 10 credits", "$0.02 per execution", "Trading View Advanced Charts are free to use"

### 8. Automations Page
- List of user's automations
- Create/ manage automations

## Shared Components

### Sidebar (updated)
Same as before but with active state routing

### Header (varies by page)
- Default: Edit icon + Login button
- Brain page: STARTER badge + 0 credits + Upgrade
- Marketplace: STARTER badge + 1,000 credits
- Subscription: Same as marketplace

### Colors
- Background: #16161e (main), #1e1e2a (sidebar), #252536 (card/input)
- Purple accent: #8b5cf6, #7c3aed
- Green: #10b981 (success/checkmarks)
- Orange: #f59e0b (New badge)
- Text: white (primary), #94a3b8 (secondary)
- Card bg: #1e1e2e with border #2e2e3f

### Typography
Same as previous design
