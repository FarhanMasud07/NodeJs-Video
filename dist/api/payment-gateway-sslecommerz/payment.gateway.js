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
const user_1 = __importDefault(require("../../graphQl/models/user"));
const SSLCommerzPayment = require("sslcommerz");
const jwt = require('jsonwebtoken');
class Payment {
    constructor(app) {
        this.app = app;
    }
    sslPayment() {
        this.app.post('/ssl-payment', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [decodedToken, decodedRefreshToken] = yield this.verifyTokens(req, res);
            if (decodedToken.userId !== decodedRefreshToken.userId
                || Date.now() > Number(decodedRefreshToken.exp) * 1000) {
                return res.redirect("http://localhost:4200/");
            }
            try {
                const test = yield this.data(res, decodedRefreshToken);
                if (test && test.GatewayPageURL) {
                    return res.redirect(test.GatewayPageURL);
                }
                else {
                    return res.sendStatus(500);
                }
            }
            catch (e) {
                res.send('error');
            }
        }));
        this.app.post('/success', (req, res) => {
            console.log(req.body);
            return res.redirect('http://localhost:4200');
        });
    }
    data(res, decodedRefreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const test = yield new SSLCommerzPayment({
                store_id: 'prd605badea9d2bf',
                store_passwd: 'prd605badea9d2bf@ssl',
                total_amount: 100,
                currency: 'BDT',
                tran_id: 'REF123',
                success_url: 'http://localhost:3001/success',
                fail_url: 'http://127.0.0.1:4200/signup',
                cancel_url: 'http://yoursite.com/cancel.php',
                shipping_method: 'not applicable',
                product_name: 'not applicable.',
                product_category: 'not applicable',
                product_profile: 'not applicable',
                cus_name: 'Customer Name',
                cus_email: 'cust@yahoo.com',
                cus_add1: 'Dhaka',
                cus_add2: 'Dhaka',
                cus_city: 'Dhaka',
                cus_state: 'Dhaka',
                cus_postcode: '1000',
                cus_country: 'Bangladesh',
                cus_phone: '01711111111',
                cus_fax: 'not applicable',
                ship_name: 'not applicable',
                ship_add1: 'not applicable',
                ship_add2: 'not applicable',
                ship_city: 'not applicable',
                ship_state: 'not applicable',
                ship_postcode: 1000,
                ship_country: 'not applicable',
                multi_card_name: 'mastercard',
            }, false);
            console.log(decodedRefreshToken.userId, 'ssl');
            const userId = decodedRefreshToken.userId;
            const foundUser = yield user_1.default.findById(userId);
            if (!foundUser)
                res.redirect('http://localhost:4200/');
            console.log(foundUser, 'user');
            return test;
        });
    }
    verifyTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.body._token;
            const refreshToken = req.body._refreshToken;
            if (!token && !refreshToken)
                return res.redirect("http://localhost:4200/");
            const decodedToken = jwt.decode(token, '01627715576');
            const decodedRefreshToken = jwt.decode(refreshToken, '01627715576');
            return Promise.all([decodedToken, decodedRefreshToken]);
        });
    }
}
exports.default = Payment;
