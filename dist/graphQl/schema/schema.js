"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const user_schema_1 = __importDefault(require("./user-schema/user.schema"));
const event_schema_1 = __importDefault(require("./event-schema/event.schema"));
const root_query_1 = __importDefault(require("./query-mutation/root.query"));
const auth_schema_1 = __importDefault(require("./auth-schema/auth.schema"));
const Schema = `
     ${auth_schema_1.default} 
     ${event_schema_1.default}        
     ${user_schema_1.default}
     ${root_query_1.default}     
`;
exports.default = graphql_1.buildSchema(Schema);
