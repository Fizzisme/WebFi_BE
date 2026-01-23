// graphql/index.ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import { projectCategoryTypeDefs } from './typeDefs/projectCategory.type';
import { projectCategoryResolver } from './resolvers/projectCategory.resolver';
import { graphqlServer } from '@hono/graphql-server';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
const schema = makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
});

export const graphQLServer = graphqlServer({
    schema,
    graphiql: true,
});
