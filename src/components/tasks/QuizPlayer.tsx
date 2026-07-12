'use client';

import { useState } from 'react';
import { Check, X, Award, ChevronRight, RotateCcw } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizPlayerProps {
  questions: Question[];
  reward: number;
  onComplete: (score: number) => void;
}

export function QuizPlayer({ questions, reward, onComplete }: QuizPlayerProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null || showResult) return;
    setShowResult(true);

    const isCorrect = selectedAnswer === question.correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setAnswers([...answers, isCorrect]);
  };

  const handleNext = () => {
    if (isLast) {
      const finalScore = score + (selectedAnswer === question.correctAnswer ? 0 : 0);
      onComplete(score);
    } else {
      setCurrentQ(c => c + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  const progress = ((currentQ + (showResult ? 1 : 0)) / questions.length) * 100;
  const finalScore = answers.filter(a => a).length;
  const passed = finalScore >= Math.ceil(questions.length * 0.6);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQ + 1} / {questions.length}
          </span>
          <span className="text-sm font-bold text-accent">
            Score: {score}/{questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-yellow-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Question */}
        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full mb-3">
            QUIZ
          </div>
          <h2 className="text-xl md:text-2xl font-bold font-display text-gray-900">
            {question.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                disabled={showResult}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  showCorrect
                    ? 'border-green-500 bg-green-50'
                    : showWrong
                    ? 'border-red-500 bg-red-50'
                    : isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                  showCorrect
                    ? 'bg-green-500 text-white'
                    : showWrong
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {showCorrect ? <Check className="w-5 h-5" /> : 
                   showWrong ? <X className="w-5 h-5" /> :
                   String.fromCharCode(65 + index)}
                </div>
                <span className={`font-medium ${
                  showCorrect ? 'text-green-900' :
                  showWrong ? 'text-red-900' :
                  'text-gray-700'
                }`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && question.explanation && (
          <div className={`mt-4 p-4 rounded-xl ${
            selectedAnswer === question.correctAnswer 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-orange-50 border border-orange-200'
          }`}>
            <div className="flex items-start gap-3">
              {selectedAnswer === question.correctAnswer ? (
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <div className="font-semibold text-gray-900 mb-1">
                  {selectedAnswer === question.correctAnswer ? 'Correct !' : 'Pas tout à fait...'}
                </div>
                <p className="text-sm text-gray-600">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Validation / Next button */}
        {!showResult ? (
          <button
            onClick={handleConfirmAnswer}
            disabled={selectedAnswer === null}
            className="mt-6 w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Je valide <Check className="w-5 h-5" />
          </button>
        ) : !isLast ? (
          <button
            onClick={handleNext}
            className="mt-6 w-full btn-primary py-3 flex items-center justify-center gap-2 animate-fade-in"
          >
            Question suivante <ChevronRight className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      {/* Final Result */}
      {isLast && showResult && (
        <div className="mt-6 bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-8 text-white text-center animate-slide-up">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            passed ? 'bg-success' : 'bg-red-500'
          }`}>
            {passed ? <Check className="w-12 h-12" /> : <X className="w-12 h-12" />}
          </div>
          <h2 className="text-3xl font-bold font-display mb-2">
            {passed ? 'Félicitations !' : 'Presque !'}
          </h2>
          <p className="text-white/80 mb-4">
            Vous avez obtenu {finalScore} sur {questions.length}
          </p>
          {passed ? (
            <div className="bg-accent/20 rounded-2xl p-6 mb-4">
              <div className="text-sm text-white/70 mb-1">Récompense gagnée</div>
              <div className="text-4xl font-bold font-display text-accent">+{reward} FCFA</div>
            </div>
          ) : (
            <p className="text-white/80 text-sm mb-4">
              Vous devez répondre correctement à au moins 60% des questions. Réessayez !
            </p>
          )}
          <button
            onClick={handleRestart}
            className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Recommencer
          </button>
        </div>
      )}
    </div>
  );
}
