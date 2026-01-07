// graphql/index.ts
import { makeExecutableSchema } from '@graphql-tools/schema';
import { projectCategoryTypeDefs } from './typeDefs/projectCategory.type';
import { projectCategoryResolver } from './resolvers/projectCategory.resolver';
import { graphqlServer } from '@hono/graphql-server';

const schema = makeExecutableSchema({
    typeDefs: [projectCategoryTypeDefs],
    resolvers: [projectCategoryResolver],
});

export const graphQLServer = graphqlServer({
    schema,
    graphiql: true,
});
