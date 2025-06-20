import React from 'react';

const BhavChalitChart = () => {
    const housePlanets = {
        '1': [], '2': ['Ju'], '3': ['Ke'], '4': [], '5': ['Mo'], '6': [],
        '7': ['Pl'], '8': ['Ma'], '9': ['Su', 'Sa', 'Me', 'Ne', 'Ur'], '10': ['Ra', 'Ve'], '11': [], '12': []
    };
    const getPlanetColor = (planet) => ({
        'Ju': 'text-orange-500', 'Ke': 'text-red-600', 'Mo': 'text-gray-500', 'Ma': 'text-red-600',
        'Pl': 'text-gray-500', 'Su': 'text-orange-500', 'Sa': 'text-black', 'Me': 'text-green-600',
        'Ne': 'text-green-600', 'Ur': 'text-green-600', 'Ra': 'text-blue-600', 'Ve': 'text-blue-600'
    }[planet] || 'text-black');
    const houseCoordinates = [
        { house: '2', x: 50, y: 18 }, { house: '1', x: 80, y: 20 }, { house: '12', x: 80, y: 50 },
        { house: '11', x: 80, y: 80 }, { house: '10', x: 50, y: 85 }, { house: '9', x: 20, y: 80 },
        { house: '8', x: 20, y: 50 }, { house: '7', x: 20, y: 20 }, { house: '3', x: 35, y: 35 },
        { house: '4', x: 65, y: 35 }, { house: '5', x: 65, y: 65 }, { house: '6', x: 35, y: 65 }
    ];

    return (
        <div className="w-full max-w-xs mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Bhav Chalit Chart</h3>
            <svg viewBox="0 0 100 100" className="w-full h-auto border-2 border-gray-400 bg-white">
                <path d="M 0 0 L 100 100 M 100 0 L 0 100 M 50 0 L 100 50 L 50 100 L 0 50 Z" stroke="gray" strokeWidth="0.5" fill="none"/>
                {houseCoordinates.map(({ house, x, y }) => (
                    <g key={house}>
                        <text x={x} y={y} textAnchor="middle" fontSize="3.5" fill="gray">{house}</text>
                        <text x={x} y={y + 6} textAnchor="middle" fontSize="3" className={getPlanetColor(housePlanets[house][0])}>
                            {housePlanets[house].join(' ')}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

const RulingPlanetsTable = () => {
    const rulingPlanetsData = [
        { name: 'Mo', signLord: 'Jupiter', starLord: 'Venus', subLord: 'SATURN' },
        { name: 'Asc', signLord: 'Sun', starLord: 'Ketu', subLord: 'Venus' },
    ];
    return (
        <div className="w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Ruling Planets</h3>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">Lagna</th>
                            <th scope="col" className="px-6 py-3">Sign Lord</th>
                            <th scope="col" className="px-6 py-3">Star Lord</th>
                            <th scope="col" className="px-6 py-3">Sub Lord</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rulingPlanetsData.map((d) => (
                            <tr key={d.name} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium">{d.name}</td>
                                <td className="px-6 py-4">{d.signLord}</td>
                                <td className="px-6 py-4">{d.starLord}</td>
                                <td className="px-6 py-4 font-bold text-gray-800">{d.subLord}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                            <td className="px-6 py-3">Day Lord</td>
                            <td className="px-6 py-3" colSpan="3">Venus</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const kpPlanetsData = [
    { name: 'Sun', cusp: 8, sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ve', subLord: 'Mo' },
    { name: 'Moon', cusp: 10, sign: 'Aquarius', signLord: 'Sa', starLord: 'Ra', subLord: 'Ra' },
    { name: 'Mars', cusp: 7, sign: 'Scorpio', signLord: 'Ma', starLord: 'Sa', subLord: 'Ju' },
    { name: 'Rahu', cusp: 9, sign: 'Capricorn', signLord: 'Sa', starLord: 'Ma', subLord: 'Ra' },
    { name: 'Jupiter', cusp: 2, sign: 'Gemini', signLord: 'Me', starLord: 'Ra', subLord: 'Sa' },
    { name: 'Saturn', cusp: 8, sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ve', subLord: 'Sa' },
    { name: 'Mercury', cusp: 8, sign: 'Capricorn', signLord: 'Sa', starLord: 'Su', subLord: 'Ju' },
    { name: 'Ketu', cusp: 3, sign: 'Cancer', signLord: 'Mo', starLord: 'Me', subLord: 'Ra' },
    { name: 'Venus', cusp: 9, sign: 'Capricorn', signLord: 'Sa', starLord: 'Mo', subLord: 'Ra' },
    { name: 'Neptune', cusp: 8, sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ve', subLord: 'Ra' },
];

const kpCuspsData = [
    { cusp: 1, degree: '40.38', sign: 'Taurus', signLord: 'Ve', starLord: 'Mo', subLord: 'Mo' },
     { cusp: 2, degree: '67.09', sign: 'Gemini', signLord: 'Me', starLord: 'Ra', subLord: 'Ra' },
    { cusp: 3, degree: '93.02', sign: 'Cancer', signLord: 'Mo', starLord: 'Ju', subLord: 'Ra' },
    { cusp: 4, degree: '121.13', sign: 'Leo', signLord: 'Su', starLord: 'Ke', subLord: 'Ve' },
    { cusp: 5, degree: '153.05', sign: 'Virgo', signLord: 'Me', starLord: 'Su', subLord: 'Sa' },
    { cusp: 6, degree: '187.36', sign: 'Libra', signLord: 'Ve', starLord: 'Ra', subLord: 'Ra' },
    { cusp: 7, degree: '220.38', sign: 'Scorpio', signLord: 'Ma', starLord: 'Sa', subLord: 'Su' },
    { cusp: 8, degree: '247.09', sign: 'Sagittarius', signLord: 'Ju', starLord: 'Ke', subLord: 'Ra' },
    { cusp: 9, degree: '273.02', sign: 'Capricorn', signLord: 'Sa', starLord: 'Su', subLord: 'Sa' },
    { cusp: 10, degree: '301.13', sign: 'Aquarius', signLord: 'Sa', starLord: 'Ma', subLord: 'Me' },
    { cusp: 11, degree: '333.05', sign: 'Pisces', signLord: 'Ju', starLord: 'Ju', subLord: 'Ra' },
    { cusp: 12, degree: '7.36', sign: 'Aries', signLord: 'Ma', starLord: 'Ke', subLord: 'Ra' },
    // Add more cusp data here...
];


const KPPlanetsTable = () => (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Planets</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-yellow-100">
                    <tr>
                        <th className="px-4 py-3">Planets</th>
                        <th className="px-4 py-3">Cusp</th>
                        <th className="px-4 py-3">Sign</th>
                        <th className="px-4 py-3">Sign Lord</th>
                        <th className="px-4 py-3">Star Lord</th>
                        <th className="px-4 py-3">Sub Lord</th>
                    </tr>
                </thead>
                <tbody>
                    {kpPlanetsData.map((p) => (
                        <tr key={p.name} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{p.name}</td>
                            <td className="px-4 py-3">{p.cusp}</td>
                            <td className="px-4 py-3">{p.sign}</td>
                            <td className="px-4 py-3">{p.signLord}</td>
                            <td className="px-4 py-3">{p.starLord}</td>
                            <td className="px-4 py-3">{p.subLord}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const KPCuspsTable = () => (
     <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Cusps</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-yellow-100">
                    <tr>
                        <th className="px-4 py-3">Cusp</th>
                        <th className="px-4 py-3">Degree</th>
                        <th className="px-4 py-3">Sign</th>
                        <th className="px-4 py-3">Sign Lord</th>
                        <th className="px-4 py-3">Star Lord</th>
                        <th className="px-4 py-3">Sub Lord</th>
                    </tr>
                </thead>
                <tbody>
                    {kpCuspsData.map((c) => (
                        <tr key={c.cusp} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{c.cusp}</td>
                            <td className="px-4 py-3">{c.degree}</td>
                            <td className="px-4 py-3">{c.sign}</td>
                            <td className="px-4 py-3">{c.signLord}</td>
                            <td className="px-4 py-3">{c.starLord}</td>
                            <td className="px-4 py-3">{c.subLord}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const KpContent = () => {
    return (
        <div className="mt-6 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="lg:col-span-2">
                    <BhavChalitChart />
                </div>
                <div className="lg:col-span-3">
                    <RulingPlanetsTable />
                </div>
            </div>
            <KPPlanetsTable />
            <KPCuspsTable />
        </div>
    );
};

export default KpContent;
