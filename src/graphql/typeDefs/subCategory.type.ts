import { gql } from 'graphql-tag';

export interface ICreateSubProjectCategoryInput {
    categoryId: string;
    title: string;
    slug?: string;
    order?: number;
}

export const subCategoryTypeDefs = gql`
    type SubCategory {
        _id: ID!
        title: String!
        slug: String!
        categoryId: String!
        order: Int!
    }

    input CreateSubCategoryInput {
        categoryId: String!
        title: String!
        slug: String!
        order: Int!
    }
    type Mutation {
        createProjectSubCategory(input: CreateSubCategoryInput!): SubCategory!
    }
`;
