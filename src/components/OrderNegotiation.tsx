import React, { useState, useEffect } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { FileText, Euro, Calendar, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../stores/useOrderStore';
import { useAuthStore } from '../stores/useAuthStore';
import type { RepairOrder, SafeZone } from '../types';
import { safeZones } from '../data/safeZones';
import { mockUsers } from '../data/mockUsers';

interface OrderNegotiationProps {
  order: RepairOrder;
  onComplete?: () => void;
}

export const OrderNegotiation: React.FC<OrderNegotiationProps> = ({ order, onComplete }) => {
  const { updateOrder } = useOrderStore();
  const { user } = useAuthStore();
  const isFixer = user?.id === order.fixerId;
  const isCustomer = user?.id === order.customerId;

  const customer = mockUsers.find(u => u.id === order.customerId);
  const fixer = mockUsers.find(u => u.id === order.fixerId);

  // Check if there's an existing proposal
  const hasProposal = order.negotiation?.proposedPrice !== undefined;
  const proposedByMe = hasProposal && (
    order.negotiation?.formalitiesProposedBy === user?.id ||
    order.negotiation?.priceProposedBy === user?.id ||
    order.negotiation?.meetupProposedBy === user?.id
  );

  // Local state for form inputs - initialize from proposal or order defaults
  const [partsResponsibility, setPartsResponsibility] = useState<'fixer' | 'customer' | 'none' | undefined>(
    order.negotiation?.partsResponsibility || order.partsResponsibility
  );
  const [partsNotes, setPartsNotes] = useState(order.negotiation?.partsNotes || order.partsNotes || '');
  const [proposedPrice, setProposedPrice] = useState(
    order.negotiation?.proposedPrice?.toString() || ''
  );
  const [selectedLocation, setSelectedLocation] = useState<SafeZone>(
    order.negotiation?.proposedLocation || order.location
  );
  const [proposedDate, setProposedDate] = useState(
    order.negotiation?.proposedDate || order.appointmentDate || ''
  );

  // Track if user has made changes to the proposal
  const [hasChanges, setHasChanges] = useState(!hasProposal);

  // Check if negotiation is completed
  const allFullyConfirmed = order.negotiation?.allConfirmed || false;

  // Update allConfirmed status when ready
  useEffect(() => {
    if (allFullyConfirmed && order.status !== 'awaiting_payment' && order.status !== 'ready_paid') {
      updateOrder(order.id, {
        status: 'awaiting_payment',
        finalPrice: order.negotiation?.proposedPrice,
        location: order.negotiation?.proposedLocation || order.location,
        appointmentDate: order.negotiation?.proposedDate || order.appointmentDate,
      });
      onComplete?.();
    }
  }, [allFullyConfirmed, order, updateOrder, onComplete]);

  // Detect changes
  useEffect(() => {
    if (!hasProposal) {
      setHasChanges(true);
      return;
    }

    const price = parseFloat(proposedPrice);
    const priceChanged = price !== order.negotiation?.proposedPrice;
    const partsChanged = partsResponsibility !== order.negotiation?.partsResponsibility;
    const notesChanged = partsNotes !== (order.negotiation?.partsNotes || '');
    const locationChanged = selectedLocation.id !== order.negotiation?.proposedLocation?.id;
    const dateChanged = proposedDate !== order.negotiation?.proposedDate;

    setHasChanges(priceChanged || partsChanged || notesChanged || locationChanged || dateChanged);
  }, [partsResponsibility, partsNotes, proposedPrice, selectedLocation, proposedDate, order.negotiation, hasProposal]);

  // Handle proposal submission with changes
  const handleSubmitProposal = () => {
    if (!user) return;

    const price = parseFloat(proposedPrice);
    if (!price || price <= 0 || !partsResponsibility || !selectedLocation || !proposedDate) {
      return;
    }

    updateOrder(order.id, {
      negotiation: {
        partsResponsibility,
        partsNotes,
        formalitiesProposedBy: user.id,
        proposedPrice: price,
        priceProposedBy: user.id,
        proposedLocation: selectedLocation,
        proposedDate,
        meetupProposedBy: user.id,
        allConfirmed: false,
      },
      status: 'negotiating',
    });

    // Send notification to other party
    import('../stores/useNotificationStore').then(({ useNotificationStore }) => {
      const { addNotification } = useNotificationStore.getState();
      const otherUserId = isFixer ? order.customerId : order.fixerId;
      addNotification({
        userId: otherUserId || '',
        type: 'order_status_changed',
        title: hasProposal ? 'Neuer Verhandlungsvorschlag' : 'Verhandlungsvorschlag erhalten',
        message: `${user.name} hat ${hasProposal ? 'einen geänderten' : 'einen'} Vorschlag gesendet.`,
        orderId: order.id,
        read: false,
      });
    });
  };

  // Handle accepting proposal without changes
  const handleAcceptProposal = () => {
    if (!user || !order.negotiation) return;

    updateOrder(order.id, {
      negotiation: {
        ...order.negotiation,
        allConfirmed: true,
      },
      status: 'awaiting_payment',
      finalPrice: order.negotiation.proposedPrice,
      location: order.negotiation.proposedLocation || order.location,
      appointmentDate: order.negotiation.proposedDate || order.appointmentDate,
    });

    // Send notification to customer for payment
    import('../stores/useNotificationStore').then(({ useNotificationStore }) => {
      const { addNotification } = useNotificationStore.getState();
      addNotification({
        userId: order.customerId,
        type: 'payment_required',
        title: 'Zahlung erforderlich',
        message: `Die Verhandlung ist abgeschlossen. Bitte bezahle ${order.negotiation?.proposedPrice}€ um fortzufahren.`,
        orderId: order.id,
        read: false,
      });
    });

    onComplete?.();
  };

  // Check if form is valid
  const isFormValid = () => {
    const price = parseFloat(proposedPrice);
    return partsResponsibility && price > 0 && selectedLocation && proposedDate;
  };

  // Show completed state
  if ((order.status === 'ready_paid' || order.status === 'awaiting_payment') && allFullyConfirmed) {
    return (
      <Card className="border-2 border-green-200 bg-green-50">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-green-800 mb-1">Alle Details geklärt!</h3>
            <p className="text-sm text-green-700 mb-4">
              {order.status === 'awaiting_payment'
                ? 'Alle Bedingungen wurden festgelegt. Bitte bezahle um fortzufahren.'
                : 'Zahlung erfolgreich! Der Fixer kann sich nun auf den Weg machen.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3">
                <p className="text-green-700 font-medium mb-1">Ersatzteile</p>
                <p className="text-green-800">
                  {order.negotiation?.partsResponsibility === 'fixer'
                    ? 'Fixer besorgt'
                    : order.negotiation?.partsResponsibility === 'customer'
                    ? 'Kunde besorgt'
                    : 'Keine nötig'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-green-700 font-medium mb-1">Finaler Preis</p>
                <p className="text-green-800 text-lg font-bold">{order.finalPrice}€</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-green-700 font-medium mb-1">Treffpunkt</p>
                <p className="text-green-800">{order.location.name}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Get proposer name
  const proposerName = order.negotiation?.priceProposedBy === order.fixerId ? fixer?.name : customer?.name;

  return (
    <Card className="border-2 border-primary-200 bg-primary-50/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Verhandlung</h2>
        <div className="text-sm text-slate-600">
          {isFixer && fixer && <span>Du (Fixer) ↔ {customer?.name} (Kunde)</span>}
          {isCustomer && customer && <span>{fixer?.name} (Fixer) ↔ Du (Kunde)</span>}
        </div>
      </div>

      {/* Status Message */}
      {hasProposal && !proposedByMe && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                {proposerName} hat einen Vorschlag gemacht
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Du kannst den Vorschlag akzeptieren oder eigene Änderungen vornehmen
              </p>
            </div>
          </div>
        </div>
      )}

      {hasProposal && proposedByMe && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Warte auf Antwort von {isFixer ? customer?.name : fixer?.name}
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {isFixer ? 'Der Kunde' : 'Der Fixer'} kann deinen Vorschlag akzeptieren oder Änderungen vornehmen
              </p>
            </div>
          </div>
        </div>
      )}

      {!hasProposal && (
        <p className="text-slate-600 mb-6">
          Lege alle Details fest: Formalitäten, Preis und Treffpunkt.
        </p>
      )}

      <div className="space-y-6">
        {/* Section 1: Formalities */}
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Formalitäten</h3>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Wer besorgt die Ersatzteile?
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setPartsResponsibility('fixer')}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  partsResponsibility === 'fixer'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-medium text-sm">Fixer besorgt Ersatzteile</span>
              </button>
              <button
                onClick={() => setPartsResponsibility('customer')}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  partsResponsibility === 'customer'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-medium text-sm">Kunde besorgt Ersatzteile</span>
              </button>
              <button
                onClick={() => setPartsResponsibility('none')}
                className={`p-3 border-2 rounded-lg text-left transition-all ${
                  partsResponsibility === 'none'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="font-medium text-sm">Keine Ersatzteile nötig</span>
              </button>
            </div>
          </div>

          <Textarea
            label="Zusätzliche Notizen (optional)"
            value={partsNotes}
            onChange={(e) => setPartsNotes(e.target.value)}
            placeholder="z.B. spezifische Teile, Marken, etc."
            rows={2}
            className="mt-4"
          />
        </div>

        {/* Section 2: Price */}
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Euro className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Preis</h3>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-slate-600 mb-1">Geschätzter Preis</p>
            <p className="text-lg font-bold text-slate-800">
              {order.priceEstimate.min}€ - {order.priceEstimate.max}€
            </p>
          </div>

          <Input
            label="Preisvorschlag (€)"
            type="number"
            value={proposedPrice}
            onChange={(e) => setProposedPrice(e.target.value)}
            placeholder="z.B. 45"
            min="0"
            step="0.5"
          />
        </div>

        {/* Section 3: Meetup */}
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Treffpunkt & Termin</h3>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Safe Zone</label>
            <div className="space-y-2">
              {safeZones.filter(sz => sz.isAvailable).map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedLocation(zone)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                    selectedLocation.id === zone.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-medium text-slate-800 text-sm">{zone.name}</p>
                  <p className="text-xs text-slate-500">{zone.address}</p>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Termin"
            type="datetime-local"
            value={proposedDate}
            onChange={(e) => setProposedDate(e.target.value)}
            className="mt-4"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasProposal && !proposedByMe && !hasChanges && (
            <Button
              onClick={handleAcceptProposal}
              className="w-full"
              size="lg"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Vorschlag akzeptieren
            </Button>
          )}

          {(!hasProposal || hasChanges) && (
            <Button
              onClick={handleSubmitProposal}
              disabled={!isFormValid()}
              className="w-full"
              size="lg"
            >
              <Send className="w-5 h-5 mr-2" />
              {hasProposal && hasChanges ? 'Gegenvorschlag senden' : 'Vorschlag senden'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
