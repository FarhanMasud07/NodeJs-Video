"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSchema = `
    type User {
         _id: ID!
         email: String!
         password: String
         roles: [String!]
         createdEvents: [Event!]!
     }
     
    input UserInput {
        email: String!
        password: String!
    }
`;
exports.default = userSchema;
