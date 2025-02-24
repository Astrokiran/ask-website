const AWS = require('aws-sdk');
const axios = require('axios');
const moment = require('moment');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.STORAGE_HOROSCOPES_NAME;
const API_KEY = process.env.VEDIC_ASTRO_API_KEY;
const API_URL = process.env.VEDIC_ASTRO_API_URL || 'https://api.vedicastroapi.com/v3/horoscope/daily/sun';

exports.handler = async (event) => {
  try {
    const date = moment().utcOffset("+05:30").format('DD/MM/YYYY');
    const timestamp = new Date().toISOString();
    console.log("date", date);
    
    // Fetch and store horoscopes for all 12 zodiac signs
    for (let zodiac = 1; zodiac <= 12; zodiac++) {
      const params = {
        zodiac: zodiac,
        date: date,
        show_same: true,
        lang: 'en',
        api_key: API_KEY
      };
      
      // Call VedicAstroAPI
      let response = await axios.get(API_URL, {
        params
      });
      // Store prediction in DynamoDB
      const item = {
        zodiac: zodiac.toString(),
        date: date,
        prediction: response.data.response.bot_response,
        timestamp: timestamp
      };

      // Get full prediction
      params['split'] = true
      params['big'] = true

      
    response = await axios.get(API_URL, {
        params
      });

    item['lucky_color'] = response.data.response.lucky_color;
    item['lucky_number'] = response.data.response.lucky_number;
    item['physique'] = response.data.response.bot_response.physique;
    item['status'] = response.data.response.bot_response.status;
    item['finances'] = response.data.response.bot_response.finances;
    item['relationship'] = response.data.response.bot_response.relationship;
    item['career'] = response.data.response.bot_response.career;
    item['travel'] = response.data.response.bot_response.travel;
    item['family'] = response.data.response.bot_response.family;
    item['friends'] = response.data.response.bot_response.friends;
    item['health'] = response.data.response.bot_response.health;
    item['total_score'] =  response.data.response.total_score;

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
