import express from 'express';
import server from './server/server';
import graphQl from './graphQl/graphQl';
import * as bodyParser from "body-parser";
import Api from "./api/api.default";
import User from "./graphQl/models/user";

const bCryptJs = require('bCryptJs');
const jwt = require('jsonwebtoken');

const SECRET = '01627715573'

const app = express();

app.use(express.urlencoded());
const cors = require('cors')

app.use(cors());
app.use(bodyParser.json());


//all the graphql calls
const GraphQl = new graphQl('/graphql/', app);
GraphQl.graphQl();


//api call
app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const findUser = await User.findOne({email: email});
    if (!findUser) return res.status(404).send({message: 'Invalid Email'});
    const isEqualPassword = await bCryptJs.compare(password, findUser.password);
    if (!isEqualPassword) return res.status(404).send({message: 'Invalid password'});
    const user = {
        userId: findUser.id,
        email: findUser.email,
        roles: findUser.roles
    }
    const token = await jwt.sign(user, '01627715576', {expiresIn: '10s'});
    const refreshToken = await jwt.sign(user, '01627715575', {expiresIn: '1m'});

    res.json({jwt: token, refreshToken: refreshToken});
});
//
// app.post('/logout', function (req, res) {
//     const refreshToken = req.body.refreshToken;
//     if (refreshToken in refreshToken) {
//         delete tokenList[refreshToken];
//     }
//     res.sendStatus(204);
// });
//
app.post('/refresh-token', async (req: any, res) => {
    const postData = req.body;
    if (postData.refreshToken) {
        let decodeRefreshToken
        try {
            decodeRefreshToken = jwt.verify(postData.refreshToken, '01627715575');
        } catch (e) {
            return res.sendStatus(401);
        }
        if (!decodeRefreshToken) return res.sendStatus(401)
        const findUser = await User.findOne({_id: decodeRefreshToken.userId});
        if (!findUser) return res.sendStatus(401);
        const user = {
            userId: findUser.id,
            email: findUser.email,
            roles: findUser.roles
        }
        const token = await jwt.sign(user, '01627715576', {expiresIn: '10s'});

        res.json({jwt: token});
    } else {
        res.sendStatus(401);
    }
});


const api = new Api(app);
api.confirmationEmail();
api.payment();
// api.getAllPosts();

// this is the server
const connection = new server(3001, app);
connection.core();
