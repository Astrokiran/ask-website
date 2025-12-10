import React from 'react';
import { useTranslation } from 'react-i18next';

// Samvatsara name translations from English to Hindi
const samvatsaraTranslations: { [key: string]: string } = {
  'Prabhava': 'प्रभव',
  'Vibhava': 'विभव',
  'Shukla': 'शुक्ल',
  'Pramodoota': 'प्रमोदूत',
  'Prajothpatti': 'प्रजोत्पत्ति',
  'Aangirasa': 'आंगीरस',
  'Shreemukha': 'श्रीमुख',
  'Bhaava': 'भाव',
  'Yuva': 'युव',
  'Dhaatu': 'धातु',
  'Eeshwara': 'ईश्वर',
  'Bahudhanya': 'बहुधान्य',
  'Pramaadi': 'प्रमादी',
  'Vikrama': 'विक्रम',
  'Vishu': 'विषु',
  'Chitrabhanu': 'चित्रभानु',
  'Svabhanu': 'स्वभानु',
  'Taarana': 'तारण',
  'Paarthiva': 'पार्थिव',
  'Vyaya': 'व्यय',
  'Sarvajith': 'सर्वजित',
  'Sarvadhāri': 'सर्वधारी',
  'Virodhi': 'विरोधि',
  'Vikṛti': 'विकृति',
  'Khara': 'खर',
  'Nandana': 'नंदन',
  'Vijaya': 'विजय',
  'Jaya': 'जय',
  'Manmatha': 'मन्मथ',
  'Durmukhi': 'दुर्मुखी',
  'Hevilambi': 'हेविलंबी',
  'Vilambi': 'विलंबी',
  'Vikaari': 'विकारी',
  'Shaarvari': 'शार्वरी',
  'Plava': 'प्लव',
  'Shubhakruth': 'शुभकृत',
  'Shobhakruth': 'शोभकृत',
  'Krodhi': 'क्रोधी',
  'Vishvaavasu': 'विश्वावसु',
  'Paraabhava': 'पराभव',
  'Plavanga': 'प्लवंग',
  'Keelaka': 'कीलक',
  'Saumya': 'सौम्य',
  'Saadhaarana': 'साधारण',
  'Virodhikruth': 'विरोधिकृत',
  'Paridhāvi': 'परिधावी',
  'Pramaadeecha': 'प्रमादीच',
  'Aananda': 'आनंद',
  'Raakshasa': 'राक्षस',
  'Nala': 'नल',
  'Pingala': 'पिंगल',
  'Kaalayukthi': 'कालयुक्ति',
  'Siddhārthi': 'सिद्धार्थि',
  'Raudra': 'रौद्र',
  'Durmathi': 'दुर्मति',
  'Dundubhi': 'दुंदुभि',
  'Rudhirodgaari': 'रुधिरोद्गारी',
  'Raktaakshi': 'रक्ताक्षि',
  'Krodhana': 'क्रोधन',
  'Akshaya': 'अक्षय'
};


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
  const { t } = useTranslation();
  if (!Array.isArray(details) || details.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 hover:shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{t('basicDetails.noDetailsAvailable')}</p>
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
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 break-words">{detail.label}</dt>
            <dd className="text-sm text-gray-900 dark:text-white font-medium group-hover:text-orange-700 dark:group-hover:text-orange-300 text-right break-words">{detail.value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
};

const BasicDetailsContent:React.FC<BasicDetailsProps> = ({ kundliData }) => {
  const { t, i18n } = useTranslation();
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
      let translatedLabel = label;
      switch (label) {
        case 'Name':
          value = (apiData as any).name || 'N/A';
          translatedLabel = t('basicDetails.name');
          break;
        case 'Date of Birth':
          value = apiData.birth_info?.date_of_birth || 'N/A';
          translatedLabel = t('basicDetails.dateOfBirth');
          break;
        case 'Time of Birth':
          value = apiData.birth_info?.time_of_birth || 'N/A';
          translatedLabel = t('basicDetails.timeOfBirth');
          break;
        case 'Place of Birth':
          value = apiData.birth_info?.place_of_birth || 'N/A';
          translatedLabel = t('basicDetails.placeOfBirth');
          break;
        case 'Latitude':
          value = apiData.birth_info?.latitude?.toFixed(4) || 'N/A';
          translatedLabel = t('basicDetails.latitude');
          break;
        case 'Longitude':
          value = apiData.birth_info?.longitude?.toFixed(4) || 'N/A';
          translatedLabel = t('basicDetails.longitude');
          break;
        case 'Timezone':
          value = apiData.birth_info?.timezone || 'N/A';
          translatedLabel = t('basicDetails.timezone');
          break;
        default:
          break;
      }
      return { label: translatedLabel, value };
    });

    // Process Panchang Details
    displayPanchangDetails = panchangDetailLabels.map((label) => {
      let value = 'N/A';
      let translatedLabel = label;
      if (apiData.enhanced_panchanga) {
        const panchang = apiData.enhanced_panchanga;
        switch (label) {
          case 'Tithi':
            value = panchang.tithi?.name ? `${panchang.tithi.name} (${panchang.tithi.paksha})` : 'N/A';
            translatedLabel = t('basicDetails.tithi');
            break;
          case 'Nakshatra':
            value = panchang.nakshatra?.name ? `${panchang.nakshatra.name}` : 'N/A';
            translatedLabel = t('basicDetails.nakshatra');
            break;
          case 'Yoga':
            value = panchang.yoga?.name ? `${panchang.yoga.name} (till ${panchang.yoga.end_time})` : 'N/A';
            translatedLabel = t('basicDetails.yoga');
            break;
          case 'Karana':
            value = panchang.karana?.name || 'N/A';
            translatedLabel = t('basicDetails.karana');
            break;
          case 'Vaara':
            value = panchang.vaara?.name || 'N/A';
            translatedLabel = t('basicDetails.vaara');
            break;
          case 'Masa':
            // Updated to show masa type (Nija/Adhika)
            value = panchang.masa?.name ? `${panchang.masa.name} (${panchang.masa.type})` : 'N/A';
            translatedLabel = t('basicDetails.masa');
            break;
          case 'Ritu':
            value = panchang.ritu?.name || 'N/A';
            translatedLabel = t('basicDetails.ritu');
            break;
          case 'Samvatsara':
            const samvatsaraName = panchang.samvatsara?.name || 'N/A';
            // Translate to Hindi if language is Hindi and translation exists
            if (i18n.language === 'hi' && samvatsaraName !== 'N/A' && samvatsaraTranslations[samvatsaraName]) {
              value = samvatsaraTranslations[samvatsaraName];
            } else {
              value = samvatsaraName;
            }
            translatedLabel = t('basicDetails.samvatsara');
            break;
          case 'Sunrise':
            value = panchang.sunrise?.time || 'N/A';
            translatedLabel = t('basicDetails.sunrise');
            break;
          case 'Sunset':
            value = panchang.sunset?.time || 'N/A';
            translatedLabel = t('basicDetails.sunset');
            break;
          case 'Day Duration':
            value = panchang.day_duration ? `${panchang.day_duration.hours} hours` : 'N/A';
            translatedLabel = t('basicDetails.dayDuration');
            break;
          default:
            break;
        }
      }
      return { label: translatedLabel, value };
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
        <DetailCard title={t('basicDetails.title')} details={displayBasicDetails} />
        <DetailCard title={t('basicDetails.panchangTitle')} details={displayPanchangDetails} />
        {/* <div className="bg-white rounded-xl shadow-lg border transform transition-all hover:scale-[1.01] duration-300 overflow-hidden">
          {/* <img src="/.png" alt="Lord Ganesha" className="w-full h-full object-cover" /> */}
        {/* </div>  */}
      </div>
    </div>
  // </div>
  )
};

export default BasicDetailsContent;