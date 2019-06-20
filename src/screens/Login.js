import React, { Component } from "react";
import { View, Text, TextInput, Button, StyleSheet, Picker } from "react-native";
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

import base_instance_opt from '../config/base_instance_opt';
import locales from '../config/locales';

class Login extends Component {
  static navigationOptions = {
    title: "Login"
  };


  state = {
    username: "",
    is_loading: false,
    languages: [],
    language: 'en'
  };
  //


  async componentDidMount() {
    try {

      const stored_languages = await AsyncStorage.getItem('languages');

      if (!stored_languages) {
        const languages_opt = { ...base_instance_opt };
        const languages_instance = axios.create(languages_opt);
        const languages_res = await languages_instance.get('/languages?api-version=3.0&scope=translation');

        const lang_keys = Object.keys(languages_res.data.translation);
        const lang_values = Object.values(languages_res.data.translation).map((x) => x.nativeName);

        var fetched_languages = [];
        lang_keys.forEach((key, i) => {
          if (locales.short.indexOf(key) !== -1) {
            fetched_languages.push({
              key,
              val: lang_values[i]
            });
          }
        });

        await AsyncStorage.setItem('languages', JSON.stringify(fetched_languages));
      }

      const languages = (stored_languages) ? JSON.parse(stored_languages) : fetched_languages;
      await this.setState({
        languages
      });

    } catch (err) {
      console.log("error occured: ", err);
    }
  }


  renderLanguages = () => {
    return this.state.languages.map((lang) => {
      return <Picker.Item label={lang.val} value={lang.key} key={lang.key} />
    });
  }


  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your language</Text>
              <Picker
                selectedValue={this.state.language}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({language: itemValue})
                }>
                {this.renderLanguages()}
              </Picker>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Enter your username</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={username => this.setState({ username })}
                value={this.state.username}
              />
            </View>

            {!this.state.is_loading && (
              <Button title="Login" color="#0064e1" onPress={this.login} />
            )}

            {this.state.is_loading && (
              <Text style={styles.loadingText}>Loading...</Text>
            )}
          </View>
        </View>
      </View>
    );
  }


  login = async () => {
    const { language, username } = this.state;

    this.setState({
      is_loading: true
    });

    if (username) {
      this.props.navigation.navigate("Rooms", {
        'language': language,
        'id': username
      });
    }

    await this.setState({
      is_loading: false,
      username: "",
      language: "en"
    });
  }

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FFF"
  },
  fieldContainer: {
    marginTop: 20
  },
  label: {
    fontSize: 16
  },
  textInput: {
    height: 40,
    marginTop: 5,
    marginBottom: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    backgroundColor: "#eaeaea",
    padding: 5
  },
  loadingText: {
    alignSelf: "center"
  },
  picker: {
    height: 50,
    width: 200
  }
});

export default Login;