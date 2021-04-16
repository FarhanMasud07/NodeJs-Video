import {buildSchema} from "graphql";
import userSchema from './user-schema/user.schema';
import EventSchema from './event-schema/event.schema';
import rootQueryAndMutation from './query-mutation/root.query';
import authSchema from "./auth-schema/auth.schema";

const Schema = `
     ${authSchema} 
     ${EventSchema}        
     ${userSchema}
     ${rootQueryAndMutation}     
`;

export default buildSchema(Schema);