
import express from 'express';
import {
  graphqlExpress,
  graphiqlExpress,
} from 'graphql-server-express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { execute, subscribe } from 'graphql';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} from 'graphql-tools';
const { glue } = require('schemaglue')

const { schema, resolver } = glue('src/')
const executableSchema = makeExecutableSchema({
	typeDefs: schema,
	resolvers: resolver
})

const PORT = 4000;
const server = express();

//Wrap the Express server
const ws = createServer(server);
ws.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}`);
  // Set up the WebSocket for handling GraphQL subscriptions
  new SubscriptionServer({
    execute,
    subscribe,
    schema: executableSchema
  }, {
    server: ws,
    path: '/subscriptions',
  });
});


server.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:4000/subscriptions`
}));

server.use('*', cors({ origin: 'http://localhost:3000' }));

server.use('/graphql', bodyParser.json(), graphqlExpress({
  schema: executableSchema
}));

// server.use('/graphiql', graphiqlExpress({
//   endpointURL: '/graphql'
// }));

// server.listen(PORT, () =>
//   console.log(`GraphQL Server is now running on http://localhost:${PORT}`)
// );
