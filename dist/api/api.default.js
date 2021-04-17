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
const user_1 = __importDefault(require("../graphQl/models/user"));
const payment_gateway_1 = __importDefault(require("./payment-gateway-sslecommerz/payment.gateway"));
const jwt = require('jsonwebtoken');
class Api extends payment_gateway_1.default {
    constructor(app) {
        super(app);
        this.app = app;
    }
    confirmationEmail() {
        this.app.get('/confirmation/:token', (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const decodeUserToken = jwt.verify(req.params.token, '01627715574');
                const id = decodeUserToken.userId;
                const user = yield user_1.default.findByIdAndUpdate(id, { confirmed: true }, { new: true });
                // console.log(user);
            }
            catch (e) {
                res.send('error');
            }
            return res.redirect('http://localhost:4200');
        }));
    }
    payment() {
        this.sslPayment();
    }
}
exports.default = Api;
