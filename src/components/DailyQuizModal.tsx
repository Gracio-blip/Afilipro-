'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { X, Check, CheckCircle, AlertCircle, Loader2, Gift, ChevronRight, Award, Coins } from 'lucide-react';
import { getClientAuthHeaders } from '@/lib/client-auth';

// Banque de questions améliorées
const ALL_QUESTIONS = [
  { question: "Combien de retraits maximum pouvez-vous effectuer par jour ?", options: ["1 retrait", "2 retraits", "3 retraits", "Illimité"], correct: 1 },
  { question: "Quel est le montant du premier palier de retrait ?", options: ["1 000 FCFA", "1 500 FCFA", "2 000 FCFA", "3 000 FCFA"], correct: 1 },
  { question: "Quel pourcentage gagnez-vous sur les dépôts de vos filleuls ?", options: ["5 %", "8 %", "10 %", "15 %"], correct: 1 },
  { question: "Quelle est la durée du cycle pour le Niveau 1 VIP ?", options: ["30 jours", "45 jours", "60 jours", "75 jours"], correct: 3 },
  { question: "Combien de tours gratuits avez-vous au Lucky Spin chaque jour ?", options: ["1 tour", "3 tours", "5 tours", "Illimité"], correct: 1 },
  { question: "Quel est le plus grand océan de la Terre ?", options: ["Atlantique", "Indien", "Pacifique", "Arctique"], correct: 2 },
  { question: "Quelle est la planète la plus proche du Soleil ?", options: ["Vénus", "Mars", "Mercure", "Terre"], correct: 2 },
  { question: "Quel élément chimique a pour symbole 'Au' ?", options: ["Argent", "Aluminium", "Fer", "Or"], correct: 3 },
  { question: "Combien de pattes possède une araignée ?", options: ["6", "8", "10", "12"], correct: 1 },
  { question: "Dans quel pays se trouve le Taj Mahal ?", options: ["Pakistan", "Inde", "Iran", "Bangladesh"], correct: 1 },
  { question: "Quel est le plus long fleuve d'Afrique ?", options: ["Le Niger", "Le Congo", "Le Zambèze", "Le Nil"], correct: 3 },
  { question: "Quelle est la capitale du Togo ?", options: ["Dakar", "Cotonou", "Lomé", "Abidjan"], correct: 2 },
  { question: "Qui est le premier président de l'Afrique du Sud post-apartheid ?", options: ["Desmond Tutu", "Thabo Mbeki", "Jacob Zuma", "Nelson Mandela"], correct: 3 },
  { question: "Quel pays est surnommé le 'Pays des Hommes Intègres' ?", options: ["Mali", "Sénégal", "Burkina Faso", "Guinée"], correct: 2 },
  { question: "Quelle est la monnaie officielle de la CEDEAO ?", options: ["Naira", "Cedi", "Franc CFA", "Dalasi"], correct: 2 },
  { question: "Qui est le fondateur de Microsoft ?", options: ["Steve Jobs", "Elon Musk", "Bill Gates", "Jeff Bezos"], correct: 2 },
  { question: "Que signifie le sigle WWW ?", options: ["World Wide Web", "World Web Wide", "Web World Wide", "Wide World Web"], correct: 0 },
  { question: "En quelle année le Bitcoin a-t-il été créé ?", options: ["2005", "2009", "2012", "2015"], correct: 1 },
];

