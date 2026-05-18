# Ethy AI - Design Document

## Part 1: Visual Design System (Global Styles)

### Color Palette

| Token | HEX | Usage |
|-------|-----|-------|
| `--bg-primary` | `#16161e` | Main content background |
| `--bg-sidebar` | `#1e1e2a` | Sidebar background |
| `--bg-sidebar-item` | `#2a2a3a` | Sidebar selected item background |
| `--bg-input` | `#252536` | Chat input background |
| `--bg-notification` | `#7c3aed` | Top notification bar (purple) |
| `--accent-purple` | `#8b5cf6` | Primary accent, logo, CTA |
| `--accent-purple-hover` | `#7c3aed` | Purple hover state |
| `--accent-violet` | `#a78bfa` | Light purple for gradients |
| `--accent-orange` | `#f59e0b` | "New" badge |
| `--accent-orange-bg` | `#3d2b1f` | Orange badge background |
| `--text-primary` | `#f8fafc` | Main headings, primary text |
| `--text-secondary` | `#94a3b8` | Body text, descriptions |
| `--text-muted` | `#64748b` | Muted labels, placeholders |
| `--border-subtle` | `#2e2e3f` | Subtle borders |
| `--badge-soon-bg` | `#3b0764` | "Soon" badge background |
| `--badge-soon-text` | `#c084fc` | "Soon" badge text |
| `--icon-purple` | `#8b5cf6` | Purple icon glow |

### Typography System

| Element | Font | Size | Weight | Line Height | Color |
|---------|------|------|--------|-------------|-------|
| Logo "ethy" | Inter/System | 24px | 700 | 1.2 | `--text-primary` |
| Logo "AI" suffix | Inter/System | 14px | 500 | 1.2 | `--accent-purple` |
| Heading (Hero) | Inter/System | 24px | 700 | 1.3 | `--text-primary` |
| Body Text | Inter/System | 14px | 400 | 1.6 | `--text-secondary` |
| Sidebar Label | Inter/System | 11px | 500 | 1.4 | `--text-muted` (uppercase) |
| Sidebar Item | Inter/System | 14px | 500 | 1.4 | `--text-secondary` |
| Sidebar Item Active | Inter/System | 14px | 600 | 1.4 | `--text-primary` |
| Button Text | Inter/System | 14px | 600 | 1.4 | `--bg-primary` |
| Chat Placeholder | Inter/System | 14px | 400 | 1.4 | `--text-muted` |
| Footer Text | Inter/System | 11px | 400 | 1.4 | `--text-muted` |

### Layout Grid & Spacing

- **Layout Type**: Fixed sidebar (280px) + Flexible main content
- **Sidebar Width**: 280px
- **Main Content**: flex-1 (fills remaining space)
- **Spacing Scale**: 4px base (4, 8, 12, 16, 20, 24, 32, 40, 48)
- **Border Radius**: 
  - Sidebar items: 8px
  - Buttons: 24px (pill shape)
  - Chat input: 12px
  - Cards: 12px
  - Badges: 4px
- **Container**: Full viewport height (100vh), no scroll on main page

### Component Primitives

**Buttons:**
- Primary (CTA): White bg (#f8fafc), dark text, pill shape, hover: slight scale + shadow
- Secondary: Transparent with border, text color, hover: subtle bg
- Icon Button: 32px circle, transparent, hover: `--bg-sidebar-item`

**Inputs:**
- Chat Input: `--bg-input` bg, 12px radius, no border, placeholder `--text-muted`

**Badges:**
- "Soon": Purple bg (`--badge-soon-bg`), purple text, small rounded
- "New": Orange text with flame icon

**Icons:**
- Size: 18-20px for sidebar, 16px for inline
- Color: `--text-muted` default, `--text-primary` active
- Style: Lucide icons (outline style)

---

## Part 2: Global Animations & Interactions

### Core Experience

**Page Load Sequence:**
1. Sidebar slides in from left (300ms, ease-out)
2. Main content fades in (400ms, ease-out, 100ms delay)
3. Notification bar slides down (300ms, ease-out)
4. Hero content fades up (500ms, cubic-bezier(0.22, 1, 0.36, 1), 200ms delay)

**Smooth Scrolling**: Not applicable (single viewport, no scroll)

### Micro-interactions

**Sidebar Menu Items:**
- Hover: Background transitions to `--bg-sidebar-item` (150ms ease)
- Active: Background `--bg-sidebar-item`, text white, left border accent (2px purple)
- Icon: Color transitions from muted to primary on hover/active

**Buttons:**
- Hover: transform scale(1.02), box-shadow increase (150ms ease)
- Active: transform scale(0.98) (50ms)
- Focus: ring-2 ring-purple-500 ring-offset-2 ring-offset-background

**Chat Input:**
- Focus: subtle border glow (box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2))
- Send button: opacity transition on hover

