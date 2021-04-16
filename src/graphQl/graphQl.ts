import {graphqlHTTP} from 'express-graphql';
import Schema from "./schema/schema";
import RootResolver from "./resolver/root.resolver";
import IsAuth from './middleware/auth.middleware';

export default class GraphQl {
    endPoint: any;
    app: any;

    constructor(endPoint: any, app: any) {
        this.endPoint = endPoint;
        this.app = app;
    }

    graphQl() {
        this.app.use((req: any, res: any, next: any) => {
            new IsAuth(req, res, next);
        });
        this.app.use(this.endPoint, this.graphQlFunctionality());
    }

    private graphQlFunctionality() {
        let resolver = new RootResolver();
        return graphqlHTTP((req: any, res: any) => ({
            schema: Schema,
            rootValue: resolver.setResolvers(),
            graphiql: true,
            context: {res, isAuth: req.isAuth}
        }));
    }
}
