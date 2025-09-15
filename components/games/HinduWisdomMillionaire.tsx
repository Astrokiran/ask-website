"use client"

import { useState, useEffect, useCallback } from 'react'
import questionsDataEn from '@/data/questions-english.json'
import questionsDataHi from '@/data/questions-hindi.json'
import { Language, getTranslation } from '@/lib/gameLanguage'
import { LanguageToggle } from './LanguageToggle'

interface Question {
  id: number;
  question: string;
  answers: string[];
  correct: number;
  category: string;
  difficulty: string;
}

interface WisdomLevel {
  min: number;
  max: number;
  title: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
}

interface Lifelines {
  fiftyFifty: boolean;
}

const prizeLadder = [
  1000, 2000, 3000, 5000, 10000, 20000, 40000, 80000,
  160000, 320000, 640000, 1250000, 2500000, 5000000, 10000000
];

const milestones = [4, 9, 14]; // 5th, 10th, 15th questions

// Load questions based on language
const getQuestions = (language: Language): Question[] => {
  return language === 'hi' ? questionsDataHi.questions : questionsDataEn.questions;
};

// Categories with translations
const categories = {
  "Vedic Astrology": { color: "#9c27b0", name: { en: "Vedic Astrology", hi: "वैदिक ज्योतिष" } },
  "Hindu Gods": { color: "#ff5722", name: { en: "Hindu Gods", hi: "हिंदू देवता" } },
  "Hindu Goddesses": { color: "#e91e63", name: { en: "Hindu Goddesses", hi: "हिंदू देवियां" } },
  "Mythology": { color: "#2196f3", name: { en: "Mythology", hi: "पुराण" } },
  "Scriptures": { color: "#4caf50", name: { en: "Scriptures", hi: "शास्त्र" } },
  "Festivals": { color: "#ff9800", name: { en: "Festivals", hi: "त्योहार" } },
  "Culture": { color: "#795548", name: { en: "Culture", hi: "संस्कृति" } },
  "Philosophy": { color: "#607d8b", name: { en: "Philosophy", hi: "दर्शन" } }
};

const wisdomLevels: WisdomLevel[] = [
  { min: 0, max: 2, title: { en: "Seeker", hi: "साधक" }, description: { en: "Beginning the journey", hi: "यात्रा की शुरुआत" } },
  { min: 3, max: 5, title: { en: "Student", hi: "छात्र" }, description: { en: "Learning the basics", hi: "मूल बातें सीखना" } },
  { min: 6, max: 8, title: { en: "Devotee", hi: "भक्त" }, description: { en: "Growing in faith", hi: "श्रद्धा में वृद्धि" } },
  { min: 9, max: 11, title: { en: "Scholar", hi: "विद्वान" }, description: { en: "Wise in knowledge", hi: "ज्ञान में निपुण" } },
  { min: 12, max: 13, title: { en: "Sage", hi: "ऋषि" }, description: { en: "Master of wisdom", hi: "ज्ञान के स्वामी" } },
  { min: 14, max: 15, title: { en: "Enlightened Master", hi: "ज्ञानी गुरु" }, description: { en: "One with cosmic consciousness", hi: "ब्रह्मांडीय चेतना से एकाकार" } }
];

