"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authSchema = `
    type AuthData {
        userId: ID!
        token: String!
        refreshToken: String!
        tokenExpiration: Int!
     }
`;
exports.default = authSchema;
