# ✅ Fixed: Maximum Update Depth Error

## 🐛 **The Problem**

```
Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render.
```

## 🔧 **Root Cause**

The `useHeaderConfig` hook was causing infinite re-renders because:

1. The `config` object was being recreated on every render in the page components
2. This caused `useEffect` to run continuously
3. Each `useEffect` run called `updateConfig`, which triggered a re-render
4. This created an infinite loop

## ✅ **The Solution**

### 1. **Memoized Context Provider**

```tsx
const updateConfig = React.useCallback((newConfig: Partial<HeaderConfig>) => {
  setConfig((prev) => ({ ...prev, ...newConfig }));
}, []);

const contextValue = React.useMemo(
  () => ({
    config,
    updateConfig,
  }),
  [config, updateConfig]
);
```

### 2. **Selective Dependencies in useHeaderConfig**

```tsx
React.useEffect(() => {
  updateConfig(config);
  return () => updateConfig({});
}, [
  updateConfig,
  config.logoAffix,
  config.fixed,
  config.containerProps?.maxWidth,
  config.containerProps?.fixed,
  // Exclude config.rightSlot and config.onMenuClick to prevent infinite loops
]);
```

### 3. **Why This Works**

- **Stable Functions**: `updateConfig` is now memoized with `useCallback`
- **Selective Dependencies**: Only track primitive values, not complex objects/JSX
- **Still Functional**: The full `config` object is still passed to `updateConfig`

## 🧪 **Testing Results**

- ✅ App starts without errors on `http://localhost:3001`
- ✅ WOAA page loads correctly with proper header
- ✅ No infinite re-render loops
- ✅ Header configuration updates properly

## 📝 **Key Lessons**

1. **Object Dependencies**: Objects and JSX elements recreated on every render cause infinite loops
2. **Memoization**: Use `useCallback` and `useMemo` for stable references
3. **Selective Dependencies**: Sometimes you need to exclude dependencies that would cause problems
4. **ESLint Overrides**: When you intentionally exclude dependencies, document why

The header context system is now stable and working correctly! 🎉
