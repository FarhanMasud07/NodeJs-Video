import User from "../graphQl/models/user";
import {debuglog} from "util";
import Payment from "./payment-gateway-sslecommerz/payment.gateway";

const jwt = require('jsonwebtoken');

export default class Api extends Payment {
    app: any;

    constructor(app: any) {
        super(app);
        this.app = app;
    }

    confirmationEmail() {
        this.app.get('/confirmation/:token', async (req: any, res: any) => {
            try {
                const decodeUserToken = jwt.verify(req.params.token, '01627715574');
                const id = decodeUserToken.userId;
                const user = await User.findByIdAndUpdate(id, {confirmed: true}, {new: true},);
                // console.log(user);
            } catch (e) {
                res.send('error');
            }
            return res.redirect('http://localhost:4200');
        });
    }

    payment() {
        this.sslPayment();
    }


}
