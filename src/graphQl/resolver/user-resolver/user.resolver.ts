import User from "../../models/user";
import IUser from "../../interface/user.interface";

const nodeMailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bCryptJs = require('bCryptJs');
const {GraphQLError} = require('graphql');

export default class Users {
    usersInfo() {
        return {
            users: async (arg: any, context: any): Promise<IUser[]> => {
                return this.allUsers(arg, context);
            },
            createUser: async (userInput: any, req: any) => {
                return this.insertUser(userInput, req);
            },
            login: async (req: any, res: any) => {
                return this.loggedInUser(req, res);
            },
            refreshTokens: async (req: any, res: any) => {
                return this.refreshTokens(req, res);
            }

        }
    }

    private refreshTokens = async (req: any, {res}: any) => {
        let userId = -1;
        try {
            const verifiedToken: any = jwt.verify(req.refreshToken, '01627715573');
            userId = verifiedToken.userId;
        } catch (err) {
            return {};
        }

        const findUser = await User.findOne({_id: userId});

        const [newToken, newRefreshToken] = await this.createTokens(findUser, '01627715573', res);

        return {
            token: newToken,
            refreshToken: newRefreshToken,
            findUser,
        };
    };

    private allUsers = async (req: any, context: any): Promise<IUser[]> => {
        console.log(context.isAuth, context.res)
        const role = context.isAuth.roles?.indexOf('admin');
        if (!context.isAuth) {
            context.res.sendStatus(401);
        }
        if (role && role < 0) {
            throw new Error('you dont have permission');
        }
        let users: IUser[] = [];
        try {
            users = await User.find().populate(`createdEvents`);
            users ? users = users.map((user: any) => {
                return {...user._doc, password: null, _id: user.id};
            }) : [];
        } catch (error) {
            console.log(error);
        }
        return users;
    }

    private insertUser = async (args: any, req: any) => {
        try {
            const user = await User.findOne({email: args.userInput.email});
            if (user) throw Error('User already Exist');
            const hashedPassword = await bCryptJs.hash(args.userInput.password, 12);
            const newUser = await new User({
                email: args.userInput.email,
                password: hashedPassword,
                confirmed: false,
                roles: ['customer']
            });
            const savedUser = await newUser.save();
            if (savedUser) {
                const findUser = await User.findOne({email: savedUser.email});
                if (!findUser) throw Error('user not exists');
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
                }, '01627715574', {expiresIn: '1d',},);

                const url = `http://localhost:3001/confirmation/${emailToken}`;

                await transporter.sendMail({
                    to: args.userInput.email,
                    subject: 'Confirm Email',
                    html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`
                });
                return {...savedUser._doc, password: null, _id: savedUser.id,}
            } else {
                throw new Error('server error');
            }

        } catch (error) {
            throw error;
        }
    }

    private loggedInUser = async (req: any, {res}: any) => {

        const findUser = await User.findOne({email: req.email});
        if (!findUser) throw Error('user not exists');
        if (!findUser.confirmed) throw Error('please verify yourself in your email');
        const isEqualPassword = await bCryptJs.compare(req.password, findUser.password);
        if (!isEqualPassword) throw Error('password is not correct');
        const [token, refreshToken] = await this.createTokens(findUser, '01627715573', res);
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
        }
    }

    private async createTokens(findUser: any, SECRET: string, res: any) {
        const createToken = jwt.sign({
            userId: findUser.id,
            email: findUser.email,
            roles: findUser.roles
        }, SECRET, {expiresIn: '3s'});
        const createRefreshToken = jwt.sign({
            userId: findUser.id,
            email: findUser.email,
            roles: findUser.roles
        }, SECRET, {expiresIn: '20m'});

        // res.set('Authorization', `Bearer ${createToken}`);

        return Promise.all([createToken, createRefreshToken]);
    }

};
