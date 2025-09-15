export type Language = 'en' | 'hi';

export interface GameTranslations {
  // UI Elements
  title: string;
  subtitle: string;
  description: string;
  categories: string;
  beginJourney: string;
  newGame: string;
  walkAway: string;
  continueJourney: string;

  // Game Elements
  prizeLadder: string;
  question: string;
  questionsAnswered: string;
  currentStreak: string;
  bestScore: string;
  wisdomLevel: string;

  // Lifelines
  fiftyFifty: string;
  askGuru: string;
  divineBlessings: string;
  ancientWisdom: string;

  // Game Messages
  timeUp: string;
  incorrect: string;
  youLeaveWith: string;
  walkAwayConfirm: string;
  lifelineUsed: string;

  // Game Over Messages
  cosmicEnlightenment: string;
  cosmicEnlightenmentMsg: string;
  wiseRetreat: string;
  wiseRetreatMsg: string;
  journeyComplete: string;
  spiritualJourney: string;
  spiritualJourneyMsg: string;

  // Loading
  consultingForces: string;

  // Categories
  vedicAstrology: string;
  hinduGods: string;
  sacredTexts: string;
  festivals: string;

  // Difficulties
  easy: string;
  medium: string;
  hard: string;

  // Welcome Screen
  welcomeTitle: string;
  welcomeDescription: string;
}

export const translations: Record<Language, GameTranslations> = {
  en: {
    // UI Elements
    title: "ॐ Hindu Wisdom Millionaire ॐ",
    subtitle: "Journey Through Ancient Knowledge & Sacred Wisdom",
    description: "Vedic Astrology • Hindu Mythology • Gods & Goddesses • Scriptures • Culture",
    categories: "Test Your Sacred Knowledge",
    beginJourney: "Begin Journey",
    newGame: "New Game",
    walkAway: "Walk Away",
    continueJourney: "Continue Journey",

    // Game Elements
    prizeLadder: "Prize Ladder",
    question: "Question",
    questionsAnswered: "Questions Answered",
    currentStreak: "Current Streak",
    bestScore: "Best Score",
    wisdomLevel: "Wisdom Level",

    // Lifelines
    fiftyFifty: "50:50",
    askGuru: "Ask the Sage",
    divineBlessings: "Divine Blessings",
    ancientWisdom: "Ancient Wisdom",

    // Game Messages
    timeUp: "Time's up!",
    incorrect: "Incorrect!",
    youLeaveWith: "You leave with",
    walkAwayConfirm: "Are you sure you want to walk away with",
    lifelineUsed: "50:50 Lifeline Used! Two incorrect answers have been removed.",

    // Game Over Messages
    cosmicEnlightenment: "🏆 Cosmic Enlightenment Achieved!",
    cosmicEnlightenmentMsg: "You have transcended all levels of knowledge and achieved supreme wisdom!",
    wiseRetreat: "🚶 Wise Retreat!",
    wiseRetreatMsg: "Like a true sage, you knew when to preserve your spiritual wealth.",
    journeyComplete: "🌟 Journey Complete",
    spiritualJourney: "📿 Spiritual Journey Continues",
    spiritualJourneyMsg: "Every end is a new beginning in the cycle of learning.",

    // Loading
    consultingForces: "Consulting the cosmic forces and ancient sages...",

    // Categories
    vedicAstrology: "📿 Vedic Astrology & Nakshatras",
    hinduGods: "🕉️ Hindu Gods & Goddesses",
    sacredTexts: "📜 Sacred Scriptures & Texts",
    festivals: "🌺 Hindu Festivals & Traditions",

    // Difficulties
    easy: "EASY",
    medium: "MEDIUM",
    hard: "HARD",

    // Welcome Screen
    welcomeTitle: "Welcome to Hindu Wisdom Millionaire! 🙏",
    welcomeDescription: "Test your knowledge of Vedic astrology, Hindu mythology, sacred texts, gods and goddesses, and ancient wisdom. Journey through 15 challenging questions to reach enlightenment and cosmic wealth!"
  },

  hi: {
    // UI Elements
    title: "ॐ हिंदू ज्ञान करोड़पति ॐ",
    subtitle: "प्राचीन ज्ञान और पवित्र बुद्धि की यात्रा",
    description: "वैदिक ज्योतिष • हिंदू पुराण • देवी देवता • शास्त्र • संस्कृति",
    categories: "अपने पवित्र ज्ञान का परीक्षण करें",
    beginJourney: "यात्रा प्रारंभ करें",
    newGame: "नया खेल",
    walkAway: "छोड़कर जाएं",
    continueJourney: "यात्रा जारी रखें",

    // Game Elements
    prizeLadder: "पुरस्कार सीढ़ी",
    question: "प्रश्न",
    questionsAnswered: "उत्तरित प्रश्न",
    currentStreak: "वर्तमान श्रृंखला",
    bestScore: "सर्वोत्तम स्कोर",
    wisdomLevel: "ज्ञान स्तर",

    // Lifelines
    fiftyFifty: "५०:५०",
    askGuru: "गुरु से पूछें",
    divineBlessings: "दिव्य आशीर्वाद",
    ancientWisdom: "प्राचीन ज्ञान",

    // Game Messages
    timeUp: "समय समाप्त!",
    incorrect: "गलत!",
    youLeaveWith: "आप के साथ जाते हैं",
    walkAwayConfirm: "क्या आप वाकई छोड़कर जाना चाहते हैं",
    lifelineUsed: "५०:५० जीवनरेखा का उपयोग किया गया! दो गलत उत्तर हटा दिए गए।",

    // Game Over Messages
    cosmicEnlightenment: "🏆 ब्रह्मांडीय ज्ञान प्राप्त!",
    cosmicEnlightenmentMsg: "आपने ज्ञान के सभी स्तरों को पार कर सर्वोच्च बुद्धि प्राप्त की है!",
    wiseRetreat: "🚶 बुद्धिमान वापसी!",
    wiseRetreatMsg: "एक सच्चे ऋषि की तरह, आप जानते थे कि अपनी आध्यात्मिक संपदा कैसे संरक्षित करनी है।",
    journeyComplete: "🌟 यात्रा पूर्ण",
    spiritualJourney: "📿 आध्यात्मिक यात्रा जारी",
    spiritualJourneyMsg: "हर अंत सीखने के चक्र में एक नई शुरुआत है।",

    // Loading
    consultingForces: "ब्रह्मांडीय शक्तियों और प्राचीन ऋषियों से सलाह ली जा रही है...",

    // Categories
    vedicAstrology: "📿 वैदिक ज्योतिष और नक्षत्र",
    hinduGods: "🕉️ हिंदू देवी देवता",
    sacredTexts: "📜 पवित्र शास्त्र और ग्रंथ",
    festivals: "🌺 हिंदू त्योहार और परंपराएं",

    // Difficulties
    easy: "आसान",
    medium: "मध्यम",
    hard: "कठिन",

    // Welcome Screen
    welcomeTitle: "हिंदू ज्ञान करोड़पति में आपका स्वागत है! 🙏",
    welcomeDescription: "वैदिक ज्योतिष, हिंदू पुराण, पवित्र ग्रंथों, देवी-देवताओं और प्राचीन ज्ञान के अपने ज्ञान का परीक्षण करें। ज्ञान और ब्रह्मांडीय संपदा तक पहुंचने के लिए 15 चुनौतीपूर्ण प्रश्नों की यात्रा करें!"
  }
};

export const getTranslation = (language: Language): GameTranslations => {
  return translations[language];
};