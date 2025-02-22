import { DynamoDB } from 'aws-sdk';
import { NextResponse } from 'next/server';
import moment from 'moment';

const dynamoDB = new DynamoDB.DocumentClient({
  region: 'ap-south-1'
});

export async function GET() {
  try {
    const today = moment().format('DD/MM/YYYY');
    
    // Scan DynamoDB for today's horoscopes
    const params = {
      TableName: process.env.STORAGE_HOROSCOPES_NAME || 'DailyHoroscope-dev',
      FilterExpression: '#date = :today',
      ExpressionAttributeNames: {
        '#date': 'date'
      },
      ExpressionAttributeValues: {
        ':today': today
      }
    };

    const result = await dynamoDB.scan(params).promise();
    
    // Sort horoscopes by zodiac sign
    const horoscopes = result.Items?.sort((a, b) => 
      parseInt(a.zodiac) - parseInt(b.zodiac)
    ) || [];

    console.log('Horoscopes:', horoscopes);

    return NextResponse.json({ horoscopes });
  } catch (error) {
    console.error('Error fetching horoscopes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch horoscopes' },
      { status: 500 }
    );
  }
}
