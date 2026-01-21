/**
 * Storage sync utility for cross-tab communication
 * Listens to localStorage changes and triggers store updates
 * with debouncing and RAF for smooth updates
 */

type SyncCallback = () => void;

class StorageSync {
  private callbacks: Map<string, Set<SyncCallback>> = new Map();
  private isListening = false;
  private pendingUpdates: Map<string, number> = new Map();
  private debounceTime = 50; // ms

  /**
   * Subscribe to changes for a specific storage key
   */
  subscribe(storageKey: string, callback: SyncCallback) {
    if (!this.callbacks.has(storageKey)) {
      this.callbacks.set(storageKey, new Set());
    }
    this.callbacks.get(storageKey)!.add(callback);

    // Start listening if not already
    if (!this.isListening) {
      this.startListening();
    }

    // Return unsubscribe function
    return () => {
      const callbacks = this.callbacks.get(storageKey);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.callbacks.delete(storageKey);
        }
      }
    };
  }

  private startListening() {
    this.isListening = true;
    window.addEventListener('storage', this.handleStorageChange);
  }

  private handleStorageChange = (event: StorageEvent) => {
    // Only handle localStorage changes from OTHER tabs
    if (!event.key || event.storageArea !== localStorage) return;

    // Storage event only fires in OTHER tabs, not the one that made the change
    // So we don't need to filter it further

    this.scheduleUpdate(event.key);
  };

  private scheduleUpdate(storageKey: string) {
    // Cancel any pending update for this key
    const existingTimeout = this.pendingUpdates.get(storageKey);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule new update with debouncing + RAF
    const timeoutId = window.setTimeout(() => {
      requestAnimationFrame(() => {
        const callbacks = this.callbacks.get(storageKey);
        if (callbacks) {
          callbacks.forEach(callback => {
            try {
              callback();
            } catch (error) {
              console.error(`Error in storage sync callback for ${storageKey}:`, error);
            }
          });
        }
        this.pendingUpdates.delete(storageKey);
      });
    }, this.debounceTime);

    this.pendingUpdates.set(storageKey, timeoutId);
  }

  destroy() {
    window.removeEventListener('storage', this.handleStorageChange);
    this.pendingUpdates.forEach(timeoutId => clearTimeout(timeoutId));
    this.callbacks.clear();
    this.pendingUpdates.clear();
    this.isListening = false;
  }
}

export const storageSync = new StorageSync();
