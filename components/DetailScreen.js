import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Image,
  Dimensions
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
          strDrinkThumb: thumbSrc
        } = cocktail;
        const baseState = {
          isLoading: false,
          name,
          glass,
          instructions,
          ingredients
        };

        if (thumbSrc) {
          Image.getSize(thumbSrc, (srcWidth, srcHeight) => {
            const maxHeight = Dimensions.get('window').height;
            const maxWidth = Dimensions.get('window').width;
            const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
            const width = srcWidth * ratio;
            const height = srcHeight * ratio;

            this.setState({
              ...baseState,
              thumb: {
                src: thumbSrc,
                height,
                width
              }
            });
          }, (error) => {
            console.error(error);
          });
        } else {
          this.setState({
            ...baseState
          });
        }
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

  render() {
    const {
      isLoading,
      ingredients,
      thumb,
      name,
      glass,
      instructions
    } = this.state;

    if (isLoading) {
      return (
        <View>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        <Text style={styles.name}>{name}</Text>

        {thumb &&
          <Image
            style={{ width: thumb.width, height: thumb.height, marginTop: 20 }}
            source={{ uri: thumb.src }}
            resizeMode="cover"
          />
        }

        <View style={styles.textContainer}>
          <Text style={styles.header}>Glass</Text>
          <Text style={styles.prose}>{glass}</Text>

          <Text style={styles.header}>Instructions</Text>
          <Text style={styles.prose}>{instructions}</Text>

          <Text style={styles.header}>Ingredients</Text>
          {ingredients.map(({ measure, name }) => (
            <Text
              key={name}
              style={styles.ingredient}
            >
              {measure} {name}
            </Text>
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },

  name: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  textContainer: {
    padding: 10
  },

  header: {
    marginTop: 22,
    fontSize: 18,
    fontWeight: 'bold'
  },

  prose: {
    marginTop: 10,
    fontSize: 14
  },

  ingredient: {
    marginTop: 10,
    fontSize: 14
  }
});
