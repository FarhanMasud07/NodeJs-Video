"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventSchema = `
    type Event {
         _id: ID!
         title: String
         description: String
         price: Float
         date: String
         creator: User
    }
    
    input EventInput {
         title: String
         description: String
         price: Float
         date: String
         creator: ID
     }
     
`;
exports.default = EventSchema;
