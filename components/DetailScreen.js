import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native';

const API_URL = 'http://www.thecocktaildb.com/api/json/v1/1/lookup.php';

const sortFn = (a, b) => {
  const aNum = parseInt(a.slice(-1));
  const bNum = parseInt(b.slice(-1));

  if (aNum > bNum) {
    return 1;
  }
  if (aNum < bNum) {
    return -1;
  }

  return 0;
};

export default class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      thumbnail: '',
      name: '',
      glass: '',
      instructions: '',
      ingredients: []
    }

    this.keyExtractor = this._keyExtractor.bind(this);
    this.renderItem = this._renderItem.bind(this);
    this.buildIngredientsList = this._buildIngredientsList.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.navigation.state.params;

    return fetch(`${API_URL}?i=${id}`)
      .then((response) => response.json())
      .then((responseJson) => responseJson.drinks[0])
      .then((cocktail) => {
        const ingredients = this.buildIngredientsList(cocktail);
        const {
          strDrink: name,
          strGlass: glass,
          strInstructions: instructions,
          strDrinkThumb: thumb = null
        } = cocktail;

        this.setState({
          isLoading: false,
          ingredients,
          name,
          glass,
          instructions,
          thumb
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  _buildIngredientsList(data) {
    const ingredients = [];
    const measures = [];
    const combined = [];

    Object.entries(data).forEach(([key, value]) => {
      const isIngredient = key.toLowerCase().includes('ingredient');
      const isMeasure = key.toLowerCase().includes('measure');

      if (isIngredient) {
        ingredients.push({ [key]: value });
      } else if (isMeasure) {
        measures.push({ [key]: value });
      }
    });

    const sortedIngredients = ingredients.sort((a, b) => sortFn);
    const sortedMeasures = measures.sort((a, b) => sortFn);
    const ingredientsArr = sortedIngredients.map((ingredient) => {
      return Object.values(ingredient)[0];
    });
    const measuresArr = sortedMeasures.map((measure) => {
      return Object.values(measure)[0];
    });

    ingredientsArr.forEach((ingredient, index) => {
      if (ingredient !== '') {
        combined.push({
          id: index,
          name: ingredient,
          measure: measuresArr[index]
        });
      }
    });

    return combined;
  }

  _keyExtractor(item, index) {
    return item.id;
  }

  _renderItem({ item: { measure, name } }) {
    return (
      <Text>
        {measure} {name}
      </Text>
    );
  }

  render() {
    const { isLoading, ingredients } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <FlatList
        data={ingredients}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
      />
    );
  }
}
