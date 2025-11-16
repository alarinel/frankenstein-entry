/**
 * Custom hook for keyboard navigation
 * Provides configurable keyboard event handling with key bindings
 * 
 * @author alarinel@gmail.com
 */

import { useEffect, useCallback, useRef } from 'react';

export interface KeyBinding {
  key: string;
  handler: () => void;
  preventDefault?: boolean;
  enabled?: boolean;
}

export interface UseKeyboardNavigationOptions {
  bindings: KeyBinding[];
  enabled?: boolean;
  target?: 'window' | 'document';
}

/**
 * Hook for managing keyboard navigation with configurable key bindings
 * 
 * @param options Configuration options for keyboard navigation
 * @returns Cleanup function (automatically called on unmount)
 * 
 * @example
 * ```tsx
 * useKeyboardNavigation({
 *   bindings: [
 *     { key: 'ArrowRight', handler: handleNext, preventDefault: true },
 *     { key: 'ArrowLeft', handler: handlePrevious, preventDefault: true },
 *     { key: ' ', handler: handleTogglePlay, preventDefault: true },
 *     { key: 'Escape', handler: handleClose, enabled: isModalOpen },
 *   ],
 *   enabled: true,
 * });
 * ```
 */
export const useKeyboardNavigation = ({
  bindings,
  enabled = true,
  target = 'window',
}: UseKeyboardNavigationOptions): void => {
  // Use refs to avoid recreating the event listener on every render
  const bindingsRef = useRef(bindings);
  const enabledRef = useRef(enabled);

  // Update refs when values change
  useEffect(() => {
    bindingsRef.current = bindings;
  }, [bindings]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Memoized keyboard event handler
  const handleKeyPress = useCallback((e: Event) => {
    if (!enabledRef.current) return;

    const keyboardEvent = e as KeyboardEvent;
    const binding = bindingsRef.current.find((b) => b.key === keyboardEvent.key);
    
    if (binding && (binding.enabled === undefined || binding.enabled)) {
      if (binding.preventDefault) {
        keyboardEvent.preventDefault();
      }
      binding.handler();
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const targetElement = target === 'window' ? window : document;
    targetElement.addEventListener('keydown', handleKeyPress);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyPress);
    };
  }, [enabled, target, handleKeyPress]);
};

/**
 * Predefined key constants for common navigation patterns
 */
export const KeyboardKeys = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  SPACE: ' ',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
} as const;
