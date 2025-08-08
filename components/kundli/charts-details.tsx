// In ChartDetails.tsx

import React from 'react';
import './ChartDetails.css'; // We will create this file next

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
    <div className="kundli-container">
      <h2 className="main-title">Astrological Charts</h2>
      
      {/* Main Charts: Rasi (D1) and Navamsa (D9) */}
      <div className="main-charts-grid">
        {rasi_chart_svg && (
          <div className="chart-card">
            <div dangerouslySetInnerHTML={{ __html: rasi_chart_svg }} />
          </div>
        )}

        {navamsa_chart_svg ? (
          <div className="chart-card">
            <div dangerouslySetInnerHTML={{ __html: navamsa_chart_svg }} />
          </div>
        ) : (
            <div className="chart-card"><p>Navamsa Chart not available.</p></div>
)}
      </div>

      {/* Responsive Divisional (Varga) Charts */}
      {otherVargaCharts.length > 0 && (
        <div className="varga-section">
          <h3 className="section-title">Divisional (Varga) Charts</h3>
          <div className="varga-grid">
            {otherVargaCharts.map(([name, svgString]) => (
              <div 
                key={name} 
                className="chart-card"
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