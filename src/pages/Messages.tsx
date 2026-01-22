import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import { useMessageStore } from '../stores/useMessageStore';
import { mockUsers } from '../data/mockUsers';
import { getIssueTypeLabel } from '../utils/issueTypeFormatter';

export const Messages: React.FC = () => {
  const { user } = useAuthStore();
  const { getOrdersByCustomerId, getOrdersByFixerId } = useOrderStore();
  const {
    addMessage,
    getMessagesByOrderId,
    markAsRead,
    getUnreadCount
  } = useMessageStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // Get all orders where user is either customer or fixer
  const customerOrders = getOrdersByCustomerId(user.id).filter(o => o.fixerId);
  const fixerOrders = getOrdersByFixerId(user.id);
  const myOrders = [...customerOrders, ...fixerOrders];

  const selectedOrder = selectedOrderId ? myOrders.find(o => o.id === selectedOrderId) : myOrders[0];

  // Determine chat partner based on user role in this order
  const isCustomer = selectedOrder?.customerId === user.id;
  const partnerId = isCustomer ? selectedOrder?.fixerId : selectedOrder?.customerId;
  const chatPartner = partnerId ? mockUsers.find(u => u.id === partnerId) : null;

  // Get messages for selected order
  const orderMessages = selectedOrder ? getMessagesByOrderId(selectedOrder.id) : [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [orderMessages]);

  // Mark messages as read when selecting an order
  useEffect(() => {
    if (selectedOrder) {
      markAsRead(selectedOrder.id, user.id);
    }
  }, [selectedOrder, user.id, markAsRead]);

  const handleSendMessage = () => {
    if (message.trim() && selectedOrder) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        orderId: selectedOrder.id,
        senderId: user.id,
        content: message.trim(),
        timestamp: new Date().toISOString(),
        read: false,
      };
      addMessage(newMessage);
      setMessage('');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'gerade eben';
    if (diffMins < 60) return `vor ${diffMins} Min.`;
    if (diffHours < 24) return `vor ${diffHours} Std.`;
    if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (myOrders.length === 0) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Nachrichten</h1>
          <p className="text-slate-600 mt-2">Kommuniziere mit deinen Fixern</p>
        </div>

        <Card className="text-center py-16">
          <MessageCircle className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Noch keine Nachrichten</h3>
          <p className="text-slate-600">
            Sobald ein Fixer deinen Auftrag annimmt, kannst du hier mit ihm chatten.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Nachrichten</h1>
        <p className="text-slate-600 mt-2">Kommuniziere mit deinen Fixern</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">Konversationen</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {myOrders.map((order) => {
                const orderIsCustomer = order.customerId === user.id;
                const orderPartnerId = orderIsCustomer ? order.fixerId : order.customerId;
                const orderPartner = orderPartnerId ? mockUsers.find(u => u.id === orderPartnerId) : null;
                if (!orderPartner) return null;

                const unreadCount = getUnreadCount(order.id, user.id);
                const orderMsgs = getMessagesByOrderId(order.id);
                const lastMsg = orderMsgs[orderMsgs.length - 1];

                return (
                  <button
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`w-full p-4 text-left hover:bg-slate-50 transition-colors ${
                      selectedOrder?.id === order.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-600 font-bold">{orderPartner.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-slate-800 truncate">{orderPartner.name}</p>
                          {unreadCount > 0 && (
                            <Badge variant="error" className="text-xs">
                              {unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 truncate">{getIssueTypeLabel(order.issueType, order.category, order.subcategory)}</p>
                        {lastMsg && (
                          <p className="text-xs text-slate-500 mt-1">
                            Zuletzt: {formatTimestamp(lastMsg.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedOrder && chatPartner ? (
            <Card className="flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{chatPartner.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{chatPartner.name}</h3>
                  <p className="text-sm text-slate-600">{selectedOrder.issueType}</p>
                </div>
                <Badge variant="info">{selectedOrder.status}</Badge>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {orderMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500 text-center">
                      Noch keine Nachrichten.<br />
                      Schreibe die erste Nachricht!
                    </p>
                  </div>
                ) : (
                  <>
                    {orderMessages.map((msg) => {
                      const isOwnMessage = msg.senderId === user.id;
                      const sender = mockUsers.find(u => u.id === msg.senderId);

                      return (
                        <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[70%]">
                            <div className={`rounded-2xl p-4 ${
                              isOwnMessage
                                ? 'bg-primary-600 rounded-tr-sm'
                                : 'bg-slate-100 rounded-tl-sm'
                            }`}>
                              <p className={`text-sm ${isOwnMessage ? 'text-white' : 'text-slate-800'}`}>
                                {msg.content}
                              </p>
                            </div>
                            <p className={`text-xs text-slate-500 mt-1 ${isOwnMessage ? 'text-right mr-2' : 'ml-2'}`}>
                              {isOwnMessage ? 'Du' : sender?.name} • {formatTimestamp(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    {/* System Message - Location */}
                    {orderMessages.length > 0 && (
                      <div className="flex justify-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                          <p className="text-xs text-blue-800 text-center">
                            📍 Treffpunkt: {selectedOrder.location.name}
                          </p>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nachricht schreiben..."
                    rows={2}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="self-end"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  💡 Tipp: Drücke Enter zum Senden, Shift+Enter für neue Zeile
                </p>
              </div>
            </Card>
          ) : (
            <Card className="text-center py-16">
              <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Wähle eine Konversation aus</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
