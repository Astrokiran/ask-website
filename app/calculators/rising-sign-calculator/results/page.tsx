"use client"

import { useState, useEffect } from 'react'
import { NavBar } from '@/components/nav-bar'
import { Footer } from '@/components/footer'
import { Sunrise, User, Calendar, Clock, MapPin, Eye, Sparkles, TrendingUp, AlertCircle, Flame, Crown, Target } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface StoredData {
  name: string
  dateOfBirth: string
  timeOfBirth: string
  placeOfBirth: string
  risingSign: string
  risingSignDegree: number
  planets: any[]
}

interface RisingSignTraits {
  symbol: string
  element: string
  modality: string
  rulingPlanet: string
  firstImpression: string
  detailedDescription: string
  physicalAppearance: string[]
  lifeApproach: string
  strengths: string[]
  challenges: string[]
  evolutionPath: string
  careerStyle: string
  relationshipStyle: string
  specialNote?: string
}

const RISING_SIGN_DATA: { [key: string]: RisingSignTraits } = {
  Aries: {
    symbol: '♈',
    element: 'Fire',
    modality: 'Cardinal',
    rulingPlanet: 'Mars',
    firstImpression: 'Bold, energetic, and confident. You come across as a natural leader who isn\'t afraid to take charge.',
    detailedDescription: 'Aries Rising gives you a warrior spirit and pioneering energy that others notice immediately. You lead with your head (literally and figuratively), often being the first to jump into new experiences. There\'s an undeniable rawness and authenticity to your presence—you don\'t hide behind masks. People see you as courageous, direct, and refreshingly honest. You have a youthful, almost childlike enthusiasm that never quite fades, regardless of your actual age. Your Mars-ruled ascendant makes you competitive by nature, always ready for a challenge. You live life at full throttle, and patience isn\'t your strongest suit. When you walk into a room, you bring a palpable energy that can be both inspiring and intimidating.',
    physicalAppearance: [
      'Strong, angular features with a prominent forehead or brow',
      'Athletic or lean build with good muscle definition',
      'Quick, energetic movements and purposeful stride',
      'Tendency toward redness in complexion, especially when excited',
      'Prominent or distinctive eyebrows',
      'Often appear younger than actual age',
      'Sharp, direct gaze that can be quite intense',
      'Prone to scars or marks on the face, especially near the forehead'
    ],
    lifeApproach: 'You approach life like a warrior approaching battle—with courage, directness, and urgency. You\'re a natural initiator who prefers action over contemplation. Your instinct is to face challenges head-on rather than sidestep them. You live in the moment and trust your gut reactions, often making quick decisions that others might agonize over for weeks.',
    strengths: [
      'Fearless courage and willingness to take risks',
      'Natural leadership abilities and pioneering spirit',
      'Authenticity and refreshing honesty',
      'High energy and enthusiasm for life',
      'Quick decision-making and action-oriented mindset',
      'Competitive drive that pushes you to excel',
      'Ability to inspire and motivate others',
      'Resilience and ability to bounce back from setbacks'
    ],
    challenges: [
      'Impulsiveness and tendency to act before thinking',
      'Short temper and difficulty controlling anger',
      'Impatience with slower processes or people',
      'Can come across as aggressive or intimidating',
      'Difficulty with follow-through on long-term projects',
      'Tendency to burn out from overexertion',
      'Struggle with listening and compromising',
      'May rush into situations without proper planning'
    ],
    evolutionPath: 'Your life journey is about learning to channel your immense energy wisely. You\'re here to develop patience, strategic thinking, and the understanding that sometimes slow and steady wins the race. Your challenge is to maintain your boldness while tempering it with wisdom and consideration for others. You\'ll evolve by learning when to charge ahead and when to pause and reflect.',
    careerStyle: 'You thrive in fast-paced, competitive environments where you can take initiative. Natural roles include entrepreneurship, athletics, military service, emergency response, sales, or any field requiring courage and quick decision-making. You need autonomy and don\'t do well with micromanagement.',
    relationshipStyle: 'You\'re passionate and direct in relationships, making your intentions clear from the start. You need a partner who can keep up with your energy and won\'t be intimidated by your strong personality. You value honesty and independence, and you\'re attracted to confidence. You love the chase and need constant excitement to stay engaged.',
    specialNote: '🔥 As an Aries Rising, you\'re the pioneer of the zodiac. Your Mars-ruled ascendant gives you exceptional courage and the ability to be a trailblazer. Remember: your greatest strength is your fearlessness, but your greatest growth comes from developing patience and strategic thinking. You inspire others simply by being unabashedly yourself.'
  },
  Leo: {
    symbol: '♌',
    element: 'Fire',
    modality: 'Fixed',
    rulingPlanet: 'Sun',
    firstImpression: 'Warm, confident, and magnetic. You light up a room and naturally command attention without even trying.',
    detailedDescription: 'Leo Rising gives you a regal presence and natural magnetism that draws people in like moths to a flame. You carry yourself with dignity and confidence, as if you\'re always aware that you\'re on stage (and in your mind, you are). There\'s a warmth and generosity to your energy that makes people feel special in your presence. Your Sun-ruled ascendant gives you a radiant quality—you literally seem to glow. You have a flair for the dramatic and love making grand gestures. You\'re born to be seen, admired, and appreciated. You don\'t apologize for taking up space or wanting recognition. People see you as generous, creative, and loyal. You have a playful, childlike quality mixed with noble bearing. Your entrance is never unnoticed, and you prefer it that way. You live life boldly and colorfully, refusing to fade into the background.',
    physicalAppearance: [
      'Full, thick, luxurious hair that\'s often your signature feature',
      'Broad shoulders and upright, proud posture',
      'Strong, expressive facial features, especially eyes',
      'Natural warmth and glow to the complexion',
      'Graceful, theatrical movements',
      'Tendency toward a fuller, more robust build',
      'Regal bearing and dignified walk',
      'Expressive, generous smile',
      'May have a mane-like quality to hair',
      'Often fond of jewelry, accessories, or dramatic fashion'
    ],
    lifeApproach: 'You approach life like royalty—with confidence, generosity, and flair. You believe life should be celebrated and enjoyed, not just endured. You\'re driven by a need for creative self-expression and recognition. You lead from the heart and inspire others through your warmth and enthusiasm. You see potential everywhere and encourage others to shine.',
    strengths: [
      'Natural charisma and magnetic presence',
      'Generous heart and willingness to help others shine',
      'Creative expression and artistic flair',
      'Loyalty and fierce protectiveness of loved ones',
      'Confidence and self-assurance',
      'Ability to inspire and uplift others',
      'Leadership through warmth rather than force',
      'Playfulness and joy for life',
      'Courage to be authentically yourself',
      'Natural performer who can captivate an audience'
    ],
    challenges: [
      'Need for constant admiration and validation',
      'Pride that makes it hard to admit mistakes',
      'Tendency toward drama and making mountains out of molehills',
      'Can be domineering or bossy',
      'Difficulty handling criticism or perceived slights',
      'May become sulky when not getting enough attention',
      'Extravagant spending on appearances',
      'Stubbornness when fixed on an idea',
      'Can overshadow others without realizing it'
    ],
    evolutionPath: 'Your journey is about learning to shine your light without needing constant external validation. You\'re here to develop authentic confidence that doesn\'t depend on applause or admiration. Your challenge is to be generous with the spotlight, helping others shine as brightly as you do. You\'ll evolve by learning that true leadership is about empowering others, not just being the star.',
    careerStyle: 'You thrive in creative fields, entertainment, leadership roles, or anywhere you can express yourself dramatically. Natural careers include acting, directing, entrepreneurship, luxury brand management, event planning, or any role that puts you center stage. You need recognition for your contributions and work that allows creative freedom.',
    relationshipStyle: 'You\'re romantic, passionate, and generous in love. You treat your partner like royalty and expect the same in return. You need admiration and frequent affirmation of love. You\'re fiercely loyal and protective. Grand romantic gestures are your love language. You need a partner who appreciates your dramatic flair and isn\'t intimidated by your strong presence.',
    specialNote: '👑 As a Leo Rising, you\'re the royal of the zodiac. Your Sun-ruled ascendant gives you exceptional warmth and magnetism. Remember: your greatest strength is your ability to make others feel special and inspire them to greatness. Your greatest growth comes from learning that true confidence doesn\'t need constant validation. You\'re here to remind the world that it\'s okay to be bold, colorful, and unapologetically yourself.'
  },
  Sagittarius: {
    symbol: '♐',
    element: 'Fire',
    modality: 'Mutable',
    rulingPlanet: 'Jupiter',
    firstImpression: 'Adventurous, optimistic, and free-spirited. You come across as worldly, philosophical, and always ready for the next adventure.',
    detailedDescription: 'Sagittarius Rising gives you an expansive, optimistic energy that others find contagious and liberating. You have a restless spirit and wandering eyes, always looking toward the horizon for the next great adventure or truth to discover. There\'s a casualness and authenticity to your presence—you don\'t put on airs. You\'re the eternal student and teacher of the zodiac, always seeking knowledge and eager to share what you\'ve learned. Your Jupiter-ruled ascendant makes you naturally lucky and blessed with good timing. You approach life with humor, enthusiasm, and a refreshing lack of pretense. People see you as wise beyond your years, philosophical, and endlessly curious. You have a talent for seeing the bigger picture and helping others broaden their perspectives. You\'re honest to a fault, sometimes saying exactly what you think without a filter. There\'s something untamed about you—you can\'t be caged or controlled. You exude freedom and inspire others to live more boldly.',
    physicalAppearance: [
      'Long limbs and athletic build',
      'Open, friendly facial expression',
      'Bright, optimistic eyes that sparkle with enthusiasm',
      'Tendency toward height or long torso',
      'Casual, comfortable style (often sporty or bohemian)',
      'Expressive gestures and animated communication',
      'Wide, genuine smile',
      'Strong, well-defined thighs and hips',
      'Natural, minimalistic approach to grooming',
      'Restless energy that\'s visible in constant movement'
    ],
    lifeApproach: 'You approach life as one grand adventure and philosophical quest. You\'re driven by a need for freedom, truth, and expansion. You see possibilities everywhere and rarely let fear hold you back. You learn through direct experience and aren\'t content with secondhand knowledge. You believe in living fully and authentically, following your truth wherever it leads.',
    strengths: [
      'Infectious optimism and positive outlook',
      'Adventurous spirit and willingness to explore',
      'Philosophical depth and wisdom',
      'Honesty and straightforward communication',
      'Ability to see the bigger picture',
      'Natural teaching ability and love of sharing knowledge',
      'Adaptability and openness to change',
      'Good humor and ability to laugh at yourself',
      'Lucky timing and fortunate opportunities',
      'Inspirational vision that motivates others'
    ],
    challenges: [
      'Brutally honest without considering others\' feelings',
      'Restlessness and difficulty with commitment',
      'Tendency to over-promise and under-deliver',
      'Can be preachy or self-righteous',
      'Difficulty with details and follow-through',
      'May run away from problems rather than face them',
      'Excess in indulgences (food, drink, spending)',
      'Can be careless with others\' possessions or feelings',
      'Avoid mundane responsibilities in favor of excitement',
      'Sometimes too blunt or tactless'
    ],
    evolutionPath: 'Your life journey is about learning to balance freedom with responsibility, and honesty with tact. You\'re here to develop the wisdom to know when to wander and when to commit, when to speak your truth and when to hold back. Your challenge is to ground your expansive vision in practical reality. You\'ll evolve by learning that true freedom includes taking responsibility for your impact on others.',
    careerStyle: 'You thrive in fields involving travel, education, philosophy, publishing, international business, or outdoor adventures. Natural roles include professor, travel writer, tour guide, motivational speaker, consultant, or entrepreneur. You need variety, freedom, and work that has meaning beyond just making money. You can\'t tolerate micromanagement or rigid structures.',
    relationshipStyle: 'You need a partner who\'s also your best friend and adventure companion. You value freedom and honesty above all else. You\'re commitment-phobic until you find someone who doesn\'t try to cage you. You need intellectual stimulation and shared adventures. You\'re honest about your needs and expect the same. You\'re fun-loving and keep relationships exciting.',
    specialNote: '🏹 As a Sagittarius Rising, you\'re the philosopher and adventurer of the zodiac. Your Jupiter-ruled ascendant gives you exceptional optimism and good fortune. Remember: your greatest strength is your ability to see possibilities and inspire others to think bigger. Your greatest growth comes from learning that true freedom includes responsibility and that honesty should be tempered with compassion. You\'re here to remind the world that life is meant to be an adventure.'
  },
  Taurus: {
    symbol: '♉',
    element: 'Earth',
    modality: 'Fixed',
    rulingPlanet: 'Venus',
    firstImpression: 'Calm, steady, and grounded. You exude a peaceful, sensual presence that puts others at ease.',
    detailedDescription: 'Taurus Rising gives you an earthy, reliable presence that others find comforting and reassuring. You move through life with deliberate grace, never rushed or frantic. There\'s a sensuality to your presence—you appreciate beauty, comfort, and the pleasures of the physical world. You have a calming effect on others and create stability wherever you go.',
    physicalAppearance: [
      'Strong, stocky build with good bone structure',
      'Full lips and attractive facial features',
      'Thick hair and beautiful skin',
      'Graceful movements despite solid build',
      'Warm, pleasant voice',
      'Tendency to gain weight easily',
      'Strong neck and shoulders',
      'Natural elegance in style'
    ],
    lifeApproach: 'You approach life slowly and steadily, valuing security and comfort. You build your world carefully and don\'t rush into changes. You trust your senses and value tangible results over abstract theories.',
    strengths: [
      'Reliability and dependability',
      'Patience and persistence',
      'Appreciation for beauty and quality',
      'Practical wisdom',
      'Calming presence',
      'Strong work ethic',
      'Loyalty and dedication'
    ],
    challenges: [
      'Stubbornness and resistance to change',
      'Materialism and possessiveness',
      'Slow to start and difficult to motivate',
      'Can be overly cautious',
      'Tendency toward indulgence',
      'Difficulty letting go'
    ],
    evolutionPath: 'You\'re learning to balance stability with flexibility, and comfort with growth. Your journey involves opening to change while maintaining your core strength.',
    careerStyle: 'You excel in fields involving finance, art, design, agriculture, real estate, or luxury goods. You need security and tangible rewards for your efforts.',
    relationshipStyle: 'You\'re loyal, sensual, and seek long-term commitment. You show love through physical touch and providing comfort. You need stability and dislike drama.'
  },
  Gemini: {
    symbol: '♊',
    element: 'Air',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    firstImpression: 'Witty, curious, and communicative. You come across as clever, friendly, and endlessly interesting.',
    detailedDescription: 'Gemini Rising gives you a youthful, adaptable energy that keeps others engaged. You\'re naturally curious about everything and everyone. Your quick mind and communication skills make you a fascinating conversationalist. There\'s a lightness and playfulness to your presence that puts people at ease.',
    physicalAppearance: [
      'Youthful appearance that defies age',
      'Expressive hands and gestures',
      'Quick, darting eyes',
      'Slender, agile build',
      'Animated facial expressions',
      'Restless energy',
      'Often appears younger than actual age'
    ],
    lifeApproach: 'You approach life with curiosity and flexibility. You gather information from everywhere and adapt quickly to new situations. You need variety and mental stimulation to feel alive.',
    strengths: [
      'Quick wit and intelligence',
      'Excellent communication skills',
      'Adaptability and versatility',
      'Social charm',
      'Learning ability',
      'Multi-tasking capability'
    ],
    challenges: [
      'Scattered energy and lack of focus',
      'Superficiality in relationships',
      'Difficulty with commitment',
      'Nervous energy and anxiety',
      'Too much talking, not enough listening',
      'Inconsistency'
    ],
    evolutionPath: 'You\'re learning to focus your brilliant mind and go deeper rather than wider. Your journey involves developing follow-through and emotional depth.',
    careerStyle: 'You thrive in communication-based fields: journalism, teaching, sales, marketing, writing, or social media. You need mental stimulation and variety.',
    relationshipStyle: 'You need mental connection above all. You show love through conversation and shared interests. You need a partner who can keep up with your quick mind.'
  },
  Cancer: {
    symbol: '♋',
    element: 'Water',
    modality: 'Cardinal',
    rulingPlanet: 'Moon',
    firstImpression: 'Nurturing, protective, and emotionally intuitive. You come across as caring and empathetic.',
    detailedDescription: 'Cancer Rising gives you a gentle, protective presence that others find comforting. You lead with your emotions and intuition, picking up on the feelings of those around you. There\'s a maternal quality to your energy, regardless of gender. You create safe spaces wherever you go.',
    physicalAppearance: [
      'Round, soft facial features',
      'Prominent chest area',
      'Gentle, kind eyes',
      'Tendency toward fuller figure',
      'Changeable expressions based on emotions',
      'Soft, smooth skin',
      'Protective, closed-off body language when uncomfortable'
    ],
    lifeApproach: 'You approach life through emotions and intuition. You need to feel safe before opening up. You build protective shells around yourself and those you love.',
    strengths: [
      'Deep empathy and emotional intelligence',
      'Nurturing and caring nature',
      'Strong intuition',
      'Loyalty and protectiveness',
      'Creating emotional security',
      'Memory and connection to the past'
    ],
    challenges: [
      'Overly sensitive and easily hurt',
      'Moody and emotionally reactive',
      'Difficulty letting go of the past',
      'Tendency to retreat into shell',
      'Can be clingy or smothering',
      'Passive-aggressive behavior'
    ],
    evolutionPath: 'You\'re learning to protect yourself without closing off completely, and to nurture without losing yourself. Your journey involves balancing emotional sensitivity with strength.',
    careerStyle: 'You excel in caring professions: nursing, counseling, teaching, hospitality, real estate, or any role involving emotional support and creating safe spaces.',
    relationshipStyle: 'You\'re deeply devoted and seek emotional security. You show love through nurturing and creating home. You need reassurance and emotional connection.'
  },
  Virgo: {
    symbol: '♍',
    element: 'Earth',
    modality: 'Mutable',
    rulingPlanet: 'Mercury',
    firstImpression: 'Precise, helpful, and analytical. You come across as intelligent, modest, and detail-oriented.',
    detailedDescription: 'Virgo Rising gives you a refined, analytical presence. You notice details others miss and have a practical approach to life. There\'s a modest, unassuming quality to you, yet you\'re incredibly competent. You have a service-oriented nature and find satisfaction in being useful.',
    physicalAppearance: [
      'Clean, neat, well-groomed appearance',
      'Delicate, precise features',
      'Often smaller frame or petite build',
      'Nervous energy',
      'Expressive, intelligent eyes',
      'Natural, understated beauty',
      'Youthful appearance'
    ],
    lifeApproach: 'You approach life analytically, always seeking to improve and perfect. You value efficiency and practicality. You serve others through problem-solving and attention to detail.',
    strengths: [
      'Attention to detail and precision',
      'Analytical thinking',
      'Practical problem-solving',
      'Service-oriented nature',
      'Health consciousness',
      'Organization and efficiency',
      'Humility and modesty'
    ],
    challenges: [
      'Perfectionism and self-criticism',
      'Worry and anxiety',
      'Overly critical of others',
      'Difficulty relaxing',
      'Can be fussy or nit-picky',
      'Analysis paralysis'
    ],
    evolutionPath: 'You\'re learning to accept imperfection in yourself and others, and to see the forest beyond the trees. Your journey involves balancing precision with compassion.',
    careerStyle: 'You excel in fields requiring attention to detail: healthcare, editing, research, accounting, nutrition, or quality control. You need meaningful work that helps others.',
    relationshipStyle: 'You show love through acts of service and practical support. You need mental connection and someone who appreciates your efforts. You\'re loyal and devoted once committed.'
  },
  Libra: {
    symbol: '♎',
    element: 'Air',
    modality: 'Cardinal',
    rulingPlanet: 'Venus',
    firstImpression: 'Charming, diplomatic, and graceful. You come across as pleasant, fair-minded, and socially adept.',
    detailedDescription: 'Libra Rising gives you a graceful, harmonious presence that draws people in. You have natural social skills and an ability to make everyone feel comfortable. There\'s an elegance to your mannerisms and an appreciation for beauty in all forms. You seek balance and fairness in all interactions.',
    physicalAppearance: [
      'Symmetrical, balanced features',
      'Natural grace and poise',
      'Attractive, pleasant appearance',
      'Dimples or charming smile',
      'Well-proportioned build',
      'Excellent fashion sense',
      'Soft, harmonious energy'
    ],
    lifeApproach: 'You approach life seeking harmony, partnership, and beauty. You\'re a natural diplomat who sees all sides of situations. You need balance and fair treatment for everyone.',
    strengths: [
      'Diplomatic and fair-minded',
      'Social grace and charm',
      'Ability to see multiple perspectives',
      'Aesthetic sense and appreciation for beauty',
      'Partnership skills',
      'Peacekeeping abilities'
    ],
    challenges: [
      'Indecisiveness and people-pleasing',
      'Avoidance of conflict',
      'Dependency on partnerships',
      'Superficiality',
      'Difficulty being alone',
      'Can be passive-aggressive'
    ],
    evolutionPath: 'You\'re learning to make decisions independently and express your true self even when it creates disharmony. Your journey involves finding balance between your needs and others\'.',
    careerStyle: 'You thrive in roles involving relationships, aesthetics, or justice: law, design, counseling, diplomacy, art, or public relations. You need harmonious work environments.',
    relationshipStyle: 'You define yourself through relationships and need partnership to feel complete. You\'re romantic, fair, and seek equality. You show love through thoughtfulness and attention.'
  },
  Scorpio: {
    symbol: '♏',
    element: 'Water',
    modality: 'Fixed',
    rulingPlanet: 'Pluto (Mars)',
    firstImpression: 'Intense, magnetic, and mysterious. You come across as powerful, penetrating, and somewhat enigmatic.',
    detailedDescription: 'Scorpio Rising gives you a powerful, magnetic presence that others find both fascinating and slightly intimidating. You have penetrating eyes and an aura of mystery. There\'s an intensity to everything you do—you don\'t do anything halfway. You see beneath surfaces and sense hidden truths.',
    physicalAppearance: [
      'Intense, penetrating eyes',
      'Strong, magnetic presence',
      'Sharp, striking features',
      'Powerful build',
      'Mysterious, closed-off demeanor',
      'Often dark coloring or dramatic features',
      'Compelling, hypnotic gaze'
    ],
    lifeApproach: 'You approach life seeking depth, truth, and transformation. You trust no one easily and investigate everything. You need to understand the hidden motivations behind surface appearances.',
    strengths: [
      'Emotional depth and intensity',
      'Investigative abilities',
      'Resilience and strength',
      'Loyalty and commitment',
      'Ability to transform',
      'Psychological insight',
      'Magnetic presence'
    ],
    challenges: [
      'Controlling and manipulative tendencies',
      'Jealousy and possessiveness',
      'Difficulty trusting',
      'Holding grudges',
      'Intensity that overwhelms others',
      'Secretiveness'
    ],
    evolutionPath: 'You\'re learning to trust and let go of control, and to use your power for healing rather than manipulation. Your journey involves death and rebirth of the ego.',
    careerStyle: 'You excel in fields involving investigation, psychology, research, surgery, crisis management, or transformation. You need depth and meaningful work that uncovers truth.',
    relationshipStyle: 'You\'re intensely loyal and need deep emotional and physical connection. You show love through fierce devotion and protection. You need complete honesty and trust.'
  },
  Capricorn: {
    symbol: '♑',
    element: 'Earth',
    modality: 'Cardinal',
    rulingPlanet: 'Saturn',
    firstImpression: 'Serious, responsible, and ambitious. You come across as mature, competent, and goal-oriented.',
    detailedDescription: 'Capricorn Rising gives you a serious, authoritative presence. You carry yourself with dignity and professionalism. There\'s a timeless quality to you—you seem old when young and grow younger with age. You project competence and reliability.',
    physicalAppearance: [
      'Strong bone structure',
      'Mature, serious expression',
      'Often appear older when young',
      'Angular, defined features',
      'Lean, disciplined build',
      'Professional, classic style',
      'Prominent cheekbones or jaw'
    ],
    lifeApproach: 'You approach life with ambition and discipline. You set long-term goals and work steadily toward them. You value achievement, responsibility, and traditional structures.',
    strengths: [
      'Ambition and determination',
      'Discipline and self-control',
      'Responsibility and reliability',
      'Strategic thinking',
      'Patience and persistence',
      'Leadership through competence',
      'Respect for tradition'
    ],
    challenges: [
      'Overly serious and pessimistic',
      'Workaholic tendencies',
      'Difficulty showing emotions',
      'Harsh self-criticism',
      'Can be cold or distant',
      'Status-conscious'
    ],
    evolutionPath: 'You\'re learning to balance ambition with emotional warmth, and success with personal fulfillment. Your journey involves softening your rigid structures while maintaining your strength.',
    careerStyle: 'You excel in business, management, finance, government, or any field requiring long-term planning and authority. You need clear goals and advancement opportunities.',
    relationshipStyle: 'You take relationships seriously and seek committed partnerships. You show love through responsibility and providing security. You need respect and loyalty.'
  },
  Aquarius: {
    symbol: '♒',
    element: 'Air',
    modality: 'Fixed',
    rulingPlanet: 'Uranus (Saturn)',
    firstImpression: 'Unique, eccentric, and progressive. You come across as intellectual, unconventional, and humanitarian.',
    detailedDescription: 'Aquarius Rising gives you an unconventional, futuristic presence. You march to your own drum and don\'t follow trends—you set them. There\'s something quirky and unique about you that makes you memorable. You value individuality and freedom above all.',
    physicalAppearance: [
      'Unusual or distinctive features',
      'Tall or statuesque build',
      'Eccentric fashion sense',
      'Friendly but detached expression',
      'Often attracted to unusual hairstyles or colors',
      'Electric, nervous energy',
      'Unique personal style'
    ],
    lifeApproach: 'You approach life as an individual and innovator. You question everything and refuse to conform. You\'re driven by humanitarian ideals and need to contribute to collective progress.',
    strengths: [
      'Originality and innovation',
      'Humanitarian values',
      'Intellectual brilliance',
      'Acceptance of differences',
      'Visionary thinking',
      'Friendship and community building',
      'Progressive mindset'
    ],
    challenges: [
      'Emotional detachment',
      'Rebelliousness for its own sake',
      'Difficulty with intimacy',
      'Stubborn in beliefs',
      'Can be cold or aloof',
      'Unpredictable'
    ],
    evolutionPath: 'You\'re learning to balance your need for freedom with emotional connection, and individuality with belonging. Your journey involves using innovation for humanity\'s benefit.',
    careerStyle: 'You thrive in technology, science, social causes, innovation, or unconventional fields. You need freedom, intellectual stimulation, and work that contributes to progress.',
    relationshipStyle: 'You need friendship and mental connection before romance. You value freedom and need space. You show love through intellectual sharing and supporting independence.'
  },
  Pisces: {
    symbol: '♓',
    element: 'Water',
    modality: 'Mutable',
    rulingPlanet: 'Neptune (Jupiter)',
    firstImpression: 'Dreamy, compassionate, and ethereal. You come across as gentle, artistic, and spiritually inclined.',
    detailedDescription: 'Pisces Rising gives you a soft, dreamy presence that seems almost otherworldly. You have a chameleon-like quality, adapting to your environment. There\'s a mystical, artistic quality to your energy. You\'re highly intuitive and emotionally receptive to everyone around you.',
    physicalAppearance: [
      'Soft, dreamy eyes',
      'Fluid, graceful movements',
      'Gentle, ethereal presence',
      'Often beautiful feet or interest in dance',
      'Changeable appearance',
      'Romantic, flowing style',
      'Sensitive, delicate features'
    ],
    lifeApproach: 'You approach life through intuition, imagination, and compassion. You feel everything deeply and have thin boundaries between yourself and others. You seek transcendence and spiritual meaning.',
    strengths: [
      'Deep compassion and empathy',
      'Artistic and creative talents',
      'Spiritual connection',
      'Intuition and psychic sensitivity',
      'Adaptability',
      'Selfless service',
      'Imagination'
    ],
    challenges: [
      'Boundary issues and escapism',
      'Victim mentality',
      'Difficulty with practical matters',
      'Absorbing others\' emotions',
      'Tendency toward addiction or fantasy',
      'Lack of grounding'
    ],
    evolutionPath: 'You\'re learning to maintain healthy boundaries while staying compassionate, and to ground your spiritual insights in practical reality. Your journey involves service without martyrdom.',
    careerStyle: 'You excel in healing arts, creativity, spirituality, counseling, or any field involving compassion and imagination. You need meaningful work that feeds your soul.',
    relationshipStyle: 'You merge completely with partners and need deep spiritual and emotional connection. You show love through empathy and sacrifice. You need someone who grounds you.'
  }
}

