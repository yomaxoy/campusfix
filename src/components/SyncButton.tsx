import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useOrderStore } from '../stores/useOrderStore';
import { useMessageStore } from '../stores/useMessageStore';
import { useNotificationStore } from '../stores/useNotificationStore';

export function SyncButton() {
  const reloadOrders = useOrderStore((state) => state.reloadFromStorage);
  const reloadMessages = useMessageStore((state) => state.reloadFromStorage);
  const reloadNotifications = useNotificationStore((state) => state.reloadFromStorage);

  const handleSync = () => {
    reloadOrders();
    reloadMessages();
    reloadNotifications();
  };

  // Auto-sync alle 2 Sekunden
  useEffect(() => {
    const interval = setInterval(() => {
      handleSync();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSync}
      className="gap-2"
    >
      <RefreshCw className="h-4 w-4" />
      Aktualisieren
    </Button>
  );
}
