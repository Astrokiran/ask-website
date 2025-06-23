import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ApiPlanetDataItem {
    id: number;
    name: string;
    fullDegree: number;
    normDegree: number;
    speed: number;
    isRetro: string; 
    sign: string;
    signLord: string;
    nakshatra: string;
    nakshatraLord: string;
    nakshatra_pad: number;
    house: number;
    is_planet_set: boolean;
    planet_awastha: string;
    state: string; 
}

interface ApiMahadashaDataItem {
    planet_id: number;
    planet: string;
    start: string;
    end: string;
}

const KundliTabContent = ({ kundliData }) => {
    const planetaryPositions: ApiPlanetDataItem[] = kundliData?.planets?.data || [];
    const vimshottariDashaData: ApiMahadashaDataItem[] = kundliData?.dasha?.data || [];
    const svgChartString1: string | undefined = kundliData?.svgChart;
    const svgChartString2: string | undefined = kundliData?.svgChart2;

    const processSvg = (svgString: string | undefined) => {
        if (!svgString) {
            return '';
        }

        let processedSvg = svgString;

        if (!processedSvg.includes('viewBox')) {
            const svgTagMatch = processedSvg.match(/<svg([^>]*)>/);
            if (svgTagMatch) {
                const attributes = svgTagMatch[1];
                const widthMatch = attributes.match(/width="(\d+(\.\d+)?)"/);
                const heightMatch = attributes.match(/height="(\d+(\.\d+)?)"/);

                if (widthMatch && heightMatch) {
                    const width = widthMatch[1];
                    const height = heightMatch[1];
                    let newAttributes = attributes
                        .replace(/width="[^"]*"/, '')
                        .replace(/height="[^"]*"/, '');
                    newAttributes += ` viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%;" `;
                    processedSvg = processedSvg.replace(/<svg[^>]*>/, `<svg ${newAttributes}>`);
                }
            }
        }

        processedSvg = processedSvg.replace(/<path\s/g, '<path fill="#FDBA54" ');

        return processedSvg;
    };

    return (
        <>
        <div id="kundli-tab-content-section">
            {(svgChartString1 || svgChartString2) && (
                <div className="mt-6 flex flex-col md:flex-row gap-6">
                    {svgChartString1 && (
                        <div id="pdf-birth-chart-container" className="md:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Birth Chart (Lagna)</h3>
                            <div
                                className="w-full h-auto overflow-x-auto flex justify-center items-center p-2 rounded-md"
                                dangerouslySetInnerHTML={{ __html: processSvg(svgChartString1) }}
                            />
                        </div>
                    )}
                    {svgChartString2 ? (
                        <div id="pdf-moon-chart-container" className="md:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Moon Chart</h3>
                            <div
                                className="w-full h-auto overflow-x-auto flex justify-center items-center p-2 rounded-md"
                                dangerouslySetInnerHTML={{ __html: processSvg(svgChartString2) }}
                            />
                        </div>
                    ) : svgChartString1 && (
                        <div className="md:w-1/2" />
                    )}
                </div>
            )}

            <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Planets</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-4 py-3">Planet</th>
                                <th scope="col" className="px-4 py-3">Sign</th>
                                <th scope="col" className="px-4 py-3">Sign Lord</th>
                                <th scope="col" className="px-4 py-3">Nakshatra</th>
                                <th scope="col" className="px-4 py-3">Naksh Lord</th>
                                <th scope="col" className="px-4 py-3">Degree</th>
                                <th scope="col" className="px-4 py-3">Retro(R)</th>
                                <th scope="col" className="px-4 py-3">Combust</th>
                                <th scope="col" className="px-4 py-3">Avastha</th>
                                <th scope="col" className="px-4 py-3">House</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(planetaryPositions) && planetaryPositions.map((p) => (
                                <tr key={p.id || p.name} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{p.name}</td>
                                    <td className="px-4 py-3">{p.sign}</td>
                                    <td className="px-4 py-3">{p.signLord}</td>
                                    <td className="px-4 py-3">{p.nakshatra}</td>
                                    <td className="px-4 py-3">{p.nakshatraLord}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{p.normDegree?.toFixed(2)}°</td>
                                    <td className="px-4 py-3">{p.isRetro === "true" ? 'Retro' : 'Direct'}</td>
                                    <td className="px-4 py-3">{p.is_planet_set ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3">{p.planet_awastha}</td>
                                    <td className="px-4 py-3">{p.house?.toString()}</td>
                                    <td className="px-4 py-3">{p.state}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mahadasha</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Planet</th>
                                <th scope="col" className="px-6 py-3">Start Date</th>
                                <th scope="col" className="px-6 py-3">End Date</th>
                            </tr>
                        </thead>
                        <tbody>
                           {Array.isArray(vimshottariDashaData) && vimshottariDashaData.map((d) => (
                                <tr key={d.planet_id || d.planet} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{d.planet}</td>
                                    <td className="px-6 py-4">{d.start}</td>
                                    <td className="px-6 py-4">{d.end}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    );
};

export default KundliTabContent;