"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importDefault(require("express"));
const server_1 = __importDefault(require("./server/server"));
const graphQl_1 = __importDefault(require("./graphQl/graphQl"));
const bodyParser = __importStar(require("body-parser"));
const api_default_1 = __importDefault(require("./api/api.default"));
const user_1 = __importDefault(require("./graphQl/models/user"));
const bCryptJs = require('bCryptJs');
const jwt = require('jsonwebtoken');
const SECRET = '01627715573';
const app = express_1.default();
app.use(express_1.default.urlencoded());
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
//all the graphql calls
const GraphQl = new graphQl_1.default('/graphql/', app);
GraphQl.graphQl();
//api call
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const findUser = yield user_1.default.findOne({ email: email });
    if (!findUser)
        return res.status(404).send({ message: 'Invalid Email' });
    const isEqualPassword = yield bCryptJs.compare(password, findUser.password);
    if (!isEqualPassword)
        return res.status(404).send({ message: 'Invalid password' });
    const user = {
        userId: findUser.id,
        email: findUser.email,
        roles: findUser.roles
    };
    const token = yield jwt.sign(user, '01627715576', { expiresIn: '10s' });
    const refreshToken = yield jwt.sign(user, '01627715575', { expiresIn: '1m' });
    res.json({ jwt: token, refreshToken: refreshToken });
}));
//
// app.post('/logout', function (req, res) {
//     const refreshToken = req.body.refreshToken;
//     if (refreshToken in refreshToken) {
//         delete tokenList[refreshToken];
//     }
//     res.sendStatus(204);
// });
//
app.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postData = req.body;
    if (postData.refreshToken) {
        let decodeRefreshToken;
        try {
            decodeRefreshToken = jwt.verify(postData.refreshToken, '01627715575');
        }
        catch (e) {
            return res.sendStatus(401);
        }
        if (!decodeRefreshToken)
            return res.sendStatus(401);
        const findUser = yield user_1.default.findOne({ _id: decodeRefreshToken.userId });
        if (!findUser)
            return res.sendStatus(401);
        const user = {
            userId: findUser.id,
            email: findUser.email,
            roles: findUser.roles
        };
        const token = yield jwt.sign(user, '01627715576', { expiresIn: '10s' });
        res.json({ jwt: token });
    }
    else {
        res.sendStatus(401);
    }
}));
const api = new api_default_1.default(app);
api.confirmationEmail();
api.payment();
// api.getAllPosts();
// this is the server
const connection = new server_1.default(8081, app);
connection.core();
