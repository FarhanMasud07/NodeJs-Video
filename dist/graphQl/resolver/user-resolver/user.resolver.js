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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../../models/user"));
const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bCryptJs = require('bCryptJs');
const { GraphQLError } = require('graphql');
class Users {
    constructor() {
        this.refreshTokens = (req, { res }) => __awaiter(this, void 0, void 0, function* () {
            let userId = -1;
            try {
                const verifiedToken = jwt.verify(req.refreshToken, '01627715573');
                userId = verifiedToken.userId;
            }
            catch (err) {
                return {};
            }
            const findUser = yield user_1.default.findOne({ _id: userId });
            const [newToken, newRefreshToken] = yield this.createTokens(findUser, '01627715573', res);
            return {
                token: newToken,
                refreshToken: newRefreshToken,
                findUser,
            };
        });
        this.allUsers = (req, context) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log(context.isAuth, context.res);
            const role = (_a = context.isAuth.roles) === null || _a === void 0 ? void 0 : _a.indexOf('admin');
            if (!context.isAuth) {
                context.res.sendStatus(401);
            }
            if (role && role < 0) {
                throw new Error('you dont have permission');
            }
            let users = [];
            try {
                users = yield user_1.default.find().populate(`createdEvents`);
                users ? users = users.map((user) => {
                    return Object.assign(Object.assign({}, user._doc), { password: null, _id: user.id });
                }) : [];
            }
            catch (error) {
                console.log(error);
            }
            return users;
        });
        this.insertUser = (args, req) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ email: args.userInput.email });
                if (user)
                    throw Error('User already Exist');
                const hashedPassword = yield bCryptJs.hash(args.userInput.password, 12);
                const newUser = yield new user_1.default({
                    email: args.userInput.email,
                    password: hashedPassword,
                    confirmed: false,
                    roles: ['customer']
                });
                const savedUser = yield newUser.save();
                if (savedUser) {
                    const findUser = yield user_1.default.findOne({ email: savedUser.email });
                    if (!findUser)
                        throw Error('user not exists');
                    const transporter = nodeMailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'farhan.masud@selise.ch',
                            pass: 'Sherlock1234@',
                        },
                    });
                    //
                    // const token = jwt.sign({userId: findUser.id,}, '01627715574', {expiresIn: '1d',},
                    //     (err: any, emailToken: any) => {
                    //         if (emailToken) {
                    //             const url = `http://localhost:4200/confirmation/${emailToken}`;
                    //
                    //             transporter.sendMail({
                    //                 to: args.userInput.email,
                    //                 subject: 'Confirm Email',
                    //                 html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
                    //             });
                    //         }
                    //         if (err) {
                    //             throw err;
                    //         }
                    //     },
                    // );
                    const emailToken = jwt.sign({
                        userId: findUser.id,
                        confirmed: findUser.confirmed
                    }, '01627715574', { expiresIn: '1d', });
                    const url = `http://localhost:3001/confirmation/${emailToken}`;
                    yield transporter.sendMail({
                        to: args.userInput.email,
                        subject: 'Confirm Email',
                        html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
                    });
                    return Object.assign(Object.assign({}, savedUser._doc), { password: null, _id: savedUser.id });
                }
                else {
                    throw new Error('server error');
                }
            }
            catch (error) {
                throw error;
            }
        });
        this.loggedInUser = (req, { res }) => __awaiter(this, void 0, void 0, function* () {
            const findUser = yield user_1.default.findOne({ email: req.email });
            if (!findUser)
                throw Error('user not exists');
            if (!findUser.confirmed)
                throw Error('please verify yourself in your email');
            const isEqualPassword = yield bCryptJs.compare(req.password, findUser.password);
            if (!isEqualPassword)
                throw Error('password is not correct');
            const [token, refreshToken] = yield this.createTokens(findUser, '01627715573', res);
            // const token = await jwt.sign({
            //     userId: findUser.id,
            //     email: findUser.email,
            //     roles: findUser.roles
            // }, '01627715573', {expiresIn: '10s'});
            // console.log(token);
            // const refreshToken = await jwt.sign({
            //     userId: findUser.id,
            //     email: findUser.email,
            //     roles: findUser.roles
            // }, '01627715573', {expiresIn: '1m'});
            return {
                userId: findUser.id,
                email: findUser.email,
                token: token,
                refreshToken: refreshToken,
                tokenExpiration: 10 + 'Minutes'
            };
        });
    }
    usersInfo() {
        return {
            users: (arg, context) => __awaiter(this, void 0, void 0, function* () {
                return this.allUsers(arg, context);
            }),
            createUser: (userInput, req) => __awaiter(this, void 0, void 0, function* () {
                return this.insertUser(userInput, req);
            }),
            login: (req, res) => __awaiter(this, void 0, void 0, function* () {
                return this.loggedInUser(req, res);
            }),
            refreshTokens: (req, res) => __awaiter(this, void 0, void 0, function* () {
                return this.refreshTokens(req, res);
            })
        };
    }
    createTokens(findUser, SECRET, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createToken = jwt.sign({
                userId: findUser.id,
                email: findUser.email,
                roles: findUser.roles
            }, SECRET, { expiresIn: '3s' });
            const createRefreshToken = jwt.sign({
                userId: findUser.id,
                email: findUser.email,
                roles: findUser.roles
            }, SECRET, { expiresIn: '20m' });
            // res.set('Authorization', `Bearer ${createToken}`);
            return Promise.all([createToken, createRefreshToken]);
        });
    }
}
exports.default = Users;
;
