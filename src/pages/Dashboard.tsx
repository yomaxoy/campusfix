import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Bike, Home, TrendingUp, Users, Wrench } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';
import { categories } from '../data/categories';
import { getIssueTypeLabel } from '../utils/issueTypeFormatter';

const iconMap = {
  Smartphone,
  Bike,
  Home,
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getOrdersByCustomerId } = useOrderStore();

  const myOrders = user ? getOrdersByCustomerId(user.id) : [];
  const activeOrder = myOrders.find((o) => ['pending', 'accepted', 'en_route', 'arrived', 'in_progress'].includes(o.status));
  const recentOrders = myOrders.filter((o) => o.status === 'completed').slice(0, 3);

  const statusLabels: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
    pending: { label: 'Sucht Fixer...', variant: 'warning' },
    accepted: { label: 'Akzeptiert', variant: 'info' },
    en_route: { label: 'Unterwegs', variant: 'info' },
    arrived: { label: 'Angekommen', variant: 'info' },
    in_progress: { label: 'In Bearbeitung', variant: 'warning' },
    completed: { label: 'Abgeschlossen', variant: 'success' },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Willkommen zurück, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-600 mt-2">
          Finde schnelle Reparatur-Hilfe von vertrauenswürdigen Studierenden
        </p>
      </div>

      {/* Active Order Card */}
      {activeOrder && (
        <Card className="border-primary-200 bg-primary-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Aktive Reparatur</h3>
              <p className="text-slate-700 mb-1">{activeOrder.issueType}</p>
              <p className="text-sm text-slate-600 mb-3">
                {activeOrder.deviceBrand} {activeOrder.deviceModel}
              </p>
              <Badge variant={statusLabels[activeOrder.status].variant}>
                {statusLabels[activeOrder.status].label}
              </Badge>
            </div>
            <Button
              size="sm"
              onClick={() => navigate(`/orders/${activeOrder.id}`)}
            >
              Details
            </Button>
          </div>
        </Card>
      )}

      {/* Service Categories */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            return (
              <Card
                key={category.id}
                hover
                onClick={() => navigate('/new-booking', { state: { category: category.id } })}
                className="text-center"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-sm text-slate-600">{category.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-slate-800">Letzte Reparaturen</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/my-orders')}
            >
              Alle anzeigen
            </Button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Card key={order.id} hover onClick={() => navigate(`/orders/${order.id}`)}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{getIssueTypeLabel(order.issueType, order.category, order.subcategory)}</p>
                    <p className="text-sm text-slate-600">
                      {order.deviceBrand} {order.deviceModel} • {order.finalPrice}€
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">Abgeschlossen</Badge>
                    {order.rating && (
                      <p className="text-sm text-slate-600 mt-1">⭐ {order.rating}/5</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Platform Stats */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Plattform-Statistiken</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">1,247</p>
                <p className="text-sm text-slate-600">Erfolgreiche Reparaturen</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">342</p>
                <p className="text-sm text-slate-600">Aktive Studierende</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">87</p>
                <p className="text-sm text-slate-600">Verfügbare Fixer</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
