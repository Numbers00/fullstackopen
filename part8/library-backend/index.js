const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const express = require('express');
const cors = require('cors');
const http = require('http');
const jwt = require('jsonwebtoken');

const User = require('./models/user');

const loaders = require('./gql/loaders');

const { connectToDatabase } = require('./utils/db');

const { typeDefs, resolvers } = require('./gql/schema');
const start = async () => {
  await connectToDatabase();
  
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          }
        }
      },
    ],
  });
  await server.start();

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith('Bearer ')) {
          const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
          const user = await User.findById(decodedToken.id);
          return { user, loaders };
        } 
      },
    }),
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => 
    console.log(`Server ready at http://localhost:${PORT}`)
  );
};
start();
