import React from 'react';
import { User, Mail, Calendar, Shield, Star, Package } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../stores/useAuthStore';
import { useOrderStore } from '../stores/useOrderStore';

export const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const { getOrdersByCustomerId } = useOrderStore();

  if (!user) return null;

  const myOrders = getOrdersByCustomerId(user.id);
  const completedOrders = myOrders.filter(o => o.status === 'completed');
  const averageRating = completedOrders.filter(o => o.rating).reduce((acc, o) => acc + (o.rating || 0), 0) / completedOrders.filter(o => o.rating).length || 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Mein Profil</h1>
        <p className="text-slate-600 mt-2">Verwalte deine Kontoinformationen</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{user.name}</h2>
              <p className="text-slate-600 mb-4">{user.email}</p>

              {user.isVerified ? (
                <Badge variant="success" className="mb-4">
                  <Shield className="w-3 h-3 mr-1" />
                  Verifiziert
                </Badge>
              ) : (
                <Badge variant="warning" className="mb-4">
                  Nicht verifiziert
                </Badge>
              )}

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  Mitglied seit {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Info & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Info */}
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Account-Informationen</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-3 border-b border-slate-100">
                <User className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Name</p>
                  <p className="font-medium text-slate-800">{user.name}</p>
                </div>
                <Button variant="outline" size="sm">Bearbeiten</Button>
              </div>

              <div className="flex items-center gap-3 py-3 border-b border-slate-100">
                <Mail className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">E-Mail</p>
                  <p className="font-medium text-slate-800">{user.email}</p>
                </div>
                <Button variant="outline" size="sm">Bearbeiten</Button>
              </div>

              <div className="flex items-center gap-3 py-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm text-slate-600">Rolle</p>
                  <p className="font-medium text-slate-800 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Statistiken</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{myOrders.length}</p>
                <p className="text-sm text-slate-600">Gesamt Aufträge</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                  <Star className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">{completedOrders.length}</p>
                <p className="text-sm text-slate-600">Abgeschlossen</p>
              </div>

              <div className="text-center p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mx-auto mb-2">
                  <Star className="w-6 h-6 text-yellow-600 fill-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-slate-800">
                  {averageRating > 0 ? averageRating.toFixed(1) : '-'}
                </p>
                <p className="text-sm text-slate-600">Durchschnitt</p>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Sicherheit</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div>
                  <p className="font-medium text-slate-800">Passwort ändern</p>
                  <p className="text-sm text-slate-600">Zuletzt geändert vor 3 Monaten</p>
                </div>
                <Button variant="outline" size="sm">Ändern</Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-slate-800">Zwei-Faktor-Authentifizierung</p>
                  <p className="text-sm text-slate-600">Erhöhe die Sicherheit deines Accounts</p>
                </div>
                <Button variant="outline" size="sm">Aktivieren</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
