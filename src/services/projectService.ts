// services/projectService.ts
import type { ICreateProjectInput} from "../graphql/typeDefs/project.type.ts";
import {projectModel} from "../models/projectModel.ts";
import {generateSlug} from "../ultils/formatter.ts";
import {projectSubCategoryModel} from "../models/projectSubCategoryModel.ts";


const creatNew = async (input: ICreateProjectInput) => {
    const data = {
        ...input,
        slug: generateSlug(input.title)
    }
    return await projectModel.createNew(data);
}

const getAll = async () => {
    return await projectModel.getAll();
};

const getByCategory = async (categoryId: string) => {
    return await projectModel.findByCategory(categoryId);
};

const getBySubCategory = async (subSlug: string) => {
    const subCategory  = await projectSubCategoryModel.findBySlug(subSlug);
    if(!subCategory) {
        return null;
    }
    const subCategoryId : string = subCategory._id.toString();
    return await projectModel.findBySubCategory(subCategoryId);
};
const getOneById = async (id: string) => {
    return await projectModel.getOneById(id);
}

export const projectService = {
    creatNew,
    getAll,
    getByCategory,
    getBySubCategory,
    getOneById
};