export function DailyQuizModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [loadingClaim, setLoadingClaim] = useState(false);
  const [questionsToAsk, setQuestionsToAsk] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const shuffled = [...ALL_QUESTIONS].sort(() => 0.5 - Math.random());
      setQuestionsToAsk(shuffled.slice(0, 3));
      setCurrentStep(0);
      setScore(0);
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
      if (currentStep === 2) setCurrentStep(3);
      else { setCurrentStep(prev => prev + 1); resetQuestionState(); }
    } else onClose();
  };

  const handleAnswer = () => {
    if (selectedOption === null || questionsToAsk.length === 0) return;
    const currentQ = questionsToAsk[currentStep];
    const correct = selectedOption === currentQ.correct;
    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);
    if (!correct) showToast("Mauvaise réponse.", "error");
  };

  const handleClaim = async () => {
    setLoadingClaim(true);
    try {
      const res = await fetch('/api/earn/daily-quiz', { method: 'POST', headers: getClientAuthHeaders(true) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      showToast(data.message, "success");
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || "Erreur", "error");
      onClose();
    } finally { setLoadingClaim(false); }
  };

  if (!isOpen) return null;

  const progressPercent = ((currentStep) / 3) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden relative animate-slide-up border border-white/20">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10 bg-gray-100 rounded-full">
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 p-7 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-32 w-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur">
                <Gift className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-black font-display">Quiz du Jour</h2>
                <p className="text-xs text-violet-200 font-semibold">50 FCFA par bonne réponse</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-violet-200">Gains</div>
              <div className="text-lg font-black">{score * 50} <span className="text-sm font-bold">FCFA</span></div>
            </div>
          </div>
          <div className="mt-5 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="p-6">
          {currentStep < 3 ? (
            <>
              <div className="mb-5 flex items-center justify-between">
                <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">Question {currentStep + 1}/3</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700 flex items-center gap-1">
                  <Coins className="h-3 w-3" /> +50 FCFA
                </span>
              </div>

              <h3 className="text-[17px] font-bold text-gray-900 mb-5 leading-snug">
                {questionsToAsk[currentStep]?.question}
              </h3>

              <div className="space-y-2.5">
                {questionsToAsk[currentStep]?.options.map((option: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => !isAnswered && setSelectedOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all font-semibold text-sm flex items-center justify-between ${
                      isAnswered
                        ? idx === questionsToAsk[currentStep].correct
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10"
                          : selectedOption === idx
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-100 text-gray-300 bg-gray-50"
                        : selectedOption === idx
                        ? "border-violet-600 bg-violet-50 text-violet-800 shadow-md shadow-violet-500/10 scale-[1.02]"
                        : "border-gray-200 hover:border-violet-300 hover:bg-violet-50/50 text-gray-700 bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                        isAnswered
                          ? idx === questionsToAsk[currentStep].correct
                            ? "bg-emerald-500 text-white"
                            : selectedOption === idx
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 text-gray-400"
                          : selectedOption === idx
                          ? "bg-violet-600 text-white"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {option}
                    </span>
                    {isAnswered && idx === questionsToAsk[currentStep].correct && <Check className="h-5 w-5 text-emerald-600" />}
                  </button>
                ))}
              </div>

              {isAnswered && (
                <div className={`mt-5 p-4 rounded-2xl border-2 animate-slide-up ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center gap-2">
                    {isCorrect ? <Check className="h-6 w-6 text-emerald-600" /> : <X className="h-6 w-6 text-red-600" />}
                    <p className={`font-black text-[15px] ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                      {isCorrect ? '✓ Réponse vraie ! +50 FCFA' : '✗ Réponse fausse'}
                    </p>
                  </div>
                  <p className="text-xs mt-1 ml-8 text-gray-600">
                    {isCorrect ? "Bonne réponse, continuez !" : "Ce n'est pas la bonne réponse."}
                  </p>
                </div>
              )}

              <button
                onClick={isAnswered ? handleNext : handleAnswer}
                disabled={selectedOption === null}
                className="mt-5 w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:from-gray-200 disabled:to-gray-300 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/20"
              >
                {isAnswered ? (
                  isCorrect ? (
                    currentStep === 2 ? <>Voir ma récompense <Gift className="h-5 w-5" /></> : <>Suivante <ChevronRight className="h-5 w-5" /></>
                  ) : <>Fermer</>
                ) : <>Je valide <Check className="h-5 w-5" /></>}
              </button>
            </>
          ) : (
            <div className="text-center py-2">
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-black font-display text-gray-900 mb-1">Félicitations !</h3>
              <p className="text-sm text-gray-500 mb-6">Vous avez obtenu {score}/3 bonnes réponses.</p>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">Cagnotte totale</p>
                <p className="text-3xl font-black text-emerald-600 mt-1">+{score * 50} FCFA</p>
                <p className="text-xs text-emerald-600/70 mt-1">{score} x 50 FCFA par bonne réponse</p>
              </div>
              <button onClick={handleClaim} disabled={loadingClaim} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-70 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg">
                {loadingClaim ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <>Réclamer {score * 50} FCFA <Gift className="h-5 w-5" /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
