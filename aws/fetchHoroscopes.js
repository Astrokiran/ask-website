const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const axios = require("axios");

// Initialize DynamoDB client
const dynamodb = new DynamoDBClient({
  region: process.env.AWS_REGION
});

// Helper to format date as DD/MM/YYYY
const getFormattedDate = () => {
  const date = new Date();
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Helper to store prediction in DynamoDB
const storePrediction = async (zodiac, date, prediction) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: marshall({
      zodiac: zodiac.toString(),
      date,
      prediction,
      timestamp: new Date().toISOString()
    })
  };

  try {
    await dynamodb.send(new PutItemCommand(params));
  } catch (error) {
    console.error(`Error storing prediction for zodiac ${zodiac}:`, error);
    throw error;
  }
};

// Main handler function
exports.handler = async (event) => {
  try {
    const date = getFormattedDate();
    const apiKey = process.env.VEDIC_ASTRO_API_KEY;
    const baseUrl = process.env.VEDIC_ASTRO_API_URL;

    // Fetch predictions for all zodiac signs (1-12)
    for (let zodiac = 1; zodiac <= 12; zodiac++) {
      const url = `${baseUrl}/daily_sun?zodiac=${zodiac}&date=${date}&show_same=true&lang=en&split=true&type=big&api_key=${apiKey}`;
      
      try {
        const response = await axios.get(url);
        const prediction = response.data.prediction || response.data.sun_sign;
        
        await storePrediction(zodiac, date, prediction);
        console.log(`Successfully stored prediction for zodiac ${zodiac}`);
      } catch (error) {
        console.error(`Error fetching prediction for zodiac ${zodiac}:`, error);
        throw error;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Successfully fetched and stored all horoscopes' })
    };
  } catch (error) {
    console.error('Error in handler:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process horoscopes' })
    };
  }
};
