import React from 'react';

// --- INTERFACES ---

interface KundliData {
  rasi_chart_svg: string | null;
  navamsa_chart_svg: string | null;
  // This is the new data structure from your backend
  varga_charts_svgs?: { [chartName: string]: string }; 
  [key: string]: any;
}

interface ChartDetailsProps {
  kundliData: KundliData;
}

// --- MAIN COMPONENT ---

const ChartDetails: React.FC<ChartDetailsProps> = ({ kundliData }) => {
  const {
    rasi_chart_svg,
    navamsa_chart_svg,
    varga_charts_svgs,
  } = kundliData;

  const otherVargaCharts = varga_charts_svgs ? Object.entries(varga_charts_svgs) : [];

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Astrological Charts</h2>

      {/* Main Charts: Rasi (D1) and Navamsa (D9) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {rasi_chart_svg && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: rasi_chart_svg }} />
          </div>
        )}

        {navamsa_chart_svg ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
            <div dangerouslySetInnerHTML={{ __html: navamsa_chart_svg }} />
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
            <p className="text-gray-600 dark:text-gray-400">Navamsa Chart not available.</p>
          </div>
        )}
      </div>

      {/* Responsive Divisional (Varga) Charts */}
      {otherVargaCharts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Divisional (Varga) Charts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherVargaCharts.map(([name, svgString]) => (
              <div
                key={name}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm"
                dangerouslySetInnerHTML={{ __html: svgString }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartDetails;