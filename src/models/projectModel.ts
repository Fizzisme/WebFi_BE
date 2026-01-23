// models/Project.ts
import mongoose, { Schema, Document } from 'mongoose';
import type { IProjectCategoryDocument } from './projectCategoryModel.ts';

const COLLECTION_NAME = 'projects';

/**
 * Project Document
 */
interface IStat {
    views: number;
    likes: number;
    comments: number;
}
interface IAuthor{
    id: string;
    name: string;
    avatar?: string;
    email: string;
}
interface IProjectDocument {
    categoryId: string;
    subCategoryId: string;

    name: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;

    thumbnail: string;
    images: string[];

    demoUrl: string;
    gitHubUrl: string;

    techStack: string[];
    features: string[];
    status: 'draft' | 'published' | 'archived';

    stats: IStat;
    tags: string[];
    author: IAuthor;
    updatedAt: Date;
    _destroy: boolean;
}

/**
 * Project Schema
 */
const projectSchema = new Schema<IProjectDocument>(
    {
        categoryId: { type: String, required: true },
        subCategoryId: { type: String, required: true },

        name: { type: String, required: true },

        title: {
            type: String,
            required: true,
        },

        slug: { type: String, required: true },

        description: { type: String, required: true },
        shortDescription: { type: String, required: true },

        thumbnail: { type: String, required: true },
        images: [{ type: String, required: true }],

        demoUrl: { type: String, required: true },
        gitHubUrl: { type: String, required: true },

        techStack: [{ type: String, required: true }],
        features: [{ type: String, required: true }],
        status: {
            type: String,
            enum: ['draft', 'published', 'archived'],
            default: 'draft',
        },

        stats: {
            views: { type: Number, default: 0 },
            likes: { type: Number, default: 0 },
            comments: { type: Number, default: 0 },
        },

        tags: [{ type: String, index: true }],
        author: {
          id:{type:String, required:true},
          name:{type:String,required:true },
          avatar:{type:String},
          email:{type:String, required:true},
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

// Tạo index text search nếu muốn tìm kiếm theo tiêu đề/mô tả
projectSchema.index({ title: 'text', description: 'text', techStack: 'text' });

/**
 * Model
 */
const ProjectModel = mongoose.model<IProjectDocument>(COLLECTION_NAME, projectSchema);

const createNew = async (data: Partial<IProjectDocument>) => {
    return await ProjectModel.create(data);
};

const getAll = async () => {
    return await ProjectModel.find({ _destroy: false }).lean();
};

const findByCategory = async (categoryId: string) => {
    return await ProjectModel.find({
        categoryId,
        _destroy: false,
    }).lean();
};

const findBySubCategory = async (subCategoryId: string) => {
    return await ProjectModel.find({
        subCategoryId,
        _destroy: false,
    }).lean();
};
const getOneById = async (id: string) => {
    return await ProjectModel.findById(id);
}

export const projectModel = {
    createNew,
    getAll,
    findByCategory,
    findBySubCategory,
    getOneById,
}