export default function RisingSignResults() {
  const router = useRouter()
  const [storedData, setStoredData] = useState<StoredData | null>(null)
  const [signData, setSignData] = useState<RisingSignTraits | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('risingSignCalculatorData')
    if (!data) {
      router.push('/calculators/rising-sign-calculator')
      return
    }

    const parsedData: StoredData = JSON.parse(data)
    setStoredData(parsedData)

    const traits = RISING_SIGN_DATA[parsedData.risingSign]
    if (traits) {
      setSignData(traits)
    } else {
      alert('Rising sign data not found')
      router.push('/calculators/rising-sign-calculator')
    }
  }, [router])

  if (!storedData || !signData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p>Loading your rising sign analysis...</p>
        </div>
      </div>
    )
  }

  const isFireSign = signData.element === 'Fire'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-4 sm:pt-6 md:pt-8">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
            <Link href="/calculators" className="hover:text-orange-600 dark:hover:text-orange-400">
              Calculators
            </Link>
            <span className="mx-2">/</span>
            <Link href="/calculators/rising-sign-calculator" className="hover:text-orange-600 dark:hover:text-orange-400">
              Rising Sign Calculator
            </Link>
            <span className="mx-2">/</span>
            <span>Results</span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Rising Sign Analysis
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
              How the world sees you and the energy you project
            </p>
          </div>

          {/* Birth Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.dateOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Time of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.timeOfBirth}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Place of Birth</p>
                  <p className="font-medium text-gray-900 dark:text-white">{storedData.placeOfBirth}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Rising Sign Card */}
          <div className={`rounded-xl border-2 p-8 mb-8 ${
            isFireSign
              ? 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-300 dark:border-orange-800'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{signData.symbol}</div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {storedData.risingSign} Rising
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                at {storedData.risingSignDegree.toFixed(2)}°
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {signData.element} Sign
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  {signData.modality}
                </span>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                  Ruled by {signData.rulingPlanet}
                </span>
              </div>
            </div>

            {isFireSign && (
              <div className="bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Flame className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-orange-900 dark:text-orange-100 mb-1">🔥 Fire Sign Rising</h3>
                    <p className="text-sm text-orange-800 dark:text-orange-200">
                      You have a dynamic, passionate, and inspiring presence. Fire rising signs are natural leaders who light up
                      any space they enter. Your energy is contagious and you inspire others to take action and live boldly.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* First Impression */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              First Impression
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {signData.firstImpression}
            </p>
          </div>

          {/* Detailed Description */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Your Rising Sign Energy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {signData.detailedDescription}
            </p>
          </div>

          {/* Special Note for Fire Signs */}
          {signData.specialNote && (
            <div className={`rounded-xl border-2 p-6 mb-8 ${
              isFireSign
                ? 'bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 border-orange-300 dark:border-orange-700'
                : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
            }`}>
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                {signData.specialNote}
              </p>
            </div>
          )}

          {/* Physical Appearance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Physical Appearance & Mannerisms
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Rising signs often influence how you look and carry yourself:
            </p>
            <ul className="space-y-2">
              {signData.physicalAppearance.map((trait, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 dark:bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700 dark:text-gray-300">{trait}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Life Approach */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              Your Approach to Life
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {signData.lifeApproach}
            </p>
          </div>

          {/* Strengths & Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {signData.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    <span className="text-gray-700 dark:text-gray-300">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                Growth Areas
              </h3>
              <ul className="space-y-2">
                {signData.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Evolution Path */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              Your Evolution Path
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {signData.evolutionPath}
            </p>
          </div>

          {/* Career & Relationship Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Career Style</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {signData.careerStyle}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Relationship Style</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {signData.relationshipStyle}
              </p>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
              <Sunrise className="w-5 h-5" />
              Understanding Your Rising Sign
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Your rising sign is your "mask"—the personality you wear when meeting new people or entering new situations.
              It\'s not fake; it\'s your natural defense mechanism and the way you navigate the world. Over time, you grow into
              your rising sign qualities more fully. While your Sun sign is who you are at your core, your rising sign is how
              you present that core to the world. Together with your Moon sign (emotional nature), these three signs form the
              foundation of your astrological identity.
            </p>
          </div>

          {/* Calculate Again Button */}
          <div className="text-center mb-8">
            <Link
              href="/calculators/rising-sign-calculator"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Calculate for Another Person
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
