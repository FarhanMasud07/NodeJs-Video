import User from '../../graphQl/models/user';

const SSLCommerzPayment = require("sslcommerz");
const jwt = require('jsonwebtoken');

export default class Payment {
    app: any;

    constructor(app: any) {
        this.app = app;
    }

    protected sslPayment() {
        this.app.post('/ssl-payment', async (req: any, res: any) => {
            const [decodedToken, decodedRefreshToken] = await this.verifyTokens(req, res);
            if (decodedToken.userId !== decodedRefreshToken.userId
                || Date.now() > Number(decodedRefreshToken.exp) * 1000) {
                return res.redirect("http://localhost:4200/");
            }
            try {
                const test: any = await this.data(res, decodedRefreshToken);
                if (test && test.GatewayPageURL) {
                    return res.redirect(test.GatewayPageURL);
                } else {
                    return res.sendStatus(500)
                }
            } catch (e) {
                res.send('error');
            }
        });

        this.app.post('/success', (req: any, res: any) => {
            console.log(req.body)
            return res.redirect('http://localhost:4200');
        })

    }

    private async data(res: any, decodedRefreshToken: any) {
        const test = await new SSLCommerzPayment({
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
        const userId: string = decodedRefreshToken.userId;
        const foundUser = await User.findById(userId);
        if (!foundUser) res.redirect('http://localhost:4200/');
        console.log(foundUser, 'user')
        return test;
    }

    private async verifyTokens(req: any, res: any) {
        const token = req.body._token;
        const refreshToken = req.body._refreshToken;
        if (!token && !refreshToken) return res.redirect("http://localhost:4200/")
        const decodedToken = jwt.decode(token, '01627715576');
        const decodedRefreshToken = jwt.decode(refreshToken, '01627715576');
        return Promise.all([decodedToken, decodedRefreshToken]);
    }
}
