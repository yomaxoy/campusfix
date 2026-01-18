import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import type { OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default'; icon: any }> = {
  pending: { label: 'Sucht Fixer', variant: 'warning', icon: Clock },
  accepted: { label: 'Akzeptiert', variant: 'info', icon: CheckCircle },
  en_route: { label: 'Unterwegs', variant: 'info', icon: Clock },
  arrived: { label: 'Angekommen', variant: 'info', icon: CheckCircle },
  in_progress: { label: 'In Bearbeitung', variant: 'warning', icon: Clock },
  completed: { label: 'Abgeschlossen', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Storniert', variant: 'error', icon: XCircle },
  escalated: { label: 'Eskaliert', variant: 'error', icon: AlertCircle },
};

export const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getOrdersByCustomerId } = useOrderStore();
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');

  const myOrders = user ? getOrdersByCustomerId(user.id) : [];

  const activeOrders = myOrders.filter(o =>
    ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'].includes(o.status)
  );

  const completedOrders = myOrders.filter(o => o.status === 'completed');
  const cancelledOrders = myOrders.filter(o => ['cancelled', 'escalated'].includes(o.status));

  const getDisplayOrders = () => {
    switch (activeTab) {
      case 'active': return activeOrders;
      case 'completed': return completedOrders;
      case 'cancelled': return cancelledOrders;
      default: return [];
    }
  };

  const displayOrders = getDisplayOrders();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Meine Aufträge</h1>
        <p className="text-slate-600 mt-2">Verwalte deine Reparatur-Aufträge</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'active'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Aktiv
          {activeOrders.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full text-xs">
              {activeOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'completed'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Abgeschlossen
          {completedOrders.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
              {completedOrders.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('cancelled')}
          className={`px-6 py-3 font-medium transition-all ${
            activeTab === 'cancelled'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Storniert
          {cancelledOrders.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs">
              {cancelledOrders.length}
            </span>
          )}
        </button>
      </div>

      {/* Orders List */}
      {displayOrders.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <Clock className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            Keine Aufträge
          </h3>
          <p className="text-slate-600">
            {activeTab === 'active' && 'Du hast keine aktiven Aufträge.'}
            {activeTab === 'completed' && 'Du hast noch keine abgeschlossenen Aufträge.'}
            {activeTab === 'cancelled' && 'Du hast keine stornierten Aufträge.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayOrders.map((order) => {
            const statusInfo = statusConfig[order.status];
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={order.id}
                hover
                onClick={() => navigate(`/orders/${order.id}`)}
                className="cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">
                        {order.issueType}
                      </h3>
                      <Badge variant={statusInfo.variant}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <p className="text-slate-600 mb-2">
                      {order.deviceBrand && order.deviceModel
                        ? `${order.deviceBrand} ${order.deviceModel}`
                        : order.subcategory}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span>📍 {order.location.name}</span>
                      <span>📅 {formatDate(order.createdAt)}</span>
                      <span>{order.deliveryMethod === 'meetup' ? '👤 Persönlich' : '📦 Versand'}</span>
                    </div>

                    {order.status === 'completed' && order.rating && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium text-slate-700">
                          {order.rating}/5
                        </span>
                        {order.review && (
                          <span className="text-sm text-slate-500">- "{order.review}"</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary-600">
                      {order.finalPrice ? `${order.finalPrice}€` : `${order.priceEstimate.min}-${order.priceEstimate.max}€`}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {order.finalPrice ? 'Endpreis' : 'Schätzung'}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
