// services/memberService.ts
import { memberModel } from '../models/memberModel';
import { HTTPException } from 'hono/http-exception';
import type { ILogin, IRegister,IGoogleLogin } from '../validations/memberValidation';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt'
import {env} from '../config/enviroment.ts';
import {v4 as uuidv4} from "uuid";
import type {Context} from "hono";

const register = async (validated: IRegister) => {
    // 1. Kiểm tra logic nghiệp vụ (Email đã tồn tại chưa?)
    const existingUser = await memberModel.findOneByEmail(validated.email);
    if (existingUser) {


        const hasLocalLinked = existingUser.authProvider.some(p => p.provider === 'local');
        if (hasLocalLinked) {
            throw new HTTPException(400,{message:'Email already exists' }); // Ném lỗi để Controller bắt
        }
        existingUser.profile.gender = validated.gender;
        existingUser.country = validated.country;

        existingUser.authProvider.push({
            provider: 'local',
            passwordHash: await bcrypt.hash(validated.password, 10),
        });

        console.log(existingUser)

      return await memberModel.update(existingUser._id.toString(),existingUser);

    }
    else {
        const newUser = {
            ...validated,
            authProvider: [
                {
                    provider: 'local',
                    providerId: null,
                    passwordHash: await bcrypt.hash(validated.password, 8)
                }
            ],
            verifyToken: uuidv4(),
        }

        // 2. Gọi Model để lưu vào DB
        return await memberModel.createNew(newUser);
    }


};

const login = async (validated: ILogin) => {
    // 1. Tìm user theo email
    const existUser = await memberModel.findOneByEmail(validated.email);
    if (!existUser) {
        throw new HTTPException(400, { message: 'The account does not exist' });
    }

    // 2. Tìm thông tin đăng nhập 'local' trong mảng authProvider
    const localAuth = existUser.authProvider.find(p => p.provider === 'local');

    // 3. Kiểm tra xem user này có mật khẩu không?
    // (Trường hợp họ chỉ đăng nhập bằng Google thì localAuth sẽ không tồn tại hoặc không có hash)
    if (!localAuth || !localAuth.passwordHash) {
        throw new HTTPException(400, {
            message: 'This account was created using Google/Facebook. Please log in using social networks.'
        });
    }

    // 4. So sánh mật khẩu (Lấy hash từ cái localAuth vừa tìm được)
    const isMatch = await bcrypt.compare(validated.password, localAuth.passwordHash);

    if (!isMatch) {
        throw new HTTPException(400, { message: 'Password is incorrect' });
    }

    // 5. Tạo Payload & Token (Giữ nguyên logic của bạn)
    const basePayload = {
        id: existUser._id.toString(),
        email: existUser.email,
        username: existUser.username,
        country: existUser.country,
        role: existUser.role
    };

    const accessToken = await sign(
        {
            ...basePayload,
            exp: Math.floor(Date.now() / 1000) + 15 * 60 // 15 phút
        },
        env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
    );

    const refreshToken = await sign(
        {
            ...basePayload,
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 ngày
        },
        env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
    );

    return {
        accessToken,
        refreshToken,
    };
};




const googleLogin = async (data : IGoogleLogin) => {

    const existingUser = await memberModel.findOneByEmail(data.email);
    // Neu chua ton tai tai khoan thi phai tao tai khoan
    if (!existingUser) {
        const newUserData = {
            ...data,
            username: data.name,
            profile :
                {
                    avatar: data.image,
                },
            authProvider: [
                {
                    provider: data.provider,
                    providerId: data.providerId,
                }
            ],
            verifyToken: uuidv4(),
        }

        const newUser = await memberModel.createNew(newUserData)

        const basePayload = {
            id: newUser._id.toString(),
            email: newUser.email,
            username: newUser.username,
            country: newUser.country,
            role: newUser.role,
        }
        const accessToken = await sign(
            {
                ...basePayload,
                exp: Math.floor(Date.now() / 1000) + 15 * 60
            },
            env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
        )

        const refreshToken = await sign(
            {
                ...basePayload,
                exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
            },
            env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
        )
        return {
            accessToken,
            refreshToken,
        }
    }
    // Neu da co tai khoan
    else {
        const hasGoogleLinked = existingUser.authProvider.some(p => p.provider === 'google');
        if (!hasGoogleLinked) {

            existingUser.authProvider.push({
                provider: data.provider,
                providerId: data.providerId
            });

            await memberModel.update(existingUser._id.toString(),existingUser);
        }
    }

    const basePayload = {
        id: existingUser._id.toString(),
        email: existingUser.email,
        username: existingUser.username,
        country: existingUser.country,
        role: existingUser.role
    }

    const accessToken = await sign(
        {
            ...basePayload,
            exp: Math.floor(Date.now() / 1000) + 15 * 60
        },
        env.ACCESS_TOKEN_SECRET_SIGNATURE as string,
    )

    const refreshToken = await sign(
        {
            ...basePayload,
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
        },
        env.REFRESH_TOKEN_SECRET_SIGNATURE as string,
    )
    return {
        accessToken,
        refreshToken,
    }

}
export const memberService = {
    register,
    login,
    googleLogin
};