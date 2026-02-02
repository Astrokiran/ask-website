"use client";

import React from "react";
import { useTranslation } from "react-i18next";

/* ------------------------------------------------------------------
 * Types for KP System API Response
 * ------------------------------------------------------------------ */

interface KPSystemPlanet {
  Planet: string;
  Cusp: number;
  Sign: string;
  Sign_Lord: string;
  Star_Lord: string;
  Sub_Lord: string;
}

interface KPSystemCusp {
  Cusp: number;
  Degree: number;
  Sign: string;
  Sign_Lord: string;
  Star_Lord: string;
  Sub_Lord: string;
}

interface KPRulingPlanetInfo {
  sign_lord: string;
  star_lord: string;
  sub_lord: string;
}

interface KPRulingPlanets {
  Mo: KPRulingPlanetInfo;
  Asc: KPRulingPlanetInfo;
  "Day Lord": {
    planet: string;
  };
}

interface KPHouseSignificator {
  strong: string[];
  medium: string[];
  weak: string[];
}

interface KPSystemHouseSignificators {
  [house: string]: KPHouseSignificator;
}

interface KPSystemData {
  birth_details: {
    name: string;
    date_of_birth: string;
    time_of_birth: string;
    place_of_birth: string;
  };
  kp_system: {
    planets_table: KPSystemPlanet[];
    cusps_table: KPSystemCusp[];
    ruling_planets: KPRulingPlanets;
    house_significators: KPSystemHouseSignificators;
    system: string;
  };
  bhava_chalit_svg?: string;
  status: string;
}

interface KPSystemDetailsProps {
  kpSystemData: KPSystemData | null;
}

/* ------------------------------------------------------------------
 * Main Component
 * ------------------------------------------------------------------ */

const KPSystemDetails: React.FC<KPSystemDetailsProps> = ({ kpSystemData }) => {
  const { t } = useTranslation();

  if (!kpSystemData || !kpSystemData.kp_system) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <p className="text-gray-600 dark:text-gray-400 text-center">KP System data not available.</p>
      </div>
    );
  }

  const { kp_system } = kpSystemData;
  const {
    planets_table,
    cusps_table,
    ruling_planets,
    house_significators,
  } = kp_system;

  return (
    <div className="space-y-6">
      {/* Bhava Chalit Chart */}
      {kpSystemData.bhava_chalit_svg && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
            {t('kpSystem.bhavaChalitChart') || 'Bhava Chalit Chart'}
          </h3>
          <div className="w-full flex justify-center">
            <div
              className="w-full max-w-md"
              dangerouslySetInnerHTML={{ __html: kpSystemData.bhava_chalit_svg }}
            />
          </div>
        </div>
      )}

      {/* Planets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t('kpSystem.planetaryPositions') || 'Planetary Positions'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[800px]">
            <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Planet</th>
                <th className="px-4 py-3 whitespace-nowrap">Cusp</th>
                <th className="px-4 py-3 whitespace-nowrap">Sign</th>
                <th className="px-4 py-3 whitespace-nowrap">Sign Lord</th>
                <th className="px-4 py-3 whitespace-nowrap">Star Lord</th>
                <th className="px-4 py-3 whitespace-nowrap">Sub Lord</th>
              </tr>
            </thead>
            <tbody>
              {planets_table.map((planet, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    {planet.Planet}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {planet.Cusp}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {planet.Sign}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {planet.Sign_Lord}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {planet.Star_Lord}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {planet.Sub_Lord}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cusps Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t('kpSystem.houseCusps') || 'House Cusps'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[900px]">
            <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Cusp</th>
                <th className="px-4 py-3 whitespace-nowrap">Degree</th>
                <th className="px-4 py-3 whitespace-nowrap">Sign</th>
                <th className="px-4 py-3 whitespace-nowrap">Sign Lord</th>
                <th className="px-4 py-3 whitespace-nowrap">Star Lord</th>
                <th className="px-4 py-3 whitespace-nowrap">Sub Lord</th>
              </tr>
            </thead>
            <tbody>
              {cusps_table.map((cusp, index) => (
                <tr
                  key={index}
                  className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-orange-600 dark:text-orange-400 whitespace-nowrap">
                    {cusp.Cusp}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {cusp.Degree.toFixed(2)}°
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {cusp.Sign}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {cusp.Sign_Lord}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {cusp.Star_Lord}
                  </td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white whitespace-nowrap">
                    {cusp.Sub_Lord}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ruling Planets */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t('kpSystem.significantRulingPlanets') || 'Significant Ruling Planets'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Moon */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Moon</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sign Lord:</span>
                <span className="text-gray-900 dark:text-white font-medium">{ruling_planets.Mo.sign_lord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Star Lord:</span>
                <span className="text-gray-900 dark:text-white font-medium">{ruling_planets.Mo.star_lord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sub Lord:</span>
                <span className="text-gray-900 dark:text-white font-medium">{ruling_planets.Mo.sub_lord}</span>
              </div>
            </div>
          </div>

          {/* Ascendant */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Ascendant</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sign Lord:</span>
                <span className="text-gray-900 dark:text-white font-medium">{ruling_planets.Asc.sign_lord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Star Lord:</span>
                <span className="text-gray-900 dark:text-white font-medium">{ruling_planets.Asc.star_lord}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sub Lord:</span>
                <span className="text-gray-900 dark:text-white font-medium">{ruling_planets.Asc.sub_lord}</span>
              </div>
            </div>
          </div>

          {/* Day Lord */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Day Lord</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Planet:</span>
                <span className="text-gray-900 dark:text-white font-medium">{ruling_planets["Day Lord"].planet}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* House Significators */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {t('kpSystem.houseSignificators') || 'House Significators'}
        </h3>
        <div className="space-y-4">
          {Object.entries(house_significators).map(([house, significators]) => (
            <div key={house} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">House {house}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {/* Strong */}
                {significators.strong.length > 0 && (
                  <div>
                    <span className="text-green-600 dark:text-green-400 font-medium block mb-1">Strong:</span>
                    <ul className="text-gray-900 dark:text-white space-y-1">
                      {significators.strong.map((item, idx) => (
                        <li key={idx} className="text-xs">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Medium */}
                {significators.medium.length > 0 && (
                  <div>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium block mb-1">Medium:</span>
                    <ul className="text-gray-900 dark:text-white space-y-1">
                      {significators.medium.map((item, idx) => (
                        <li key={idx} className="text-xs">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Weak */}
                {significators.weak.length > 0 && (
                  <div>
                    <span className="text-red-600 dark:text-red-400 font-medium block mb-1">Weak:</span>
                    <ul className="text-gray-900 dark:text-white space-y-1">
                      {significators.weak.map((item, idx) => (
                        <li key={idx} className="text-xs">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPSystemDetails;
