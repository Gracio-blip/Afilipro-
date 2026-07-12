'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink, Check, Clock, Award, Smartphone, PlayCircle } from 'lucide-react';

interface ExternalTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  reward: number;
  externalUrl: string;
  platform: 'tiktok' | 'video';
  thumbnailColor: string;
  onComplete: () => void | Promise<void>;
}

export function ExternalTaskModal({
  isOpen,
  onClose,
  title,
  description,
  reward,
  externalUrl,
  platform,
  thumbnailColor,
  onComplete
}: ExternalTaskModalProps) {
  const [step, setStep] = useState<'ready' | 'watching' | 'verifying' | 'completed'>('ready');
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    if (isOpen) {
      setStep('ready');
      setCountdown(20);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (step === 'watching' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleOpenLink = () => {
    window.open(externalUrl, '_blank');
    setStep('watching');
  };

  const handleVerify = async () => {
    setStep('verifying');
    await new Promise((resolve) => setTimeout(resolve, 900));

    try {
      await onComplete();
      setStep('completed');
      setTimeout(onClose, 1800);
    } catch {
      setStep('watching');
    }
  };

  const isTiktok = platform === 'tiktok';
  const PlatformIcon = isTiktok ? Smartphone : PlayCircle;
  const platformLabel = isTiktok ? 'TikTok' : 'Vidéo';
  const platformColor = isTiktok ? 'from-pink-500 to-rose-600' : 'from-red-500 to-pink-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => step !== 'verifying' && step !== 'completed' && onClose()}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className={`bg-gradient-to-r ${platformColor} p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <PlatformIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-80">{platformLabel} Earn</div>
                <div className="font-bold font-display">{title}</div>
              </div>
            </div>
            <button
              onClick={() => step !== 'verifying' && step !== 'completed' && onClose()}
              disabled={step === 'verifying' || step === 'completed'}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur rounded-full w-fit">
            <Award className="w-4 h-4 text-accent" />
            <span className="font-bold text-sm">+{reward.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Step 1: Ready */}
          {step === 'ready' && (
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${platformColor} flex items-center justify-center`}>
                <PlatformIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 mb-3">
                {isTiktok ? 'Regarder sur TikTok' : 'Regarder la vidéo'}
              </h2>
              <p className="text-gray-600 mb-6">
                {description}
              </p>
              <p className="text-sm text-gray-500 mb-8">
                Cliquez sur le bouton ci-dessous pour ouvrir {isTiktok ? 'TikTok' : 'la vidéo'}. 
                Restez au moins 20 secondes, puis revenez pour valider votre récompense.
              </p>
              <button
                onClick={handleOpenLink}
                className={`w-full bg-gradient-to-r ${platformColor} text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity text-lg`}
              >
                <ExternalLink className="w-5 h-5" />
                {isTiktok ? 'Ouvrir TikTok' : 'Regarder la vidéo'}
              </button>
            </div>
          )}

          {/* Step 2: Watching (countdown) */}
          {step === 'watching' && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                <Clock className="w-10 h-10 text-accent animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 mb-3">
                {isTiktok ? 'Regardez sur TikTok...' : 'Regardez la vidéo...'}
              </h2>
              <p className="text-gray-600 mb-6">
                Ne fermez pas cette page. Revenez ici une fois que vous avez regardé.
              </p>

              {/* Countdown circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54" fill="none" stroke="#D4AF37" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 54}
                    strokeDashoffset={2 * Math.PI * 54 * (countdown / 20)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold font-display text-gray-900">{countdown}s</span>
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={countdown > 0}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  countdown > 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {countdown > 0 ? (
                  <>Patientez {countdown}s...</>
                ) : (
                  <><Check className="w-5 h-5" /> OK</>
                )}
              </button>

              {/* Re-open link */}
              <button
                onClick={() => window.open(externalUrl, '_blank')}
                className="mt-3 text-sm text-primary font-medium hover:text-accent flex items-center gap-1 mx-auto"
              >
                <ExternalLink className="w-4 h-4" />
                Rouvrir le lien
              </button>
            </div>
          )}

          {/* Step 3: Verifying */}
          {step === 'verifying' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-accent border-t-transparent rounded-full animate-spin" />
              <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">
                Vérification en cours...
              </h2>
              <p className="text-gray-500">Nous vérifions votre activité</p>
            </div>
          )}

          {/* Step 4: Completed */}
          {step === 'completed' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success flex items-center justify-center animate-slide-up">
                <Check className="w-14 h-14 text-white" />
              </div>
              <h2 className="text-3xl font-bold font-display text-gray-900 mb-2">
                Tâche validée !
              </h2>
              <p className="text-gray-600 mb-4">
                {isTiktok ? 'Visionnage TikTok vérifié' : 'Visionnage vidéo vérifié'}
              </p>
              <div className="bg-gradient-to-r from-success to-emerald-600 rounded-2xl p-6 text-white inline-block">
                <div className="text-sm text-white/80 mb-1">Récompense créditée</div>
                <div className="text-4xl font-bold font-display">+{reward.toLocaleString('fr-FR')} FCFA</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
