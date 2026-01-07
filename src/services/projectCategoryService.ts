// services/projectCategoryService.ts
import { type IProjectCategoryDocument, projectCategoryModel } from '../models/projectCategoryModel';
import { HTTPException } from 'hono/http-exception';
import type {ICreateProjectCategoryInput} from "../graphql/typeDefs/projectCategory.type.ts";
import { projectSubCategoryModel } from '../models/projectSubCategoryModel.ts';


const creatNew = async (input: ICreateProjectCategoryInput) => {
    const newCategory = await projectCategoryModel.createNew(input);
    return newCategory;
}

/**
 * Lấy tất cả category + subCategories
 * Dùng cho sidebar, filter
 */
const getAllCategories = async () => {
    return await projectCategoryModel.getAll();
};

/**
 * Lấy category theo key (slug)
 */
const getCategoryByKey = async (key: string) => {
    if (!key) {
        throw new HTTPException(400,{message:'Category key is required'});
    }

    const category = await projectCategoryModel.findByKey(key);

    if (!category) {
        throw new HTTPException(400, {message:'Category not found'});
    }

    return category;
};

export const projectCategoryService = {
    creatNew,
    getAllCategories,
    getCategoryByKey,
};
