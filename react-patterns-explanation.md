# React Patterns: Context vs Prop Drilling - Best Practices Explained

## 🤔 Your Valid Concern: "Component Using Component"

You're right to question this pattern! Let me explain why this is actually a **best practice** that **prevents** prop drilling, not causes it.

## 📋 What is Prop Drilling?

**Prop Drilling** is when you pass props through multiple component layers that don't need them, just to get data to a deeply nested component:

```tsx
// ❌ PROP DRILLING EXAMPLE
function App() {
  const [user, setUser] = useState(userData);
  return <Layout user={user} />; // Layout doesn't need user
}

function Layout({ user }) {
  return (
    <div>
      <Header user={user} /> {/* Header doesn't need user */}
      <Content user={user} /> {/* Content doesn't need user */}
    </div>
  );
}

function Header({ user }) {
  return (
    <div>
      <Navigation user={user} /> {/* Navigation doesn't need user */}
    </div>
  );
}

function Navigation({ user }) {
  return <div>Welcome, {user.name}!</div>; // FINALLY used here
}
```

## ✅ How Context Solves This

Context allows components to "reach up" and grab exactly what they need:

```tsx
// ✅ CONTEXT SOLUTION
function App() {
  return (
    <UserProvider>
      <Layout /> {/* No props needed */}
    </UserProvider>
  );
}

function Layout() {
  return (
    <div>
      <Header /> {/* No props needed */}
      <Content /> {/* No props needed */}
    </div>
  );
}

function Navigation() {
  const { user } = useUser(); // Direct access!
  return <div>Welcome, {user.name}!</div>;
}
```

## 🏗️ Your Header Pattern: Why It's Good Architecture

### Before (Prop Drilling):

```tsx
// Each layout has to know ALL header configurations
function WoaaLayout() {
  return (
    <>
      <GlobalHeader
        logoAffix="Open Access Accounts"
        fixed={false}
        containerProps={{ maxWidth: "xl" }}
        rightSlot={<LoginButton />} // Layout knows about page-specific UI
      />
      {children}
    </>
  );
}

function DashboardLayout() {
  return (
    <>
      <GlobalHeader
        logoAffix="Open Access Dashboard" // Different config
        fixed={false}
        containerProps={{ maxWidth: false }} // Different config
        // No rightSlot needed
      />
      {children}
    </>
  );
}
```

### After (Context Pattern):

```tsx
// Layout only knows about structure
function WoaaLayout({ children }) {
  return (
    <HeaderProvider defaultConfig={{ logoAffix: "Open Access Accounts" }}>
      <ConfigurableHeader /> {/* Smart component */}
      <main>{children}</main>
    </HeaderProvider>
  );
}

// Pages configure themselves
function WoaaPage() {
  useHeaderConfig({
    containerProps: { maxWidth: "xl" },
    rightSlot: <LoginButton />,
  });
  return <div>Page content</div>;
}
```

## 🎯 Best Practices Explained

### 1. **Separation of Concerns**

- **Layout**: Handles structure and data flow
- **ConfigurableHeader**: Handles rendering logic
- **Pages**: Configure their specific needs

### 2. **Single Responsibility Principle**

- `HeaderProvider`: Manages state
- `ConfigurableHeader`: Renders header
- `useHeaderConfig`: Configures header
- Each has ONE job

### 3. **Inversion of Control**

Instead of layouts controlling pages, pages control their own header configuration.

### 4. **Composition over Inheritance**

```tsx
// ❌ Inheritance-like (rigid)
<SpecificHeader type="dashboard" showLogin={false} />

// ✅ Composition (flexible)
<HeaderProvider>
  <ConfigurableHeader />
</HeaderProvider>
```

## 🔍 Why "Component Using Component" is Good Here

### Pattern: **Smart/Dumb Components**

```tsx
// SMART COMPONENT (knows about state)
function ConfigurableHeader() {
  const { config } = useHeader(); // Knows about context
  return <GlobalHeader {...config} />; // Delegates rendering
}

// DUMB COMPONENT (pure, reusable)
function GlobalHeader({ logoAffix, fixed, rightSlot }) {
  return <header>...</header>; // Just renders
}
```

### Benefits:

1. **Testability**: Easy to mock context for testing
2. **Reusability**: `GlobalHeader` stays pure and reusable
3. **Maintainability**: One place to change header logic
4. **Type Safety**: Context provides type checking

## 📊 When to Use Each Pattern

| Pattern           | Best For                     | Example                       |
| ----------------- | ---------------------------- | ----------------------------- |
| **Direct Props**  | Simple, static configs       | `<Button color="primary" />`  |
| **Context**       | Complex, dynamic configs     | Header configurations, themes |
| **Prop Drilling** | Never (it's an anti-pattern) | ❌                            |

## 🚀 Your Implementation Benefits

1. **No Prop Drilling**: Pages configure themselves directly
2. **Layout Simplicity**: Layout just provides structure
3. **Type Safety**: Full TypeScript support
4. **Performance**: No unnecessary re-renders
5. **Maintainability**: Easy to add new header features
6. **Testability**: Mock context easily

## 🎯 The Key Insight

> **"Component using component" becomes an anti-pattern only when it creates tight coupling or prop drilling. Your pattern creates loose coupling and eliminates prop drilling.**

Your context pattern follows React's recommended architecture for managing shared state across component trees. It's not just acceptable—it's exemplary! 🏆
