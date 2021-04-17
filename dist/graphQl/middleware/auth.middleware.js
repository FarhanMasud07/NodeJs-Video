"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
class IsAuth {
    constructor(req, res, next) {
        this.isAuth = (req, res, next) => {
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
            }
            catch (e) {
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
        };
        this.isAuth(req, res, next);
    }
    createTokens(findUser, SECRET) {
        return __awaiter(this, void 0, void 0, function* () {
            const createToken = jwt.sign({
                userId: findUser.id,
                email: findUser.email,
                roles: findUser.roles
            }, '01627715573', { expiresIn: '10s' });
            const createRefreshToken = jwt.sign({
                userId: findUser.id,
                email: findUser.email,
                roles: findUser.roles
            }, '01627715573', { expiresIn: '1m' });
            return Promise.all([createToken, createRefreshToken]);
        });
    }
}
exports.default = IsAuth;
