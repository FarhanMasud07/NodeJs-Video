import User from './user-resolver/user.resolver';
import Events from './event-resolver/event.resolver';

export default class Resolvers {
    private events = new Events();
    private users = new User();
    setResolvers() {
        return {...this.events.event(), ...this.users.usersInfo()};
    }
}
