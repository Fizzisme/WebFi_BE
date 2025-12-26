// models/memberModel.ts
import mongoose, { Schema, Document } from 'mongoose';
import { type IRegister } from '../validations/memberValidation';
import { v4 as uuidv4 } from 'uuid';
const COLLECTION_NAME = 'members';
const MEMBER_ROLES = { CLIENT: 'client', ADMIN: 'admin' };

export interface IMemberDocument extends Document {
    username: string;
    email: string;
    password: string;
   country: string;
    avatar: string;
    role: string;
    isActive: boolean;
    verifyToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    _destroy: boolean;
}

const memberSchema = new Schema<IMemberDocument>(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
       country: { type: String, required: true },
        avatar: { type: String, default: '' },
        role: { type: String, default: MEMBER_ROLES.CLIENT },
        isActive: { type: Boolean, default: false },
        verifyToken: { type: String, default: null },
        _destroy: { type: Boolean, default: false },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const MemberModel = mongoose.model<IMemberDocument>(COLLECTION_NAME, memberSchema);

// Các hàm Wrapper
const createNew = async (data: IRegister) => {

    return await MemberModel.create({
        ...data,
        verifyToken: uuidv4(),
    });
};

// Cần mở lại hàm này để check trùng Email trong Service
const findOneByEmail = async (email: string) => {
    return await MemberModel.findOne({ email }).lean();
};

export const memberModel = {
    MEMBER_ROLES,
    createNew,
    findOneByEmail,
    MemberModel,
};