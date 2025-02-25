import { API } from 'aws-amplify';

const apiName = 'astrokiranAPI';

export async function getReport(phonenumber: string) {
    try {
        const response = await API.get(apiName, `/reports/${phonenumber}`, {});
        return response;
    } catch (error) {
        console.error('Error fetching report:', error);
        throw error;
    }
}

export async function createReport(reportData) {
    try {
        const response = await API.post(apiName, '/reports', {
            body: reportData
        });
        return response;
    } catch (error) {
        console.error('Error creating report:', error);
        throw error;
    }
}

export async function getDailyHoroscopes() {
    try {
        const response = await API.get(apiName, '/daily-horoscopes', {});
        return response;
    } catch (error) {
        console.error('Error fetching horoscopes:', error);
        throw error;
    }
}