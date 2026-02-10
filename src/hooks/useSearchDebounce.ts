// Custom hook for debounced search with filtering indicator
import * as React from "react";

interface UseSearchDebounceOptions {
  initialSearchTerm?: string;
  debounceDelay?: number;
  onSearchChange: (value: string) => void;
}

export function useSearchDebounce({
  initialSearchTerm = "",
  debounceDelay = 150,
  onSearchChange,
}: UseSearchDebounceOptions) {
  const [localSearchTerm, setLocalSearchTerm] =
    React.useState(initialSearchTerm);
  const [isFiltering, setIsFiltering] = React.useState(false);

  // Sync local state when parent searchTerm changes externally
  React.useEffect(() => {
    setLocalSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Debounce search to parent (150ms for snappy feel)
  React.useEffect(() => {
    // Show filtering indicator immediately when typing
    if (localSearchTerm !== initialSearchTerm) {
      setIsFiltering(true);
    }

    const timer = setTimeout(() => {
      if (localSearchTerm !== initialSearchTerm) {
        onSearchChange(localSearchTerm);
        // Clear filtering indicator after search completes
        setTimeout(() => setIsFiltering(false), 50);
      }
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [localSearchTerm, initialSearchTerm, onSearchChange, debounceDelay]);

  return {
    localSearchTerm,
    setLocalSearchTerm,
    isFiltering,
  };
}
