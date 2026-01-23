import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, CheckCircle, Star, MessageCircle, XCircle, Navigation, MapPinCheck, Wrench, FileText } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Textarea } from '../components/ui/Textarea';
import { Toast } from '../components/ui/Toast';
import { useOrderStore } from '../stores/useOrderStore';
import { useMessageStore } from '../stores/useMessageStore';
import { useAuthStore } from '../stores/useAuthStore';
import { mockUsers } from '../data/mockUsers';
import type { OrderStatus } from '../types';
import { OrderNegotiation } from '../components/OrderNegotiation';
import { PaymentCheckout } from '../components/PaymentCheckout';
import { PaymentRelease } from '../components/PaymentRelease';
import { getIssueTypeLabel } from '../utils/issueTypeFormatter';

const statusConfig: Record<OrderStatus, { label: string; description: string; icon: React.ReactNode; variant: 'success' | 'warning' | 'error' | 'info'; color: string }> = {
  pending: {
    label: 'Sucht Fixer',
    description: 'Dein Auftrag wurde erstellt und wartet auf einen Fixer',
    icon: <Clock className="w-5 h-5 text-white" />,
    variant: 'warning',
    color: 'bg-yellow-500'
  },
  accepted: {
    label: 'Akzeptiert',
    description: 'Ein Fixer hat deinen Auftrag angenommen',
    icon: <CheckCircle className="w-5 h-5 text-white" />,
    variant: 'info',
    color: 'bg-blue-500'
  },
  negotiating: {
    label: 'Verhandlung',
    description: 'Fixer und Kunde verhandeln Details der Reparatur',
    icon: <FileText className="w-5 h-5 text-white" />,
    variant: 'info',
    color: 'bg-blue-500'
  },
  ready: {
    label: 'Bereit',
    description: 'Alle Details geklärt - bereit für die Reparatur',
    icon: <CheckCircle className="w-5 h-5 text-white" />,
    variant: 'success',
    color: 'bg-green-500'
  },
  awaiting_payment: {
    label: 'Zahlung ausstehend',
    description: 'Warte auf Zahlung vom Kunden',
    icon: <Clock className="w-5 h-5 text-white" />,
    variant: 'warning',
    color: 'bg-yellow-500'
  },
  payment_failed: {
    label: 'Zahlung fehlgeschlagen',
    description: 'Die Zahlung konnte nicht verarbeitet werden',
    icon: <XCircle className="w-5 h-5 text-white" />,
    variant: 'error',
    color: 'bg-red-500'
  },
  ready_paid: {
    label: 'Bezahlt',
    description: 'Zahlung erfolgreich - Fixer kann starten',
    icon: <CheckCircle className="w-5 h-5 text-white" />,
    variant: 'success',
    color: 'bg-green-500'
  },
  en_route: {
    label: 'Unterwegs',
    description: 'Der Fixer ist auf dem Weg zur Safe Zone',
    icon: <Navigation className="w-5 h-5 text-white" />,
    variant: 'info',
    color: 'bg-blue-500'
  },
  arrived: {
    label: 'Angekommen',
    description: 'Der Fixer ist am Treffpunkt eingetroffen',
    icon: <MapPinCheck className="w-5 h-5 text-white" />,
    variant: 'info',
    color: 'bg-blue-500'
  },
  in_progress: {
    label: 'In Bearbeitung',
    description: 'Die Reparatur wird durchgeführt',
    icon: <Wrench className="w-5 h-5 text-white" />,
    variant: 'warning',
    color: 'bg-yellow-500'
  },
  completed: {
    label: 'Abgeschlossen',
    description: 'Der Auftrag wurde erfolgreich abgeschlossen',
    icon: <CheckCircle className="w-5 h-5 text-white" />,
    variant: 'success',
    color: 'bg-green-500'
  },
  awaiting_release: {
    label: 'Warte auf Freigabe',
    description: 'Warte auf Bestätigung zur Zahlungsfreigabe',
    icon: <Clock className="w-5 h-5 text-white" />,
    variant: 'warning',
    color: 'bg-yellow-500'
  },
  paid_completed: {
    label: 'Bezahlt & Abgeschlossen',
    description: 'Zahlung wurde an Fixer freigegeben',
    icon: <CheckCircle className="w-5 h-5 text-white" />,
    variant: 'success',
    color: 'bg-green-500'
  },
  cancelled: {
    label: 'Storniert',
    description: 'Der Auftrag wurde storniert',
    icon: <XCircle className="w-5 h-5 text-white" />,
    variant: 'error',
    color: 'bg-red-500'
  },
  escalated: {
    label: 'Eskaliert',
    description: 'Problem gemeldet - Support wurde informiert',
    icon: <XCircle className="w-5 h-5 text-white" />,
    variant: 'error',
    color: 'bg-red-500'
  },
};

