// graphql/resolvers/projectCategory.resolver.ts
import { projectCategoryService } from '../../services/projectCategoryService';
import type { ICreateProjectCategoryInput,ICreateSubProjectCategoryInput } from '../typeDefs/projectCategory.type.ts';
import { projectSubCategoryService } from '../../services/projectSubCategoryService.ts';


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
        createProjectSubCategory: async(_: unknown, args: {input: ICreateSubProjectCategoryInput})=>{
            return await projectSubCategoryService.creatNew(args.input)
        }
    },
};
