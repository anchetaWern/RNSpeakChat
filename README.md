# RNSpeakChat
A multi-lingual React Native chat app with speech to text capabilities.

### Prerequisites

-   React Native development environment
-   [Node.js](https://nodejs.org/en/)
-   [Yarn](https://yarnpkg.com/en/)
-   [Microsoft Azure Account](https://azure.microsoft.com/en-in/free/) - set up Translator Text API on Cognitive Services (free tier is plenty).

## Getting Started

1.  Clone the repo:

```
git clone https://github.com/anchetaWern/RNSpeakChat.git
cd RNSpeakChat
```

2.  Install the app dependencies:

```
yarn install
```

3. Re-create `android` and `ios` folders:

```
react-native eject
```

4. Link native dependencies:

```
react-native link @react-native-community/async-storage
react-native link react-native-config
react-native link react-native-gesture-handler
react-native link react-native-vector-icons 
react-native link react-native-voice
```

5. Add extra config (Android) for React Native Config on `android/app/build.gradle`:

```
// 2nd line, add a new apply:
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
```

6. Install server dependencies:

```
cd server
yarn
```

7. Add your Chatkit and Cognitive Services config on both app and server:

```
// .env
CHATKIT_INSTANCE_LOCATOR_ID="YOUR CHATKIT INSTANCE LOCATOR ID"
CHATKIT_SECRET_KEY="YOUR CHATKIT SECRET KEY"
CHATKIT_TOKEN_PROVIDER_ENDPOINT="YOUR CHATKIT TOKEN PROVIDER"
COGNITIVE_SERVICES_API_KEY="YOUR TRANSLATOR TEXT API KEY"
```

```
// server/.env
CHATKIT_INSTANCE_LOCATOR_ID="YOUR CHATKIT INSTANCE LOCATOR ID"
CHATKIT_SECRET_KEY="YOUR CHATKIT SECRET KEY"
```

8. Run the server:

```
cd server
node server.js
./ngrok http 5000
```

9. Update `src/screens/Login.js` file with your ngrok HTTPS URL:

```
const CHAT_SERVER = "YOUR NGROK HTTPS URL";
```

10. Create a few users on your Chatkit app dashboard.

11. Run the app:

```
react-native run-android
react-native run-ios
```

## Built with

- [React Native](http://facebook.github.io/react-native/)
- [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)
- [Chatkit](https://pusher.com/chatkit)
- [Cognitive Services: Translator Text API](https://docs.microsoft.com/en-us/azure/cognitive-services/translator/)
