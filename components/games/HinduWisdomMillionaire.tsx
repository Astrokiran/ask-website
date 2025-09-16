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
  100, 200, 300, 500, 1000, 2000, 4000, 8000,
  16000, 32000, 64000, 125000, 250000, 500000, 1000000
];

const milestones = [4, 9, 14]; // 5th, 10th, 15th questions

// Load questions based on language
const getQuestions = (language: Language): Question[] => {
  return language === 'hi' ? questionsDataHi.questions : questionsDataEn.questions;
};

// Categories with translations
const categories = {
  "Vedic Astrology": { color: "#2563eb", name: { en: "Vedic Astrology", hi: "वैदिक ज्योतिष" } },
  "Hindu Gods": { color: "#1d4ed8", name: { en: "Hindu Gods", hi: "हिंदू देवता" } },
  "Hindu Goddesses": { color: "#3b82f6", name: { en: "Hindu Goddesses", hi: "हिंदू देवियां" } },
  "Mythology": { color: "#1e40af", name: { en: "Mythology", hi: "पुराण" } },
  "Scriptures": { color: "#2563eb", name: { en: "Scriptures", hi: "शास्त्र" } },
  "Festivals": { color: "#1d4ed8", name: { en: "Festivals", hi: "त्योहार" } },
  "Culture": { color: "#3b82f6", name: { en: "Culture", hi: "संस्कृति" } },
  "Philosophy": { color: "#1e40af", name: { en: "Philosophy", hi: "दर्शन" } }
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

  const formatPoints = (amount: number): string => {
    if (amount >= 1000000) return (amount / 1000000) + 'M points';
    if (amount >= 1000) return (amount / 1000) + 'K points';
    return amount.toString() + ' points';
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
  }, [selectedAnswer, timerInterval, t.timeUp]);

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
        endGame(false, false, `${t.incorrect} ${t.youLeaveWith} ${formatPoints(safeAmount)}`);
      } else {
        setCurrentAmount(prizeLadder[currentQuestion]);
        setQuestionsAnswered(prev => prev + 1);
        setCurrentStreak(prev => prev + 1);

        setTimeout(() => {
          const nextQuestion = currentQuestion + 1;
          setCurrentQuestion(nextQuestion);
          if (nextQuestion < 15) {
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
      stats: `You answered ${questionsAnswered} questions correctly with a streak of ${currentStreak}. Wisdom Level: ${wisdomLevel.title[language]} - ${wisdomLevel.description[language]}`
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">

      <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 xl:py-20">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Language Toggle and Badge */}
          <div className="flex flex-col items-center gap-4 mb-6">
            <LanguageToggle currentLanguage={language} onLanguageChange={setLanguage} />
            <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-full px-4 py-2 max-w-sm">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate">{t.categories}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight mb-6 text-gray-900 dark:text-white px-4">
            {t.title}
          </h1>

          <div className="mb-8">
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-2 px-4">
              {t.subtitle}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 px-4">
              {t.description}
            </p>
            {/* Accent line under subtitle */}
            <div className="w-24 h-0.5 bg-blue-600 rounded-full mx-auto mt-4"></div>
          </div>
        </div>

        {/* Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {/* Prize Ladder */}
          <div className="lg:col-span-1 order-2 lg:order-1 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-6">
              {t.prizeLadder}
            </h3>
            <div className="space-y-1 max-h-64 lg:max-h-none overflow-y-auto lg:overflow-visible">
              {prizeLadder.slice().reverse().map((amount, index) => {
                const levelIndex = prizeLadder.length - 1 - index;
                const isCurrent = gameActive && levelIndex === currentQuestion;
                const isCompleted = gameActive && levelIndex < currentQuestion;
                const isMilestone = milestones.includes(levelIndex);

                return (
                  <div
                    key={levelIndex}
                    className={`flex justify-between items-center p-3 rounded-lg border transition-all duration-200 text-sm ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : isCompleted
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                        : isMilestone
                        ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span>{levelIndex + 1}</span>
                    <span className="font-semibold">{formatPoints(amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Game Content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-3 sm:space-y-4 md:space-y-6">
            {gameActive && (
              <div className="flex flex-wrap justify-center sm:justify-between items-center gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 px-4 py-2 rounded-full font-semibold text-blue-600 dark:text-blue-400 text-sm">
                  {t.question} {currentQuestion + 1}
                </div>
                <div
                  className="px-4 py-2 rounded-full font-semibold text-white border text-sm"
                  style={{ backgroundColor: getCategoryColor(currentQuestionData?.category || ''), borderColor: getCategoryColor(currentQuestionData?.category || '') }}
                >
                  {getCategoryName(currentQuestionData?.category || '')}
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm text-white transition-all duration-200 ${
                  timeLeft <= 10
                    ? 'bg-red-600 border border-red-600'
                    : 'bg-gray-600 border border-gray-600'
                }`}>
                  {timeLeft}s
                </div>
              </div>
            )}

            {/* Question Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 min-h-[200px] flex items-center justify-center relative shadow-sm">
              {gameActive && currentQuestionData?.difficulty && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold border ${
                  currentQuestionData.difficulty === 'easy'
                    ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                    : currentQuestionData.difficulty === 'medium'
                    ? 'bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
                    : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800'
                }`}>
                  {currentQuestionData.difficulty === 'easy' ? t.easy :
                   currentQuestionData.difficulty === 'medium' ? t.medium : t.hard}
                </div>
              )}

              <div className="text-center w-full">
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-blue-600 dark:text-blue-400 text-base">{t.consultingForces}</p>
                  </div>
                ) : gameActive && currentQuestionData ? (
                  <h2 className="text-xl lg:text-2xl font-semibold leading-relaxed text-gray-900 dark:text-white px-4">
                    {currentQuestionData.question}
                  </h2>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl leading-relaxed mb-6 font-semibold px-2 text-gray-900 dark:text-white">
                      {t.welcomeTitle}
                    </p>
                    <p className="text-base mb-6 text-gray-600 dark:text-gray-400 leading-relaxed px-2">
                      {t.welcomeDescription}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto px-2">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{t.vedicAstrology}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{t.hinduGods}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{t.sacredTexts}</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{t.festivals}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Answers Grid */}
            {gameActive && currentQuestionData && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestionData.answers.map((answer, index) => {
                  const isHidden = hiddenAnswers.includes(index);

                  if (isHidden) {
                    return (
                      <div
                        key={index}
                        className="p-4 rounded-lg font-semibold text-left opacity-30 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 cursor-not-allowed min-h-[64px] flex items-center"
                      >
                        <span className="text-gray-500 line-through text-base">{answer}</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`p-4 rounded-lg font-semibold text-left transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] min-h-[64px] w-full flex items-center border ${
                        selectedAnswer === index
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                          : selectedAnswer !== null && index === currentQuestionData.correct
                          ? 'bg-green-600 text-white border-green-600 shadow-sm'
                          : selectedAnswer !== null && selectedAnswer !== index && selectedAnswer !== currentQuestionData.correct
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white shadow-sm hover:shadow-md'
                      }`}
                    >
                      <span className="text-base leading-snug">{String.fromCharCode(65 + index)}. {answer}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Lifelines */}
            {gameActive && (
              <div className="flex justify-center">
                <button
                  onClick={useFiftyFifty}
                  disabled={!lifelines.fiftyFifty}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md border border-blue-600 min-h-[48px]"
                >
                  <span className="text-sm">{t.fiftyFifty}</span>
                </button>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4">
              {!gameActive ? (
                <button
                  onClick={startGame}
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[56px] w-full sm:w-auto max-w-sm"
                >
                  <span>{t.beginJourney}</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={newGame}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-gray-600 min-h-[48px]"
                  >
                    <span className="text-sm">{t.newGame}</span>
                  </button>
                  <button
                    onClick={walkAway}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-red-600 min-h-[48px]"
                  >
                    <span className="text-sm">{t.walkAway}</span>
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-1">{questionsAnswered}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.questionsAnswered}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-1">{currentStreak}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.currentStreak}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-1">{formatPoints(bestScore)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.bestScore}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                <div className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mb-1">{wisdomLevel.title[language]}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{t.wisdomLevel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-2xl w-full border border-gray-200 dark:border-gray-700 shadow-sm max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-white">
                {language === 'hi' ? 'स्वागत है, साधक!' : 'Welcome, Seeker!'}
              </h2>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {language === 'hi' ? 'ज्ञान की यात्रा' : 'Journey of Wisdom'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'hi'
                    ? 'इस खेल में आप धन नहीं, बल्कि ज्ञान अर्जित करते हैं। प्रत्येक सही उत्तर आपको आध्यात्मिक ज्ञान की नई ऊंचाइयों तक पहुंचाता है।'
                    : 'In this game, you earn Wisdom, not money. Each correct answer elevates you to new heights of spiritual knowledge and understanding.'}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {language === 'hi' ? 'ज्ञान के स्तर' : 'Wisdom Levels'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'hi'
                    ? 'साधक से शुरू करके ज्ञानी गुरु तक - आपकी यात्रा हिंदू दर्शन, ज्योतिष, और पवित्र शास्त्रों के माध्यम से होगी।'
                    : 'Progress from Seeker to Enlightened Master - your journey through Hindu philosophy, astrology, and sacred scriptures awaits.'}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {language === 'hi' ? 'खेल के नियम' : 'Game Rules'}
                </h3>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1 text-sm">
                  <li>• {language === 'hi' ? '15 प्रश्न, प्रत्येक के लिए 60 सेकंड' : '15 questions, 60 seconds each'}</li>
                  <li>• {language === 'hi' ? '50:50 जीवनरेखा का उपयोग करें' : 'Use the 50:50 lifeline wisely'}</li>
                  <li>• {language === 'hi' ? 'भाषा बदलना बिल्कुल मुफ्त है!' : 'Language switching is completely free!'}</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={beginGameAfterModal}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[48px] w-full sm:w-auto max-w-sm"
              >
                <span>{language === 'hi' ? 'ज्ञान यात्रा शुरू करें' : 'Begin Wisdom Quest'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Walk Away Confirmation Modal */}
      {showWalkAwayModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-lg w-full border border-gray-200 dark:border-gray-700 shadow-sm max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white px-2">
                {language === 'hi' ? 'क्या आप वाकई चले जाना चाहते हैं?' : 'Are you sure you want to walk away?'}
              </h2>
            </div>

            <div className="text-center mb-8">
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6 px-2">
                {language === 'hi'
                  ? `आप अपने साथ ले जा रहे हैं`
                  : 'You will walk away with'}
              </p>

              {/* Prize amount */}
              <div className="mb-6">
                <div className="text-4xl font-semibold text-green-600 dark:text-green-400">
                  {formatPoints(currentAmount)}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {language === 'hi'
                    ? 'आपका ज्ञान स्तर: ' + getWisdomLevel(questionsAnswered).title[language]
                    : 'Your Wisdom Level: ' + getWisdomLevel(questionsAnswered).title[language]}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={cancelWalkAway}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-green-600 min-h-[48px] w-full sm:w-auto"
              >
                <span className="text-sm">
                  {language === 'hi' ? 'जारी रखें' : 'Continue Playing'}
                </span>
              </button>
              <button
                onClick={confirmWalkAway}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-sm border border-red-600 min-h-[48px] w-full sm:w-auto"
              >
                <span className="text-sm">
                  {language === 'hi' ? 'हां, चलिए' : 'Yes, Walk Away'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-lg w-full border border-gray-200 dark:border-gray-700 shadow-sm max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white px-2">
              {gameOverData.title}
            </h2>

            <div className="text-center mb-6">
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4 font-medium px-2">
                {gameOverData.message}
              </p>

              {/* Prize amount */}
              <div className="mb-4">
                <div className="text-3xl font-semibold text-green-600 dark:text-green-400">
                  {formatPoints(currentAmount)}
                </div>
              </div>
            </div>

            {/* Stats card */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 mb-6">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {gameOverData.stats}
              </p>
            </div>

            <button
              onClick={newGame}
              className="w-full px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            >
              <span>{t.continueJourney}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}