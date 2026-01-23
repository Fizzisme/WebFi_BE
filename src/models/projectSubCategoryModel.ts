// models/projectSubCategoryModel.ts
import mongoose, { Schema, Document } from 'mongoose';

const COLLECTION_NAME = 'project_sub_categories';

/**
 * Project Category Document
 */
export interface IProjectSubCategoryDocument extends Document {
    categoryId: string;
    slug: string;
    title: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    _destroy: boolean;
}

/**
 * Project Category Schema
 */
const projectCategorySchema = new Schema<IProjectSubCategoryDocument>(
    {
        categoryId: { type: String, required: true },

        title: {
            type: String,
            required: true,
        },

        slug: { type: String, required: true },

        order: {
            type: Number,
            default: 0,
        },

        _destroy: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

/**
 * Model
 */
const ProjectSubCategoryModel = mongoose.model<IProjectSubCategoryDocument>(COLLECTION_NAME, projectCategorySchema);

const createNew = async (data: Partial<IProjectSubCategoryDocument>) => {
    return await ProjectSubCategoryModel.create(data);
};

const getAll = async () => {
    return await ProjectSubCategoryModel.find({ _destroy: false })
        .sort({ order: 1 })
        .lean();
};

const findBySlug = async (slug: string) => {
    return await ProjectSubCategoryModel.findOne({ slug: slug });
};

const update = async (categoryId: string, data: Partial<IProjectSubCategoryDocument>) => {
    if (!categoryId) {
        throw new Error('Missing Category ID for update');
    }

    return await ProjectSubCategoryModel.findByIdAndUpdate(categoryId, data, {
        new: true,
        runValidators: true,
    });
};

const softDelete = async (categoryId: string) => {
    return await ProjectSubCategoryModel.findByIdAndUpdate(categoryId, { _destroy: true }, { new: true });
};

/**
 * Export
 */
export const projectSubCategoryModel = {
    createNew,
    getAll,
    findBySlug,
    update,
    softDelete,
    ProjectSubCategoryModel,
};
