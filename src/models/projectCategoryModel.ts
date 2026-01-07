// models/projectCategoryModel.ts
import mongoose, { Schema, Document } from 'mongoose';

const COLLECTION_NAME = 'project_categories';

/**
 * SubCategory Interface
 */
interface ISubCategory {
    key: string;
    title: string;
}

/**
 * Project Category Document
 */
export interface IProjectCategoryDocument extends Document {
    key: string;
    slug: string;
    title: string;
    icon: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    _destroy: boolean;
}

/**
 * SubCategory Schema
 */
const subCategorySchema = new Schema<ISubCategory>(
    {
        key: { type: String, required: true },
        title: { type: String, required: true },
    },
    {
        _id: false,
    },
);

/**
 * Project Category Schema
 */
const projectCategorySchema = new Schema<IProjectCategoryDocument>(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
        },

        slug: { type: String, required: true },

        icon: {
            type: String,
            required: true,
        },

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
const ProjectCategoryModel = mongoose.model<IProjectCategoryDocument>(COLLECTION_NAME, projectCategorySchema);

const createNew = async (data: Partial<IProjectCategoryDocument>) => {
    return await ProjectCategoryModel.create(data);
};

const getAll = async () => {
    return await ProjectCategoryModel.aggregate([
        {
            $match: {
                _destroy: false,
            },
        },
        {
            $sort: {
                order: 1,
            },
        },
        {
            $lookup: {
                from: 'project_sub_categories',
                let: { categoryId: { $toString: '$_id' } },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$categoryId', '$$categoryId'],
                            },
                        },
                    },
                    { $sort: { order: 1 } },
                    { $project: { _destroy: 0 } },
                ],
                as: 'subCategories',
            },
        },
        {
            $project: {
                _destroy: 0,
                'subCategories._destroy': 0,
            },
        },
    ]);
};

const findByKey = async (key: string) => {
    return await ProjectCategoryModel.findOne({
        key,
        _destroy: false,
    }).lean();
};

const update = async (categoryId: string, data: Partial<IProjectCategoryDocument>) => {
    if (!categoryId) {
        throw new Error('Missing Category ID for update');
    }

    return await ProjectCategoryModel.findByIdAndUpdate(categoryId, data, {
        new: true,
        runValidators: true,
    });
};

const softDelete = async (categoryId: string) => {
    return await ProjectCategoryModel.findByIdAndUpdate(categoryId, { _destroy: true }, { new: true });
};

/**
 * Export
 */
export const projectCategoryModel = {
    createNew,
    getAll,
    findByKey,
    update,
    softDelete,
    ProjectCategoryModel,
};
