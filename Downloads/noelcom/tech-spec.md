# Ethy AI - Technical Specification

## 1. Component Inventory

### shadcn/ui Components (Built-in)
| Component | Purpose | Customization |
|-----------|---------|---------------|
| `button` | CTA buttons, icon buttons | Custom variants (pill, ghost, purple) |
| `input` | Chat textarea | Dark theme styling |
| `badge` | "Soon", "New" labels | Purple and orange variants |
| `tooltip` | Hover hints on sidebar items | Dark theme |
| `separator` | Section dividers in sidebar | Subtle color |
| `scroll-area` | Sidebar scroll | Hidden scrollbar style |
| `avatar` | Agent avatar row | Small size variant |

### Custom Components
| Component | File | Description |
|-----------|------|-------------|
| `Sidebar` | `sections/Sidebar.tsx` | Main navigation sidebar |
| `SidebarItem` | `components/SidebarItem.tsx` | Individual nav item with icon |
| `SidebarSection` | `components/SidebarSection.tsx` | Grouped nav section with label |
| `NotificationBar` | `sections/NotificationBar.tsx` | Top purple announcement bar |
| `MainHeader` | `sections/MainHeader.tsx` | Header with compose + login |
| `HeroSection` | `sections/HeroSection.tsx` | Center hero with agent orb |
| `ChatInput` | `sections/ChatInput.tsx` | Bottom chat input area |
| `AgentOrb` | `components/AgentOrb.tsx` | Animated purple sphere |
| `ExampleCommands` | `components/ExampleCommands.tsx` | List of example prompts |
| `AgentAvatars` | `components/AgentAvatars.tsx` | Row of plugin/agent icons |
| `SocialIcons` | `components/SocialIcons.tsx` | Footer social links |

## 2. Animation Implementation Table

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Page load fade-in | Framer Motion | `AnimatePresence` + `motion.div` with initial/animate | Low |
| Sidebar slide-in | Framer Motion | `motion.aside` with x: -280 → 0 | Low |
| Notification slide-down | Framer Motion | `motion.div` with y: -40 → 0 | Low |
| Hero content stagger | Framer Motion | `staggerChildren: 0.1` on container | Medium |
| Agent orb floating | Framer Motion | `animate` with y: [0, -8, 0], repeat: Infinity | Low |
| Agent orb glow pulse | CSS Animation | `@keyframes` box-shadow pulse | Low |
| Sidebar item hover | Tailwind | `transition-colors duration-150` | Low |
| Button hover scale | Tailwind | `hover:scale-[1.02] transition-transform` | Low |
| Chat input focus glow | Tailwind | `focus:ring-2 focus:ring-purple-500/20` | Low |
| Avatar hover scale | Tailwind | `hover:scale-110 transition-transform` | Low |
| Notification dismiss | Framer Motion | `animate={{ height: 0, opacity: 0 }}` | Low |

### Animation Library: Framer Motion
- **Rationale**: Simple declarative API, excellent for React, handles all our needs
- **Installation**: `npm install framer-motion`

## 3. State & Logic Plan

### State Management: React useState (Local)
| State | Type | Location | Purpose |
|-------|------|----------|---------|
| `notificationVisible` | `boolean` | `App.tsx` | Show/hide top notification bar |
| `activeNavItem` | `string` | `Sidebar.tsx` | Track active navigation item |
| `chatInput` | `string` | `ChatInput.tsx` | Chat textarea value |

### No Complex Logic
- Static content display (no API calls)
- Simple navigation state
- No forms or validation
- No authentication logic (UI only)

## 4. Project File Structure

```
/mnt/agents/output/app/
├── src/
│   ├── sections/
│   │   ├── Sidebar.tsx
│   │   ├── NotificationBar.tsx
│   │   ├── MainHeader.tsx
│   │   ├── HeroSection.tsx
│   │   └── ChatInput.tsx
│   ├── components/
│   │   ├── SidebarItem.tsx
│   │   ├── SidebarSection.tsx
│   │   ├── AgentOrb.tsx
│   │   ├── ExampleCommands.tsx
│   │   ├── AgentAvatars.tsx
│   │   └── SocialIcons.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── components/ui/          # shadcn components (auto-generated)
├── public/
│   └── images/             # Generated assets
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

## 5. Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  }
}
```

## 6. Tailwind Configuration

### Custom Colors
```javascript
colors: {
  background: {
    primary: '#16161e',
    sidebar: '#1e1e2a',
    input: '#252536',
  },
  accent: {
    purple: '#8b5cf6',
    'purple-hover': '#7c3aed',
    violet: '#a78bfa',
    orange: '#f59e0b',
  },
  border: {
    subtle: '#2e2e3f',
  }
}
```

### Custom Animations
```javascript
keyframes: {
  float: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-8px)' },
  },
  glow: {
    '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)' },
    '50%': { boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' },
  }
}
```

## 7. Implementation Order

1. Initialize project with `init-webapp.sh`
2. Configure Tailwind with custom colors/animations
3. Generate agent orb image asset
4. Build `Sidebar` section (navigation, social icons, footer)
5. Build `NotificationBar` section
6. Build `MainHeader` section
7. Build `HeroSection` (orb, heading, examples, CTA, avatars)
8. Build `ChatInput` section
9. Assemble in `App.tsx` with animations
10. Build and deploy
