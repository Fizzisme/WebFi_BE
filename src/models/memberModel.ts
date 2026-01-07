// models/memberModel.ts
import mongoose, {Schema, Document, Types} from 'mongoose';
import type {  IRegister, IGoogleLogin } from '../validations/memberValidation';
const COLLECTION_NAME = 'members';
const MEMBER_ROLES = { CLIENT: 'client', ADMIN: 'admin' };

interface IProfile {
    bio: string;
    location: string;
    website: string;
    birthday: Date | null;
    avatar: string;
    coverImg: string;
    gender: string;
}

interface IWorkHistory {
    company: string;
    position: string;
    startDate: Date | null;
    endDate: Date | null;
    isCurrent: boolean;
}

interface IAuthProvider{
    provider: string;
    providerId?: string;
    passwordHash?: string;
}
export interface IMemberDocument extends Document {
    username: string;
    displayName:  string;
    email: string;
    country: string;
    role: string;
    profile: IProfile;
    workHistory: IWorkHistory[];
    authProvider: IAuthProvider[];
    isActive: boolean;
    verifyToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    _destroy: boolean;
}

const memberSchema = new Schema<IMemberDocument>(
    {
        username: { type: String, required: true },
        displayName: { type: String },
        email: { type: String, required: true, unique: true },
        country: { type: String, default: '' },
        role: { type: String, default: MEMBER_ROLES.CLIENT },
        profile: {
            bio: { type: String, default: '' },
            location: { type: String, default: '' },
            website: { type: String, default: '' },
            birthday: { type: Date, default: null },
            avatar: { type: String, default: '' },
            coverImg: { type: String, default: '' },
            gender: { type: String, default: '' },
        },
        workHistory: [
            {
                company: { type: String, default: '' },
                position: { type: String, default: '' },
                startDate: { type: Date, default: null },
                endDate: { type: Date, default: null },
                isCurrent: { type: Boolean, default: false },
                _id: false
            }
        ],
        authProvider: [
            {
                provider: { type: String, required: true },
                providerId: { type: String, default: null },
                passwordHash: { type: String, default: null },
            }
        ],
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
const createNew = async (data: IRegister | IGoogleLogin) => {

    return await MemberModel.create(
        data
    );
};

// Cần mở lại hàm này để check trùng Email trong Service
const findOneByEmail = async (email: string) => {
    return await MemberModel.findOne({ email }).lean();
};

const update = async (dataId: string,data: Partial<IMemberDocument>) => {

    if (!dataId) {
        throw new Error("Missing User ID for update");
    }




    const updatedUser = await MemberModel.findByIdAndUpdate(
    dataId,
        data,
        {
            new: true,
            runValidators: true
        }
    );

    return updatedUser;
};
const getMemberById = async (memberId: string) => {
    return await MemberModel.findById(memberId);
}
export const memberModel = {
    MEMBER_ROLES,
    createNew,
    findOneByEmail,
    update,
    getMemberById,
    MemberModel,
};