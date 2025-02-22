import { Amplify } from 'aws-amplify';
import { generateClient } from '@aws-amplify/api';
import config from '../amplifyconfiguration.json';

// Configure Amplify
Amplify.configure(config, {
  ssr: true
});

// Generate API client
const client = generateClient();

export { client };
