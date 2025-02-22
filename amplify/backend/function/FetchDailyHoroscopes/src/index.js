const AWS = require('aws-sdk');
const axios = require('axios');
const moment = require('moment');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.STORAGE_HOROSCOPES_NAME;
const API_KEY = process.env.VEDIC_ASTRO_API_KEY;
const API_URL = process.env.VEDIC_ASTRO_API_URL || 'https://api.vedicastroapi.com/v3/horoscope/daily/sun';

exports.handler = async (event) => {
  try {
    const date = moment().format('DD/MM/YYYY');
    const timestamp = new Date().toISOString();
    
    // Fetch and store horoscopes for all 12 zodiac signs
    for (let zodiac = 1; zodiac <= 12; zodiac++) {
      const params = {
        zodiac: zodiac,
        date: date,
        show_same: true,
        lang: 'en',
        split: true,
        type: 'big'
      };
      
      // Call VedicAstroAPI
      const response = await axios.get(API_URL, {
        params,
        headers: {
          'x-api-key': API_KEY
        }
      });
      
      // Store prediction in DynamoDB
      const item = {
        zodiac: zodiac.toString(),
        date: date,
        prediction: response.data.response.prediction,
        timestamp: timestamp
      };
      
      await dynamoDB.put({
        TableName: TABLE_NAME,
        Item: item
      }).promise();
      
      // Add a small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Successfully fetched and stored horoscopes for all zodiac signs'
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error fetching and storing horoscopes',
        error: error.message
      })
    };
  }
};
