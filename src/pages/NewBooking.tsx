import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Bike, Home, ChevronLeft, ChevronRight, Check, Upload, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Toast } from '../components/ui/Toast';
import { categories } from '../data/categories';
import { safeZones } from '../data/safeZones';
import { useOrderStore } from '../stores/useOrderStore';
import { useAuthStore } from '../stores/useAuthStore';
import type { Category, Subcategory, Issue } from '../types';

const iconMap = {
  Smartphone,
  Bike,
  Home,
};

export const NewBooking: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder } = useOrderStore();
  const { user } = useAuthStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    location.state?.category ? categories.find(c => c.id === location.state.category) || null : null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [deviceBrand, setDeviceBrand] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSafeZone, setSelectedSafeZone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
  };

  const handleSubmit = () => {
    if (!user || !selectedCategory || !selectedSubcategory || !selectedIssue || !selectedSafeZone) {
      return;
    }

    const safeZone = safeZones.find(sz => sz.id === selectedSafeZone);
    if (!safeZone) return;

    const newOrder = {
      id: `order-${Date.now()}`,
      customerId: user.id,
      category: selectedCategory.id as 'tech' | 'mobility' | 'dorm',
      subcategory: selectedSubcategory.id,
      deviceBrand: deviceBrand || undefined,
      deviceModel: deviceModel || undefined,
      issueType: selectedIssue.id,
      issueDescription: description || selectedIssue.label,
      photoUrl: photoPreview || undefined,
      location: safeZone,
      priceEstimate: selectedIssue.priceRange,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addOrder(newOrder);
    setShowToast(true);
    setTimeout(() => {
      navigate('/my-orders');
    }, 1000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedCategory !== null;
      case 2: return selectedSubcategory !== null && selectedIssue !== null;
      case 3: return true; // Optional step
      case 4: return selectedSafeZone !== '';
      case 5: return true;
      default: return false;
    }
  };

  return (
    <>
      {showToast && (
        <Toast
          type="success"
          message="Buchung erfolgreich! Du wirst weitergeleitet..."
          onClose={() => setShowToast(false)}
        />
      )}
      <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Neue Reparatur buchen</h1>
        <p className="text-slate-600 mt-2">Beschreibe dein Problem in 5 einfachen Schritten</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  step < currentStep
                    ? 'bg-primary-600 text-white'
                    : step === currentStep
                    ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {step < currentStep ? <Check className="w-5 h-5" /> : step}
              </div>
              {step < 5 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-slate-600 mt-2">
          <span>Kategorie</span>
          <span>Problem</span>
          <span>Details</span>
          <span>Ort</span>
          <span>Übersicht</span>
        </div>
      </div>

      <Card>
        {/* Step 1: Category Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Wähle eine Kategorie</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {categories.map((category) => {
                const Icon = iconMap[category.icon as keyof typeof iconMap];
                return (
                  <Card
                    key={category.id}
                    hover
                    onClick={() => setSelectedCategory(category)}
                    className={`text-center cursor-pointer ${
                      selectedCategory?.id === category.id
                        ? 'ring-2 ring-primary-600 bg-primary-50'
                        : ''
                    }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        selectedCategory?.id === category.id
                          ? 'bg-primary-600'
                          : 'bg-primary-100'
                      }`}>
                        <Icon className={`w-8 h-8 ${
                          selectedCategory?.id === category.id
                            ? 'text-white'
                            : 'text-primary-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800">{category.name}</h3>
                        <p className="text-sm text-slate-600">{category.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Subcategory & Issue Selection */}
        {currentStep === 2 && selectedCategory && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Was genau möchtest du reparieren?</h2>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Gerät / Typ</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedCategory.subcategories.map((subcat) => (
                  <button
                    key={subcat.id}
                    onClick={() => {
                      setSelectedSubcategory(subcat);
                      setSelectedIssue(null);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedSubcategory?.id === subcat.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700 font-medium'
                        : 'border-slate-200 hover:border-primary-300 text-slate-700'
                    }`}
                  >
                    {subcat.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedSubcategory && (
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Was ist das Problem?</label>
                <div className="space-y-2">
                  {selectedSubcategory.issues.map((issue) => (
                    <button
                      key={issue.id}
                      onClick={() => setSelectedIssue(issue)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedIssue?.id === issue.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-slate-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-slate-800">{issue.label}</p>
                          <p className="text-sm text-slate-600">{issue.estimatedTime}</p>
                        </div>
                        <p className="text-primary-600 font-semibold">
                          {issue.priceRange.min}-{issue.priceRange.max}€
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Device Details & Description */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Details (optional)</h2>
            <p className="text-slate-600">Gib uns mehr Informationen zu deinem Gerät und dem Problem</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Marke (z.B. Apple, Samsung)"
                value={deviceBrand}
                onChange={(e) => setDeviceBrand(e.target.value)}
                placeholder="z.B. Apple"
              />
              <Input
                label="Modell (z.B. iPhone 13)"
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                placeholder="z.B. iPhone 13"
              />
            </div>

            <Textarea
              label="Beschreibung des Problems"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe das Problem genauer..."
              rows={5}
            />

            {/* Photo Upload */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Foto hochladen (optional)
              </label>
              {!photoPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 text-slate-400 mb-3" />
                    <p className="mb-2 text-sm text-slate-600">
                      <span className="font-semibold">Klicken zum Hochladen</span> oder Drag & Drop
                    </p>
                    <p className="text-xs text-slate-500">PNG, JPG oder JPEG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </label>
              ) : (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-xl border-2 border-slate-200"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                💡 Tipp: Je genauer du das Problem beschreibst, desto besser kann der Fixer sich vorbereiten!
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Safe Zone Selection */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Wo soll die Reparatur stattfinden?</h2>
            <p className="text-slate-600">Wähle eine Safe Zone auf dem Campus</p>

            <div className="space-y-3">
              {safeZones.filter(sz => sz.isAvailable).map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedSafeZone(zone.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedSafeZone === zone.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-slate-200 hover:border-primary-300'
                  }`}
                >
                  <p className="font-medium text-slate-800">{zone.name}</p>
                  <p className="text-sm text-slate-600">{zone.address}</p>
                </button>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-sm text-green-800">
                🛡️ Safe Zones sind öffentliche, gut besuchte Orte auf dem Campus für deine Sicherheit
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Summary */}
        {currentStep === 5 && selectedCategory && selectedSubcategory && selectedIssue && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Zusammenfassung</h2>
            <p className="text-slate-600">Bitte überprüfe deine Angaben</p>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Kategorie</p>
                <p className="font-medium text-slate-800">{selectedCategory.name}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Gerät & Problem</p>
                <p className="font-medium text-slate-800">
                  {selectedSubcategory.name} - {selectedIssue.label}
                </p>
                {deviceBrand && deviceModel && (
                  <p className="text-sm text-slate-600 mt-1">{deviceBrand} {deviceModel}</p>
                )}
              </div>

              {description && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-1">Beschreibung</p>
                  <p className="text-slate-800">{description}</p>
                </div>
              )}

              {photoPreview && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-600 mb-2">Hochgeladenes Foto</p>
                  <img
                    src={photoPreview}
                    alt="Uploaded"
                    className="w-full max-h-64 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Treffpunkt</p>
                <p className="font-medium text-slate-800">
                  {safeZones.find(sz => sz.id === selectedSafeZone)?.name}
                </p>
              </div>

              <div className="bg-primary-50 border-2 border-primary-600 rounded-xl p-4">
                <p className="text-sm text-slate-600 mb-1">Geschätzter Preis</p>
                <p className="text-2xl font-bold text-primary-600">
                  {selectedIssue.priceRange.min}-{selectedIssue.priceRange.max}€
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Geschätzte Dauer: {selectedIssue.estimatedTime}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>

          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Weiter
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed()}
            >
              <Check className="w-4 h-4 mr-2" />
              Buchung abschließen
            </Button>
          )}
        </div>
      </Card>
      </div>
    </>
  );
};
