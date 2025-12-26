import type { Context } from 'hono';
import type { IRegister, ILogin } from '../validations/memberValidation.ts';
import { memberService } from '../services/memberService.ts';
import { setCookie } from 'hono/cookie'


const register = async (c: Context<{}, any, { out: { json: IRegister } }>) => {

   const validated  = c.req.valid('json');

       const memberRegistered = await memberService.register(validated)

       return c.json(memberRegistered,200)
};

const login = async (c: Context<{}, any, { out: { json: ILogin } }>) => {

    const validated  = c.req.valid('json');

    const memberLogged = await memberService.login(validated)

    const {accessToken, refreshToken} = memberLogged

    setCookie(c, 'access_token', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 15 * 60,
    })

    setCookie(c, 'refresh_token', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
    })

    return c.json( {
        message: 'Login thành công',
    },200)
};


export const memberController = {
    register,
    login
};