export default function HinduWisdomMillionaire() {
  const [language, setLanguage] = useState<Language>('en');
  const [gameActive, setGameActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentAmount, setCurrentAmount] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverData, setGameOverData] = useState({ title: '', message: '', stats: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [lifelines, setLifelines] = useState<Lifelines>({
    fiftyFifty: true
  });
  const [hiddenAnswers, setHiddenAnswers] = useState<number[]>([]);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showWalkAwayModal, setShowWalkAwayModal] = useState(false);

  // Get translations for current language
  const t = getTranslation(language);

  const formatMoney = (amount: number): string => {
    if (amount >= 10000000) return (amount / 10000000) + ' Cr';
    if (amount >= 100000) return (amount / 100000) + ' L';
    if (amount >= 1000) return (amount / 1000) + 'K';
    return amount.toString();
  };

  const getWisdomLevel = (questionsAnswered: number): WisdomLevel => {
    for (let level of wisdomLevels) {
      if (questionsAnswered >= level.min && questionsAnswered <= level.max) {
        return level;
      }
    }
    return wisdomLevels[0];
  };

  const getCategoryColor = (category: string): string => {
    const categoryData = categories[category as keyof typeof categories];
    return typeof categoryData === 'object' ? categoryData.color : '#667eea';
  };

  const getCategoryName = (category: string): string => {
    const categoryData = categories[category as keyof typeof categories];
    if (typeof categoryData === 'object' && categoryData.name) {
      return categoryData.name[language];
    }
    return category;
  };

  const shuffleQuestions = useCallback(() => {
    // Get questions based on current language
    const questions = getQuestions(language);

    // If we don't have a question order yet, create one
    if (questionOrder.length === 0) {
      // Create shuffled order of indices
      const indices = Array.from({ length: questions.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      const newOrder = indices.slice(0, 15); // Take only first 15 questions for the game
      setQuestionOrder(newOrder);

      // Set questions using the new order
      const orderedQuestions = newOrder.map(index => questions[index]);
      setShuffledQuestions(orderedQuestions);
    } else {
      // Use existing order but get questions in current language
      const orderedQuestions = questionOrder.map(index => questions[index]);
      setShuffledQuestions(orderedQuestions);
    }
  }, [language, questionOrder]);

  useEffect(() => {
    const saved = localStorage.getItem('bestScore');
    if (saved) setBestScore(parseInt(saved));
    shuffleQuestions();
  }, [shuffleQuestions]);

  // Reshuffle questions when language changes
  useEffect(() => {
    if (!gameActive) {
      shuffleQuestions();
    }
  }, [language, shuffleQuestions, gameActive]);

  const startTimer = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    setTimeLeft(60);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (selectedAnswer === null) {
            endGame(false, false, t.timeUp);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimerInterval(interval);
  }, [selectedAnswer]);

  const stopTimer = useCallback(() => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [timerInterval]);

  const startGame = () => {
    // Show welcome modal first
    setShowWelcomeModal(true);
  };

  const beginGameAfterModal = () => {
    setShowWelcomeModal(false);

    // Reset question order for a new game
    setQuestionOrder([]);

    // First shuffle questions for fresh gameplay
    shuffleQuestions();

    setGameActive(true);
    setCurrentQuestion(0);
    setCurrentAmount(0);
    setQuestionsAnswered(0);
    setCurrentStreak(0);
    setSelectedAnswer(null);
    setTimeLeft(60);

    setLifelines({ fiftyFifty: true });
    setHiddenAnswers([]); // Reset hidden answers for new game

    // Small delay to ensure questions are shuffled
    setTimeout(() => {
      loadQuestion();
    }, 100);
  };

  const loadQuestion = () => {
    if (currentQuestion >= shuffledQuestions.length || currentQuestion >= 15) {
      endGame(true);
      return;
    }

    setIsLoading(true);
    setHiddenAnswers([]); // Reset hidden answers for new question

    setTimeout(() => {
      setIsLoading(false);
      setSelectedAnswer(null);
      startTimer();
    }, 1500);
  };

  const selectAnswer = (answerIndex: number) => {
    if (selectedAnswer !== null) return;

    stopTimer();
    setSelectedAnswer(answerIndex);
    const question = shuffledQuestions[currentQuestion];

    setTimeout(() => {
      if (answerIndex !== question.correct) {
        const safeAmount = getSafeAmount();
        endGame(false, false, `${t.incorrect} ${t.youLeaveWith} ₹${formatMoney(safeAmount)}`);
      } else {
        setCurrentAmount(prizeLadder[currentQuestion]);
        setQuestionsAnswered(prev => prev + 1);
        setCurrentStreak(prev => prev + 1);

        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          if (currentQuestion + 1 < 15) {
            loadQuestion();
          } else {
            endGame(true);
          }
        }, 2500);
      }
    }, 1200);
  };

  const getSafeAmount = (): number => {
    let safeAmount = 0;
    for (let milestone of milestones) {
      if (questionsAnswered > milestone) {
        safeAmount = prizeLadder[milestone];
      }
    }
    return safeAmount;
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || selectedAnswer !== null) return;

    setLifelines(prev => ({ ...prev, fiftyFifty: false }));

    const question = shuffledQuestions[currentQuestion];
    const correctAnswer = question.correct;

    const wrongAnswers = [];
    for (let i = 0; i < question.answers.length; i++) {
      if (i !== correctAnswer) {
        wrongAnswers.push(i);
      }
    }

    // Randomly shuffle wrong answers and hide 2 of them
    for (let i = wrongAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wrongAnswers[i], wrongAnswers[j]] = [wrongAnswers[j], wrongAnswers[i]];
    }

    // Hide the first 2 wrong answers
    const answersToHide = wrongAnswers.slice(0, 2);
    setHiddenAnswers(answersToHide);
  };

  const walkAway = () => {
    setShowWalkAwayModal(true);
  };

  const confirmWalkAway = () => {
    setShowWalkAwayModal(false);
    stopTimer();
    endGame(false, true);
  };

  const cancelWalkAway = () => {
    setShowWalkAwayModal(false);
  };

  const endGame = (won: boolean, walkedAway = false, customMessage = '') => {
    setGameActive(false);
    stopTimer();

    if (currentAmount > bestScore) {
      setBestScore(currentAmount);
      localStorage.setItem('bestScore', currentAmount.toString());
    }

    const wisdomLevel = getWisdomLevel(questionsAnswered);

    let title, message;
    if (won) {
      title = t.cosmicEnlightenment;
      message = t.cosmicEnlightenmentMsg;
    } else if (walkedAway) {
      title = t.wiseRetreat;
      message = t.wiseRetreatMsg;
    } else if (customMessage) {
      title = t.journeyComplete;
      message = customMessage;
    } else {
      title = t.spiritualJourney;
      message = t.spiritualJourneyMsg;
    }

    setGameOverData({
      title,
      message,
      stats: `You answered ${questionsAnswered} questions correctly with a streak of ${currentStreak}. Wisdom Level: ${wisdomLevel.title} - ${wisdomLevel.description}`
    });
    setShowGameOver(true);
  };

  const newGame = () => {
    setShowGameOver(false);
    setGameActive(false);

    // Reset question order for new game variety
    setQuestionOrder([]);

    // Reshuffle questions for new game variety
    shuffleQuestions();

    // Reset all game state
    setCurrentQuestion(0);
    setCurrentAmount(0);
    setQuestionsAnswered(0);
    setCurrentStreak(0);
    setSelectedAnswer(null);
    setTimeLeft(60);
    setLifelines({ fiftyFifty: true });
    setHiddenAnswers([]); // Reset hidden answers for new game
  };

  if (shuffledQuestions.length === 0) return <div>Loading...</div>;

  const currentQuestionData = shuffledQuestions[currentQuestion];
  const wisdomLevel = getWisdomLevel(questionsAnswered);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Instagram-style gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-purple-50/60 to-orange-50/40 dark:from-orange-950/30 dark:via-purple-950/20 dark:to-orange-950/15"></div>

      {/* Multiple layered gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.3)_0%,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(251,146,60,0.15)_0%,transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(147,51,234,0.25)_0%,transparent_45%)] dark:bg-[radial-gradient(circle_at_80%_30%,rgba(147,51,234,0.12)_0%,transparent_45%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.2)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.1)_0%,transparent_50%)]"></div>

      {/* Enhanced Floating Elements with varied sizes and animations */}
      <div className="absolute top-16 left-8 w-3 h-3 bg-orange-400 rounded-full animate-pulse opacity-70 shadow-lg"></div>
      <div className="absolute top-24 left-24 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-32 right-16 w-4 h-4 bg-pink-400 rounded-full animate-bounce opacity-80 shadow-md"></div>
      <div className="absolute top-48 right-32 w-1.5 h-1.5 bg-orange-300 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute bottom-32 left-16 w-3.5 h-3.5 bg-purple-400 rounded-full animate-bounce opacity-70 shadow-lg"></div>
      <div className="absolute bottom-48 left-40 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping opacity-50"></div>
      <div className="absolute bottom-24 right-20 w-3 h-3 bg-pink-500 rounded-full animate-pulse opacity-65 shadow-md"></div>

      {/* Magical sparkle effects */}
      <div className="absolute top-20 left-1/4 text-orange-400 opacity-80 animate-pulse text-sm">✨</div>
      <div className="absolute top-40 right-1/4 text-purple-500 opacity-70 animate-bounce text-lg">⭐</div>
      <div className="absolute bottom-40 left-1/3 text-pink-400 opacity-75 animate-pulse text-base">🌟</div>
      <div className="absolute bottom-20 right-1/3 text-orange-500 opacity-80 animate-bounce text-sm">✨</div>
      <div className="absolute top-60 left-1/2 text-purple-400 opacity-60 animate-ping text-xs">💫</div>

      {/* Geometric shapes for modern look */}
      <div className="absolute top-28 left-12 w-8 h-8 border-2 border-orange-300 rotate-45 animate-spin opacity-30"></div>
      <div className="absolute bottom-36 right-12 w-6 h-6 border-2 border-purple-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute top-72 right-1/4 w-4 h-4 bg-gradient-to-r from-orange-400 to-purple-500 transform rotate-12 animate-bounce opacity-50"></div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 py-6 sm:py-12 lg:py-20">
        {/* Enhanced Header with Instagram-style effects */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          {/* Language Toggle and Badge */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <LanguageToggle currentLanguage={language} onLanguageChange={setLanguage} />
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/20 to-purple-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full px-3 sm:px-4 py-2 animate-pulse">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              <span className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400">🔥 {t.categories}</span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight mb-4 sm:mb-6 relative text-center px-2 sm:px-4">
            {/* Glowing background effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-purple-600 to-orange-500 blur-xl opacity-30 animate-pulse"></span>
            <span className="relative bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-lg break-words whitespace-pre-wrap">
              {t.title}
            </span>
            {/* Floating sparkle on title */}
            <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 text-yellow-400 animate-bounce text-sm sm:text-lg">✨</span>
          </h1>

          <div className="relative mb-6 sm:mb-8">
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-medium mb-2 px-2">
              {t.subtitle}
            </p>
            <p className="text-xs sm:text-sm md:text-base text-orange-600 dark:text-orange-400 px-2">
              {t.description}
            </p>
            {/* Accent line under subtitle */}
            <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-500 rounded-full mx-auto mt-3 sm:mt-4 animate-pulse"></div>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Enhanced Money Ladder */}
          <div className="lg:col-span-1 order-2 lg:order-1 bg-card/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-orange-300/50 shadow-2xl shadow-orange-500/10">
            <h3 className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400 text-center mb-4 sm:mb-6 flex items-center justify-center gap-2">
              <span className="animate-bounce">💰</span>
              {t.prizeLadder}
            </h3>
            <div className="space-y-1 sm:space-y-2 max-h-64 sm:max-h-none overflow-y-auto lg:overflow-visible">
              {prizeLadder.slice().reverse().map((amount, index) => {
                const levelIndex = prizeLadder.length - 1 - index;
                const isCurrent = gameActive && levelIndex === currentQuestion;
                const isCompleted = gameActive && levelIndex < currentQuestion;
                const isMilestone = milestones.includes(levelIndex);

                return (
                  <div
                    key={levelIndex}
                    className={`flex justify-between items-center p-2 sm:p-3 rounded-lg sm:rounded-xl border-2 transition-all duration-300 relative overflow-hidden text-sm sm:text-base ${
                      isCurrent
                        ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white font-bold border-orange-400 animate-pulse shadow-lg transform scale-105'
                        : isCompleted
                        ? 'bg-gradient-to-r from-green-500/30 to-green-600/30 border-green-400/50 text-green-600 dark:text-green-400'
                        : isMilestone
                        ? 'border-orange-400/60 bg-gradient-to-r from-orange-50/60 to-purple-50/60 dark:from-orange-950/20 dark:to-purple-950/20 text-orange-600 dark:text-orange-400'
                        : 'border-border bg-card/50 text-muted-foreground hover:border-orange-300/50 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-purple-50/30 dark:hover:from-orange-950/10 dark:hover:to-purple-950/10'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                    )}
                    <span className="relative z-10">{levelIndex + 1}</span>
                    <span className="relative z-10 font-semibold">₹{formatMoney(amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game Content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-4 sm:space-y-6">
            {gameActive && (
              <div className="flex flex-wrap justify-center sm:justify-between items-center gap-2 sm:gap-4">
                <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-300/30 px-3 sm:px-4 py-2 rounded-full font-bold text-purple-600 dark:text-purple-400 text-sm sm:text-base">
                  {t.question} {currentQuestion + 1}
                </div>
                <div
                  className="px-3 sm:px-4 py-2 rounded-full font-bold text-white backdrop-blur-sm border border-white/20 text-xs sm:text-sm"
                  style={{ background: `linear-gradient(45deg, ${getCategoryColor(currentQuestionData?.category || '')}, #764ba2)` }}
                >
                  {getCategoryName(currentQuestionData?.category || '')}
                </div>
                <div className={`px-3 sm:px-4 py-2 rounded-full font-bold text-base sm:text-lg text-white backdrop-blur-sm transition-all duration-300 ${
                  timeLeft <= 10
                    ? 'bg-gradient-to-r from-red-500 to-red-600 animate-pulse border-2 border-red-400 shadow-lg shadow-red-500/30'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 border border-orange-300/30'
                }`}>
                  {timeLeft}s
                </div>
              </div>
            )}

            {/* Enhanced Question Container */}
            <div className="bg-card/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-orange-300/50 min-h-[180px] sm:min-h-[220px] lg:min-h-[250px] flex items-center justify-center relative overflow-hidden shadow-2xl shadow-orange-500/10">
              {/* Rotating gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-orange-500/10 animate-pulse"></div>

              {gameActive && currentQuestionData?.difficulty && (
                <div className={`absolute top-4 right-4 px-3 py-2 rounded-full text-xs font-bold backdrop-blur-sm border transition-all ${
                  currentQuestionData.difficulty === 'easy'
                    ? 'bg-gradient-to-r from-green-500/80 to-green-600/80 text-white border-green-400/50'
                    : currentQuestionData.difficulty === 'medium'
                    ? 'bg-gradient-to-r from-yellow-500/80 to-yellow-600/80 text-black border-yellow-400/50'
                    : 'bg-gradient-to-r from-red-500/80 to-red-600/80 text-white border-red-400/50'
                }`}>
                  {currentQuestionData.difficulty === 'easy' ? t.easy :
                   currentQuestionData.difficulty === 'medium' ? t.medium : t.hard}
                </div>
              )}

              <div className="relative z-10 text-center">
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
                    <p className="text-orange-600 dark:text-orange-400 text-lg">{t.consultingForces}</p>
                  </div>
                ) : gameActive && currentQuestionData ? (
                  <h2 className="text-xl md:text-3xl font-semibold leading-relaxed text-foreground">
                    {currentQuestionData.question}
                  </h2>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl md:text-3xl leading-relaxed mb-6 font-bold">
                      {t.welcomeTitle}
                    </p>
                    <p className="text-lg mb-6 text-muted-foreground leading-relaxed">
                      {t.welcomeDescription}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                      <div className="bg-gradient-to-r from-orange-50/60 to-purple-50/60 dark:from-orange-950/20 dark:to-purple-950/20 p-3 rounded-xl border border-orange-300/30">
                        <p className="text-orange-600 dark:text-orange-400 font-semibold">{t.vedicAstrology}</p>
                      </div>
                      <div className="bg-gradient-to-r from-purple-50/60 to-pink-50/60 dark:from-purple-950/20 dark:to-pink-950/20 p-3 rounded-xl border border-purple-300/30">
                        <p className="text-purple-600 dark:text-purple-400 font-semibold">{t.hinduGods}</p>
                      </div>
                      <div className="bg-gradient-to-r from-green-50/60 to-emerald-50/60 dark:from-green-950/20 dark:to-emerald-950/20 p-3 rounded-xl border border-green-300/30">
                        <p className="text-green-600 dark:text-green-400 font-semibold">{t.sacredTexts}</p>
                      </div>
                      <div className="bg-gradient-to-r from-pink-50/60 to-rose-50/60 dark:from-pink-950/20 dark:to-rose-950/20 p-3 rounded-xl border border-pink-300/30">
                        <p className="text-pink-600 dark:text-pink-400 font-semibold">{t.festivals}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Answers Grid */}
            {gameActive && currentQuestionData && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentQuestionData.answers.map((answer, index) => {
                  const isHidden = hiddenAnswers.includes(index);

                  if (isHidden) {
                    return (
                      <div
                        key={index}
                        className="group relative p-6 rounded-2xl font-semibold text-left transition-all duration-300 transform opacity-30 bg-gray-400/20 border-2 border-gray-400/30 cursor-not-allowed backdrop-blur-sm"
                      >
                        <span className="relative z-10 text-gray-500 line-through">{answer}</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`group relative p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl font-semibold text-left transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden backdrop-blur-sm min-h-[56px] sm:min-h-[64px] md:min-h-[70px] w-full touch-manipulation ${
                        selectedAnswer === index
                          ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white border-2 border-orange-400 shadow-lg shadow-orange-500/30'
                          : selectedAnswer !== null && index === currentQuestionData.correct
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse border-2 border-green-400 shadow-lg shadow-green-500/30'
                          : selectedAnswer !== null && selectedAnswer !== index && selectedAnswer !== currentQuestionData.correct
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white border-2 border-red-400 shadow-lg shadow-red-500/30'
                          : 'bg-card/80 border-2 border-border hover:border-orange-300/50 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-purple-50/30 dark:hover:from-orange-950/10 dark:hover:to-purple-950/10 text-foreground shadow-md hover:shadow-lg'
                      }`}
                    >
                      {/* Shimmer effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10 text-sm sm:text-base md:text-lg leading-snug">{String.fromCharCode(65 + index)}. {answer}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Enhanced Lifelines - Mobile Optimized */}
            {gameActive && (
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <button
                  onClick={useFiftyFifty}
                  disabled={!lifelines.fiftyFifty}
                  className="group relative px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-400 hover:to-purple-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg border border-purple-300/30 overflow-hidden min-h-[44px] touch-manipulation"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative z-10 text-sm sm:text-base">🎯 {t.fiftyFifty}</span>
                </button>
              </div>
            )}

            {/* Enhanced Controls - Mobile Optimized */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              {!gameActive ? (
                <button
                  onClick={startGame}
                  className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-12 py-4 sm:py-6 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 hover:from-orange-600 hover:via-purple-700 hover:to-pink-600 text-white text-lg sm:text-xl font-black rounded-xl sm:rounded-2xl shadow-2xl shadow-orange-500/40 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden min-h-[56px] touch-manipulation w-full sm:w-auto max-w-sm"
                >
                  {/* Animated background shimmer */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative flex items-center gap-2 sm:gap-3 text-center">
                    <span className="animate-bounce text-base sm:text-lg">🎁</span>
                    <span className="text-sm sm:text-lg">{t.beginJourney}</span>
                    <span className="text-yellow-400 animate-pulse text-base sm:text-lg">✨</span>
                  </span>
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-400 to-purple-500 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </button>
              ) : (
                <>
                  <button
                    onClick={newGame}
                    className="group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-purple-400 hover:to-purple-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-purple-300/30 overflow-hidden min-h-[48px] touch-manipulation"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10 text-sm sm:text-base">🔄 {t.newGame}</span>
                  </button>
                  <button
                    onClick={walkAway}
                    className="group relative px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-red-400 hover:to-red-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-red-300/30 overflow-hidden min-h-[48px] touch-manipulation"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10 text-sm sm:text-base">🚶 {t.walkAway}</span>
                  </button>
                </>
              )}
            </div>

            {/* Enhanced Stats with Instagram-style design - Mobile Optimized */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
              <div className="group relative bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-md rounded-2xl p-4 border border-orange-300/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">{questionsAnswered}</div>
                  <div className="text-sm text-orange-600/80 dark:text-orange-400/80 font-medium">{t.questionsAnswered}</div>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-md rounded-2xl p-4 border border-purple-300/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">{currentStreak}</div>
                  <div className="text-sm text-purple-600/80 dark:text-purple-400/80 font-medium">{t.currentStreak}</div>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-md rounded-2xl p-4 border border-green-300/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">₹{formatMoney(bestScore)}</div>
                  <div className="text-sm text-green-600/80 dark:text-green-400/80 font-medium">{t.bestScore}</div>
                </div>
              </div>
              <div className="group relative bg-gradient-to-br from-pink-500/20 to-pink-600/20 backdrop-blur-md rounded-2xl p-4 border border-pink-300/40 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-1">{wisdomLevel.title[language]}</div>
                  <div className="text-sm text-pink-600/80 dark:text-pink-400/80 font-medium">{t.wisdomLevel}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="relative bg-card/95 backdrop-blur-xl p-8 rounded-3xl max-w-2xl w-full border-2 border-orange-300/50 shadow-2xl shadow-orange-500/20 overflow-hidden">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-purple-50/60 to-pink-50/40 dark:from-orange-950/30 dark:via-purple-950/20 dark:to-pink-950/15"></div>

            {/* Floating sparkles */}
            <div className="absolute top-4 left-4 text-orange-400 opacity-80 animate-pulse text-lg">🕉️</div>
            <div className="absolute top-6 right-6 text-purple-500 opacity-70 animate-bounce text-base">📿</div>
            <div className="absolute bottom-6 left-6 text-pink-400 opacity-75 animate-pulse text-sm">✨</div>
            <div className="absolute bottom-4 right-4 text-orange-500 opacity-80 animate-bounce text-lg">🧘</div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🙏</div>
                <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {language === 'hi' ? 'स्वागत है, साधक!' : 'Welcome, Seeker!'}
                </h2>
              </div>

              <div className="space-y-4 mb-8 text-lg leading-relaxed">
                <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-6 border border-orange-300/30">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🧠</div>
                    <div>
                      <h3 className="font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {language === 'hi' ? 'ज्ञान की यात्रा' : 'Journey of Wisdom'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'hi'
                          ? 'इस खेल में आप धन नहीं, बल्कि ज्ञान अर्जित करते हैं। प्रत्येक सही उत्तर आपको आध्यात्मिक ज्ञान की नई ऊंचाइयों तक पहुंचाता है।'
                          : 'In this game, you earn Wisdom, not money. Each correct answer elevates you to new heights of spiritual knowledge and understanding.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-300/30">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">🏆</div>
                    <div>
                      <h3 className="font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {language === 'hi' ? 'ज्ञान के स्तर' : 'Wisdom Levels'}
                      </h3>
                      <p className="text-muted-foreground">
                        {language === 'hi'
                          ? 'साधक से शुरू करके ज्ञानी गुरु तक - आपकी यात्रा हिंदू दर्शन, ज्योतिष, और पवित्र शास्त्रों के माध्यम से होगी।'
                          : 'Progress from Seeker to Enlightened Master - your journey through Hindu philosophy, astrology, and sacred scriptures awaits.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-2xl p-6 border border-green-300/30">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">⏰</div>
                    <div>
                      <h3 className="font-bold text-green-600 dark:text-green-400 mb-2">
                        {language === 'hi' ? 'खेल के नियम' : 'Game Rules'}
                      </h3>
                      <ul className="text-muted-foreground space-y-1 text-sm">
                        <li>• {language === 'hi' ? '15 प्रश्न, प्रत्येक के लिए 60 सेकंड' : '15 questions, 60 seconds each'}</li>
                        <li>• {language === 'hi' ? '50:50 जीवनरेखा का उपयोग करें' : 'Use the 50:50 lifeline wisely'}</li>
                        <li>• {language === 'hi' ? 'भाषा बदलना बिल्कुल मुफ्त है!' : 'Language switching is completely free!'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={beginGameAfterModal}
                  className="group relative px-4 sm:px-6 md:px-8 py-3 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 hover:from-orange-600 hover:via-purple-700 hover:to-pink-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden min-h-[48px] w-full sm:w-auto touch-manipulation"
                >
                  {/* Animated shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <span className="animate-bounce text-sm sm:text-base">🚀</span>
                    <span className="text-sm sm:text-base">{language === 'hi' ? 'ज्ञान यात्रा शुरू करें' : 'Begin Wisdom Quest'}</span>
                    <span className="text-yellow-400 animate-pulse text-sm sm:text-base">✨</span>
                  </span>
                  {/* Glowing border effect */}
                  <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-400 to-purple-500 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Walk Away Confirmation Modal - Mobile Optimized */}
      {showWalkAwayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="relative bg-card/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full border-2 border-red-300/50 shadow-2xl shadow-red-500/20 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 via-orange-50/60 to-yellow-50/40 dark:from-red-950/30 dark:via-orange-950/20 dark:to-yellow-950/15"></div>

            {/* Floating icons */}
            <div className="absolute top-4 left-4 text-red-400 opacity-80 animate-pulse text-lg">🚶</div>
            <div className="absolute top-6 right-6 text-orange-500 opacity-70 animate-bounce text-base">💰</div>
            <div className="absolute bottom-6 left-6 text-yellow-400 opacity-75 animate-pulse text-sm">⚠️</div>
            <div className="absolute bottom-4 right-4 text-red-500 opacity-80 animate-bounce text-lg">🤔</div>

            <div className="relative z-10">
              <div className="text-center mb-4 sm:mb-6">
                <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🚶‍♂️</div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-red-500 via-orange-600 to-yellow-500 bg-clip-text text-transparent px-2">
                  {language === 'hi' ? 'क्या आप वाकई चले जाना चाहते हैं?' : 'Are you sure you want to walk away?'}
                </h2>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6 px-2">
                  {language === 'hi'
                    ? `आप अपने साथ ले जा रहे हैं`
                    : 'You will walk away with'}
                </p>

                {/* Prize amount with glowing effect */}
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-yellow-600 to-orange-500 blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-500 via-yellow-600 to-orange-500 bg-clip-text text-transparent">
                    ₹{formatMoney(currentAmount)}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm rounded-2xl p-4 border border-yellow-300/30 mb-6">
                  <p className="text-sm text-muted-foreground">
                    {language === 'hi'
                      ? 'आपका ज्ञान स्तर: ' + getWisdomLevel(questionsAnswered).title[language]
                      : 'Your Wisdom Level: ' + getWisdomLevel(questionsAnswered).title[language]}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={cancelWalkAway}
                  className="group relative px-4 sm:px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-green-400 hover:to-green-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-green-300/30 overflow-hidden min-h-[48px] w-full sm:w-auto touch-manipulation"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <span>💪</span>
                    {language === 'hi' ? 'जारी रखें' : 'Continue Playing'}
                  </span>
                </button>
                <button
                  onClick={confirmWalkAway}
                  className="group relative px-4 sm:px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-red-400 hover:to-red-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-red-300/30 overflow-hidden min-h-[48px] w-full sm:w-auto touch-manipulation"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2 text-sm sm:text-base">
                    <span>🚶</span>
                    {language === 'hi' ? 'हां, चलिए' : 'Yes, Walk Away'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Game Over Modal with Instagram-style design - Mobile Optimized */}
      {showGameOver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="relative bg-card/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl max-w-lg w-full border-2 border-orange-300/50 shadow-2xl shadow-orange-500/20 overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Background gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-purple-50/60 to-pink-50/40 dark:from-orange-950/30 dark:via-purple-950/20 dark:to-pink-950/15"></div>

            {/* Floating sparkles */}
            <div className="absolute top-4 left-4 text-orange-400 opacity-80 animate-pulse text-lg">✨</div>
            <div className="absolute top-6 right-6 text-purple-500 opacity-70 animate-bounce text-base">⭐</div>
            <div className="absolute bottom-6 left-6 text-pink-400 opacity-75 animate-pulse text-sm">🌟</div>
            <div className="absolute bottom-4 right-4 text-orange-500 opacity-80 animate-bounce text-lg">✨</div>

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center mb-4 sm:mb-6 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 bg-clip-text text-transparent px-2">
                {gameOverData.title}
              </h2>

              <div className="text-center mb-4 sm:mb-6">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-3 sm:mb-4 font-medium px-2">
                  {gameOverData.message}
                </p>

                {/* Prize amount with glowing effect */}
                <div className="relative inline-block mb-3 sm:mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                    ₹{formatMoney(currentAmount)}
                  </div>
                </div>
              </div>

              {/* Stats in a beautiful card */}
              <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-300/30 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-center text-muted-foreground leading-relaxed font-medium">
                  {gameOverData.stats}
                </p>
              </div>

              <button
                onClick={newGame}
                className="group relative w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 hover:from-orange-600 hover:via-purple-700 hover:to-pink-600 text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden min-h-[48px] touch-manipulation"
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                <span className="relative flex items-center justify-center gap-2">
                  <span className="animate-bounce text-sm sm:text-base">🔄</span>
                  <span className="text-sm sm:text-base">{t.continueJourney}</span>
                  <span className="text-yellow-400 animate-pulse text-sm sm:text-base">✨</span>
                </span>
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-orange-400 to-purple-500 blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}