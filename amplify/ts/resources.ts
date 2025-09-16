// import { defineData, defineFunction, type ClientSchema } from '@aws-amplify/backend';

// // Define DynamoDB table
// const horoscopesTable = defineData('Horoscopes', {
//   schema: {
//     zodiac: 'number', // partition key
//     date: 'string',   // sort key
//     prediction: {
//       personal: 'string',
//       professional: 'string',
//       emotions: 'string',
//       travel: 'string',
//       luck: 'string'
//     },
//     timestamp: 'string'
//   },
//   primaryIndex: { partitionKey: 'zodiac', sortKey: 'date' }
// }) as ClientSchema;

// // Define Lambda function
// const fetchHoroscopesFunction = defineFunction({
//   name: 'fetchHoroscopes',
//   handler: 'aws/fetchHoroscopes.js',
//   runtime: 'nodejs18.x',
//   timeout: 60,
//   memorySize: 256,
//   environment: {
//     VEDIC_ASTRO_API_URL: process.env.VEDIC_ASTRO_API_URL || '',
//     VEDIC_ASTRO_API_KEY: process.env.VEDIC_ASTRO_API_KEY || '',
//     DYNAMODB_TABLE_NAME: horoscopesTable.tableName
//   },
//   permissions: [
//     {
//       actions: [
//         'dynamodb:PutItem',
//         'dynamodb:GetItem',
//         'dynamodb:Query',
//         'dynamodb:Scan'
//       ],
//       resources: [horoscopesTable.tableArn]
//     }
//   ],
//   schedule: {
//     rate: 'rate(1 day)',
//     enabled: true
//   }
// });

// export { horoscopesTable, fetchHoroscopesFunction };
