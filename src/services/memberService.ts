// services/memberService.ts
import { memberModel } from '../models/memberModel';
import { HTTPException } from 'hono/http-exception';
import type { ILogin, IRegister } from '../validations/memberValidation';
import bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt'
import {env} from '../config/enviroment.ts';

const register = async (validated: IRegister) => {
    // 1. Kiểm tra logic nghiệp vụ (Email đã tồn tại chưa?)
    const existingUser = await memberModel.findOneByEmail(validated.email);
    if (existingUser) {
        throw new HTTPException(400,{message:'Email đã tồn tại' }); // Ném lỗi để Controller bắt
    }


    const newUser = {
    ...validated,
        password: await bcrypt.hash(validated.password, 8)
    }

    // 2. Gọi Model để lưu vào DB
    return await memberModel.createNew(newUser);

};

const login = async (validated: ILogin) => {

    const existUser = await memberModel.findOneByEmail(validated.email);
    if (!existUser) {
        throw new HTTPException(400,{message:'Tài khoản chưa tồn tại' });
    }

    if(!bcrypt.compareSync(validated.password, existUser.password)) {
        throw new HTTPException(400,{message:'Không đúng mật khẩu' });
    }

    const basePayload = {
        id: existUser._id.toString(),
        email: existUser.email,
        username: existUser.username,
        country: existUser.country,
        avatar: existUser.avatar,
        role: existUser.role
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

};

export const memberService = {
    register,
    login
};