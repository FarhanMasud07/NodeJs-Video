import User from '../models/user';

const jwt = require('jsonwebtoken');

export default class IsAuth {
    constructor(req: any, res: any, next: any) {
        this.isAuth(req, res, next);
    }

    private isAuth = (req: any, res: any, next: any) => {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            req.isAuth = false;
            return next();
        }
        const token = authHeader.split(' ')[1];
        if (!token || token === '') {
            req.isAuth = false;
            return next();
        }



        let decodedToken;
        try {
            decodedToken = jwt.verify(token, '01627715576');
        } catch (e) {
            req.isAuth = false;
            return next();
        }
        if (!decodedToken) {
            req.isAuth = false;
            return next();
        }

        // console.log(decodedToken)
        req.isAuth = true;
        req.userId = decodedToken.userId;
        req.roles = decodedToken.roles;
        next();
    }


    private async createTokens(findUser: any, SECRET: string) {
        const createToken = jwt.sign({
            userId: findUser.id,
            email: findUser.email,
            roles: findUser.roles
        }, '01627715573', {expiresIn: '10s'});
        const createRefreshToken = jwt.sign({
            userId: findUser.id,
            email: findUser.email,
            roles: findUser.roles
        }, '01627715573', {expiresIn: '1m'});

        return Promise.all([createToken, createRefreshToken]);
    }
}
