import React, { useState } from 'react';
import { Power, TrendingUp, Clock, MapPin, Euro, Check } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useOrderStore } from '../stores/useOrderStore';
import { useAuthStore } from '../stores/useAuthStore';

export const FixerDashboard: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useAuthStore();
  const { orders, acceptOrder, getOrdersByFixerId } = useOrderStore();

  // Get pending orders (not yet accepted)
  const availableOrders = orders.filter(o => o.status === 'pending');

  // Get fixer's own orders
  const myFixerOrders = user ? getOrdersByFixerId(user.id) : [];
  const myActiveOrders = myFixerOrders.filter(o =>
    ['accepted', 'en_route', 'arrived', 'in_progress'].includes(o.status)
  );
  const myCompletedOrders = myFixerOrders.filter(o => o.status === 'completed');

  // Calculate real statistics for Fixer
  const totalEarnings = myCompletedOrders.reduce((sum, order) => sum + (order.finalPrice || 0), 0);
  const averageRating = myCompletedOrders.filter(o => o.rating).length > 0
    ? myCompletedOrders.reduce((sum, o) => sum + (o.rating || 0), 0) / myCompletedOrders.filter(o => o.rating).length
    : 0;

  const stats = {
    totalEarnings,
    completedJobs: myCompletedOrders.length,
    averageRating: averageRating > 0 ? averageRating : 4.8,
    activeJobs: myActiveOrders.length,
  };

  const handleAcceptOrder = (orderId: string) => {
    if (user) {
      acceptOrder(orderId, user.id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Fixer Dashboard</h1>
            <p className="text-slate-600 mt-2">Verdiene Geld mit deinen Fähigkeiten</p>
          </div>

          {/* Online/Offline Toggle */}
          <Card className="px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">Status:</span>
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  isOnline
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Power className="w-4 h-4" />
                {isOnline ? 'Online' : 'Offline'}
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Euro className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.totalEarnings}€</p>
              <p className="text-sm text-slate-600">Verdienst</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.completedJobs}</p>
              <p className="text-sm text-slate-600">Abgeschlossen</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.averageRating}</p>
              <p className="text-sm text-slate-600">Bewertung</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.activeJobs}</p>
              <p className="text-sm text-slate-600">Aktive Jobs</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Orders */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Verfügbare Aufträge</h2>
          {!isOnline && (
            <Badge variant="warning">
              Du bist offline - Schalte dich online um Aufträge zu sehen
            </Badge>
          )}
        </div>

        {!isOnline ? (
          <Card className="text-center py-16">
            <Power className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Du bist offline</h3>
            <p className="text-slate-600 mb-6">
              Schalte dich online, um verfügbare Aufträge zu sehen und anzunehmen
            </p>
            <Button onClick={() => setIsOnline(true)}>
              <Power className="w-4 h-4 mr-2" />
              Online gehen
            </Button>
          </Card>
        ) : availableOrders.length === 0 ? (
          <Card className="text-center py-16">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Keine Aufträge verfügbar</h3>
            <p className="text-slate-600">
              Momentan gibt es keine neuen Aufträge. Wir benachrichtigen dich, sobald neue Aufträge reinkommen!
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {availableOrders.map((order) => (
              <Card key={order.id} hover className="cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-slate-800">
                        {order.issueType}
                      </h3>
                      <Badge variant="warning">Neu</Badge>
                    </div>

                    <p className="text-slate-700 mb-3">
                      {order.deviceBrand && order.deviceModel
                        ? `${order.deviceBrand} ${order.deviceModel}`
                        : order.subcategory}
                    </p>

                    {order.issueDescription && (
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                        {order.issueDescription}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.location.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right ml-6">
                    <p className="text-3xl font-bold text-primary-600 mb-2">
                      {order.priceEstimate.min}-{order.priceEstimate.max}€
                    </p>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptOrder(order.id);
                      }}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Auftrag annehmen
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">Fixer-Tipps</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Reagiere schnell auf neue Aufträge für höhere Chancen</li>
              <li>• Kommuniziere klar mit deinen Kunden über den Chat</li>
              <li>• Bringe alle notwendigen Werkzeuge zur Safe Zone mit</li>
              <li>• Gute Bewertungen erhöhen deine Sichtbarkeit</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
