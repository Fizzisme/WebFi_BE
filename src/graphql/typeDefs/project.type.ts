// graphql/typeDefs/project.type.ts
import { gql } from 'graphql-tag';

export interface ICreateProjectInput {
    memberId: string;
    categoryId: string;
    subCategoryId: string;

    name: string;
    title: string;
    description: string;
    shortDescription: string;

    thumbnail: string;
    images?: string[];

    demoUrl?: string;
    gitHubUrl?: string;

    techStack: string[];
    features?: string[];
    tags?: string[];
}

export const projectTypeDefs = gql`
    type Author {
        id: ID!
        name: String!
        avatar: String
        email: String
    }
    type Stats {
        views: Int!
        likes: Int!
        comments: Int!
    }
    type Project {
        _id: ID!
        memberId: String!
        categoryId: String!
        subCategoryId: String!
        name: String!
        title: String!
        slug: String!
        description: String!
        shortDescription: String!
        thumbnail: String!
        images: [String!]
        demoUrl: String
        gitHubUrl: String
        techStack: [String!]!
        features: [String!]
        tags: [String!]
        author: Author!
        stats: Stats!
    }

    input AuthorInput {
        id: ID!
        name: String!
        avatar: String
        email: String!
    }

    input CreateProjectInput {
        categoryId: String!
        subCategoryId: String!

        name: String!
        title: String!
        shortDescription: String!
        description: String!

        thumbnail: String!
        images: [String!]

        demoUrl: String
        gitHubUrl: String

        techStack: [String!]!
        features: [String!]
        tags: [String!]
        author: AuthorInput!
    }
    extend type Query {
        projects: [Project!]!
        projectsByCategory(categoryId: String!): [Project!]!
        projectsBySubCategory(subSlug: String!): [Project!]!

        project(id: ID!): Project
    }
    type Mutation {
        createProject(input: CreateProjectInput!): Project!
    }
`;
