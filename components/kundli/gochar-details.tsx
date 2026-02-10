import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Sparkles, Star, Calendar, Info, ChevronLeft, ChevronRight } from 'lucide-react';

// Gochar API Interfaces
interface GocharCurrentTransit {
  planet: string;
  current_sign: string;
  current_degree: number;
  house_from_moon: number;
  house_from_lagna: number;
  nature: 'excellent' | 'good' | 'neutral' | 'challenging' | 'bad';
  effect_summary: string;
  detailed_effect: string;
  remedies: string[];
}

interface GocharOverallScore {
  favorable_planets: number;
  good_planets: number;
  neutral_planets: number;
  challenging_planets: number;
  total_planets: number;
  percentage: number;
  verdict: string;
  summary: string;
}

interface GocharLifeAspect {
  score: number;
  status: string;
  influencing_planets: string[];
  prediction: string;
  detailed_prediction: string;
  best_for: string[];
  avoid: string[];
  recommendations: string[];
}

interface GocharLifeAspects {
  career: GocharLifeAspect;
  finance: GocharLifeAspect;
  relationships: GocharLifeAspect;
  health: GocharLifeAspect;
  education: GocharLifeAspect;
}

interface GocharSadeSati {
  is_active: boolean;
  name: string;
  phase: string;
  house: number;
  started: string;
  ends: string;
  description: string;
  detailed_description: string;
  remedies: string[];
  severity: string;
}

interface GocharSpecialTransitsNone {
  is_active: false;
  name: null;
  phase: null;
  house: null;
  started: null;
  ends: null;
  description: string;
  detailed_description: string;
  remedies: string[];
  severity: null;
}

interface GocharSpecialTransits {
  sade_sati?: GocharSadeSati;
  none?: GocharSpecialTransitsNone;
  [key: string]: any;
}

interface GocharRecommendations {
  do_this_month: string[];
  avoid_this_month: string[];
  general_advice: string[];
  remedies: string[];
  color_therapy: string;
  gemstone_suggestion: string;
  mantra_suggestion: string;
}

interface GocharAstrologerNotes {
  key_points: string[];
  priority_aspects: string[];
  technical_observations: string[];
  special_considerations: string[];
}

interface GocharData {
  analysis_date: string;
  reference_type: string;
  birth_chart_reference: {
    moon_sign: string;
    moon_sign_hindi: string;
    moon_lord: string;
    lagna_sign: string;
    lagna_sign_hindi: string;
    lagna_lord: string;
  };
  current_transits: { [key: string]: GocharCurrentTransit };
  overall_score: GocharOverallScore;
  life_aspects: GocharLifeAspects;
  special_transits: GocharSpecialTransits;
  upcoming_transits: any[];
  recommendations: GocharRecommendations;
  astrologer_notes: GocharAstrologerNotes;
  error?: string; // For date range API error responses
}

interface GocharDateRangeData {
  input: {
    name: string;
    date_of_birth: string;
    place_of_birth: string;
  };
  start_date: string;
  end_date: string;
  total_months: number;
  monthly_analyses: { [key: string]: GocharData };
}

interface GocharDetailsProps {
  gocharData: GocharData | null;
  gocharDateRangeData?: GocharDateRangeData | null;
  gocharPreviousDateRangeData?: GocharDateRangeData | null;
}

