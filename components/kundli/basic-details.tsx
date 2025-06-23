import React from 'react';

const DetailCard = ({ title, details }) => {
  if (!Array.isArray(details) || details.length === 0) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-[1.01] duration-300">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-4 pb-2 border-b border-orange-200">{title}</h3>
            <p className="text-gray-500">No details available.</p>
        </div>
    );
  }
  return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-6 transform transition-all hover:scale-[1.01] duration-300">
        <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 mb-5 pb-3 border-b border-orange-200">{title}</h3>
        <div className=" sm:space-y-0.5">
            {details.map((detail, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2.5 px-3 rounded-lg transition-colors duration-200 hover:bg-orange-50 group">
              <dt className="text-sm font-medium text-gray-500 group-hover:text-orange-600 sm:w-2/5 lg:w-1/3 xl:w-2/5 mb-0.5 sm:mb-0">{detail.label}</dt>
              <dd className="text-sm text-gray-800 font-semibold group-hover:text-orange-800 sm:w-3/5 lg:w-2/3 xl:w-3/5 sm:text-right break-words">{detail.value}</dd>
            </div>
          ))}
        </div>
      </div>
  );
};

// Content for the 'Basic' tab, now receives data via props
const BasicDetailsContent = ({ kundliData }) => {
    let displayBasicDetails, displayPanchangDetails;
    
    const basicDetailLabels = ['Name', 'Date', 'Time', 'Place', 'Latitude', 'Longitude', 'Timezone', 'Sunrise', 'Sunset', 'Ayanamsha'];
    const panchangDetailLabels = ['Day', 'Tithi', 'Nakshatra', 'Yog', 'Karan', 'Sunrise', 'Sunset', 'Vedic Sunrise', 'Vedic Sunset'];

    if (kundliData && kundliData.data) {
        const apiData = kundliData.data;

        // 1. Process Basic Details
        displayBasicDetails = basicDetailLabels.map(label => {
            let value = "N/A";
            switch (label) {
                case 'Name': value = apiData.name || "N/A"; break;
                case 'Date': value = apiData.date_of_birth || "N/A"; break;
                case 'Time': value = apiData.time_of_birth || "N/A"; break;
                case 'Place': value = apiData.place_of_birth || "N/A"; break;
                case 'Latitude': value = apiData.latitude?.toString() || "N/A"; break;
                case 'Longitude': value = apiData.longitude?.toString() || "N/A"; break;
                case 'Timezone': value = apiData.timezone || "N/A"; break;
                case 'Sunrise': value = apiData.sunrise || (apiData.panchang?.sunrise) || "N/A"; break;
                case 'Sunset': value = apiData.sunset || (apiData.panchang?.sunset) || "N/A"; break;
                case 'Ayanamsha': value = apiData.ayanamsha?.toString() || "N/A"; break;
                default:
                    break;
            }
            return { label, value };
        });

        // 2. Process Panchang Details
        displayPanchangDetails = panchangDetailLabels.map(label => {
            let value = "N/A";
            if (apiData.panchang) {
                switch (label) {
                    case 'Day': value = apiData.panchang.day || "N/A"; break;
                    case 'Tithi': value = apiData.panchang.tithi || "N/A"; break;
                    case 'Nakshatra': value = apiData.panchang.nakshatra || "N/A"; break;
                    case 'Yog': value = apiData.panchang.yog || "N/A"; break;
                    case 'Karan': value = apiData.panchang.karan || "N/A"; break;
                    case 'Sunrise': value = apiData.panchang.sunrise || "N/A"; break;
                    case 'Sunset': value = apiData.panchang.sunset || "N/A"; break;
                    case 'Vedic Sunrise': value = apiData.panchang.vedic_sunrise || "N/A"; break;
                    case 'Vedic Sunset': value = apiData.panchang.vedic_sunset || "N/A"; break;
                    default:
                        break;
                }
            }
            return { label, value };
        });

    } else { 
        displayBasicDetails = basicDetailLabels.map(label => ({ label, value: "N/A" }));
        displayPanchangDetails = panchangDetailLabels.map(label => ({ label, value: "N/A" }));
    }

    return (
        <div id="basic-details-content-section" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DetailCard title="Basic Details" details={displayBasicDetails} />
                <DetailCard title="Panchang Details" details={displayPanchangDetails} />
                
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 transform transition-all hover:scale-[1.01] duration-300 overflow-hidden">
                    <img 
                        src="/lord-ganesh.png" 
                        alt="Lord Ganesha"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicDetailsContent;