import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import * as serviceWorker from './serviceWorker';

const httpLink = createHttpLink({
  uri: 'https://afternoon-cliffs-73721.herokuapp.com:4000/graphql'
})

const wsLink = new WebSocketLink({
  uri: `ws://afternoon-cliffs-73721.herokuapp.com:4000/subscriptions`,
  options: {
    reconnect: true
  }
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