// Helper Components
const MonthSummaryCard: React.FC<{
  month: string;
  analysis: GocharData;
  onMonthClick: () => void;
}> = ({ month, analysis, onMonthClick }) => {
  const { t } = useTranslation();

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('EXCELLENT') || verdict.includes('FAVORABLE')) {
      return 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20';
    }
    if (verdict.includes('MODERATE') || verdict.includes('NEUTRAL')) {
      return 'border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20';
    }
    return 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20';
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 60) return 'text-green-600 dark:text-green-400';
    if (percentage >= 40) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 20) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (analysis.error) {
    return (
      <div className="p-4 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <p className="text-sm text-gray-600 dark:text-gray-400">{t('gochar.dataNotAvailable')}</p>
      </div>
    );
  }

  return (
    <div
      onClick={onMonthClick}
      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${getVerdictColor(analysis.overall_score.verdict)}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{formatDate(analysis.analysis_date)}</h4>
          <p className={`text-sm font-bold ${getScoreColor(analysis.overall_score.percentage)}`}>
            {analysis.overall_score.percentage}% {t('gochar.favorable')}
          </p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
          analysis.overall_score.verdict.includes('EXCELLENT') || analysis.overall_score.verdict.includes('FAVORABLE')
            ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
            : 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200'
        }`}>
          {analysis.overall_score.verdict.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Life Aspects Summary */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {Object.entries(analysis.life_aspects).slice(0, 4).map(([aspect, data]) => (
          <div key={aspect} className="bg-white/50 dark:bg-gray-800/50 p-2 rounded text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{aspect}</p>
            <p className={`text-sm font-bold ${
              data.score >= 60 ? 'text-green-600 dark:text-green-400' :
              data.score >= 40 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {data.score}%
            </p>
          </div>
        ))}
      </div>

      {/* Key Highlights */}
      <div className="bg-white/70 dark:bg-gray-800/70 p-3 rounded-lg">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('gochar.keyHighlights')}</p>
        <ul className="space-y-1">
          {analysis.astrologer_notes.key_points.slice(0, 2).map((point, idx) => (
            <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">• {point}</li>
          ))}
          <li className="text-xs text-gray-600 dark:text-gray-400">• {analysis.overall_score.summary}</li>
        </ul>
      </div>

      {/* Sade Sati Alert */}
      {analysis.special_transits?.sade_sati?.is_active && (
        <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg border border-red-300 dark:border-red-700">
          <p className="text-xs font-bold text-red-700 dark:text-red-400">
            ⚠️ {analysis.special_transits.sade_sati.phase}
          </p>
        </div>
      )}
    </div>
  );
};

