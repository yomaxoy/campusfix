import React, { useState } from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { CreditCard, Lock, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import type { RepairOrder } from '../types';

interface PaymentCheckoutProps {
  order: RepairOrder;
  onPaymentSuccess: () => void;
  onCancel?: () => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  order,
  onPaymentSuccess,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank_transfer'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  // Calculate fees
  const basePrice = order.finalPrice || order.priceEstimate.max;
  const campusFixCommission = Math.round(basePrice * 0.10 * 100) / 100; // 10%
  const transactionFee = Math.round(basePrice * 0.02 * 100) / 100; // 2%
  const totalAmount = Math.round((basePrice + campusFixCommission + transactionFee) * 100) / 100;

  const validateCard = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Kartennummer muss 16 Ziffern haben');
      return false;
    }
    if (!cardName.trim()) {
      setError('Bitte Karteninhaber angeben');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setError('Ablaufdatum im Format MM/JJ');
      return false;
    }
    if (cardCVV.length !== 3) {
      setError('CVV muss 3 Ziffern haben');
      return false;
    }
    return true;
  };

  const validatePayPal = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(paypalEmail)) {
      setError('Bitte gültige E-Mail-Adresse angeben');
      return false;
    }
    return true;
  };

  const validateBankTransfer = () => {
    if (bankAccount.replace(/\s/g, '').length < 10) {
      setError('Bitte gültige IBAN angeben');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    setError('');

    // Validate based on payment method
    if (paymentMethod === 'card' && !validateCard()) return;
    if (paymentMethod === 'paypal' && !validatePayPal()) return;
    if (paymentMethod === 'bank_transfer' && !validateBankTransfer()) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess();
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <Card className="border-2 border-primary-600 bg-primary-50/30">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Zahlung</h2>
            <p className="text-sm text-slate-600">
              Sichere Zahlung per Escrow - Geld wird erst nach erfolgreicher Reparatur freigegeben
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Gesamt zu zahlen</p>
            <p className="text-3xl font-bold text-primary-600">{totalAmount}€</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-sm font-medium text-slate-700 mb-3">Preisaufschlüsselung</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-700">
              <span>Reparaturpreis (Fixer)</span>
              <span className="font-medium">{basePrice.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CampusFix Service (10%)</span>
              <span className="font-medium">{campusFixCommission.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Transaktionsgebühr (2%)</span>
              <span className="font-medium">{transactionFee.toFixed(2)}€</span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between text-slate-800 font-bold">
              <span>Gesamt</span>
              <span>{totalAmount.toFixed(2)}€</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800 mb-1">Sicherer Escrow-Service</p>
            <p className="text-xs text-green-700">
              Dein Geld wird sicher verwahrt und erst an den Fixer freigegeben, wenn du die Reparatur bestätigst.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className="mb-6">
        <label className="text-sm font-medium text-slate-700 mb-3 block">Zahlungsmethode</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'card'
                ? 'border-primary-600 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <CreditCard className="w-6 h-6 mx-auto mb-2 text-slate-700" />
            <p className="text-sm font-medium text-slate-800">Karte</p>
          </button>
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'paypal'
                ? 'border-primary-600 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <DollarSign className="w-6 h-6 mx-auto mb-2 text-slate-700" />
            <p className="text-sm font-medium text-slate-800">PayPal</p>
          </button>
          <button
            onClick={() => setPaymentMethod('bank_transfer')}
            className={`p-4 border-2 rounded-xl transition-all ${
              paymentMethod === 'bank_transfer'
                ? 'border-primary-600 bg-primary-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-2">🏦</div>
            <p className="text-sm font-medium text-slate-800">SEPA</p>
          </button>
        </div>
      </div>

      {/* Payment Form */}
      <div className="space-y-4">
        {paymentMethod === 'card' && (
          <>
            <Input
              label="Kartennummer"
              value={cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                if (formatted.replace(/\s/g, '').length <= 16) {
                  setCardNumber(formatted);
                }
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
            <Input
              label="Karteninhaber"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Max Mustermann"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ablaufdatum"
                value={cardExpiry}
                onChange={(e) => {
                  const formatted = formatExpiry(e.target.value);
                  if (formatted.length <= 5) {
                    setCardExpiry(formatted);
                  }
                }}
                placeholder="MM/JJ"
                maxLength={5}
              />
              <Input
                label="CVV"
                type="password"
                value={cardCVV}
                onChange={(e) => {
                  if (e.target.value.length <= 3 && /^\d*$/.test(e.target.value)) {
                    setCardCVV(e.target.value);
                  }
                }}
                placeholder="123"
                maxLength={3}
              />
            </div>
          </>
        )}

        {paymentMethod === 'paypal' && (
          <div className="space-y-4">
            <Input
              label="PayPal E-Mail"
              type="email"
              value={paypalEmail}
              onChange={(e) => setPaypalEmail(e.target.value)}
              placeholder="deine@email.de"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Du wirst zu PayPal weitergeleitet, um die Zahlung zu autorisieren.
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'bank_transfer' && (
          <div className="space-y-4">
            <Input
              label="IBAN"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="DE89 3704 0044 0532 0130 00"
            />
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Die Überweisung wird per SEPA-Lastschrift durchgeführt. Dies kann 1-2 Werktage dauern.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} disabled={isProcessing} className="flex-1">
            Abbrechen
          </Button>
        )}
        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="flex-1"
          size="lg"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Zahlung wird verarbeitet...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Jetzt bezahlen ({totalAmount.toFixed(2)}€)
            </>
          )}
        </Button>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-slate-50 rounded-lg">
        <p className="text-xs text-slate-600 text-center">
          🔒 Deine Zahlungsinformationen werden sicher verschlüsselt übertragen
        </p>
      </div>
    </Card>
  );
};
