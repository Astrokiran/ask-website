const amplifyConfig = {
  API: {
    endpoints: [
      {
        name: 'astrokiranAPI',
        endpoint: 'YOUR_API_GATEWAY_ENDPOINT',
        region: 'ap-south-1'
      }
    ]
  }
};

export default amplifyConfig;