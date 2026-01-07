// graphql/typeDefs/projectCategory.type.ts
import { gql } from 'graphql-tag';

export interface ICreateProjectCategoryInput {
    key: string;
    title: string;
    icon: string;
    slug?: string;
    order?: number;
}

export interface ICreateSubProjectCategoryInput {
    categoryId: string;
    title: string;
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
    type SubCategory {
        _id: ID!
        title: String!
        slug: String!
        categoryId: String!
        order: Int!
    }

    type Query {
        projectCategories: [ProjectCategory!]!
        projectCategory(key: String!): ProjectCategory
    }

    input CreateSubCategoryInput {
        categoryId: String!
        title: String!
        slug: String!
        order: Int!
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
        createProjectSubCategory(input: CreateSubCategoryInput!): SubCategory!
    }
`;
