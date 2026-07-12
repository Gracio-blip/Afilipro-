'use client';

import { useState, useEffect } from 'react';
import { X, Award } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';
import { QuizPlayer } from './QuizPlayer';
import { SurveyPlayer } from './SurveyPlayer';
import { TutorialPlayer } from './TutorialPlayer';
import { quizQuestions, surveyQuestions, tradingSlides, marketingSlides, seoSlides } from '@/data/tasks';

export type TaskType = 'video' | 'ad' | 'sponsored' | 'tiktok' | 'quiz' | 'survey' | 'tutorial-trading' | 'tutorial-marketing' | 'tutorial-seo';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: TaskType;
  title: string;
  description: string;
  reward: number;
  duration: string;
  thumbnailColor: string;
  onComplete: () => void;
}

const typeConfig: Record<TaskType, { 
  icon: string;
  label: string;
  color: string;
  durationSec: number;
}> = {
  'video': { icon: '▶', label: 'Vidéo', color: 'from-red-500 to-pink-600', durationSec: 180 },
  'ad': { icon: '📺', label: 'Publicité', color: 'from-orange-500 to-red-600', durationSec: 30 },
  'sponsored': { icon: '⭐', label: 'Sponsorisé', color: 'from-fuchsia-500 to-pink-700', durationSec: 90 },
  'tiktok': { icon: '🎵', label: 'TikTok', color: 'from-pink-500 to-rose-600', durationSec: 60 },
  'quiz': { icon: '🧠', label: 'Quiz', color: 'from-violet-500 to-purple-700', durationSec: 300 },
  'survey': { icon: '📋', label: 'Sondage', color: 'from-teal-500 to-cyan-600', durationSec: 300 },
  'tutorial-trading': { icon: '📈', label: 'Tutoriel Trading', color: 'from-lime-500 to-green-600', durationSec: 600 },
  'tutorial-marketing': { icon: '📊', label: 'Tutoriel Marketing', color: 'from-sky-500 to-blue-600', durationSec: 600 },
  'tutorial-seo': { icon: '🔍', label: 'Tutoriel SEO', color: 'from-sky-500 to-blue-600', durationSec: 600 },
};

export function TaskModal({ isOpen, onClose, type, title, description, reward, duration, thumbnailColor, onComplete }: TaskModalProps) {
  const [completed, setCompleted] = useState(false);
  const config = typeConfig[type];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCompleted(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !completed) onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, completed, onClose]);

  if (!isOpen) return null;

  const handleComplete = () => {
    setCompleted(true);
    setTimeout(() => {
      onComplete();
      onClose();
    }, 2000);
  };

  const quizKey = title.toLowerCase().includes('math') ? 'mathematiques' :
                  title.toLowerCase().includes('histoire') ? 'histoire' :
                  title.toLowerCase().includes('science') ? 'sciences' :
                  title.toLowerCase().includes('géographie') || title.toLowerCase().includes('geographie') ? 'geographie' :
                  title.toLowerCase().includes('tech') ? 'technologie' :
                  'culture-generale';

  const surveyKey = title.toLowerCase().includes('consommation') ? 'consommation' :
                    title.toLowerCase().includes('tech') ? 'tech' :
                    title.toLowerCase().includes('lifestyle') ? 'lifestyle' :
                    title.toLowerCase().includes('beauté') || title.toLowerCase().includes('beaute') ? 'beaute' :
                    title.toLowerCase().includes('voyage') ? 'voyage' :
                    'alimentation';

  const renderTask = () => {
    if (type === 'quiz') {
      const questions = quizQuestions[quizKey] || quizQuestions['culture-generale'];
      return <QuizPlayer questions={questions} reward={reward} onComplete={() => handleComplete()} />;
    }
    if (type === 'survey') {
      const questions = surveyQuestions[surveyKey] || surveyQuestions['consommation'];
      return <SurveyPlayer title={title} questions={questions} reward={reward} onComplete={handleComplete} />;
    }
    if (type === 'tutorial-trading') {
      return <TutorialPlayer title={title} slides={tradingSlides} reward={reward} onComplete={handleComplete} />;
    }
    if (type === 'tutorial-marketing') {
      return <TutorialPlayer title={title} slides={marketingSlides} reward={reward} onComplete={handleComplete} />;
    }
    if (type === 'tutorial-seo') {
      return <TutorialPlayer title={title} slides={seoSlides} reward={reward} onComplete={handleComplete} />;
    }
    // Video types
    return (
      <VideoPlayer
        title={title}
        description={description}
        duration={config.durationSec}
        thumbnailColor={thumbnailColor}
        thumbnailLetter={title.charAt(0)}
        type={type}
        onComplete={handleComplete}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={() => !completed && onClose()}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-gray-50 rounded-3xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className={`sticky top-0 z-10 bg-gradient-to-r ${config.color} p-4 flex items-center justify-between text-white`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
              {config.icon}
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-80">{config.label}</div>
              <div className="font-bold font-display">{title}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-white/20 backdrop-blur rounded-full">
              <Award className="w-4 h-4 text-accent" />
              <span className="font-bold text-sm">+{reward}€</span>
            </div>
            <button
              onClick={() => !completed && onClose()}
              disabled={completed}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderTask()}
        </div>

        {/* Completion banner */}
        {completed && (
          <div className="fixed inset-0 z-60 flex items-center justify-center pointer-events-none">
            <div className="bg-gradient-to-br from-success to-emerald-600 rounded-3xl p-8 text-white text-center animate-slide-up shadow-2xl">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center">
                <Award className="w-12 h-12" />
              </div>
              <div className="text-2xl font-bold font-display mb-1">+{reward}€</div>
              <div className="text-white/80">Crédité sur votre compte !</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
