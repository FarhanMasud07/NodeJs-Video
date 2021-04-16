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

export default userSchema;