**Links:**
- Hover: color transitions to white, underline appears (150ms)
- External links: arrow icon appears on hover

**Agent Avatars Row:**
- Hover: slight scale (1.1) with z-index increase
- Transition: 200ms ease

### Technical Specs

- **Easing Functions**: 
  - Standard: `cubic-bezier(0.4, 0, 0.2, 1)`
  - Enter: `cubic-bezier(0, 0, 0.2, 1)`
  - Exit: `cubic-bezier(0.4, 0, 1, 1)`
  - Bounce: `cubic-bezier(0.22, 1, 0.36, 1)`
- **Default Duration**: 150-300ms
- **Performance**: Use transform and opacity only for animations

---

## Part 3: Content Sections Breakdown

### Section: Top Notification Bar

**1. Layout & Composition:**
- **Structure**: Full-width flex row, items centered vertically
- **Height**: ~40px
- **Background**: Purple gradient (`#7c3aed` to `#6d28d9`)
- **Dismissible**: Has close button (X) on right

**2. Visual Styling:**
- Left: Sparkle icon (white/primary)
- Center: Text "Ethy V2 coming soon — More powerful, secure, and scalable agents. Join the waitlist for early access."
- Right: "Learn more" link + close button
- Text color: White with slight transparency for secondary text

**3. Interaction & Motion:**
- Slide down on page load
- Slide up on dismiss (with height collapse)
- "Learn more" hover: underline + slight opacity change
- Close button hover: bg rgba(255,255,255,0.1)

**4. Content:**
- Text: "Ethy V2 coming soon — More powerful, secure, and scalable agents. Join the waitlist for early access."
- CTA: "Learn more →"

---

### Section: Sidebar Navigation

**1. Layout & Composition:**
- **Structure**: Fixed vertical column, full height
- **Width**: 280px
- **Padding**: 20px 16px
- **Background**: `--bg-sidebar`
- **Border**: 1px right border `--border-subtle`

**2. Visual Styling:**
- Logo area at top: Ethy logo (purple icon + "ethy" text + "AI" superscript)
- Below logo: 16px gap
- Navigation groups separated by 24px gap
- Section labels: uppercase, muted, 11px, letter-spacing 0.05em
- Each nav item: 40px height, 8px border-radius, 12px horizontal padding

**3. Interaction & Motion:**
- Nav items: hover bg fade (150ms)
- Active item: slightly lighter bg, white text
- External links: arrow icon on hover
- Social icons at bottom: hover scale + color change

**4. Content & Copy:**

**My Agent Section:**
- Terminal (active)
- Wallet
- Brain
- Automations

**Social Trading Section:**
- Label: "Social Trading" + "Soon" badge
- Discover
- Activity
- Leaderboard

**Other:**
- Marketplace
- Metrics (with "New" badge)
- Subscription

**Footer:**
- "Need help? Join our community" with external arrow
- Social icons: X (Twitter), Telegram, Diamond, Wreath, Docs
- Copyright: "2025 @ Ethy AI, v1.2.10+cfd8"

**5. Icon Mapping:**
| Item | Icon |
|------|------|
| Terminal | `Terminal` (lucide) |
| Wallet | `Wallet` |
| Brain | `Brain` |
| Automations | `Zap` |
| Discover | `Globe` |
| Activity | `Users` |
| Leaderboard | `Trophy` |
| Marketplace | `Store` |
| Metrics | `BarChart3` |
| Subscription | `CreditCard` |

---

### Section: Main Header

**1. Layout & Composition:**
- **Structure**: Flex row, justify-between, items-center
- **Height**: 64px
- **Padding**: 0 24px
- **Background**: Transparent (inherits main bg)

