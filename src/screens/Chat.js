import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import Config from 'react-native-config';

import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';
import Voice from 'react-native-voice';

const CHATKIT_INSTANCE_LOCATOR_ID = Config.CHATKIT_INSTANCE_LOCATOR_ID;
const CHATKIT_SECRET_KEY = Config.CHATKIT_SECRET_KEY;
const CHATKIT_TOKEN_PROVIDER_ENDPOINT = Config.CHATKIT_TOKEN_PROVIDER_ENDPOINT;

import base_instance_opt from '../config/base_instance_opt';
import locales from '../config/locales';

class Chat extends Component {

  state = {
    text: '',
    messages: [],
    is_listening: false
  };


  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      headerTitle: params.room_name
    };
  };
  //

  constructor(props) {
    super(props);
    const { navigation } = this.props;

    this.user_id = navigation.getParam("user_id");
    this.room_id = navigation.getParam("room_id");
    this.language = navigation.getParam("language");

    const locale_index = locales.short.indexOf(this.language);
    this.voice_locale = locales.long[locale_index];
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }


  onSpeechError = e => {
    console.log('speech error: ', e);
  }


  onSpeechResults = e => {
    console.log('speech results: ', e);
    this.setState({
      is_listening: false,
      text: e.value[0],
    });
  }


  componentWillUnMount() {
    this.currentUser.disconnect();
    Voice.destroy().then(Voice.removeAllListeners);
  }


  async componentDidMount() {
    try {
      const chatManager = new ChatManager({
        instanceLocator: CHATKIT_INSTANCE_LOCATOR_ID,
        userId: this.user_id,
        tokenProvider: new TokenProvider({ url: CHATKIT_TOKEN_PROVIDER_ENDPOINT })
      });

      let currentUser = await chatManager.connect();
      this.currentUser = currentUser;

      await this.currentUser.subscribeToRoomMultipart({
        roomId: this.room_id,
        hooks: {
          onMessage: this.onReceive
        },
        messageLimit: 2
      });

      await this.setState({
        room_users: this.currentUser.users
      });

    } catch (chat_mgr_err) {
      console.log("error with chat manager: ", chat_mgr_err);
    }
  }


  onReceive = async (data) => {
    const { message } = await this.getMessage(data);
    await this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, message)
    }));
  }


  getMessage = async ({ id, sender, parts, createdAt }) => {
    const text = parts.find(part => part.partType === 'inline').payload.content;
    let txt = text;

    try {
      const translate_opt = { ...base_instance_opt };
      const translate_instance = axios.create(translate_opt);

      const content = JSON.stringify([{
        'Text': text
      }]);
      const res = await translate_instance.post(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${this.language}`, content);
      txt = res.data[0].translations[0].text;

    } catch (err) {
      console.log("err: ", err);
    }

    const msg_data = {
      _id: id,
      text: txt,
      createdAt: new Date(createdAt),
      user: {
        _id: sender.id,
        name: sender.name,
        avatar: `https://ui-avatars.com/api/?background=d88413&color=FFF&name=${sender.name}`
      }
    };

    return {
      message: msg_data
    };
  }


  setCustomText = (text) => {
    this.setState({
      text
    });
  }


  render() {
    const { text, messages } = this.state;
    return (
      <View style={{flex: 1}}>
        <GiftedChat
          text={text}
          onInputTextChanged={text => this.setCustomText(text)}
          messages={messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.user_id
          }}
          renderActions={this.renderCustomActions}
        />
      </View>
    );
  }
  //

  renderCustomActions = () => {
    const { is_listening } = this.state;
    const color = is_listening ? '#e82020' : '#333';
    if (Voice.isAvailable()) {
     return (
        <View style={styles.customActionsContainer}>
          <TouchableOpacity onPress={this.listen}>
            <View style={styles.buttonContainer}>
              <Icon name="microphone" size={23} color={color} />
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }
  //

  listen = async () => {
    this.setState({
      is_listening: true
    });

    try {
      await Voice.start(this.voice_locale);
    } catch (e) {
      console.error('error: ', e);
    }
  }
  //

  onSend = async ([message]) => {
    const message_parts = [
      { type: "text/plain", content: message.text }
    ];

    try {
      await this.currentUser.sendMultipartMessage({
        roomId: this.room_id,
        parts: message_parts
      });

    } catch (send_msg_err) {
      console.log("error sending message: ", send_msg_err);
    }
  }

}

const styles = StyleSheet.create({
  customActionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonContainer: {
    padding: 10
  }
});

export default Chat;