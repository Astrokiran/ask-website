import React from 'react';


interface EnhancedPanchangaDetails {
  tithi: { name: string; number: number; end_time: string; paksha: string; };
  nakshatra: { name: string; number: number; end_time: string; lord: string; pada: number; };
  yoga: { name: string; number: number; end_time: string; };
  karana: { name: string; number: number; };
  vaara: { name: string; number: number; lord: string; };
  masa: { name: string; number: number; type: string; };
  ritu: { name: string; number: number; };
  samvatsara: { name: string; number: number; };
  sunrise: { time: string; };
  sunset: { time: string; };
  day_duration: { hours: number; ghatikas: number; };
}

interface BirthInfo {
  datetime: string;
  timezone: string;
  latitude: number;
  longitude: number;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
}

interface KudliData {
  birth_info: BirthInfo;
  enhanced_panchanga: EnhancedPanchangaDetails;

}

interface BasicDetailsProps {
  kundliData: KudliData;
}


const DetailCard = ({ title, details }: { title: string; details: any[] }) => {
  if (!Array.isArray(details) || details.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">No details available.</p>
      </div>
    );
  }
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-5 pb-3 border-b border-gray-200 dark:border-gray-700">{title}</h3>
      <div className="sm:space-y-0.5">
        {details.map((detail, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 items-center py-2.5 px-3 rounded-lg transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 group"
          >
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 break-words">{detail.label}</dt>
            <dd className="text-sm text-gray-900 dark:text-white font-medium group-hover:text-blue-700 dark:group-hover:text-blue-300 text-right break-words">{detail.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
};

const BasicDetailsContent:React.FC<BasicDetailsProps> = ({ kundliData }) => {
  let displayBasicDetails, displayPanchangDetails;

  // Updated to remove the "Place" field
  const basicDetailLabels = ['Name', 'Date of Birth','Time of Birth', 'Place of Birth',  'Latitude', 'Longitude', 'Timezone'];
  const panchangDetailLabels = [
    'Tithi',
    'Nakshatra',
    'Yoga',
    'Karana',
    'Vaara',
    'Masa',
    'Ritu',
    'Samvatsara',
    'Sunrise',
    'Sunset',
    'Day Duration',
  ];

  // Check for kundliData directly, not kundliData.data
  if (kundliData) {
    const apiData = kundliData;

    // Process Basic Details
    displayBasicDetails = basicDetailLabels.map((label) => {
      let value = 'N/A';
      switch (label) {
        case 'Name':
          value = (apiData as any).name || 'N/A';
          break;
        case 'Date of Birth':
          value = apiData.birth_info?.date_of_birth || 'N/A';
          break;
        case 'Time of Birth':
          value = apiData.birth_info?.time_of_birth || 'N/A';
          break;
        case 'Place of Birth':
          value = apiData.birth_info?.place_of_birth || 'N/A';
          break;
        case 'Latitude':
          value = apiData.birth_info?.latitude?.toFixed(4) || 'N/A';
          break;
        case 'Longitude':
          value = apiData.birth_info?.longitude?.toFixed(4) || 'N/A';
          break;
        case 'Timezone':
          value = apiData.birth_info?.timezone || 'N/A';
          break;
        default:
          break;
      }
      return { label, value };
    });

    // Process Panchang Details
    displayPanchangDetails = panchangDetailLabels.map((label) => {
      let value = 'N/A';
      if (apiData.enhanced_panchanga) {
        const panchang = apiData.enhanced_panchanga;
        switch (label) {
          case 'Tithi':
            value = panchang.tithi?.name ? `${panchang.tithi.name} (${panchang.tithi.paksha})` : 'N/A';
            break;
          case 'Nakshatra':
            value = panchang.nakshatra?.name ? `${panchang.nakshatra.name}` : 'N/A';
            break;
          case 'Yoga':
            value = panchang.yoga?.name ? `${panchang.yoga.name} (till ${panchang.yoga.end_time})` : 'N/A';
            break;
          case 'Karana':
            value = panchang.karana?.name || 'N/A';
            break;
          case 'Vaara':
            value = panchang.vaara?.name || 'N/A';
            break;
          case 'Masa':
            // Updated to show masa type (Nija/Adhika)
            value = panchang.masa?.name ? `${panchang.masa.name} (${panchang.masa.type})` : 'N/A';
            break;
          case 'Ritu':
            value = panchang.ritu?.name || 'N/A';
            break;
          case 'Samvatsara':
            value = panchang.samvatsara?.name || 'N/A';
            break;
          case 'Sunrise':
            value = panchang.sunrise?.time || 'N/A';
            break;
          case 'Sunset':
            value = panchang.sunset?.time || 'N/A';
            break;
          case 'Day Duration':
            value = panchang.day_duration ? `${panchang.day_duration.hours} hours` : 'N/A';
            break;
          default:
            break;
        }
      }
      return { label, value };
    });
  } else {
    displayBasicDetails = basicDetailLabels.map((label) => ({ label, value: 'N/A' }));
    displayPanchangDetails = panchangDetailLabels.map((label) => ({ label, value: 'N/A' }));
  }

  return (
    // <div 
    //   id="basic-details-content-section" 
    //   className="mt-6 p-6 rounded-lg bg-cover bg-center"
    //   style={{ backgroundImage: "url('/om-image.png')" }}
    // >
    <div id="basic-details-content-section" className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DetailCard title="Basic Details" details={displayBasicDetails} />
        <DetailCard title="Panchang Details" details={displayPanchangDetails} />
        {/* <div className="bg-white rounded-xl shadow-lg border transform transition-all hover:scale-[1.01] duration-300 overflow-hidden">
          {/* <img src="/.png" alt="Lord Ganesha" className="w-full h-full object-cover" /> */}
        {/* </div>  */}
      </div>
    </div>
  // </div>
  )
};

export default BasicDetailsContent;