const DetailedMonthView: React.FC<{
  month: string;
  analysis: GocharData;
}> = ({ month, analysis }) => {
  const { t } = useTranslation();

  const getNatureColor = (nature: string) => {
    switch (nature) {
      case 'excellent':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'good':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'neutral':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'challenging':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'bad':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-700';
    }
  };

  const getNatureIcon = (nature: string) => {
    switch (nature) {
      case 'excellent':
      case 'good':
        return <TrendingUp className="h-4 w-4" />;
      case 'bad':
      case 'challenging':
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict.includes('EXCELLENT') || verdict.includes('FAVORABLE')) {
      return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    }
    if (verdict.includes('CHALLENGING') || verdict.includes('DIFFICULT')) {
      return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
    }
    return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (analysis.error) {
    return (
      <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 dark:text-gray-400">{analysis.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Month Header */}
      <div className={`p-4 rounded-xl border-2 ${getVerdictColor(analysis.overall_score.verdict)}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{formatDate(analysis.analysis_date)}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{analysis.reference_type.replace('_', ' ')} {t('gochar.analysisType')}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{analysis.overall_score.percentage}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('gochar.favorable')}</p>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className={`p-4 rounded-xl border ${getVerdictColor(analysis.overall_score.verdict)}`}>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          <div className="bg-white dark:bg-gray-800 p-2 rounded">
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {analysis.overall_score.favorable_planets + analysis.overall_score.good_planets}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('gochar.favorable')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded">
            <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">{analysis.overall_score.neutral_planets}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('gochar.neutral')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-2 rounded">
            <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{analysis.overall_score.challenging_planets}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('gochar.challenging')}</p>
          </div>
          <div className="col-span-2 bg-white dark:bg-gray-800 p-2 rounded">
            <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{analysis.overall_score.total_planets}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{t('gochar.totalPlanets')}</p>
          </div>
        </div>
      </div>

      {/* Overall Summary */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('gochar.overallSummary')}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.overall_score.summary}</p>
      </div>

      {/* Life Aspects */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('gochar.lifeAspects')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(analysis.life_aspects).map(([aspect, data]) => (
            <div key={aspect} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 dark:text-white capitalize">{aspect}</h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                  data.score >= 60 ? 'bg-green-200 text-green-800' :
                  data.score >= 40 ? 'bg-yellow-200 text-yellow-800' :
                  'bg-red-200 text-red-800'
                }`}>
                  {data.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 mr-2">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        data.score >= 60 ? 'bg-green-500' :
                        data.score >= 40 ? 'bg-yellow-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${data.score}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  data.score >= 60 ? 'text-green-600' :
                  data.score >= 40 ? 'text-yellow-600' :
                  'text-orange-600'
                }`}>
                  {data.score}%
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {t('gochar.influencing')} {data.influencing_planets.join(', ')}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">{data.prediction}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Planetary Transits */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('gochar.planetaryTransits')}</h3>
        <div className="space-y-2">
          {Object.entries(analysis.current_transits).map(([planetKey, transit]) => (
            <div key={planetKey} className={`p-3 rounded-lg border ${getNatureColor(transit.nature)}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  {getNatureIcon(transit.nature)}
                  <span className="font-semibold text-gray-900 dark:text-white">{transit.planet}</span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getNatureColor(transit.nature)}`}>
                  {transit.nature}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('gochar.sign')}:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{transit.current_sign} ({transit.current_degree}°)</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">{t('gochar.fromMoon')}:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">{t('gochar.house')} {transit.house_from_moon}</span>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{transit.effect_summary}</p>
              {transit.remedies && transit.remedies.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{t('gochar.remedies')}</p>
                  <ul className="space-y-0.5">
                    {transit.remedies.slice(0, 2).map((remedy, idx) => (
                      <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">• {remedy}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t('gochar.recommendations')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">✓ {t('gochar.doThisMonth')}</h4>
            <ul className="space-y-1">
              {analysis.recommendations.do_this_month.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-700 dark:text-gray-300">• {item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">✗ {t('gochar.avoidThisMonth')}</h4>
            <ul className="space-y-1">
              {analysis.recommendations.avoid_this_month.map((item, idx) => (
                <li key={idx} className="text-xs text-gray-700 dark:text-gray-300">• {item}</li>
              ))}
            </ul>
          </div>
        </div>
        {analysis.recommendations.general_advice && analysis.recommendations.general_advice.length > 0 && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">{t('gochar.generalAdvice')}</h4>
            <ul className="space-y-1">
              {analysis.recommendations.general_advice.map((advice, idx) => (
                <li key={idx} className="text-xs text-gray-700 dark:text-gray-300">• {advice}</li>
              ))}
            </ul>
          </div>
        )}
        {analysis.recommendations.color_therapy && (
          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h4 className="font-medium text-purple-700 dark:text-purple-400 mb-1">{t('gochar.colorTherapy')}</h4>
            <p className="text-xs text-gray-700 dark:text-gray-300">{analysis.recommendations.color_therapy}</p>
          </div>
        )}
        {analysis.recommendations.mantra_suggestion && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <h4 className="font-medium text-amber-700 dark:text-amber-400 mb-1">{t('gochar.mantraSuggestion')}</h4>
            <p className="text-xs text-gray-700 dark:text-gray-300">{analysis.recommendations.mantra_suggestion}</p>
          </div>
        )}
      </div>

      {/* Special Transits - Sade Sati */}
      {analysis.special_transits?.sade_sati?.is_active && (
        <div className={`p-4 rounded-xl border-2 ${
          analysis.special_transits.sade_sati.severity === 'severe'
            ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
            : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
        }`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-5 w-5 mt-0.5 ${
              analysis.special_transits.sade_sati.severity === 'severe'
                ? 'text-red-600 dark:text-red-400'
                : 'text-orange-600 dark:text-orange-400'
            }`} />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {analysis.special_transits.sade_sati.name} - {analysis.special_transits.sade_sati.phase}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                House {analysis.special_transits.sade_sati.house} • {analysis.special_transits.sade_sati.started} to {analysis.special_transits.sade_sati.ends}
              </p>
              {analysis.special_transits.sade_sati.remedies && analysis.special_transits.sade_sati.remedies.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{t('gochar.remedies')}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{analysis.special_transits.sade_sati.remedies[0]}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Astrologer Notes */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
          <Info className="h-5 w-5 mr-2 text-orange-600 dark:text-orange-400" />
          {t('gochar.astrologerNotes')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{t('gochar.keyPoints')}</h4>
            <ul className="space-y-1">
              {analysis.astrologer_notes.key_points.map((point, idx) => (
                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">• {point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">{t('gochar.priorityAspects')}</h4>
            <ul className="space-y-1">
              {analysis.astrologer_notes.priority_aspects.map((aspect, idx) => (
                <li key={idx} className="text-xs text-gray-600 dark:text-gray-400">• {aspect}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const GocharDetails: React.FC<GocharDetailsProps> = ({ gocharData, gocharDateRangeData, gocharPreviousDateRangeData }) => {
  const { t } = useTranslation();
  const [selectedRange, setSelectedRange] = useState<'current' | '3months' | '6months' | '1year' | 'prev3months' | 'prev1year'>('current');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  if (!gocharData && !gocharDateRangeData) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <AlertTriangle className="h-12 w-12 text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">{t('gochar.noDataAvailable')}</p>
      </div>
    );
  }

  const getMonthlyData = () => {
    const isPreviousRange = selectedRange.startsWith('prev');
    const dataSource = isPreviousRange ? gocharPreviousDateRangeData : gocharDateRangeData;

    if (selectedRange === 'current' || !dataSource) {
      return null;
    }
    const allMonths = dataSource.monthly_analyses;
    const allMonthKeys = Object.keys(allMonths).sort((a, b) => {
      // Sort chronologically by date string (YYYY-MM format)
      return a.localeCompare(b);
    });

    // Filter out months with errors first
    const validMonthKeys = allMonthKeys.filter(key => !allMonths[key].error);

    // Then filter based on selected range
    let filteredMonthKeys: string[] = [];
    switch (selectedRange) {
      case '3months':
      case 'prev3months':
        filteredMonthKeys = validMonthKeys.slice(0, 3);
        break;
      case '6months':
        filteredMonthKeys = validMonthKeys.slice(0, 6);
        break;
      case '1year':
      case 'prev1year':
        filteredMonthKeys = validMonthKeys.slice(0, 12);
        break;
      default:
        filteredMonthKeys = validMonthKeys;
    }

    // Create filtered object with only valid months
    const filteredMonths: { [key: string]: GocharData } = {};
    filteredMonthKeys.forEach(key => {
      filteredMonths[key] = allMonths[key];
    });

    return filteredMonths;
  };

  const monthlyData = getMonthlyData();
  const monthKeys = monthlyData ? Object.keys(monthlyData).sort((a, b) => a.localeCompare(b)) : [];

  const currentViewData = selectedRange === 'current'
    ? gocharData
    : (selectedMonth && monthlyData ? monthlyData[selectedMonth] : null);

  const renderContent = () => {
    // Define these at function scope so they're accessible in JSX
    const isPreviousRange = selectedRange.startsWith('prev');
    const dataSource = isPreviousRange ? gocharPreviousDateRangeData : gocharDateRangeData;

    if (selectedRange === 'current') {
      if (!gocharData) {
        return (
          <div className="text-center py-10 text-gray-600 dark:text-gray-400">
            {t('gochar.noDataAvailable')}
          </div>
        );
      }
      return <DetailedMonthView month="current" analysis={gocharData} />;
    } else {
      // Date range view
      if (!monthlyData || monthKeys.length === 0) {
        return (
          <div className="text-center py-10 text-gray-600 dark:text-gray-400">
            {t('gochar.noDateRangeData')}
          </div>
        );
      }

      if (selectedMonth) {
        return (
          <div>
            <button
              onClick={() => setSelectedMonth(null)}
              className="mb-4 flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              {t('gochar.backToAllMonths')}
            </button>
            <DetailedMonthView month={selectedMonth} analysis={monthlyData[selectedMonth]} />
          </div>
        );
      } else {
        return (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t('gochar.showingMonths', {
                count: monthKeys.length,
                startDate: new Date((isPreviousRange ? gocharPreviousDateRangeData! : gocharDateRangeData!).start_date).toLocaleDateString(),
                endDate: new Date((isPreviousRange ? gocharPreviousDateRangeData! : gocharDateRangeData!).end_date).toLocaleDateString()
              })}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthKeys.map((monthKey) => (
                <div key={monthKey}>
                  <MonthSummaryCard
                    month={monthKey}
                    analysis={monthlyData[monthKey]}
                    onMonthClick={() => setSelectedMonth(monthKey)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-orange-600 dark:text-orange-400" />
              {t('gochar.title')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{t('gochar.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Time Range Tabs */}
      <div className="bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
        {/* Future range tabs */}
        <div className="mb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">{t('gochar.future')}</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'current' as const, label: t('gochar.current'), icon: Calendar },
              { key: '3months' as const, label: t('gochar.threeMonths'), icon: Calendar },
              { key: '6months' as const, label: t('gochar.sixMonths'), icon: Calendar },
              { key: '1year' as const, label: t('gochar.oneYear'), icon: Calendar },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => {
                  setSelectedRange(range.key);
                  setSelectedMonth(null);
                }}
                disabled={!gocharDateRangeData && range.key !== 'current'}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRange === range.key
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } ${(!gocharDateRangeData && range.key !== 'current') ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <range.icon className="h-4 w-4" />
                {range.label}
              </button>
            ))}
          </div>
        </div>
        {/* Past range tabs */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">{t('gochar.past')}</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'prev3months' as const, label: t('gochar.prevThreeMonths'), icon: Calendar },
              { key: 'prev1year' as const, label: t('gochar.prevOneYear'), icon: Calendar },
            ].map((range) => (
              <button
                key={range.key}
                onClick={() => {
                  setSelectedRange(range.key);
                  setSelectedMonth(null);
                }}
                disabled={!gocharPreviousDateRangeData}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRange === range.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                } ${!gocharPreviousDateRangeData ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <range.icon className="h-4 w-4" />
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
};

export default GocharDetails;
