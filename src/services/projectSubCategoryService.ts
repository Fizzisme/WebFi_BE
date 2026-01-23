// services/projectCategoryService.ts
import { type IProjectSubCategoryDocument, projectSubCategoryModel } from '../models/projectSubCategoryModel';
import { HTTPException } from 'hono/http-exception';
import type {
    ICreateSubProjectCategoryInput,
} from '../graphql/typeDefs/subCategory.type.ts';


const creatNew = async (input: ICreateSubProjectCategoryInput) => {
    const data ={
        ...input,
    }

    const newSubCategory = await projectSubCategoryModel.createNew(data);
    return newSubCategory;
}

// /**
//  * Lấy tất cả category + subCategories
//  * Dùng cho sidebar, filter
//  */
// const getAllCategories = async () => {
//
//     const categories = await projectCategoryModel.getAll();
//     console.log(categories)
//     return categories;
// };
//
// /**
//  * Lấy category theo key (slug)
//  */
// const getCategoryByKey = async (key: string) => {
//     if (!key) {
//         throw new HTTPException(400,{message:'Category key is required'});
//     }
//
//     const category = await projectCategoryModel.findByKey(key);
//
//     if (!category) {
//         throw new HTTPException(400, {message:'Category not found'});
//     }
//
//     return category;
// };

export const projectSubCategoryService = {
    creatNew,
};
