import type { Context } from 'hono';
import type { IRegister, ILogin } from '../validations/memberValidation.ts';
import { memberService } from '../services/memberService.ts';
import { setCookie } from 'hono/cookie'
import { memberModel } from '../models/memberModel.ts';


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

const googleLogin = async (c: Context)=>{

    const data = await c.req.json()
    const memberLogged = await memberService.googleLogin(data)
    const {accessToken, refreshToken} = memberLogged || {}

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

}

const getMember = async (c: Context) => {
    const payload = c.get('jwtPayload')
    const memberId = payload.id

    const memberDoc = await memberModel.getMemberById(memberId)
    if (!memberDoc) {
        return c.json({ message: 'Member not found' }, 404)
    }

    const member = memberDoc.toObject()
        return c.json(
            {
                id: member._id,
                username: member.username,
                email: member.email,
                profile: member.profile,
                workHistory: member.workHistory,
                dateJoined: member.createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }),
            },
            200
        )
}



export const memberController = {
    register,
    login,
    getMember,
    googleLogin
};