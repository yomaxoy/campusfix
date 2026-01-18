import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle, Send, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';
import { useOrderStore } from '../stores/useOrderStore';
import { mockUsers } from '../data/mockUsers';
import type { OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; variant: 'success' | 'warning' | 'error' | 'info'; color: string }> = {
  pending: { label: 'Sucht Fixer', variant: 'warning', color: 'bg-yellow-500' },
  accepted: { label: 'Akzeptiert', variant: 'info', color: 'bg-blue-500' },
  en_route: { label: 'Unterwegs', variant: 'info', color: 'bg-blue-500' },
  arrived: { label: 'Angekommen', variant: 'info', color: 'bg-blue-500' },
  in_progress: { label: 'In Bearbeitung', variant: 'warning', color: 'bg-yellow-500' },
  completed: { label: 'Abgeschlossen', variant: 'success', color: 'bg-green-500' },
  cancelled: { label: 'Storniert', variant: 'error', color: 'bg-red-500' },
  escalated: { label: 'Eskaliert', variant: 'error', color: 'bg-red-500' },
};

const statusSteps: OrderStatus[] = ['pending', 'accepted', 'en_route', 'arrived', 'in_progress', 'completed'];

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrder } = useOrderStore();
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="text-center py-12">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Auftrag nicht gefunden</h2>
          <p className="text-slate-600 mb-6">Der gesuchte Auftrag existiert nicht.</p>
          <Button onClick={() => navigate('/my-orders')}>
            Zurück zu Meine Aufträge
          </Button>
        </Card>
      </div>
    );
  }

  const fixer = order.fixerId ? mockUsers.find(u => u.id === order.fixerId) : null;
  const statusInfo = statusConfig[order.status];
  const currentStepIndex = statusSteps.indexOf(order.status);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In a real app, this would send to backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleSubmitReview = () => {
    if (rating > 0) {
      updateOrder(order.id, { rating, review: review || undefined });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/my-orders')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{order.issueType}</h1>
            <p className="text-slate-600 mt-1">
              Auftrag #{order.id} • Erstellt am {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge variant={statusInfo.variant} className="text-base px-4 py-2">
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <Card>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Auftragsdetails</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Kategorie</span>
                <span className="font-medium text-slate-800">{order.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Typ</span>
                <span className="font-medium text-slate-800">{order.subcategory}</span>
              </div>
              {order.deviceBrand && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-600">Gerät</span>
                  <span className="font-medium text-slate-800">
                    {order.deviceBrand} {order.deviceModel}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Preis</span>
                <span className="font-semibold text-primary-600 text-lg">
                  {order.finalPrice ? `${order.finalPrice}€` : `${order.priceEstimate.min}-${order.priceEstimate.max}€`}
                </span>
              </div>
            </div>

            {order.issueDescription && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Beschreibung</p>
                <p className="text-slate-800">{order.issueDescription}</p>
              </div>
            )}
          </Card>

          {/* Status Timeline */}
          <Card>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Status-Verlauf</h2>
            <div className="relative">
              {statusSteps.map((step, index) => {
                const stepConfig = statusConfig[step];
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;

                return (
                  <div key={step} className="relative flex items-start mb-8 last:mb-0">
                    {/* Vertical Line */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-4 top-10 w-0.5 h-full ${
                          isCompleted ? 'bg-primary-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Circle */}
                    <div
                      className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? stepConfig.color : 'bg-slate-200'
                      } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
                    >
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="ml-4 flex-1">
                      <p className={`font-medium ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                        {stepConfig.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-slate-600 mt-1">Aktueller Status</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Review Section (if completed and not rated yet) */}
          {order.status === 'completed' && !order.rating && (
            <Card>
              <h2 className="text-xl font-bold text-slate-800 mb-4">Bewertung abgeben</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Wie zufrieden warst du?
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <Textarea
                  label="Bewertung (optional)"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Teile deine Erfahrungen..."
                  rows={3}
                />

                <Button onClick={handleSubmitReview} disabled={rating === 0}>
                  Bewertung abschicken
                </Button>
              </div>
            </Card>
          )}

          {/* Existing Review */}
          {order.rating && (
            <Card className="bg-yellow-50 border-yellow-200">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Deine Bewertung</h2>
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= (order.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              {order.review && (
                <p className="text-slate-700 italic">"{order.review}"</p>
              )}
            </Card>
          )}
        </div>

        {/* Right Column: Fixer Info & Chat */}
        <div className="space-y-6">
          {/* Location */}
          <Card>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Treffpunkt</p>
                <p className="font-medium text-slate-800">{order.location.name}</p>
                <p className="text-sm text-slate-500 mt-1">{order.location.address}</p>
              </div>
            </div>
          </Card>

          {/* Fixer Info */}
          {fixer ? (
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Dein Fixer</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-lg">
                    {fixer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{fixer.name}</p>
                  {fixer.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{fixer.rating}</span>
                      <span className="text-slate-500">({fixer.completedJobs} Jobs)</span>
                    </div>
                  )}
                </div>
              </div>
              {fixer.skills && fixer.skills.length > 0 && (
                <div>
                  <p className="text-sm text-slate-600 mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {fixer.skills.map((skill) => (
                      <Badge key={skill} variant="default" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 mb-1">Suche nach Fixer...</p>
                  <p className="text-sm text-yellow-700">
                    Wir benachrichtigen dich, sobald ein Fixer deinen Auftrag annimmt!
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Chat */}
          {fixer && (
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Nachrichten</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                <div className="bg-slate-100 rounded-xl p-3">
                  <p className="text-xs text-slate-500 mb-1">{fixer.name}</p>
                  <p className="text-sm text-slate-800">Hallo! Ich bin auf dem Weg zur Safe Zone.</p>
                </div>
                <div className="bg-primary-100 rounded-xl p-3 ml-auto max-w-[80%]">
                  <p className="text-xs text-slate-500 mb-1">Du</p>
                  <p className="text-sm text-slate-800">Super, bis gleich!</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nachricht schreiben..."
                  rows={2}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