const statusSteps: OrderStatus[] = ['pending', 'accepted', 'awaiting_payment', 'ready_paid', 'en_route', 'arrived', 'in_progress', 'completed'];

export const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { updateOrder } = useOrderStore();
  const { getUnreadCount } = useMessageStore();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Reaktiv auf Änderungen im Store reagieren
  const order = useOrderStore((state) =>
    state.orders.find((o) => o.id === id)
  );
  const isFixer = user?.id === order?.fixerId;

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
  const unreadCount = user ? getUnreadCount(order.id, user.id) : 0;

  const handleCancelOrder = () => {
    if (confirm('Möchtest du diesen Auftrag wirklich stornieren?')) {
      updateOrder(order.id, { status: 'cancelled' });
      setToastMessage('Auftrag wurde storniert');
      setShowToast(true);
    }
  };

  const handleSubmitReview = () => {
    if (rating > 0) {
      updateOrder(order.id, { rating, review: review || undefined });
      setToastMessage('Bewertung wurde gespeichert!');
      setShowToast(true);
    }
  };

  const handleUpdateStatus = (newStatus: OrderStatus) => {
    updateOrder(order.id, { status: newStatus });
    const statusMessages: Record<string, string> = {
      en_route: 'Status aktualisiert: Auf dem Weg',
      arrived: 'Status aktualisiert: Angekommen',
      in_progress: 'Status aktualisiert: Reparatur läuft',
      completed: 'Auftrag als abgeschlossen markiert!',
    };
    setToastMessage(statusMessages[newStatus] || 'Status aktualisiert');
    setShowToast(true);
  };

  const getNextStatusAction = (currentStatus: OrderStatus) => {
    const actions: Record<string, { status: OrderStatus; label: string; icon: React.ReactNode }> = {
      ready_paid: { status: 'en_route', label: 'Auf dem Weg', icon: <Navigation className="w-4 h-4" /> },
      en_route: { status: 'arrived', label: 'Angekommen', icon: <MapPinCheck className="w-4 h-4" /> },
      arrived: { status: 'in_progress', label: 'Reparatur starten', icon: <Wrench className="w-4 h-4" /> },
      in_progress: { status: 'awaiting_release', label: 'Abschließen', icon: <CheckCircle className="w-4 h-4" /> },
    };
    return actions[currentStatus];
  };

  const getTimestampForStatus = (status: OrderStatus): string | null => {
    if (status === 'pending') return order.createdAt;
    if (status === order.status) return order.updatedAt;
    if (statusSteps.indexOf(status) > currentStepIndex) return null;
    // Estimate timestamps for passed statuses
    return order.updatedAt;
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
    <>
      {showToast && (
        <Toast
          type="success"
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
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
            <h1 className="text-3xl font-bold text-slate-800">{getIssueTypeLabel(order.issueType, order.category, order.subcategory)}</h1>
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
          {/* Negotiation Section - Show when fixer is assigned and negotiation active */}
          {(order.fixerId && order.negotiation && !order.negotiation.allConfirmed) && (
            <OrderNegotiation order={order} onComplete={() => {
              setToastMessage('Alle Details geklärt - Bereit für die Reparatur!');
              setShowToast(true);
            }} />
          )}

          {/* Show completion message when ready */}
          {(order.status === 'ready_paid' || order.status === 'awaiting_payment') && order.negotiation?.allConfirmed && (
            <OrderNegotiation order={order} onComplete={() => {}} />
          )}

          {/* Payment Section - only for customer when awaiting payment */}
          {!isFixer && order.status === 'awaiting_payment' && (
            <PaymentCheckout
              order={order}
              onPaymentSuccess={() => {
                const basePrice = order.finalPrice || order.priceEstimate.max;
                const campusFixCommission = Math.round(basePrice * 0.10 * 100) / 100;
                const transactionFee = Math.round(basePrice * 0.02 * 100) / 100;
                const totalAmount = Math.round((basePrice + campusFixCommission + transactionFee) * 100) / 100;

                updateOrder(order.id, {
                  status: 'ready_paid',
                  paymentStatus: 'escrowed',
                  paymentTimestamp: new Date().toISOString(),
                  escrowedAmount: basePrice, // Amount held in escrow for fixer
                  customerPrice: totalAmount,
                  campusFixCommission,
                  transactionFee,
                });
                setToastMessage('Zahlung erfolgreich! Der Fixer kann nun loslegen.');
                setShowToast(true);

                // Notify fixer about payment
                import('../stores/useNotificationStore').then(({ useNotificationStore }) => {
                  const { addNotification } = useNotificationStore.getState();
                  if (order.fixerId) {
                    addNotification({
                      userId: order.fixerId,
                      type: 'payment_received',
                      title: 'Zahlung erhalten',
                      message: `Der Kunde hat bezahlt (${basePrice}€ für dich). Du kannst nun mit der Reparatur beginnen!`,
                      orderId: order.id,
                      read: false,
                    });
                  }
                });
              }}
            />
          )}

          {/* Payment Waiting Message for Fixer */}
          {isFixer && order.status === 'awaiting_payment' && (
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-800 mb-1">Warte auf Zahlung</h3>
                  <p className="text-sm text-yellow-700">
                    Der Kunde muss noch {order.finalPrice}€ bezahlen, bevor die Reparatur beginnen kann.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Fixer Status Actions */}
          {isFixer && order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'awaiting_payment' && getNextStatusAction(order.status) && (
            <Card className="border-2 border-primary-200 bg-primary-50/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Nächster Schritt</h3>
                  <p className="text-sm text-slate-600">Aktualisiere den Auftragsstatus</p>
                </div>
                <Button
                  size="lg"
                  onClick={() => handleUpdateStatus(getNextStatusAction(order.status)!.status)}
                >
                  {getNextStatusAction(order.status)!.icon}
                  <span className="ml-2">{getNextStatusAction(order.status)!.label}</span>
                </Button>
              </div>
            </Card>
          )}

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
                <span className="text-slate-600">
                  {isFixer ? 'Dein Verdienst' : order.customerPrice ? 'Gesamt' : 'Preis'}
                </span>
                <div className="text-right">
                  <span className="font-semibold text-primary-600 text-lg">
                    {isFixer
                      ? order.finalPrice ? `${order.finalPrice}€` : `${order.priceEstimate.min}-${order.priceEstimate.max}€`
                      : order.customerPrice
                        ? `${order.customerPrice.toFixed(2)}€`
                        : order.finalPrice
                          ? `${order.finalPrice}€`
                          : `${order.priceEstimate.min}-${order.priceEstimate.max}€`}
                  </span>
                  {!isFixer && order.customerPrice && order.finalPrice && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      (Reparatur: {order.finalPrice}€ + Gebühren: {(order.customerPrice - order.finalPrice).toFixed(2)}€)
                    </p>
                  )}
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Übergabe</span>
                <span className="font-medium text-slate-800">
                  {order.deliveryMethod === 'meetup' ? '📍 Persönlich' : '📦 Versand'}
                </span>
              </div>
            </div>

            {order.issueDescription && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Beschreibung</p>
                <p className="text-slate-800">{order.issueDescription}</p>
              </div>
            )}

            {order.deliveryMethod === 'shipping' && order.shippingAddress && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Versandadresse</p>
                <p className="text-slate-800 whitespace-pre-line">{order.shippingAddress}</p>
              </div>
            )}

            {order.appointmentDate && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600 mb-1">Wunschtermin</p>
                <p className="text-slate-800">
                  {new Date(order.appointmentDate).toLocaleString('de-DE', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </Card>

          {/* Payment Release Section - Customer confirms and releases payment */}
          {!isFixer && order.status === 'awaiting_release' && order.paymentStatus === 'escrowed' && (
            <PaymentRelease
              order={order}
              onRelease={() => {
                updateOrder(order.id, {
                  status: 'paid_completed',
                  paymentStatus: 'released',
                  paymentReleaseTimestamp: new Date().toISOString(),
                });
                setToastMessage('Zahlung wurde an den Fixer freigegeben!');
                setShowToast(true);

                // Notify fixer about payment release
                import('../stores/useNotificationStore').then(({ useNotificationStore }) => {
                  const { addNotification } = useNotificationStore.getState();
                  if (order.fixerId) {
                    addNotification({
                      userId: order.fixerId,
                      type: 'payment_released',
                      title: 'Zahlung erhalten!',
                      message: `Der Kunde hat die Zahlung freigegeben. ${order.escrowedAmount || order.finalPrice}€ wurden dir gutgeschrieben!`,
                      orderId: order.id,
                      read: false,
                    });
                  }
                });
              }}
              onDispute={() => {
                updateOrder(order.id, { status: 'escalated' });
                setToastMessage('Problem gemeldet - Support wurde informiert');
                setShowToast(true);
              }}
            />
          )}

          {/* Waiting for Release - Fixer View */}
          {isFixer && order.status === 'awaiting_release' && (
            <Card className="border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-yellow-800 mb-1">Warte auf Zahlungsfreigabe</h3>
                  <p className="text-sm text-yellow-700">
                    Der Kunde prüft die Reparatur. Sobald er zufrieden ist, wird die Zahlung von {order.escrowedAmount || order.finalPrice}€ freigegeben.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Payment Completed Message */}
          {order.status === 'paid_completed' && order.paymentStatus === 'released' && (
            <Card className="border-2 border-green-200 bg-green-50">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-green-800 mb-1">
                    {isFixer ? 'Zahlung erhalten!' : 'Zahlung freigegeben'}
                  </h3>
                  <p className="text-sm text-green-700">
                    {isFixer
                      ? `Die Zahlung von ${order.escrowedAmount || order.finalPrice}€ wurde dir gutgeschrieben.`
                      : `Die Zahlung von ${order.escrowedAmount || order.finalPrice}€ wurde an den Fixer freigegeben.`}
                  </p>
                  {order.paymentReleaseTimestamp && (
                    <p className="text-xs text-green-600 mt-2">
                      Freigegeben am {formatDate(order.paymentReleaseTimestamp)}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Status Timeline */}
          <Card>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Status-Verlauf</h2>
            <div className="relative">
              {statusSteps.map((step, index) => {
                const stepConfig = statusConfig[step];
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const timestamp = getTimestampForStatus(step);

                return (
                  <div key={step} className="relative flex items-start mb-8 last:mb-0">
                    {/* Vertical Line */}
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute left-5 top-12 w-0.5 h-full ${
                          isCompleted ? 'bg-primary-600' : 'bg-slate-200'
                        }`}
                      />
                    )}

                    {/* Circle/Icon */}
                    <div
                      className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? stepConfig.color : 'bg-slate-200'
                      } ${isCurrent ? 'ring-4 ring-primary-100 shadow-lg' : ''}`}
                    >
                      {isCompleted ? stepConfig.icon : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                    </div>

                    {/* Content */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`font-semibold ${isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                          {stepConfig.label}
                        </p>
                        {timestamp && isCompleted && (
                          <span className="text-xs text-slate-500">
                            {formatDate(timestamp)}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${isCompleted ? 'text-slate-600' : 'text-slate-400'}`}>
                        {stepConfig.description}
                      </p>
                      {isCurrent && (
                        <Badge variant="info" className="mt-2 text-xs">
                          Aktueller Status
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cancel Button - only if not completed or cancelled */}
            {!['completed', 'cancelled'].includes(order.status) && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={handleCancelOrder}
                  className="w-full text-red-600 border-red-300 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Auftrag stornieren
                </Button>
              </div>
            )}
          </Card>

          {/* Review Section (if completed and not rated yet) */}
          {(order.status === 'paid_completed' || order.status === 'completed') && !order.rating && !isFixer && (
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Nachrichten</h3>
                {unreadCount > 0 && (
                  <Badge variant="error" className="text-xs">
                    {unreadCount} neu
                  </Badge>
                )}
              </div>

              <p className="text-sm text-slate-600 mb-4">
                Kommuniziere mit {fixer.name} über den Chat
              </p>

              <Button
                onClick={() => navigate('/messages')}
                className="w-full"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Zum Chat
              </Button>
            </Card>
          )}
        </div>
      </div>
      </div>
    </>
  );
};
