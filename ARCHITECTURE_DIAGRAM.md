# Portfolio Website Architecture Diagram

## High-Level System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    User Interface                        │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │    Home     │  │  Portfolio  │  │    About    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Contact   │  │   Donate    │  │    404      │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├──────────────────────────────────────────────────────────┤
│                  React Router DOM                       │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   Navbar    │  │ CardProject │  │  InputField │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Background  │  │ ProjectDetail│  │TechStackIcon│     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├──────────────────────────────────────────────────────────┤
│               Animation Libraries                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ Framer Mtn  │  │     AOS     │  │   Lottie    │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├──────────────────────────────────────────────────────────┤
│                State Management                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   useState  │  │  useEffect  │  │  useContext │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
├──────────────────────────────────────────────────────────┤
│                  Firebase SDK                            │
├──────────────────────────────────────────────────────────┤
│              Firestore Database                          │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │  Projects   │  │  Messages   │                       │
│  └─────────────┘  └─────────────┘                       │
└──────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Interaction
        ↓
┌─────────────────────┐
│   React Component   │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Event Handler      │
│  (onClick, onChange)│
└─────────────────────┘
        ↓
┌─────────────────────┐
│  State Update       │
│  (useState)         │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Effect Hook        │
│  (useEffect)        │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Firebase Call      │
│  (getDocs, addDoc)  │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Firestore DB       │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Data Response      │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  UI Re-render       │
│  + Animations       │
└─────────────────────┘
```

## Component Hierarchy

```
App
├── WelcomeScreen
├── Navbar
├── Routes
│   ├── Home
│   │   ├── HeroSection
│   │   ├── Statistics
│   │   ├── CTAButtons
│   │   └── SocialLinks
│   ├── About
│   │   ├── Bio
│   │   ├── Skills
│   │   └── Experience
│   ├── Portfolio
│   │   ├── ProjectGrid
│   │   │   └── CardProject []
│   │   └── ProjectDetail (Modal)
│   ├── Contact
│   │   └── InputField []
│   ├── Donate
│   ├── ThankYou
│   └── NotFound
├── Background
└── Footer
```

## Build Process Flow

```
Development (npm run dev)
        ↓
┌─────────────────────┐
│      Vite Dev       │
│     (localhost)     │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Hot Module Replace │
│  (HMR)              │
└─────────────────────┘
        ↓

Production (npm run build)
        ↓
┌─────────────────────┐
│    Vite Bundle      │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Code Splitting    │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Minification      │
└─────────────────────┘
        ↓
┌─────────────────────┐
│     dist/ folder    │
└─────────────────────┘
        ↓
┌─────────────────────┐
│   Deploy (Firebase) │
└─────────────────────┘
```

## State Management Pattern

```
Local Component State
├── Form Data (Contact)
├── Modal State (Portfolio)
├── Menu State (Navbar)
└── Loading State

Shared State (Context)
├── Theme (if implemented)
├── User Data
└── Global Settings

External State
├── Firebase Projects
├── Messages
└── Analytics Data
```

## Animation Pipeline

```
Component Mount
        ↓
┌─────────────────────┐
│   AOS Initialize    │
└─────────────────────┘
        ↓
┌─────────────────────┐
│ Framer Motion       │
│ Components Render   │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Lottie Load        │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  CSS Transitions    │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Interactive States │
│  (Hover, Focus)     │
└─────────────────────┘
```

## Security Layers

```
Input Validation
        ↓
┌─────────────────────┐
│  Client Side        │
│  Checks             │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Data Sanitization  │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  Firebase Security  │
│  Rules              │
└─────────────────────┘
        ↓
┌─────────────────────┐
│  HTTPS Only         │
│  Transport          │
└─────────────────────┘
```

## Performance Optimization Points

1. **Bundle Size**
   - Code splitting at route level
   - Lazy loading components
   - Tree shaking unused code

2. **Rendering**
   - React.memo for components
   - useEffect dependencies
   - Virtual scrolling for lists

3. **Assets**
   - Image optimization
   - SVG instead of PNG where possible
   - Caching strategies

4. **Network**
   - CDN for static assets
   - Compression enabled
   - Preload critical resources

This visual representation helps understand how different parts of the portfolio website work together to create a cohesive, performant, and maintainable web application.