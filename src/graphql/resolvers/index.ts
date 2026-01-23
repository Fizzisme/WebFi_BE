import { mergeResolvers } from '@graphql-tools/merge';
import { projectResolver } from './project.resolver.ts';
import { subCategoryResolver } from './subCategory.resolver.ts';
import { projectCategoryResolver } from './projectCategory.resolver.ts';

export const resolvers = mergeResolvers([projectResolver, subCategoryResolver, projectCategoryResolver]);
