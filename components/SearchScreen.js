import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from 'react-native';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };

    this.onPress = this._onPress.bind(this);
  }

  _onPress() {
    const { navigate } = this.props.navigation;
    const { searchQuery } = this.state;
    navigate('Result', { searchQuery });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerInner}>
          <View style={styles.box}>
            <Text
              style={styles.heading}
            >
              Search for your favorite cocktail
            </Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({
                searchQuery: text,
              })}
            />
            <Button
              style={styles.button}
              title="Search"
              onPress={this.onPress}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#555',
  },

  containerInner: {
    height: 300,
    padding: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },

  box: {
    height: 200,
  },

  heading: {
    fontSize: 30,
    textAlign: 'center',
  },

  textInput: {
    marginTop: 10,
    marginBottom: 20,
  },
});
