import React from 'react';
import { ChevronRight } from 'lucide-react';


// Interface for individual planet data from API
interface ApiPlanetDataItem {
    id: number;
    name: string;
    fullDegree: number;
    normDegree: number;
    speed: number;
    isRetro: string; // "true" or "false"
    sign: string;
    signLord: string;
    nakshatra: string;
    nakshatraLord: string;
    nakshatra_pad: number;
    house: number;
    is_planet_set: boolean; // API uses is_planet_set for combust status
    planet_awastha: string;
    state: string; // API uses 'state' for status (Friendly, Enemy, etc.)
}

interface ApiMahadashaDataItem {
    planet_id: number;
    planet: string;
    start: string;
    end: string;
}

const KundliTabContent = ({ kundliData }) => {
    // Extract planetary positions from the kundliData prop
    // kundliData.planets is expected to be the array from the API
    const planetaryPositions: ApiPlanetDataItem[] = kundliData?.planets || [];
    const svgChartString1: string | undefined = kundliData?.svgChart; // Renamed for clarity
    const svgChartString2: string | undefined = kundliData?.svgChart2; // Assuming a second SVG string
    const vimshottariDashaData: ApiMahadashaDataItem[] = kundliData?.dasha

    // Dasha data would also come from kundliData if the API provides it
    // const dashaDetails = kundliData?.dasha || vimshottariDashaData;

    return (
        <>
        {/* Container for two SVG Charts side-by-side */}

        <div id="kundli-tab-content-section">
        {(svgChartString1 || svgChartString2) && (
            <div className="mt-6 flex flex-col md:flex-row gap-6"> {/* ID removed from here */}
                {/* First SVG Chart (Left) */}
                {svgChartString1 && (
                    <div id="pdf-birth-chart-container" className="md:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Birth Chart (Lagna)</h3>
                        <div 
                            className="w-full overflow-x-auto flex justify-center items-center p-2  rounded-md"
                            style={{ '--svg-bg-color': '#FDBA74' }}
                            dangerouslySetInnerHTML={{
                                __html: svgChartString1.replace(
                                /(<svg[^>]*>)/,
                                `$1<rect width="100%" height="100%" fill="#FDBA54"/>` // Orange color
                                )
                            }}

                        />
                    </div>
                )}

                {/* Second SVG Chart (Right) */}
                {svgChartString2 ? (
                    <div id="pdf-moon-chart-container" className="md:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Moon Chart</h3> {/* Example Title */}
                        <div 
                            className="w-full overflow-x-auto flex justify-center items-center p-2 rounded-md"
                            dangerouslySetInnerHTML={{
                                 __html: svgChartString2.replace(
                                    /(<svg[^>]*>)/,
                                    `$1<rect width="100%" height="100%" fill="#FDBA54"/>` // Orange color
                                 ) }} 
                        />
                    </div>
                ) : svgChartString1 && ( // If only one chart, show a placeholder for the second or adjust layout
                    <div className="md:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 flex items-center justify-center">
                        <p className="text-gray-500">Second chart will appear here.</p>
                    </div>
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
                        {planetaryPositions.map((p) => (
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
                <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                        {/* {['Mahadasha', 'Antardasha', 'Pratyantardasha', 'Sookshmadasha'].map((dasha, index) => (
                            <React.Fragment key={dasha}>
                                <div className="flex items-center">
                                    <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${index === 0 ? 'bg-orange-400 text-gray-800' : 'bg-gray-200'}`}>{index + 1}</span>
                                    <span className={`ml-2 ${index === 0 ? 'text-gray-800 font-semibold' : ''}`}>{dasha}</span>
                                </div>
                                {index < 3 && <div className="flex-auto border-t-2 border-gray-200 mx-4"></div>}
                            </React.Fragment>
                        ))} */}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3">Planet</th>
                                <th scope="col" className="px-6 py-3">Start Date</th>
                                <th scope="col" className="px-6 py-3">End Date</th>
                                {/* <th scope="col" className="px-6 py-3"><span className="sr-only">Details</span></th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {/* Replace vimshottariDashaData with dashaDetails when API is ready */}
                            {vimshottariDashaData.map((d) => ( 
                                <tr key={d.planet_id || d.planet} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{d.planet}</td>
                                    <td className="px-6 py-4">{d.start}</td>
                                    <td className="px-6 py-4">{d.end}</td>
                                    {/* <td className="px-6 py-4 text-right">
                                        <ChevronRight className="h-5 w-5 text-gray-400" />
                                    </td> */}
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
