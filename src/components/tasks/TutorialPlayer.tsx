'use client';

import { useState } from 'react';
import { Check, ChevronRight, ChevronLeft, Award, BookOpen, Lightbulb } from 'lucide-react';

interface Slide {
  title: string;
  content: string;
  tip?: string;
  highlight?: string;
}

interface TutorialPlayerProps {
  title: string;
  slides: Slide[];
  reward: number;
  onComplete: () => void;
}

export function TutorialPlayer({ title, slides, reward, onComplete }: TutorialPlayerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [readSlides, setReadSlides] = useState<Set<number>>(new Set([0]));

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;
  const progress = (readSlides.size / slides.length) * 100;

  const handleNext = () => {
    if (isLast) {
      setCompleted(true);
      onComplete();
    } else {
      const next = currentSlide + 1;
      setCurrentSlide(next);
      setReadSlides(prev => new Set([...prev, next]));
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(c => c - 1);
  };

  if (completed) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-success to-emerald-600 rounded-3xl p-12 text-white text-center animate-slide-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
            <Award className="w-14 h-14" />
          </div>
          <h2 className="text-3xl font-bold font-display mb-2">Tutoriel terminé !</h2>
          <p className="text-white/80 mb-6">Vous avez complété "{title}"</p>
          <div className="bg-white/10 rounded-2xl p-6 mb-6 inline-block">
            <div className="text-sm text-white/70 mb-1">Récompense gagnée</div>
            <div className="text-5xl font-bold font-display text-accent">+{reward}€</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold font-display text-gray-900">{title}</h1>
          <span className="text-sm font-bold text-accent">
            {currentSlide + 1}/{slides.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-yellow-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {readSlides.size} / {slides.length} slides lues
        </div>
      </div>

      {/* Slide Content */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Slide Header */}
        <div className="bg-gradient-to-br from-primary to-blue-700 p-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Tutoriel</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold font-display">{slide.title}</h2>
        </div>

        {/* Slide Body */}
        <div className="p-8">
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {slide.content}
          </p>

          {/* Highlight */}
          {slide.highlight && (
            <div className="bg-accent/10 border-l-4 border-accent rounded-r-xl p-4 mb-6">
              <p className="text-gray-900 font-medium">{slide.highlight}</p>
            </div>
          )}

          {/* Tip */}
          {slide.tip && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Astuce</div>
                  <p className="text-sm text-blue-700">{slide.tip}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Précédent
            </button>
            <button
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              {isLast ? (
                <>Terminer <Check className="w-5 h-5" /></>
              ) : (
                <>Slide suivante <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="px-8 pb-6 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i);
                setReadSlides(prev => new Set([...prev, i]));
              }}
              className={`h-2 rounded-full transition-all ${
                i === currentSlide 
                  ? 'w-8 bg-accent' 
                  : readSlides.has(i)
                  ? 'w-2 bg-primary'
                  : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
