// graphql/typeDefs/projectCategory.type.ts
import { gql } from 'graphql-tag';

export interface ICreateProjectCategoryInput {
    key: string;
    title: string;
    icon: string;
    slug?: string;
    order?: number;
}

export const projectCategoryTypeDefs = gql`
    type ProjectCategory {
        _id: ID!
        key: String!
        title: String!
        slug: String!
        icon: String!
        order: Int!
        subCategories: [SubCategory!]!
    }

    type Query {
        projectCategories: [ProjectCategory!]!
        projectCategory(key: String!): ProjectCategory
    }

    input CreateProjectCategoryInput {
        key: String!
        title: String!
        slug: String!
        icon: String!
        order: Int
    }

    type Mutation {
        createProjectCategory(input: CreateProjectCategoryInput!): ProjectCategory!
    }
`;
