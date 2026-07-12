'use client';

import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Award } from 'lucide-react';

interface SurveyQuestion {
  id: number;
  type: 'single' | 'multiple' | 'rating' | 'text';
  question: string;
  options?: string[];
  maxRating?: number;
}

interface SurveyPlayerProps {
  title: string;
  questions: SurveyQuestion[];
  reward: number;
  onComplete: () => void;
}

export function SurveyPlayer({ title, questions, reward, onComplete }: SurveyPlayerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [completed, setCompleted] = useState(false);

  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;
  const currentAnswer = answers[question.id];

  const canProceed = () => {
    if (question.type === 'text') return currentAnswer && currentAnswer.trim().length > 0;
    if (question.type === 'multiple') return currentAnswer && currentAnswer.length > 0;
    return currentAnswer !== undefined;
  };

  const handleNext = () => {
    if (isLast) {
      setCompleted(true);
      onComplete();
    } else {
      setCurrentQ(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(c => c - 1);
  };

  const handleSingleSelect = (option: string) => {
    setAnswers({ ...answers, [question.id]: option });
  };

  const handleMultipleToggle = (option: string) => {
    const current = answers[question.id] || [];
    if (current.includes(option)) {
      setAnswers({ ...answers, [question.id]: current.filter((o: string) => o !== option) });
    } else {
      setAnswers({ ...answers, [question.id]: [...current, option] });
    }
  };

  const handleRating = (value: number) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleTextChange = (value: string) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-success to-emerald-600 rounded-3xl p-12 text-white text-center animate-slide-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
            <Check className="w-14 h-14" />
          </div>
          <h2 className="text-3xl font-bold font-display mb-2">Merci !</h2>
          <p className="text-white/80 mb-6">Votre sondage a été enregistré avec succès</p>
          <div className="bg-white/10 rounded-2xl p-6 mb-6 inline-block">
            <div className="text-sm text-white/70 mb-1">Récompense gagnée</div>
            <div className="text-5xl font-bold font-display text-accent">+{reward}€</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold font-display text-gray-900">{title}</h1>
          <span className="text-sm font-bold text-accent">
            {currentQ + 1}/{questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-yellow-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3">
            SONDAGE
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900 mb-2">
            {question.question}
          </h2>
          {question.type === 'multiple' && (
            <p className="text-sm text-gray-500">Plusieurs réponses possibles</p>
          )}
        </div>

        {/* Single choice */}
        {question.type === 'single' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleSingleSelect(option)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  currentAnswer === option
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  currentAnswer === option ? 'border-primary' : 'border-gray-300'
                }`}>
                  {currentAnswer === option && (
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  )}
                </div>
                <span className="font-medium text-gray-700">{option}</span>
              </button>
            ))}
          </div>
        )}

        {/* Multiple choice */}
        {question.type === 'multiple' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, i) => {
              const selected = currentAnswer?.includes(option);
              return (
                <button
                  key={i}
                  onClick={() => handleMultipleToggle(option)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                    selected ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {selected && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <span className="font-medium text-gray-700">{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Rating */}
        {question.type === 'rating' && (
          <div>
            <div className="flex justify-center gap-2 mb-4">
              {[...(Array(question.maxRating || 5))].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleRating(i + 1)}
                  className="transition-transform hover:scale-110"
                >
                  <svg 
                    className={`w-12 h-12 ${i < currentAnswer ? 'text-accent' : 'text-gray-300'}`}
                    fill={i < currentAnswer ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.782 15.79a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
              ))}
            </div>
            <div className="text-center text-gray-500 text-sm">
              {currentAnswer ? `Vous avez donné ${currentAnswer} étoile${currentAnswer > 1 ? 's' : ''}` : 'Cliquez pour noter'}
            </div>
          </div>
        )}

        {/* Text */}
        {question.type === 'text' && (
          <textarea
            value={currentAnswer || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Votre réponse..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-transparent focus:border-primary focus:bg-white outline-none resize-none"
          />
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrev}
            disabled={currentQ === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> Précédent
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLast ? 'Terminer' : 'Suivant'} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
