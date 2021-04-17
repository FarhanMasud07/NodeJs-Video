"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./schema/schema"));
const root_resolver_1 = __importDefault(require("./resolver/root.resolver"));
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
class GraphQl {
    constructor(endPoint, app) {
        this.endPoint = endPoint;
        this.app = app;
    }
    graphQl() {
        this.app.use((req, res, next) => {
            new auth_middleware_1.default(req, res, next);
        });
        this.app.use(this.endPoint, this.graphQlFunctionality());
    }
    graphQlFunctionality() {
        let resolver = new root_resolver_1.default();
        return express_graphql_1.graphqlHTTP((req, res) => ({
            schema: schema_1.default,
            rootValue: resolver.setResolvers(),
            graphiql: true,
            context: { res, isAuth: req.isAuth }
        }));
    }
}
exports.default = GraphQl;