**2. Visual Styling:**
- Left: Compose/edit icon button (square with pencil)
- Right: Login button (purple bg, white text, pill shape)

**3. Interaction & Motion:**
- Compose button hover: bg subtle
- Login button hover: scale + brightness

**4. Content:**
- Left: Edit/compose icon
- Right: "Login" button

---

### Section: Hero / Main Content

**1. Layout & Composition:**
- **Structure**: Centered flex column, vertically and horizontally centered
- **Max Width**: 600px for text content
- **Position**: Absolute center of main content area

**2. Visual Styling:**
- Agent Icon: Large purple gradient orb/sphere (120-140px), glowing effect
- Heading: "Automate your trading strategies with your own AI Agent"
- Subtext: "Just ask Ethy to do anything, like:"
- Example list: 5 command examples with ">_" prefix
- CTA Button: "Deploy Your Agent" with rocket icon, white bg, dark text, pill
- Agent Avatars: Row of 5-6 small circular avatar images
- Subtitle below avatars: "Powered by expert agents & plugins"

**3. Interaction & Motion:**
- Agent orb: Subtle floating animation (translateY ±5px, 3s infinite)
- Orb glow: Pulsing box-shadow animation
- Example items: Stagger fade-in on load (100ms delay each)
- CTA hover: scale(1.02) + shadow
- Avatar hover: scale(1.1)

**4. Content & Copy:**
- Heading: "Automate your trading strategies with your own AI Agent"
- Subheading: "Just ask Ethy to do anything, like:"
- Examples:
  1. "Hey Ethy, buy me 1000$ of ETHY"
  2. "Automate DCA 50$ of ETHY every day. Stop after spending 1000$"
  3. "Give me trending coins last 24h from Coingecko"
  4. "If 15min RSI on FACY is below 30, buy it. Sell 50% when 10x from first buy"
  5. "Check every 4 hours if WIRE is down at least 10% last day, then buy 500$"
- CTA: "Deploy Your Agent"
- Footer: "Powered by expert agents & plugins"

**5. Image Asset Mapping:**
| Asset | Type | Placement | Description |
|-------|------|-----------|-------------|
| Agent Orb | Generated/Gradient | Center top of hero | Purple gradient sphere with glow effect |
| Avatar 1-6 | Images | Horizontal row below CTA | Small circular agent/plugin icons |

---

### Section: Chat Input Area

**1. Layout & Composition:**
- **Structure**: Fixed at bottom of main content
- **Width**: ~700px max, centered
- **Padding**: 16px 20px
- **Background**: `--bg-input`
- **Border Radius**: 12px

**2. Visual Styling:**
- Textarea: Full width, transparent bg, placeholder text
- Bottom row: Left has "Automations" button, right has send button (circular, purple)
- Subtle top border or shadow separating from content

**3. Interaction & Motion:**
- Focus: Purple glow ring
- Send button hover: Brightness increase
- Automations button hover: Subtle bg
- Auto-resize textarea on content

**4. Content:**
- Placeholder: "What I can do for you today...?"
- Left button: "Automations" with lightning bolt icon
- Right button: Send/arrow up icon (circular purple button)

---

## Part 4: Asset Requirements

### Images to Generate

1. **Agent Orb Icon**
   - Description: "A glossy 3D sphere with purple and violet gradient, glowing neon edges, futuristic AI agent icon, dark background, digital art style"
   - Size: 256x256px
   - Placement: Hero section center

2. **Agent Avatars (5-6 small icons)**
   - Description: "Small circular icons representing different AI agents and plugins, colorful icons on dark backgrounds"
   - Size: 40x40px each
   - Placement: Row below CTA button

### Icons (Lucide)
- All navigation icons from lucide-react
- Send, Zap, Edit, X (close), ArrowUp icons

---

## Part 5: Responsive Behavior

This is a desktop-first dashboard design:
- **Desktop** (1280px+): Full sidebar + main content
- **Tablet** (768px-1279px): Collapsed sidebar (icon only) + main content
- **Mobile** (<768px): Hidden sidebar, hamburger menu, full-width content

For this replication, focus on desktop layout primarily.
