'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { X, Check, CheckCircle, AlertCircle, Loader2, Gift, ChevronRight } from 'lucide-react';
import { getClientAuthHeaders } from '@/lib/client-auth';

// Questions du Quiz Quotidien — Banque de questions
const ALL_QUESTIONS = [
  // Sur la plateforme AfiliPro
  { question: "Combien de retraits maximum pouvez-vous effectuer par jour sur AfiliPro ?", options: ["1 retrait", "2 retraits", "3 retraits", "Illimité"], correct: 1 },
  { question: "Quel est le montant du premier palier de retrait ?", options: ["1 000 FCFA", "1 500 FCFA", "2 000 FCFA", "3 000 FCFA"], correct: 1 },
  { question: "Quel pourcentage gagnez-vous sur les dépôts de vos filleuls ?", options: ["5 %", "8 %", "10 %", "15 %"], correct: 1 },
  { question: "Quelle est la durée du cycle pour le Niveau 1 VIP ?", options: ["30 jours", "45 jours", "60 jours", "75 jours"], correct: 3 },
  { question: "Combien de tours gratuits avez-vous au Lucky Spin chaque jour ?", options: ["1 tour", "3 tours", "5 tours", "Illimité"], correct: 1 },
  
  // Culture Générale (Monde)
  { question: "Quel est le plus grand océan de la Terre ?", options: ["Océan Atlantique", "Océan Indien", "Océan Pacifique", "Océan Arctique"], correct: 2 },
  { question: "Quelle est la planète la plus proche du Soleil ?", options: ["Vénus", "Mars", "Mercure", "Terre"], correct: 2 },
  { question: "Quel élément chimique a pour symbole 'Au' ?", options: ["Argent", "Aluminium", "Fer", "Or"], correct: 3 },
  { question: "Combien de pattes possède une araignée ?", options: ["6", "8", "10", "12"], correct: 1 },
  { question: "Dans quel pays se trouve le Taj Mahal ?", options: ["Pakistan", "Inde", "Iran", "Bangladesh"], correct: 1 },
  
  // Culture Africaine
  { question: "Quel est le plus long fleuve d'Afrique ?", options: ["Le Niger", "Le Congo", "Le Zambèze", "Le Nil"], correct: 3 },
  { question: "Quelle est la capitale du Togo ?", options: ["Dakar", "Cotonou", "Lomé", "Abidjan"], correct: 2 },
  { question: "Qui est le premier président de l'Afrique du Sud post-apartheid ?", options: ["Desmond Tutu", "Thabo Mbeki", "Jacob Zuma", "Nelson Mandela"], correct: 3 },
  { question: "Quel pays est surnommé le 'Pays des Hommes Intègres' ?", options: ["Mali", "Sénégal", "Burkina Faso", "Guinée"], correct: 2 },
  { question: "Quelle est la monnaie officielle de la CEDEAO (actuelle) ?", options: ["Naira", "Cedi", "Franc CFA", "Dalasi"], correct: 2 },
  
  // Technologie & Numérique
  { question: "Qui est le fondateur de Microsoft ?", options: ["Steve Jobs", "Elon Musk", "Bill Gates", "Jeff Bezos"], correct: 2 },
  { question: "Que signifie le sigle WWW ?", options: ["World Wide Web", "World Web Wide", "Web World Wide", "Wide World Web"], correct: 0 },
  { question: "En quelle année le Bitcoin a-t-il été créé ?", options: ["2005", "2009", "2012", "2015"], correct: 1 },
];

export function DailyQuizModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2 for questions, 3 for success/loading
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);

  const [questionsToAsk, setQuestionsToAsk] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Sélectionner 3 questions aléatoires parmi la banque de données
      const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
      setQuestionsToAsk(shuffled.slice(0, 3));
      
      setCurrentStep(0);
      resetQuestionState();
    }
  }, [isOpen]);

  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleNext = () => {
    if (isCorrect) {
      if (currentStep === 2) {
        setCurrentStep(3);
      } else {
        setCurrentStep(prev => prev + 1);
        resetQuestionState();
      }
    } else {
      onClose();
    }
  };

  const handleAnswer = () => {
    if (selectedOption === null || questionsToAsk.length === 0) return;
    
    const currentQ = questionsToAsk[currentStep];
    const correct = selectedOption === currentQ.correct;
    
    setIsAnswered(true);
    setIsCorrect(correct);

    if (!correct) {
      showToast("Mauvaise réponse. Essayez encore demain.", "error");
    }
  };

  const handleClaim = async () => {
    setLoadingClaim(true);
    try {
      const res = await fetch('/api/earn/daily-quiz', {
        method: 'POST',
        headers: getClientAuthHeaders(true),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      
      showToast(data.message, "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || "Erreur", "error");
      onClose();
    } finally {
      setLoadingClaim(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative animate-slide-up">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10">
          <X className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Gift className="h-6 w-6" /> Quiz Quotidien
          </h2>
          <p className="text-sm text-violet-100 mt-1">
            Répondez à 3 questions (100 FCFA chacune) pour gagner <strong className="text-white">300 FCFA</strong>
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep < 3 ? (
            <>
              {/* Question */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-2 font-semibold">
                  <span>Question {currentStep + 1}/3</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 leading-snug">
                  {questionsToAsk[currentStep]?.question}
                </h3>

                <div className="space-y-3">
                  {questionsToAsk[currentStep]?.options.map((option: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => !isAnswered && setSelectedOption(idx)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${
                        isAnswered
                          ? idx === questionsToAsk[currentStep].correct
                            ? "border-green-500 bg-green-50 text-green-700"
                            : selectedOption === idx
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-100 text-gray-400"
                          : selectedOption === idx
                          ? "border-violet-500 bg-violet-50 text-violet-700"
                          : "border-gray-100 hover:border-violet-300 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isAnswered && idx === questionsToAsk[currentStep].correct && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                        {isAnswered && selectedOption === idx && idx !== questionsToAsk[currentStep].correct && (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Résultat de la réponse */}
              {isAnswered && (
                <div className={`mb-4 p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
                  <div className="flex items-center gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    )}
                    <p className={`font-bold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect ? '✓ Réponse vraie !' : '✗ Réponse fausse'}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={isAnswered ? handleNext : handleAnswer}
                disabled={selectedOption === null}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {isAnswered ? (
                  isCorrect ? (
                    currentStep === 2 ? (
                      <>Voir ma récompense (300 FCFA) <Gift className="h-5 w-5" /></>
                    ) : (
                      <>Question suivante <ChevronRight className="h-5 w-5" /></>
                    )
                  ) : (
                    <>Fermer</>
                  )
                ) : (
                  <>Je valide <Check className="w-5 h-5" /></>
                )}
              </button>
            </>
          ) : (
            // Claim State
            <div className="text-center py-4">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Félicitations !</h3>
              <p className="text-gray-500 mb-6">Vous avez répondu correctement aux 3 questions.</p>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <span className="text-sm text-green-800 block mb-1">Récompense</span>
                <span className="text-2xl font-black text-green-700">+300 FCFA</span>
              </div>

              <button
                onClick={handleClaim}
                disabled={loadingClaim}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-70 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loadingClaim ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>Réclamer mes 300 FCFA <Gift className="h-5 w-5" /></>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
