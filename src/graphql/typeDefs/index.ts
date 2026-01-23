import { mergeTypeDefs } from '@graphql-tools/merge';
import { projectCategoryTypeDefs } from './projectCategory.type.ts';
import { subCategoryTypeDefs } from './subCategory.type.ts';
import { projectTypeDefs } from './project.type.ts';

export const typeDefs = mergeTypeDefs([projectCategoryTypeDefs, subCategoryTypeDefs, projectTypeDefs]);
