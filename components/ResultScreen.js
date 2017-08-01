import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SectionList,
  TouchableOpacity,
} from 'react-native';

import { createAlphaSections, sortArrayOfObjects } from '../utils/sort';
import { listStyles } from '../utils/styles';
import { Separator } from './helpers/list';

const API_URL = 'http://www.thecocktaildb.com/api/json/v1/1/search.php';

const RenderItem = ({ navigate, item: { strDrink, idDrink } }) => (
  <TouchableOpacity
    onPress={() => navigate('Detail', { id: idDrink })}
  >
    <Text style={listStyles.item}>
      {strDrink}
    </Text>
  </TouchableOpacity>
);

const RenderSectionHeader = ({ section: { name } }) => (
  <Text style={listStyles.header}>{name}</Text>
);

function wrapWithNavigation(navigate, Component) {
  return (props) => (
    <Component
      navigate={navigate}
      {...props}
    />
  );
}

export default class ResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      sections: [],
    }
  }

  componentDidMount() {
    let { searchQuery } = this.props.navigation.state.params;
    searchQuery = searchQuery.trim().toLowerCase();

    return fetch(`${API_URL}?s=${searchQuery}`)
      .then((response) => response.json())
      .then((responseJson) => {
        const sortFn = sortArrayOfObjects.bind(null, 'strDrink')
        const cocktails = responseJson.drinks.sort(sortFn);
        const sections = createAlphaSections(cocktails, 'strDrink');

        this.setState({
          isLoading: false,
          sections
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { isLoading, sections } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    const { navigate } = this.props.navigation;
    const RenderItemWithNavigation = wrapWithNavigation(navigate, RenderItem);

    return (
      <View>
        <SectionList
          keyExtractor={item => item.idDrink}
          renderItem={RenderItemWithNavigation}
          renderSectionHeader={RenderSectionHeader}
          sections={sections}
          ItemSeparatorComponent={() => <Separator />}
        />
      </View>
    );
  }
}
