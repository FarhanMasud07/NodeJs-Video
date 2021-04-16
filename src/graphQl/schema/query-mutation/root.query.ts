const rootQueryAndMutation = `
    type RootQuery {
        events: [Event!]!
        users: [User!]!
        login(email: String!, password: String!): AuthData!
        refreshTokens(token: String!, refreshToken: String!): AuthData!
    }
    
    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }
    
    schema { 
       query: RootQuery
       mutation: RootMutation
    }
`;
export default rootQueryAndMutation;
