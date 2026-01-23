import type { ICreateSubProjectCategoryInput } from '../typeDefs/subCategory.type.ts';
import { projectSubCategoryService } from '../../services/projectSubCategoryService.ts';

export const subCategoryResolver = {
    Mutation: {
        createProjectSubCategory: async(_: unknown, args: {input: ICreateSubProjectCategoryInput})=>{
            return await projectSubCategoryService.creatNew(args.input)
        },
    },
};
