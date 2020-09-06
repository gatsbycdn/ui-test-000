import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import dotenv from 'dotenv';
import Items from './Items';
import IPInfo from './IPInfo';

dotenv.config()

const client = new ApolloClient({
  uri: process.env.REACT_APP_APOLLO_API,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <IPInfo />
    <Items />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
