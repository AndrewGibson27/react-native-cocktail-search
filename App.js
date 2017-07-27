import { StackNavigator } from 'react-navigation';
import React, { Component } from 'react';

import SearchScreen from './components/SearchScreen';
import ResultScreen from './components/ResultScreen';
import DetailScreen from './components/DetailScreen';

const App = StackNavigator({
  Home: { screen: SearchScreen },
  Result: { screen: ResultScreen },
  Detail: { screen: DetailScreen },
});

export default App;
