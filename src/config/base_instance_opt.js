import Config from 'react-native-config';
const COGNITIVE_SERVICES_API_KEY = Config.COGNITIVE_SERVICES_API_KEY;

const base_instance_opt = {
  baseURL: `https://api.cognitive.microsofttranslator.com`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Ocp-Apim-Subscription-Key': COGNITIVE_SERVICES_API_KEY
  }
};

export default base_instance_opt;