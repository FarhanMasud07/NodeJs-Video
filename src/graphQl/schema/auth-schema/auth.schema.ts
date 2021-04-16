const authSchema = `
    type AuthData {
        userId: ID!
        token: String!
        refreshToken: String!
        tokenExpiration: Int!
     }
`;
export default authSchema;