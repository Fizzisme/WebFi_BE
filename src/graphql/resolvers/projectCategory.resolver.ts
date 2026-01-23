// graphql/resolvers/projectCategory.resolver.ts
import type { ICreateProjectCategoryInput } from '../typeDefs/projectCategory.type.ts';
import { projectCategoryService } from '../../services/projectCategoryService';


export const projectCategoryResolver = {
    Query: {
        projectCategories: async () => {
            return await projectCategoryService.getAllCategories();
        },

        projectCategory: async (_: unknown, args: { key: string }) => {
            return await projectCategoryService.getCategoryByKey(args.key);
        },
    },
    Mutation: {
        createProjectCategory: async (_: unknown, args: { input: ICreateProjectCategoryInput }) => {
            return await projectCategoryService.creatNew(args.input);
        },
    },
};
