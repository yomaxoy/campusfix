import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircle, DollarSign, AlertCircle, Info } from 'lucide-react';
import type { RepairOrder } from '../types';

interface PaymentReleaseProps {
  order: RepairOrder;
  onRelease: () => void;
  onDispute?: () => void;
}

export const PaymentRelease: React.FC<PaymentReleaseProps> = ({
  order,
  onRelease,
  onDispute,
}) => {
  const [isReleasing, setIsReleasing] = useState(false);

  const handleRelease = () => {
    if (!confirm(`Möchtest du die Zahlung von ${order.escrowedAmount || order.finalPrice}€ an den Fixer freigeben?`)) {
      return;
    }

    setIsReleasing(true);

    // Simulate payment release
    setTimeout(() => {
      setIsReleasing(false);
      onRelease();
    }, 1500);
  };

  return (
    <Card className="border-2 border-primary-600 bg-primary-50/30">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">Zahlung freigeben</h2>
          <p className="text-sm text-slate-600">
            Die Reparatur wurde als abgeschlossen markiert. Bitte überprüfe die Arbeit und gib die Zahlung frei.
          </p>
        </div>
      </div>

      {/* Payment Info */}
      <div className="bg-white rounded-xl p-6 border-2 border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-600">Hinterlegter Betrag</span>
          <span className="text-3xl font-bold text-primary-600">
            {order.escrowedAmount || order.finalPrice}€
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Zahlungsstatus</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
            Im Escrow verwahrt
          </span>
        </div>
      </div>

      {/* Info Box */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Wie funktioniert das?</p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Der Betrag wird sicher verwahrt bis du ihn freigibst</li>
              <li>• Prüfe ob die Reparatur zufriedenstellend ist</li>
              <li>• Bei Freigabe erhält der Fixer sofort das Geld</li>
              <li>• Bei Problemen kannst du einen Dispute eröffnen</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleRelease}
          disabled={isReleasing}
          className="w-full"
          size="lg"
        >
          {isReleasing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Zahlung wird freigegeben...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Zahlung an Fixer freigeben ({order.escrowedAmount || order.finalPrice}€)
            </>
          )}
        </Button>

        {onDispute && (
          <Button
            variant="outline"
            onClick={onDispute}
            disabled={isReleasing}
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Problem melden
          </Button>
        )}
      </div>

      {/* Fine Print */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-600 text-center">
          Mit der Freigabe bestätigst du, dass die Reparatur zufriedenstellend durchgeführt wurde.
          Der Betrag wird dem Fixer sofort gutgeschrieben.
        </p>
      </div>
    </Card>
  );
};
