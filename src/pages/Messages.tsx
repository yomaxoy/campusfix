import React, { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import { mockUsers } from '../data/mockUsers';

export const Messages: React.FC = () => {
  const { user } = useAuthStore();
  const { getOrdersByCustomerId } = useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  if (!user) return null;

  const myOrders = getOrdersByCustomerId(user.id).filter(o => o.fixerId);
  const selectedOrder = selectedOrderId ? myOrders.find(o => o.id === selectedOrderId) : myOrders[0];
  const fixer = selectedOrder?.fixerId ? mockUsers.find(u => u.id === selectedOrder.fixerId) : null;

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
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
                const orderFixer = order.fixerId ? mockUsers.find(u => u.id === order.fixerId) : null;
                if (!orderFixer) return null;

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
                        <span className="text-primary-600 font-bold">{orderFixer.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-slate-800 truncate">{orderFixer.name}</p>
                          <Badge variant="default" className="text-xs ml-2">
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 truncate">{order.issueType}</p>
                        <p className="text-xs text-slate-500 mt-1">Zuletzt: vor 2 Std.</p>
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
          {selectedOrder && fixer ? (
            <Card className="flex flex-col h-[600px]">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">{fixer.name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800">{fixer.name}</h3>
                  <p className="text-sm text-slate-600">{selectedOrder.issueType}</p>
                </div>
                <Badge variant="info">{selectedOrder.status}</Badge>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {/* Example messages */}
                <div className="flex justify-start">
                  <div className="max-w-[70%]">
                    <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-4">
                      <p className="text-sm text-slate-800">
                        Hallo! Ich habe deinen Auftrag angenommen. Ich kann morgen um 14 Uhr zur Safe Zone kommen. Passt das?
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-2">{fixer.name} • vor 2 Std.</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[70%]">
                    <div className="bg-primary-600 rounded-2xl rounded-tr-sm p-4">
                      <p className="text-sm text-white">
                        Perfekt! 14 Uhr passt mir super. Bis morgen! 👍
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 mr-2 text-right">Du • vor 1 Std.</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[70%]">
                    <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-4">
                      <p className="text-sm text-slate-800">
                        Super! Ich bringe alle notwendigen Werkzeuge mit. Bis morgen! 🔧
                      </p>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 ml-2">{fixer.name} • vor 45 Min.</p>
                  </div>
                </div>

                {/* System Message */}
                <div className="flex justify-center">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
                    <p className="text-xs text-blue-800 text-center">
                      📍 Treffpunkt: {selectedOrder.location.name}
                    </p>
                  </div>
                </div>
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
