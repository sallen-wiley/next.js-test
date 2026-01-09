"use client";
import React, { createContext, useContext, useState, useCallback } from "react";

export interface AdminAction {
  /** Unique identifier for the action */
  id: string;
  /** Display label for the menu item */
  label: string;
  /** Icon component to display */
  icon?: React.ReactNode;
  /** Action handler */
  onClick: () => void | Promise<void>;
  /** Whether the action is destructive (shows in red) */
  destructive?: boolean;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Tooltip or help text */
  tooltip?: string;
}

interface AdminActionsContextType {
  actions: AdminAction[];
  setActions: (actions: AdminAction[]) => void;
  clearActions: () => void;
}

const AdminActionsContext = createContext<AdminActionsContextType | undefined>(
  undefined
);

export function AdminActionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [actions, setActionsState] = useState<AdminAction[]>([]);

  const setActions = useCallback((newActions: AdminAction[]) => {
    setActionsState(newActions);
  }, []);

  const clearActions = useCallback(() => {
    setActionsState([]);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      actions,
      setActions,
      clearActions,
    }),
    [actions, setActions, clearActions]
  );

  return (
    <AdminActionsContext.Provider value={contextValue}>
      {children}
    </AdminActionsContext.Provider>
  );
}

export function useAdminActionsContext() {
  const context = useContext(AdminActionsContext);
  if (!context) {
    throw new Error(
      "useAdminActionsContext must be used within AdminActionsProvider"
    );
  }
  return context;
}

/**
 * Hook for pages to register admin actions
 * Actions are automatically cleared when the component unmounts
 *
 * Note: For best performance, wrap your actions array in useMemo()
 */
export function useAdminActions(actions: AdminAction[]) {
  const { setActions, clearActions } = useAdminActionsContext();

  // Create a stable JSON representation of action IDs for comparison
  // This prevents infinite loops when actions array is recreated but content is the same
  const actionIds = React.useMemo(
    () => actions.map((a) => a.id).join(","),
    [actions]
  );

  React.useEffect(() => {
    setActions(actions);

    // Clear actions when component unmounts
    return () => {
      clearActions();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionIds, setActions, clearActions]);
}
